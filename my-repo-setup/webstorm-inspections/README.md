# WebStorm inspection profile

Copy `Project_Default.xml` and `profiles_settings.xml` into `<project>/.idea/inspectionProfiles/`, then restart WebStorm or reopen the project.

Disabled (noisy in docs/scripts repos): Markdown unresolved file/header refs, deprecated HTML attributes in Markdown, JS redundant initializer/local variable, spellcheck, grammar.

Commit dialog checkboxes (Analyze code, Check TODO, Optimize imports) live in `workspace.xml`, per user. Set them by hand once: gear icon in the commit panel, or Settings > Version Control > Commit.
