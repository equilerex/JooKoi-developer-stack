from pathlib import Path

path = Path(r"C:\Users\Joosep\.agents\AGENTS.md")
content = path.read_bytes()
rule = b"- For local files, give verified absolute filesystem paths. Do not turn them into `/blob/<branch>/` repository-web links unless the user asks for a web link."
newline = b"\r\n" if b"\r\n" in content else b"\n"

if content.count(rule + newline) != 1:
    raise SystemExit("Expected rule missing or duplicated; file left unchanged")

path.write_bytes(content.replace(rule + newline, b"", 1))
print("Codex-specific rule removed from shared global AGENTS.md")
