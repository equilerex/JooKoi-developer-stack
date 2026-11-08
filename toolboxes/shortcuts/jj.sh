# Defines the `jj` function for Git Bash.
# Sourced from ~/.bashrc by `npm run setup:jj`. jj.mjs writes "cd" or "run"
# plus a payload to a temp file, and this function applies it in the current shell.
_jj_menu_script="$(cygpath -w "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/jj.mjs")"

jj() {
  local result_file kind payload exit_code
  result_file="$(mktemp)" || return 1
  JJ_RESULT_FILE="$(cygpath -w "$result_file")" node "$_jj_menu_script"
  exit_code=$?
  if [ -s "$result_file" ]; then
    { IFS= read -r kind; IFS= read -r payload; } < "$result_file"
  fi
  rm -f "$result_file"
  [ "$exit_code" -eq 0 ] || return "$exit_code"
  case "$kind" in
    cd) cd "$(cygpath -u "$payload")" ;;
    run) eval "$payload" ;;
  esac
}
