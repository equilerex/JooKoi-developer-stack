#!/usr/bin/env bash
echo "Setting up Unix line endings & Git safety rules..."

# 1. Stop Git from changing checked-out files
git config --global core.autocrlf false
git config --global core.safecrlf false

# 2. Configure global VS Code settings (if VS Code is installed)
VSCODE_SETTINGS_DIR=""
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    VSCODE_SETTINGS_DIR="$APPDATA/Code/User"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    VSCODE_SETTINGS_DIR="$HOME/Library/Application Support/Code/User"
else
    VSCODE_SETTINGS_DIR="$HOME/.config/Code/User"
fi

if [ -d "$VSCODE_SETTINGS_DIR" ]; then
    SETTINGS_FILE="$VSCODE_SETTINGS_DIR/settings.json"
    if [ ! -f "$SETTINGS_FILE" ]; then
        echo "{}" > "$SETTINGS_FILE"
    fi
    # Use node or python to cleanly update JSON without destroying existing settings
    python3 -c "import json; f=open('$SETTINGS_FILE','r+'); d=json.load(f); d['files.eol']='\n'; f.seek(0); json.dump(d,f,indent=4); f.truncate()" 2>/dev/null || \
    node -e "const fs=require('fs'); const file='$SETTINGS_FILE'; const d=JSON.parse(fs.readFileSync(file,'utf8')); d['files.eol']='\n'; fs.writeFileSync(file, JSON.stringify(d,null,4));" 2>/dev/null
    echo "✔ VS Code default EOL set to Unix (LF)."
else
    echo "⚠ VS Code user directory not found. Skipping editor-specific configuration."
fi

echo "✔ Setup complete! Git will leave existing files alone, and your tools are configured for Unix newlines."
