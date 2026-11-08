_jookoi_find_package() {
    local directory="$PWD"
    while [[ "$directory" != "/" && "$directory" != "." ]]; do
        if [[ -f "$directory/package.json" ]]; then
            printf '%s\n' "$directory/package.json"
            return 0
        fi
        [[ "$directory" == "${directory%/*}" ]] && break
        directory="${directory%/*}"
    done
    return 1
}

jookoi_project_context() {
    local package_file package_root package_info project_name script_names
    package_file=$(_jookoi_find_package) || {
        unset JOO_PROJECT_ROOT JOO_PROJECT_NAME JOO_PACKAGE_MANAGER JOO_PROJECT_SCRIPTS
        return 0
    }

    package_root=${package_file%/*}
    package_info=$(node -e '
        const fs = require("fs");
        const packageJson = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
        process.stdout.write(`${packageJson.name || ""}\n${Object.keys(packageJson.scripts || {}).join("|")}`);
    ' "$package_file" 2>/dev/null) || return 1

    project_name=${package_info%%$'\n'*}
    script_names=${package_info#*$'\n'}
    if [[ -f "$package_root/pnpm-lock.yaml" ]]; then
        JOO_PACKAGE_MANAGER=pnpm
    elif [[ -f "$package_root/yarn.lock" ]]; then
        JOO_PACKAGE_MANAGER=yarn
    elif [[ -f "$package_root/bun.lock" || -f "$package_root/bun.lockb" ]]; then
        JOO_PACKAGE_MANAGER=bun
    else
        JOO_PACKAGE_MANAGER=npm
    fi

    export JOO_PROJECT_ROOT="$package_root"
    export JOO_PROJECT_NAME="$project_name"
    export JOO_PROJECT_SCRIPTS="$script_names"
    export JOO_PACKAGE_MANAGER
}

jookoi_project_scripts() {
    jookoi_project_context || return 1
    [[ -n ${JOO_PROJECT_ROOT:-} ]] || {
        printf 'No package.json found in this folder or its parents.\n'
        return 1
    }

    local script
    printf '%s (%s)\n' "${JOO_PROJECT_NAME:-project}" "$JOO_PACKAGE_MANAGER"
    while IFS= read -r script; do
        [[ -n "$script" ]] && printf '  %s run %s\n' "$JOO_PACKAGE_MANAGER" "$script"
    done < <(printf '%s' "$JOO_PROJECT_SCRIPTS" | tr '|' '\n')
}

jrun() {
    jookoi_project_context || return 1
    [[ -n ${JOO_PROJECT_ROOT:-} ]] || {
        printf 'No package.json found in this folder or its parents.\n' >&2
        return 1
    }
    "$JOO_PACKAGE_MANAGER" run "$@"
}

_jookoi_welcome() {
    [[ $- == *i* && -t 1 ]] || return
    [[ ${JOO_SKIP_WELCOME:-0} == 1 ]] && return
    [[ -n ${COPILOT_CLI:-}${COPILOT_AGENT_SESSION_ID:-}${GEMINI_CLI:-}${CLAUDE_CODE:-}${CLAUDECODE:-} ]] && return

    local quick_commands='jj :: Favorites' tool
    for tool in claude copilot gemini codex jnote; do
        command -v "$tool" >/dev/null 2>&1 && quick_commands+="  │  $tool"
    done

    printf '\n'
    if [[ ${JOO_WELCOME_LOGO:-0} == 1 ]]; then
        printf '\033[0;37m ═╦═         ╦  ╦            ╔══╗                   ╗\033[0m\n'
        printf '\033[0;37m  ║          ║ ╔╝     o      ║                o     ║\033[0m\n'
        printf '\033[0;37m  ║  ╔═╗ ╔═╗ ╠═╣  ╔═╗ ╦      ╚══╗ ╔═╗ ╔═╗ ╔═╗ ╦ ╔═╗ ║\033[0m\n'
        printf '\033[0;37m╦ ║  ║ ║ ║ ║ ║ ╚╗ ║ ║ ║         ║ ║ ║ ╠═╝ ║   ║ ╔═╣ ║\033[0m\n'
        printf '\033[0;37m╚═╝  ╚═╝ ╚═╝ ╩  ╩ ╚═╝ ╩      ╚══╝ ╠═╝ ╚═╝ ╚═╝ ╩ ╚═╚ ╩\033[0m\n'
        printf '\033[0;37m                                  ║                  \033[0m\n'
        printf '\033[0;37m                                  ╩                  \033[0m\n'
    else
        printf '  \033[1;36mJOOKOI DEVELOPER STACK\033[0m\n'
    fi
    printf '  \033[1;37mQuick commands:\033[0m  %s\n' "$quick_commands"
    printf '\n'
    printf '  \033[1;35m%-36s\033[0m│ \033[1;34m%-36s\033[0m│ \033[1;33m%-36s\033[0m\n' \
        'POWER NAVIGATION' 'CLAUDE CODE' 'GEMINI CLI'
    printf '  %-36s│ %-36s│ %-36s\n' \
        'Alt+B / F :: word back / forward' 'Shift+Tab :: cycle permission mode' 'Ctrl+Enter :: multiline'
    printf '  %-36s│ %-36s│ %-36s\n' \
        'Ctrl+A / E :: line start / end' 'Esc Esc :: rewind / edit last' 'Ctrl+Y :: YOLO mode'
    printf '  %-36s│ %-36s│ %-36s\n' \
        'Ctrl+U / K :: delete to / from' '@ :: reference a file' 'Ctrl+B / L :: background shell'
    printf '  %-36s│ %-36s│ %-36s\n' \
        'Ctrl+Y :: paste deleted text' '! command :: run in shell' '! command :: run in context'
    printf '  %-36s│ %-36s│ %-36s\n' \
        'Ctrl+R :: search history' '/compact /clear :: shrink / reset' 'Ctrl+Z/Alt+Z :: undo / redo'
    if jookoi_project_context && [[ -n ${JOO_PROJECT_NAME:-} && -n ${JOO_PROJECT_SCRIPTS:-} ]]; then
        local script_count=0 script_line script
        while IFS= read -r script; do
            [[ -z "$script" ]] && continue
            script_line+="${script_line:+  }$JOO_PACKAGE_MANAGER run $script"
            ((script_count += 1))
            [[ $script_count -ge 8 ]] && break
        done < <(printf '%s' "$JOO_PROJECT_SCRIPTS" | tr '|' '\n')
        printf '\n  \033[1;32mPROJECT:\033[0m %s  \033[1;37m%s\033[0m\n' "$JOO_PROJECT_NAME" "$JOO_PROJECT_ROOT"
        printf '  \033[1;32mRUN:\033[0m %s\n' "$script_line"
        (( ${#JOO_PROJECT_SCRIPTS} > 0 )) && printf '  \033[2mUse jookoi_project_scripts to list all commands, or jrun <name> to run one.\033[0m\n'
    fi
    printf '\n'
}

_jookoi_welcome
unset -f _jookoi_welcome
