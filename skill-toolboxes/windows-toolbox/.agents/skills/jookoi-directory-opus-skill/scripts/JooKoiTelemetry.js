// JooKoiTelemetry.js
// Opt-in usage observer for jookoi-directory-opus-skill.
// Logs navigation steps, UI pane toggles, view/filter switches, tab switches, and renames
// to %LOCALAPPDATA%\jookoi-directory-opus-skill\telemetry.jsonl (auto-rotates at 2 MB).

function OnInit(initData) {
	initData.name = "JooKoi Usage Telemetry";
	initData.version = "1.1";
	initData.desc = "Opt-in local usage logger for Directory Opus workflow optimization.";
	initData.default_enable = true;
	initData.min_version = "13.0";

	initData.config.enable_logging = true;
	initData.config_desc = DOpus.Create.Map("enable_logging", "Write local usage events to telemetry.jsonl");
}

function _esc(str) {
	if (str === null || typeof str === "undefined") return "";
	return String(str)
		.replace(/\\/g, "\\\\")
		.replace(/"/g, '\\"')
		.replace(/\r/g, "\\r")
		.replace(/\n/g, "\\n")
		.replace(/\t/g, "\\t")
		.replace(/[^\x20-\x7e]/g, function(ch) {
			var hex = ch.charCodeAt(0).toString(16);
			return "\\u" + ("0000" + hex).slice(-4);
		});
}

function _isoNow() {
	var d = new Date();
	function pad(n) { return n < 10 ? "0" + n : "" + n; }
	return d.getUTCFullYear() + "-" +
		pad(d.getUTCMonth() + 1) + "-" +
		pad(d.getUTCDate()) + "T" +
		pad(d.getUTCHours()) + ":" +
		pad(d.getUTCMinutes()) + ":" +
		pad(d.getUTCSeconds()) + "Z";
}

function _writeEvent(jsonBody) {
	try {
		if (!Script.config.enable_logging) return;
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		var sh = new ActiveXObject("WScript.Shell");
		var baseDir = sh.ExpandEnvironmentStrings("%LOCALAPPDATA%") + "\\jookoi-directory-opus-skill";
		if (!fso.FolderExists(baseDir)) {
			fso.CreateFolder(baseDir);
		}
		var logPath = baseDir + "\\telemetry.jsonl";
		if (fso.FileExists(logPath)) {
			var f = fso.GetFile(logPath);
			if (f.Size > 2097152) {
				var prevPath = baseDir + "\\telemetry.prev.jsonl";
				if (fso.FileExists(prevPath)) fso.DeleteFile(prevPath, true);
				f.Move(prevPath);
			}
		}
		var line = '{"ts":"' + _isoNow() + '",' + jsonBody + '}';
		var ts = fso.OpenTextFile(logPath, 8, true, 0);
		ts.WriteLine(line);
		ts.Close();
	} catch (e) {
		// Never interrupt Directory Opus on logging errors.
	}
}

function OnAfterFolderChange(data) {
	try {
		if (!data.result) return;
		var p = data.tab && data.tab.path ? _esc(data.tab.path) : "";
		_writeEvent('"ev":"nav","act":"' + _esc(data.action) + '","path":"' + p + '","q":"' + _esc(data.qualifiers) + '"');
	} catch (e) {}
}

function OnListerUIChange(data) {
	try {
		_writeEvent('"ev":"ui","chg":"' + _esc(data.change) + '","q":"' + _esc(data.qualifiers) + '"');
	} catch (e) {}
}

function OnDisplayModeChange(data) {
	try {
		var p = data.tab && data.tab.path ? _esc(data.tab.path) : "";
		_writeEvent('"ev":"view","mode":"' + _esc(data.mode) + '","path":"' + p + '"');
	} catch (e) {}
}

function OnFlatViewChange(data) {
	try {
		var p = data.tab && data.tab.path ? _esc(data.tab.path) : "";
		_writeEvent('"ev":"flat","mode":"' + _esc(data.mode) + '","path":"' + p + '"');
	} catch (e) {}
}

function OnQuickFilterChange(data) {
	try {
		var flt = (data.tab && data.tab.quickfilter && data.tab.quickfilter.filter) ? _esc(data.tab.quickfilter.filter) : "";
		if (!flt) return;
		var p = data.tab && data.tab.path ? _esc(data.tab.path) : "";
		_writeEvent('"ev":"filter","filter":"' + flt + '","path":"' + p + '"');
	} catch (e) {}
}

function OnOpenTab(data) {
	try {
		var p = data.tab && data.tab.path ? _esc(data.tab.path) : "";
		_writeEvent('"ev":"tab","act":"open","path":"' + p + '","q":"' + _esc(data.qualifiers) + '"');
	} catch (e) {}
}

function OnCloseTab(data) {
	try {
		var p = data.tab && data.tab.path ? _esc(data.tab.path) : "";
		_writeEvent('"ev":"tab","act":"close","path":"' + p + '"');
	} catch (e) {}
}

function OnActivateTab(data) {
	try {
		var oldP = data.oldtab && data.oldtab.path ? _esc(data.oldtab.path) : "";
		var newP = data.newtab && data.newtab.path ? _esc(data.newtab.path) : "";
		_writeEvent('"ev":"tab","act":"activate","from":"' + oldP + '","to":"' + newP + '"');
	} catch (e) {}
}

function OnDoubleClick(data) {
	try {
		var ext = "";
		if (!data.is_dir && data.path && data.path.ext) {
			ext = _esc(data.path.ext);
		}
		_writeEvent('"ev":"dblclk","dir":' + (data.is_dir ? "true" : "false") + ',"ext":"' + ext + '","q":"' + _esc(data.qualifiers) + '"');
	} catch (e) {}
	return false;
}

function OnFileOperationComplete(data) {
	try {
		if (data.query) {
			return (data.action == "rename");
		}
		if (data.action == "rename") {
			var dst = data.dest ? _esc(data.dest) : "";
			var cmd = data.cmdline ? _esc(data.cmdline) : "";
			var cnt = (data.data && typeof data.data.count !== "undefined") ? data.data.count : 0;
			_writeEvent('"ev":"rename","dest":"' + dst + '","count":' + cnt + ',"cmd":"' + cmd + '"');
		}
	} catch (e) {}
}
