# Internal command index

Compact index of the v13 manual's internal command arguments, one line per argument.
Types: /S switch, /K keyword (ARG=value), /O optional value, /N numeric, /M multiple, /F file or folder name, /R raw (rest of line).

## CLI
The CLI internal command can be used to: - Open the CLI / Ad-Hoc Script Editor window - Open an MS-DOS prompt (with the current directory set to the current folder in the Lister) - Cause the find-as-you-type field to ap…
- `DOSPROMPT /O = selfolder|admin|noadmin|powershell|powershellise|nocolor|wsl`: (selfolder) Opens a DOS prompt with the current directory set to the folder displayed in the source file display.
- `EXEC /K = <command>`: Overrides the default executable to launch when opening a PowerShell prompt.
- `QUICKCMD /O/R = <command>`: Displays the find-as-you-type field in Command mode, which lets you enter an ad-hoc Opus command to execute in the current file display.
- `QUICKDOSCMD /O/R = <command>`: Displays the find-as-you-type field in DOS Command mode, which lets you enter a command to execute in a DOS prompt.
- `QUICKFILTER /O/R = <pattern>`: Displays the find-as-you-type field in Filter mode, which lets you filter the current file list.
- `QUICKFIND /O/R = <search string>`: Displays the find-as-you-type field in Find mode, which lets you scroll to the first file matching the entered string.
- `QUICKFINDCLEAR /S`: Clears any highlights shown in the file display as a result of a quick find.
- `QUICKFINDREPEAT /O = next|prev`: (next) Repeats the last QUICKFIND.
- `QUICKFOLDERS /O/R = <search string>`: Displays the find-as-you-type field in Folders mode, which shows a list of folders drawn from the tab history list, recent list, favorites…
- `QUICKFTPCMD /O/R = <command>`: Displays the find-as-you-type field in a special mode that lets you enter a command to send directly to a remote FTP server.
- `QUICKGO /O/R = <path>`: Displays the find-as-you-type field in a special mode ("go" mode) that lets you navigate to another folder in the current file display.
- `QUICKRANGE /O/R = <range>`: Displays the find-as-you-type field in Range mode, which lets you select files by index (or by a range of indices).
- `QUICKSEARCH /O/R = <query term>`: Displays the find-as-you-type field in Search mode, which lets you initiate a Windows Search of the current folder.
- `QUICKSEARCHENGINE /K = everything|diacritics|wholeword|regexp|everythingglobal|diacritics|wholeword|regexp|opus|case|content|nodiacritics|nonames|nopartial|nowild|utf8|windows|nqs`: (everything) <engine>[,<options>] Use with the QUICKSEARCH argument to specify the search engine to use in Search mode.
- `QUICKSELECT /O/R = <pattern>`: Displays the find-as-you-type field in Select mode, which lets you select files in the current folder by wildcard pattern.
- `QUICKTABS /O/R = <pattern>`: Displays the find-as-you-type field in Tabs mode, which lets you search and switch folder tabs.
- `QUICKWSLCMD /O/R = <command>`: Displays the find-as-you-type field in WSL script mode, which lets you enter a command to execute in a WSL (Windows System For Linux) windo…
- `SCRIPTMODE /O = <language>`: Displays the CLI in Script Mode, which provides a simple way to test scripts before adding them to buttons.
- `TITLE /K = <command>`: Defines the window title when opening a PowerShell prompt.

## Clipboard
The Clipboard internal command can be used to: - Copy and paste files and folders from one folder to another - Copy the names of selected files and folders to the clipboard - Paste image or text data from the clipboard…
- `ADD /S`: Adds additional files to those already on the clipboard instead of replacing them.
- `AS /K = <filename>|ask`: Overrides the default filename used when pasting images or text to disk.
- `COPY /S`: Copies all selected files and folders to the clipboard.
- `COPYCOLUMNS /K = tab|head|all|nocsv`: (tab) Copies the contents of any highlighted cells to the clipboard, in comma-separated (CSV) format.
- `COPYCOMMANDARGS /K = <arguments>`: When used with Clipboard PASTE this lets you provide additional arguments for the Copy command (if that's what the paste command ends up ru…
- `COPYIMAGE /S`: Copies the selected image file to the clipboard as an image, for pasting into other programs.
- `COPYINFOTIP /S`: Copies the text content of the currently visible info tip to the clipboard.
- `COPYNAMES /O = noexts|nopaths|notepad.exe|url|unc|short|single|paths|capsemantics|quote|wsl|hashcache`: (noexts) Copies the names of all selected files and folders to the clipboard (the file names themselves are copied, in text format, rather than the…
- `COPYQUEUE /O = <queue name>|none|shift|quiet|noisy`: Use in conjunction with the PASTE argument to paste files with copy queuing enabled.
- `CUT /S`: Cuts all selected files and folders to the clipboard (nothing happens to the files immediately, but when you paste them somewhere else they…
- `CUTNOCOPYQUEUEWHENSAME /S`: Used with Clipboard PASTE, this disables the use of a copy queue when the files on the clipboard are being cut (that is, moved), and the so…
- `EXPANDNEWLINES /S`: Used with Clipboard SET, allows you to use \n to insert a new line into the string, so that you can set a clipboard string consisting of mu…
- `FILE /K/M = files.`: <filename>, … Specify the file or files to operate on.
- `NEWLINEIFADDING /S`: Used with Clipboard ADD SET, adds a new line between the existing clipboard data and the string to be added.
- `NOFROMFOCUS /S`: The default behaviour for the Clipboard command is to operate on either the source file display, or the Folder Tree, depending on which one…
- `PASTE /O = jpg|png|gif|bmp|zip|7z|<archive suffix>`: (jpg) Pastes any files and folders previously copied to the clipboard into the current Lister.
- `PASTELINK /O = junction|hardlink|softlink|relsoftlink|auto|autonosoft`: (junction) Pastes shortcuts to any files and folders previously copied to the clipboard into the current Lister.
- `PREFERIMAGE /S`: When pasting data from the clipboard into a new file, image data is normally given priority over text data.
- `PREFERTEXT /S`: When pasting data from the clipboard into a new file, image data is normally given priority over text data.
- `REGEXP /K/M`: <search> <replace> … In conjunction with COPYNAMES lets you perform regular expression manipulation on the filenames as they are put into t…
- `SCREENSHOT /O = all|format|name|quality|quiet|save|secure|time`: (all) Takes a screenshot of the active Lister and copies it to the clipboard.
- `SET /K/R`: user defined Copies the supplied text to the clipboard.
- `USESEL /S`: Modifies the behaviour of the PASTE and PASTESHORTCUT functions.

## Close
The Close command can be used to: - Close Listers (either the current Lister or all) - Collapse all open Listers to tabs in a single Lister - Exit Directory Opus altogether - Shutdown or restart the system immediately -…
- `ALLLISTERS /O = collapse|unique`: (collapse) Closes all currently open Listers.
- `ALLOTHERLISTERS /S`: Closes all open Listers except the active Lister.
- `ALLVIEWERS /S`: Closes any open standalone viewer windows.
- `AT /K = <HH:MM:SS>`: In conjunction with the SYSTEM argument this schedules an automatic shutdown of your system at a given time.
- `AUTOLISTER /O = no`: In conjunction with the Prefs RESTORE command, this argument sets a global flag that specifies that when Opus restarts, it should use "auto…
- `CANCEL /S`: If you have previously scheduled a system shutdown with the Close SYSTEM and AT or IN arguments, this argument will cancel it.
- `CURRENTDESKTOP /S`: When combined with ALLLISTERS, ALLOTHERLISTERS, or ALLVIEWERS, the CURRENTDESKTOP switch will make the command only close those windows whi…
- `IN /K = <HH:MM:SS>`: Schedules an automatic shutdown in a certain amount of time (contrast with AT, which lets you specify an absolute time of day).
- `NOSCRIPT /S`: Closes the Lister without triggering the OnCloseLister script events that any script add-ins may have provided.
- `PROGRAM /O = confirm|onlast`: (confirm) Exits Directory Opus immediately.
- `QUIET /S`: Suppresses the confirmation dialog normally displayed when shutting the system down with the Close SYSTEM command.
- `RESTART /O = confirm`: Shuts Opus down and restarts it.
- `SYSTEM /O = restart|shutdown|poweroff|sleep|suspend|stay|force|forceifhung|switch|unattended`: (restart) Ends your Windows session and logs you off.
- `TOGGLE /S`: Use this argument in conjunction with the scheduled-shutdown options to toggle the scheduled shutdown on or off.
- `WHENFINISHED /S`: Schedules an automatic shutdown when all outstanding file operations have completed.

## ContextMenu
The ContextMenu command can be used to: - Display a list of the context menu commands that are available for selected files, and - Trigger a context menu command for selected files without needing to first display the c…
- `CTRL /S`: When invoking a context menu command, tells the command handler to act as if the Ctrl key is held down.
- `EXTENDEDVERBS /S`: Enables support for extended verbs.
- `FILE /K/M = files.`: <filename>, … Specify the file or files to operate on.
- `ID /K/N = <command ID>`: Specify the ID of the context menu command to execute.
- `ITEMMENU /O = no`: (Windows Vista and above.
- `LABEL /K = <label>`: Specify the label of the context menu command to execute.
- `LABELRAW /K/R = <label>`: This is the same as the LABEL argument except that it is a "raw" argument which swallows the remainder of the command line.
- `LOOKUP /S`: Use in conjunction with the VERB argument to make Opus lookup the verb's ID on-the-fly instead of simply passing the verb name to the comma…
- `REGEXP /S`: Used in conjunction with the LABEL argument to specify that the label string is a regular expression.
- `SHIFT /S`: When invoking a context menu command, tells the command handler to act as if the Shift key is held down.
- `SHOWCMDS /S = <verb>`: Displays a list of context menu commands for the selected files.
- `WANTSYNC /S`: Requests that the context menu command be run synchronously.
- `WILD /S`: Used in conjunction with the LABEL argument to specify that the label string is a wildcard expression.

## Copy
The Copy internal command can be used to: - Copy and move files and folders - Create and add files to archives - Extract files from archives - Perform simple one-way file synchronization - Create links, shortcuts and ju…
- `ADDTOARCHIVE /O = <archive format>|fullpaths|nofullpaths|keepfolder|nokeepfolder|nosplit`: Displays the Add to Archive dialog, to create an archive from the selected files.
- `ARCHIVE /O = <archive format>|single|keepfolder|nokeepfolder`: Adds all selected files and folders to a Zip file named after the first selected item.
- `AS /O = <new name>`: When copying or moving files, you will be prompted to enter a new name for each file.
- `AUTOSELECT /K = yes|no`: (yes) Overrides the state of the Automatically select newly copied files option on the Copying Files Preferences page.
- `BUFSIZE /K/N = <size in bytes>`: Overrides the copy_buffer_size setting on the Miscellaneous / Advanced page in Preferences.
- `BURNCD /S`: Invokes the system CD Burning Wizard, which initiates burning of any files you have previously copied to the CD staging area.
- `CLEARREADONLY /K = yes|no`: (yes) Clear the read-only attribute.
- `COLLLIST /S`: Displays a dynamically generated list of file collections - you can add selected files and folders to a file collection simply by selecting…
- `COPYATTR /K = yes|no`: (yes) Preserves file attributes when copying files or folders.
- `COPYDESC /K = yes|no`: (yes) Preserves file descriptions when copying files or folders, when the descriptions are not stored within NTFS ADS or when NTFS ADS is not oth…
- `COPYDIRTIMES /K = all|none|onlymodified|onlycreated`: (all) Preserves the Modified and Created timestamps of copied folders.
- `COPYFILETIMES /K = all|none|onlymodified|onlycreated`: (all) Preserves the Modified and Created timestamps of copied files.
- `COPYOWNER /K = local|all|no`: (local) Copy file owner information, when the copy takes place between local drives only.
- `COPYPROPERTIES /K = yes|no|fastest`: (yes) Always copy NTFS ADS properties/metadata when copying files and folders.
- `COPYSECURITY /K = yes|no`: (yes) Copy security permissions when copying files between NTFS drives.
- `COPYSPARSE /K = yes|no`: (yes) Recreate sparse regions in the copied file (when the source file is sparse).
- `COPYTOCOLL /K = member|sub|ask`: (member) When copying (adding) folders to a file collection, add them as members of the collection (overrides the When copying folders to a Collecti…
- `CREATEFOLDER /O = <folder name>`: Prompts for the name of a new folder and copies the selected files and folders into that folder.
- `DELEGATE /K = yes|no`: (yes) Overrides the copy_allow_delegation setting on the Miscellaneous / Advanced page in Preferences.
- `DUPLICATE /S`: Create duplicates of the selected items in the same folder.
- `EXTRACT /O = sub|checkout`: (sub) Extracts the contents of selected archives to the destination folder.
- `FILE /M`: <filename> … Specifies the name of the file or files to copy.
- `FILTER /O = <filter>|shift|alt|ctrl`: Copies with filtering enabled (without having to activate the copy filter in the Lister first).
- `FILTERDEF /K/R = <filter>`: Lets you define a filter in text format to filter the contents of copied folders.
- `FLATVIEWCOPY /K = single|recreate|ask|autosingle`: (single) When copying items in different directories from a flat view file display, the files will all be copied to the same target directory.
- `FORCE /S`: Automatically replace existing files without prompting.
- `HERE /S`: Use the source folder as the destination folder (for example, archives can be extracted to the same folder instead of the destination).
- `IGNOREEXT /S`: Makes the copy function ignore file extensions when copying with a wildcard rename (for example, so a button can work on both files and fol…
- `INCLUDEINLIBRARY /O = noread|<library name>`: (noread) Displays a dynamically generated list of libraries - you can include a selected folder in a library simply by selecting it from this list.
- `INSTALLFONT /O = user`: Installs new fonts in your system fonts folder.
- `MAKELINK /O = junction|hardlink|softlink|relsoftlink|auto|autonosoft`: (junction) Creates shortcuts to all selected files and folders.
- `MAKESFX /O`: Creates a self-extracting Zip file from selected files and folders.
- `MARKDESTARCHIVE /K = yes|no`: (yes) Clears the A ("ready for archiving") attribute on newly copied files.
- `MARKSOURCEARCHIVE /K = yes|no`: (yes) Clear the A ("ready for archiving") attribute on the original files after they have been copied.
- `MOVE /S`: Move selected files and folders to the destination (a.k.a.
- `MOVEWHENSAME /S`: If the destination folder is on the same drive as the source then selected items will be moved, otherwise they will be copied.
- `MOVEWITHSHIFT /S`: Selected items will be moved if the Shift key is held down when the command is executed, otherwise they will be copied.
- `NONBUFIO /K = yes|no|<threshold size>`: (yes) Changes when the copy operation uses non-buffered mode, where the filesystem buffers provided by Windows are bypassed.
- `NOQUEUEWHENSAME /S`: Disables the use of the copy queue when the source and destination paths are on the same drive partition.
- `PATTERN /K = <old name pattern>`: Specifies the "old name" or "from" wildcard pattern for the copied or moved files.
- `QUEUE /O = <queue name>|none|shift|quiet|noisy`: Enables automatic copy queuing.
- `READAUTO /O = no|dual|left|right|tab|nofocus`: (no) When used with CREATEFOLDER, automatically reads the newly created folder into the current source file display.
- `RENAMEWHENSAME /S`: If the source and destination are the same folder, the newly copied file will be automatically renamed to avoid a clash.
- `SENDMAIL /O = <email address>`: Send selected files as email attachments.
- `SENDTO /K = <send-to target>`: Send selected files to the specified "send to" target.
- `SYNC /S`: Performs the copy stage of a synchronize operation.
- `TO /K = <target path>|ask`: Specify the target path for the command.
- `UNATTENDED /K = yes|no`: (yes) Enables unattended copy mode.
- `UPDATEALL /S = date|size|smaller|larger`: (date) Update files in the destination folder (a simple form of one-way synchronization).
- `UPDATEEXISTING /O = date|size|smaller|larger`: (date) Update existing files in the destination folder (a simple form of one-way synchronization).
- `UPDATESECURITY /K = yes|no`: (yes) Update security permissions and encryption settings for moved* files to match their destination folders.
- `UPDATETOLERANCE /K/N = <tolerance seconds>`: Sets the maximum number of seconds an existing file's timestamp can vary before it will be considered "different" by the UPDATEALL or UPDAT…
- `WHENEXISTS /K = ask|skip|recycle|replace|rename|renameold|resume|merge|keepnewer`: (ask) If a file that is being copied already exists in the destination, ask what to do.

## CreateFolder
The CreateFolder internal command is used to: - Create new folders (either via a dialog, an inline rename field in the file display, or with a pre-determined name) - Create new archive files - Create new libraries, coll…
- `ARCHIVE /O = <archive format>`: Create a new archive file.
- `ARCHIVEARGS /K = <archive arguments>`: Used to pass format-specific arguments when creating an archive.
- `ASK /S`: If you specify a name with the NAME argument the Create Folder dialog does not normally display; instead the folder is created immediately.
- `COLLQUERY /S`: Creates a stored query collection rather than a regular file collection.
- `FROMCLIPBOARD /O = multi`: Uses the text currently on the clipboard for the name of the new folder.
- `INLINE /S`: Creates a new folder and lets you edit its name inline (in the file display) - equivalent to selecting New → Folder from the context or Fil…
- `NAME /M`: <folder name> … Specify the name of the folder or archive to create.
- `NOSEL /S`: Normally when a folder is created in the currently displayed directory it is selected, and the display scrolled if necessary to make it vis…
- `NOUPDATESETTINGS /S`: Prevents settings made by this command from becoming the new defaults.
- `MULTI /O = no`: Ensures the Create Folder is in multiple-folder mode if it opens.
- `READAUTO /O = no|dual|left|right|tab|nofocus`: (no) Automatically read the newly created folder into the current source file display.
- `ZIP /S`: Create a new Zip file (equivalent to CreateFolder ARCHIVE=.zip).

## Delete
The Delete internal command can be used to: - Recycle files and folders (delete them to the recycle bin) - Delete files and folders permanently (bypassing the recycle bin) - Securely erase files so they can't ever be re…
- `ALL /S`: Delete all files and folders without prompting.
- `EMPTYRECYCLE /O = <drive letter>`: Empty the system recycle bin.
- `ERASEEMPTYSPACE /O = <drive letter>`: Erase empty space on the current drive.
- `FAILNOTEMPTY /S`: Fail when attempting to delete a non-empty folder, or any file.
- `FILE /M`: <filename> … Specifies the name of the file or files to delete.
- `FILTER /O = <filter>|shift|alt|ctrl`: Delete with filtering enabled (without having to activate the delete filter in the Lister first).
- `FILTERDEF /K/R = <filter>`: Lets you define a filter in text format to only delete matching files from selected folders.
- `FORCE /S`: Force the deletion of any files that are marked as read-only (have the R attribute set).
- `NOFROMFOCUS /S`: The default behaviour for the Delete command is to operate on either the source file display, or the Folder Tree, depending on which one ha…
- `NORECYCLE /S`: Prevent the use of the recycle bin - files will be permanently deleted.
- `QUIET /S`: Prevent the display of any confirmation dialogs or error messages.
- `RECYCLE /S`: Delete files by moving them to the recycle bin (if possible - not all drives support the recycle bin).
- `REMOVECOLLECTION /O = auto`: Remove selected files and folders from the file collection.
- `SECURE /O = <passes>`: Perform a secure delete using the number of passes specified on the File Operations / Delete Files page in Preferences.
- `SHIFT /S`: Modifies the behaviour of the Delete command if the Shift key is held down.
- `SKIPNOTEMPTY /S`: Skip over non-empty folders, and all files, without deleting them, while still considering subsequent items for deletion.

## Favorites
The Favorites internal command can be used to: - Display a dynamic list of your Favorite folders (either all Favorites or a specific sub-branch) - Display a dynamic list of your SmartFavorite folders - Add a folder to y…
- `ADD /O = nameonly|alias`: (nameonly) Add the current source folder to your Favorites list.
- `ADDDIALOG /S`: Display a dialog that lets you edit the name and path when adding a new favorite folder.
- `ALIAS /K = delete|set|list|builtin|all`: (delete) Deletes a folder alias.
- `AUTOCREATE /S = <branch path>`: Automatically creates the branch specified by the BRANCH argument if it doesn't already exist.
- `BRANCH /K = <branch path>`: Specifies a branch of the favorites tree to display, or when used with the ADD or ADDDIALOG arguments, the branch to add a new favorite to.
- `COPYTO /S`: Modifies the generated list of favorites, turning each item into a "copy" button that will copy selected files to the favorite folder.
- `EDIT /S`: Display the Favorites List page in Preferences.
- `EXCLUDEBRANCH /K = <name or pattern>`: When displaying a list of Favorites, you can use the EXCLUDEBRANCH argument to exclude whole branches of the favorites tree from the genera…
- `FOLDERCONTENT /K = <options>`: When displaying a list of Favorites, this lets the individually generated buttons act as folder content menus.
- `FILTER /K = <wildcard>`: When displaying a list of Favorites or SmartFavorites, you can use the FILTER argument to filter the list by path, using a wildcard.
- `HEADING /O = <heading text>`: When used with commands which generate a list of items (see dynamic buttons), the HEADING argument adds a small heading at the start of the…
- `KEYARGS /K/M = <qualifier:arguments>`: … When displaying a list of favorites, this argument lets you assign different behaviour to the items in the list if a qualifier key is hel…
- `MENUMARKERS /S`: If the generated list of favorites includes any submenus, the top-level buttons will display a glyph indicating a dropdown menu.
- `MOVETO /S`: Modifies the generated list of favorites, turning each item into a "move" button that will move selected files to the favorite folder.
- `MULTIFUNC /O = tabs`: The generated list of favorites will be multiple function buttons (three-button buttons) - clicking them with the left mouse button will ac…
- `NAME /K = <name>`: Specifies the name of the newly created favorite or alias.
- `NAMESONLY /S`: When listing Smart Favorites, each item in the list will only display its respective folder's name, not the full path.
- `NEW /S`: Favorites selected from the list generated by this command will open in a new Lister instead of the current one.
- `NEWTAB /O = deflister|findexisting|findinactive|nofocus|tofront`: (deflister) Favorites selected from the list generated by this command will open in a new tab.
- `NOLABELS /S`: The favorites list displayed by this command will not show any labels for the favorite folders.
- `NOOPENINTABS /S`: Do not add the Open in tabs command that is normally displayed at the bottom of the generated favorites list.
- `OPENINDEST /S`: Favorites selected from the list will open in the destination file display or Lister.
- `OPENINDUAL /S`: Favorites selected from the list will open in the other file display of a dual-display Lister.
- `OPENINLEFT /S`: Favorites will open in the left-hand (or top) display of a dual-display Lister.
- `OPENINRIGHT /S`: Favorites will open in the right-hand (or bottom) display of a dual-display Lister.
- `PATH (default arg) = <folder path>`: When used with the ADD argument, specifies the path to add as a favorite or alias.
- `SHOWICONS /S`: The favorites list displayed by this command will display icons for the items within it.
- `SMART /O = <number of items>|clear`: Generates a dynamic list of SmartFavorites instead of the regular Favorite list.
- `TYPE /K = files|dirs`: (files) Displays only files from the Favorites list.
- `USEQUALKEYS /S`: Activates pre-configured behaviour for the main qualifier keys - Control will open the favorite folder in the dual-display, Shift in a new…

## FileType
The FileType internal command can be used to: - Execute a file-type-specific command or action on selected files - Display the context menu for selected items in a drop-down menu - Display the context menu items generat…
- `ACTION (default arg) = <event>`: Trigger a file-type-defined event for the selected files.
- `CONTEXTFORCE /S`: When used with the CONTEXTMENU argument, this overrides the Hide Windows items on file context menus option on the Miscellaneous / Windows…
- `CONTEXTMENU /O = <GUID>`: Displays the standard system context menu for the selected files and folders (acts as a dynamic button).
- `CONTEXTFORCE (default arg) = <file class>`: Displays any context menus for the specified file class.
- `CONTEXTOPTIONS /K = parser.|windowsonly`: (parser.) INCLUDE=<type> When used in conjunction with CONTEXTMENU Directory\Background, this lets you include specific file types (and exclude all o…
- `EDIT /S`: Displays the File Type editor for the file type corresponding to the selected file.
- `FILE /K/M`: <filename> … Specify the filename or names to perform the file type action on.
- `FILECONTEXT /S`: Creates a button which, when right-clicked, shows the context menu for the file or folder the FILE argument points to.
- `FROMCLIPBOARD /O = keepext`: Use in conjunction with the NEW argument to create one or more new files with names drawn from the clipboard contents.
- `HEADING /O = <heading text>`: When used with commands which generate a list of items (see dynamic buttons), the HEADING argument adds a small heading at the start of the…
- `NEW /K = <file type>`: Create a new file of the specified type.
- `NEWCOUNT /K/N = <count>`: Allows the creation of more than one new file at once.
- `NEWMENU /O = nosub`: Adds a sub-menu containing the Windows shell's New menu.
- `NEWNAME /K = <new filename>`: Specifies the filename when creating a new file via the NEW argument.
- `OPENWITHMENU /O = nosub`: Adds a sub-menu containing the Windows shell's Open With menu, which lets you choose the program to open selected files with.
- `PATH /K = <path>`: Use this in conjunction with the NEW argument to create a new file in a location other than the current source file display.
- `SENDTOMENU /O = nosub|shift`: (nosub) Displays the shell Send To menu, that lets you send selected files and folders to various programs and destinations (acts as a dynamic butt…
- `SHELLCLASS /K = <class>`: When used in conjunction with ACTION=shellex, the SHELLCLASS argument lets you specify the name of a file type or application class which t…
- `SHELLVERB /K = <verb>`: When used in conjunction with ACTION=shellex, the SHELLVERB argument lets you specify the file type verb to ask the shell to execute.
- `SUMMARY /O = <no value>|all|ascending|contents|count|dirs|ext|groups|nomerge|recurse|selected|size`: Displays a dialog containing a pie chart that indicates the types of files in the current or selected folders, and their relative proportio…

## Find
The Find internal command can be used to: - Display the Find Panel where you can perform file searches - Automate the Find Files function to perform simple searches without displaying a user interface - Automate the Dup…
- `ADVANCED /S`: Display the Find Panel in Advanced mode.
- `ANYWORD /S`: Use when automating Find Files to enable the Any Word option for name searching.
- `ARCHIVES /S`: Search inside archive files (when the Find Files function is being automated).
- `BOTHWAYS /S`: When automating the Synchronize tool with the SYNC argument, this lets you turn on the Copy files in both directions option.
- `CASE /S`: Use when automating Find Files to specify that the NAME argument should be treated as case-sensitive, similar to the related checkbox in th…
- `CLEAR /O = no`: Clear previous results (when the Find Files function is being automated).
- `COLLNAME /K = <collection name>`: Specify the name of the file collection that results are added to.
- `COLUMN /K = <column name>|name|size`: When automating the duplicate finder tool with the DUPES argument, specifies that duplicates should be matched using the value of a specifi…
- `COMPARE /K = size|date|compare`: (size) When automating the Synchronize tool with the SYNC argument, this lets you select to compare files by size.
- `COMPUTERS /S`: Launch the Windows Search for Computers function (depending on your version of Windows, this may have no effect).
- `CONTAINING /K = <search text>`: Specify text to search for (when the Find Files function is being automated).
- `CONTANYWORD /S`: Use when automating Find Files to specify that the CONTAINING argument should be handled in "any word" mode, similar to the related checkbo…
- `CONTCASE /S`: Use when automating Find Files to specify that the CONTAINING argument should be treated as case- sensitive, similar to the related checkbo…
- `CONTIGNOREDIACRITICS /S`: Use when automating Find Files to specify that the CONTAINING argument should ignore diacritics (accent marks), similar to the related chec…
- `CONTNOPARTIAL /S`: Use when automating Find Files to prevent partial word matching for the CONTAINING argument (contents must then match the pattern you speci…
- `CONTWILD /S`: Use when automating Find Files to specify that the CONTAINING argument should be treated as a wildcard, similar to the related checkbox in…
- `CONTREGEXP /S`: Use when automating the Find Files function to specify that the CONTAINING argument should use regular expressions, similar to the related…
- `CONTUTF8 /S`: When automating the Find Files function, plain text files will be assumed to be UTF-8 if no BOM is detected (similar to the related checkbo…
- `DELETE /O = first`: When automating the Synchronize tool with the SYNC argument, this lets you turn on the Delete destination files that aren't in the source o…
- `DSTCOMPENSATION /S`: When automating the Synchronize tool with the SYNC argument, this lets you select to ignore one hour time differences (daylight savings tim…
- `DUPES /S`: Automates the Duplicate File Finder.
- `EXCLUDEHIDDEN /O = no`: Excludes hidden folders (those with the H attribute set) from the search.
- `EXCLUDESYSTEM /O = no`: Excludes system folders (those with the H and S attributes set) from the search.
- `FILTER /S`: Indicates that the value of the NAME argument is the name of a pre-defined filter.
- `FILTERDEF /K/R = <filter>`: Lets you define a filter in text format.
- `FROM /K = <path>`: When automating the Synchronize tool with the SYNC argument, this lets you specify the folder that is the source of the synchronize operati…
- `HERE /S`: When automating the Find tool, performs the search below the current folder.
- `HIDEUNAFFECTED /S`: When automating the Synchronize tool with the SYNC argument, this lets you select to hide unaffected files once the comparison process has…
- `IGNOREDIACRITICS /S`: Use when automating Find Files to specify that the NAME argument should ignore diacritics (accent marks), similar to the related checkbox i…
- `IGNORELINKS /S`: When automating the Duplicate File Finder, this lets you turn on the Ignore hard links option.
- `IGNORESECONDS /S`: When automating the Synchronize tool with the SYNC argument, this lets you select to ignore seconds when comparing timestamps.
- `IN /K/M`: <search location> … Specify the folder or folders to search in when automating a search.
- `LOADPREV /K = no|yes|all`: (no) Disable the loading of previous find settings when the Find panel opens.
- `MD5 /O = <percentage>|cache`: Search for duplicates using the MD5 checksum (used with the DUPES argument).
- `MINSIZE /K/N = <size>`: When automating the Duplicate File Finder, this lets you set the value of the Minimum size field.
- `NAME (default arg) = <filename>`: This is the default argument for the Find command, which means you do not need to use the NAME keyword before it (unless you are searching…
- `NAMEONLY /O = noext`: Search for duplicates based on filename only (used with the DUPES argument).
- `NOAUTORUN /S`: Lets you prevent an automated search from taking place - instead, the Find, Duplicates or Synchronize panel will open with the controls ini…
- `NOPARTIAL /S`: Use when automating Find Files to prevent partial name matching (names must then match the pattern you specify exactly).
- `NOWILD /S`: Use when automating Find Files to prevent wildcard name matching.
- `NUMBERGROUPS /S`: The Duplicate Finder creates groups for each set of duplicate files found, and normally these groups are named after the criteria used for…
- `OF /K/M`: <file to match> … Specifies one or more files to search for duplicates of.
- `OFFLINE /S`: When automating the Duplicate File Finder, this lets you turn off the Ignore offline files option (the default for this option is on).
- `ONLYEXISTING /S`: When automating the Synchronize tool with the SYNC argument, this lets you select to only synchronize existing files.
- `PRESET /K = <preset name>|faves|nofaves|nogroups`: Loads the specified Find, Synchronize or Duplicates preset.
- `QUERY /K/R = <query string>`: Performs a quick search in the specified location using Windows Search, Everything or the Opus internal find engine.
- `QUERYENGINE /K = <engine and flags>|everything|everythingglobal|case|whole|regex|diacritics|windows|nqs|noauto|opus|nonames|content|nowild|regex|anywords|case|nodiactritcs|nopartial|utf8`: Configures the search engine used to perform a query via the QUERY argument.
- `RECURSE /O = no`: When automating the Find Files, Duplicate File Finder or Synchronize Files functions, the search will extend into sub-folders below the spe…
- `REGEXP /S`: When automating the Find Files function, enables regular expressions for the value of the NAME field.
- `RUNINPANEL /S`: Normal automation of the Find command causes it to run in the background, without a visible user interface.
- `SAVEQUERY /S`: When you are currently viewing the results of a Windows Search query, this command will save the search as a stored query collection.
- `SHOWEVERYTHING /S`: When automating the Synchronize tool with the SYNC argument, this lets you select the option to show and synchronize everything, including…
- `SHOWRESULTS /K = source|dest|tab`: (source) Display the results of the automated search in the current source file display or Lister.
- `SIMPLE /S`: Display the Find Panel in simple mode.
- `SIZEONLY /S`: Search for duplicates based on file size only (used with the DUPES argument).
- `SYNC /O = ltr`: In conjunction with other arguments, this lets you automate the Synchronize tool.
- `TO /K = <path>`: When automating the Synchronize tool with the SYNC argument, this lets you specify the folder that is the destination of the synchronize op…
- `UAC /O = no`: Enables UAC prompts if elevation may be required to search inside folders.

## GetSizes
The GetSizes internal command can be used to: - Calculate and display the total sizes of selected folders - Calculate the total sizes of all folders in the current file display - Calculate MD5, SHA and other checksums f…
- `EVERYTHING /O = no|only`: (no) Calculates the sizes of selected folders using Everything if possible.
- `HASH /O = <type>`: Forces calculation of any hash columns that are displayed in the current file display, but haven't been calculated yet because the file siz…
- `IGNOREJUNCTIONS /O = no`: Ignores junctions and softlinks within folders when calculating their size.
- `NODESELECT /S`: Prevent the GetSizes command from deselected files and folders once their sizes/checksums have been calculated.
- `USEHASHCACHE /S`: In conjunction with the HASH option, this enables the use of the checksum cache.

## Go
The Go internal command can be used to: - Navigate to a different folder in the Lister - Move back and forward in the history list, and display the contents of the history list - Connect and disconnect network shares -…
- `BACK /S`: Navigate to the previous folder in the history list.
- `BACKLIST /O = namesonly|noicons|keys|sort`: (namesonly) Display a list of all previous folders in the history list (acts as a dynamic button).
- `COMPATIBILITYFILES /S`: Switch between a folder and its compatibility store.
- `CONNECT /O = <network path>`: Display the system dialog that allows you to map a network share to a drive letter.
- `COPYARGS /K/R`: A command like Go FOLDERCONTENT=copy which generates a list of buttons, each of which copies or moves files to or from a different place.
- `CURDIR /O = rootmode`: Activates "current directory" mode for the Go command.
- `CURRENT /S`: Indicates the current source folder.
- `DESTPATH /S`: Indicates the current destination folder.
- `DISCONNECT /S`: Display the system dialog that allows you to disconnect (unmap) a network share.
- `DRIVEBUTTONS /O = fixed|network|cdrom|removable|ramdisk|mtp|iconlettersoff|iconletterson|labels|noletters|multifunc|multifunctabs|lettersbeforelabels|offline|online|hideempty`: (fixed) Display a list of all the drives currently on your system (acts as a dynamic button).
- `DUALPATH /K = <path to read>`: Specify a path to read into the destination file display of a dual-display Lister (the standard PATH argument reads into the source file di…
- `EJECT /S`: Trigger an eject of the media in the drive specified by the PATH argument.
- `EXISTINGLISTER /O = seltabsonly`: If the specified folder is already open in an existing lister (including inactive folder tabs in other windows) then the command will activ…
- `EXPANDBRANCH /O = case|clearselect|collapse|noparent|regexp|script|toggle|toggleall|top|wild`: (case) When Folder Expansion is turned on in Preferences, this command lets you programmatically expand folders in the current file display.
- `FDBBUTTONS /O = <button keywords>|noicons|nolabels|dropdowns`: This command acts as a dynamic button.
- `FINDTITLE /K = <title string>`: Finds all currently open Listers with titles that match the specified string, and brings them to the front.
- `FOLDERCONTENT /O = button|nomenusel|dblclickmenu|norecurse|noparselinks|resolvedirlinks|nocontext|nodirs|nofiles|showhidden|showempty|includestart|hideext|sortext|sortsize|sortdate|sortnone|sortreverse|copy|move|copytosource|copytodest|copytoleft|copytoright|useshell`: (button) Display the contents of the path specified by the PATH argument in drop-down menus (acts as a dynamic button).
- `FORMATPATH /S`: Reads the path that the current folder format was set for (if any).
- `FORWARD /S`: Navigate to the next folder in the history list.
- `FORWARDLIST /O = namesonly|noicons|keys|sort`: (namesonly) Display a list of all subsequent folders in the history list (acts as a dynamic button).
- `FROMSEL /S`: Indicates the first selected folder in the source file display.
- `FTP /S`: Displays the FTP Connect dialog, allowing you to make an ad-hoc connection to an FTP site.
- `FTPCMD /K/R = <command>`: Sends a raw command to the remote FTP server (when currently viewing an FTP directory).
- `FTPSITE /K = <site name>`: Connect to an FTP site listed in the FTP address book.
- `FTPSITEICONS /S`: In conjunction with the FTPSITELIST argument, displays icons for all sites in the list generated by the command.
- `FTPSITELIST /O = <site prefix>`: Displays a list of the sites in the FTP address book(acts as a dynamic button).
- `GROUPCOLLAPSE /K = <group name>`: When the file display is grouped, this command can be used to collapse a specified group.
- `GROUPEXPAND /K = <group name>`: Expand a specified file group.
- `HEADING /O = <heading text>`: When used with commands which generate a list of items (see dynamic buttons), the HEADING argument adds a small heading at the start of the…
- `HISTORYLIST /O = namesonly|noicons|keys|sort`: (namesonly) Display the contents of the history list (acts as a dynamic button).
- `HOMEDIR /O = update|reset`: (update) Reads the home directory (configured via the Home Folder Preferences page).
- `INITIALDIR /S`: Returns the file display to the very first folder that it read.
- `KEYARGS /K/M = <qualifier:arguments>`: … Provides an alternate way to modify the behaviour of the Go command depending on which qualifier keys are held down (instead of using the…
- `LASTACTIVELISTER /S`: Brings the most recently active Lister to the front.
- `LASTCRUMB /S`: If the file display has a breadcrumbs location field associated with it, and a ghost path is currently shown, this command will go to the l…
- `LAYOUT /K = <layout name>`: Opens the folder in a new Lister loaded from the specified layout.
- `NAME /K = <name>`: Specifies a name to save or load the folder tree expansion.
- `NEW /O = max|min|norm|source|dest|lockoff|tree|notree|dual|dualhoriz|dualvert|nodual|viewpane|noviewpane|findpanel|findsimple|findadvanced|syncpanel|dupepanel|noutilitypanel|metapane|nometapane`: (max) Opens a new Lister.
- `NEWTAB /O = deflister|dupe|findexisting|findinactive|nofindexisting|nofocus|tofront`: (deflister) Opens a new folder tab.
- `NEXTCRUMB /S`: If the file display has a breadcrumbs location field associated with it, and a ghost path is currently shown, this command will go to the n…
- `NOSCRIPT /S`: Allows a script to run Go commands without triggering other scripts (or itself).
- `OPENCONTAINER /O = target|noselect`: (target) Opens the container (parent folder) of the selected item.
- `OPENINDEST /S`: The specified folder will be read into the destination file display.
- `OPENINDUAL /O = horiz|vert`: (horiz) The specified folder will be read into the destination file display in a dual-display Lister.
- `OPENINLEFT /S`: Reads the specified folder into the left-hand (or top) file display in a dual-display Lister.
- `OPENINRIGHT /O = horiz|vert`: (horiz) Reads the specified folder into the right-hand (or bottom) file display in a dual-display Lister.
- `PATH (default arg)`: Specify the path to read (or in conjunction with the FOLDERCONTENT argument, the path to display the contents of).
- `PATHENTRY /O = dest|left|right`: (dest) Displays the find-as-you-type field in a special mode ("go" mode) that lets you navigate to another folder in the current file display.
- `REBUILDTREE /O = dest|left|right|both`: (dest) Rebuilds the contents of the folder tree attached to the source file display.
- `REFRESH /O = tree|both|all|source|dest|viewpane|left|right|expanded|noexpanded|filterclear|filterkeep|state`: (tree) Refresh the display of the current folder in the source file display.
- `REFRESHTHUMBS /O = shift|alt|ctrl`: (shift) Refreshes thumbnails displayed in the current folder.
- `REMEMBERTREEEXPANSION /O = dest|left|right|both`: (dest) Remembers the current expansion state of the source folder tree.
- `RESTORETREEEXPANSION /O = dest|left|right|both|reset`: (dest) Restores the expansion state of the source folder tree that was previously remembered with REMEMBERTREEEXPANSION.
- `ROOT /O = collapse`: Navigate to the root of the current folder.
- `RUNEMBEDDEDIFNOTFOUND /S`: This argument is used when embedding a function in the Go FINDTITLE command.
- `SETFOCUS /S`: If the Go command reads a folder into the non-active side, this argument makes that side active (gives it the focus).
- `SWAP /S`: Swaps the folders displayed in the source and destination file displays.
- `SWITCHPATH /K/M`: <alternate path> … Switches between (or cycles through) two or more paths.
- `TABCLOSE /O = left|right|dest|force`: (left) Close the current folder tab in the source file display.
- `TABCLOSEALL /O = left|right|dest|force|expand|no`: (left) Close all folder tabs except the current one.
- `TABCOLOR /K = <color>|reset|edit`: Assigns a custom color to the current tab.
- `TABDUPLICATE /O = active|dual|full|nocolor|nolock`: (active) Duplicates the current folder tab.
- `TABGROUPDESC /K = <description>`: When saving a tab group programmatically using Go TABGROUPSAVE, this lets you assign a description to the tab group at the same time.
- `TABFINDEXISTING /S`: If the specified folder is open in another tab Opus will switch to that tab, otherwise the folder will be read into the current tab.
- `TABGROUPFORCE /S`: Use in conjunction with the TABGROUPLOAD or TABGROUPLIST arguments to force folders in the loaded tabs to load immediately even if they wou…
- `TABGROUPLIST /O = keys|icons|nohighlight|savecurrent`: (keys) Displays a list of your saved Folder Tab Groups (acts as a dynamic button).
- `TABGROUPLOAD /K = <group name>`: Loads the named folder tab group.
- `TABGROUPSAVE /O = <group name>`: Save the current set of folder tabs as a new tab group.
- `TABLINK /K = on|off|toggle|navlock|reset|unlinkall|,|menu`: (on) In a dual-display Lister, links the current active tab in the source file display with the current active tab in the destination file displ…
- `TABLIST /O = keys|sort|sortpath|icons|namesonly|lockicons`: (keys) Displays a list of the currently open folder tabs (acts as a dynamic button).
- `TABLOCK /K = lock|lockchanges|lockreuse|off|toggle|all|left|right|target|menu`: (lock) Lock the current folder tab to prevent any folder changes.
- `TABLOCKDIR /S`: Indicates the original (locked) directory of the current folder tab.
- `TABMOVE /O = split|splitlister|<new position>|active`: (split) Move the current folder tab to the other file display.
- `TABNAME /O = <tab name>`: Clears the name of the current tab if one has been assigned.
- `TABPOS /K = first|last|+1|-1|<index>`: (first) When used with the NEWTAB argument, causes the newly created tab to appear as the first on the tab bar.
- `TABSCROLL /O = <delta>`: If there are more tabs open than will fit in the display, this command displays the tab overflow menu (useful if you want to bind this to a…
- `TABSELECT /K = first|last|prev|+1|-1|home|noload|<index>`: (first) Select (make active) the first folder tab in the current file display.
- `TABSWAP /O`: Swaps the active tab in the left file display with the active tab in the right file display.
- `TABSWITCHER /S`: Displays the "tab switcher", a popup list of tabs open in the current Lister.
- `TABUNDOCLOSE /S`: Undoes the last action that resulted in one or more tabs being closed.
- `TITLE /K = <custom title>`: Specifies a custom title when opening a new Lister using the NEW argument.
- `TOFRONT /S`: Makes the Lister the active window and brings it to the front.
- `TREECOLLAPSE /O = dest|left|right|both|focus|all|first|second|full`: (dest) Collapses the selected branch in the tree belonging to the source file display.
- `TREEEXPAND /O = dest|left|right|both|focus|all|first|second`: (dest) When used in conjunction with reading a folder, this command automatically expands the folder tree to display the contents of the new folde…
- `TREESETPINSTATE /O = on|off`: (on) Toggles the "pin" state of the currently selected folder in the folder tree.
- `UNDOCLOSELISTER /O = closeexisting`: Reopens the last Lister that was closed (so if, for example, you accidentally close the Lister you're working with, this command would brin…
- `UP /S`: Navigate up to the parent of the current folder.
- `USEQUALKEYS /S`: Activates pre-configured behaviour for the main qualifier keys - Control will open the folder in the dual- display, Shift in a new Lister a…
- `USER /K = <user name>`: Can be used when certain folder aliases are supplied for the PATH argument.
- `VIEW /K = largeicons|smallicons|list|details|power|thumbnails|tiles`: (largeicons) Changes the view mode of the new folder to Large Icons mode.
- `WHENDUAL /K = checkmouse|anydevice|deffocus`: (checkmouse) This works in conjunction with the BACK, FORWARD and UP arguments and is designed to be used with "app command" hotkeys like the Back butto…

## Help
The Help internal command can be used to: - Display the program help file - Display information about the program (the About dialog) - Check for program updates - Access the licence manager to install your program certi…
- `ABOUT /S`: Displays the About dialog, showing information about the current version of the program, copyright and contact details for technical suppor…
- `CHECKUPDATE /O = quiet`: Checks online for program updates.
- `CRASHLOGS /S`: Displays the Crash Logs dialog, which shows any crash logs that have been automatically generated and lets you submit them to GPSoftware fo…
- `LANG /K = <language name>`: Displays a help file in the specified language, if one exists.
- `LICENCEMANAGER /S`: Displays the licence manager, where you can view and manage your current program licence, or apply for a free evaluation licence.
- `NEWEMAIL /S`: Sends a quick email message.
- `REF /K = commands|scripting`: (commands) Provides a shortcut to displays certain reference sections of the help file.
- `RELEASENOTES /S`: Displays the release notes for the current version.
- `TASKMANAGER /S`: Displays the Task Manager, a window which displays a list of various types of running Opus tasks.
- `THEMETESTER /S`: Opens a UI which can be useful for testing how various standard Windows controls look with colors from custom themes.

## Image
The Image internal command can be used to: - Change the format of images - Resize and rotate images - Upload or synchronize images with an online service - Locate an image using its embedded GPS information The Image CO…
- `ADDSUFFIX /O = <suffix>`: Add a suffix to the output filename when resizing images.
- `AS /K = <output filename>`: Specify the output filename when converting images.
- `BACKGROUND /O = none`: When an image with an alpha channel (transparency) is converted to a format that doesn't support the alpha channel, this argument is used t…
- `CONVERT /O = jpg|png|gif|bmp`: (jpg) Displays the image conversion dialog in interactive mode when no other arguments are provided.
- `CROP /K = <arguments>|no`: Crops selected images.
- `FLIP /K = h|v|no`: (h) Flip (mirror) the image horizontally.
- `FROM /M = quotes.`: <filename> … Specify the image file or files to operate on.
- `HEIGHT /K/N = <height>`: Resize the image to the specified height.
- `HERE /S`: Write converted images to the source folder.
- `LOCATE /K = <keyword>|bing|google|googleearth|kml|osm|windowsmaps|menu|nohide`: Locates the real-world position of the selected image file from its embedded GPS information, using a third-party mapping service.
- `LOSSLESS /K = auto|only|no`: (auto) Enables automatic lossless rotation when rotating a JPEG file.
- `NOADDSUFFIX /S`: Specify NOADDSUFFIX in conjunction with a preset to override the saved setting.
- `NOAUTORUN /S`: Even if the other arguments on the command line would allow for automated image conversion, if NOAUTORUN is specified the conversion dialog…
- `NOENLARGE /O = no`: Prevents images from being enlarged if the resize operation would otherwise cause this.
- `NOREDUCE /O = no`: Prevents images from being reduced in size if the resize operation would otherwise cause this.
- `NORENAME /S`: Specify NORENAME in conjunction with a preset to override the saved setting.
- `NOUSEIMAGEDATA /S`: When used with the CONVERT argument (in the standalone image viewer), overrides the @useimagedata command modifier and makes the image conv…
- `PERCENT /K/N = <resize percent>`: Resize the image to the specified percentage of the original size.
- `PRESERVEASPECTRATIO /O = no`: Preserve the original aspect ratio when resizing images.
- `PRESERVEDATE /S`: When converting images, this option preserves the creation and last modified timestamps of the original file.
- `PRESET /K = <name>`: Invokes a saved preset on selected images.
- `QUALITY /K/N = <quality>`: Specify the quality (1 - 100) when an image is saved in JPEG format.
- `REPLACE /O = always|no|readonly`: (always) Automatically replaces existing files in the destination folder.
- `ROTATE /K = <angle>`: Rotate the image the specified angle (in degrees).
- `TO /K = <destination path>`: Specifies the destination path for converted images.
- `TODEST /S`: Forces the output to go to the current destination folder.
- `WIDTH /K/N`: Resize the image to the specified width.

## Join
The Join internal command can be used to join multiple files together into a single larger file.
- `CONVERT /K = uudecode|base64|text`: (uudecode) Specifies that joined files should be uudecoded.
- `FROM /M`: <filename> … Specify the files that will be joined.
- `HERE /S`: Writes the joined file to the source folder instead of the destination.
- `TO /K = <output file>`: Specifies the name of the joined file.

## Marker
The Marker internal command is used to display toolbar buttons and menu items that are added dynamically by third-party namespace extensions (it acts as a dynamic button).
- `HEADING /O = <heading>`: When used with commands which generate a list of items (see dynamic buttons), the HEADING argument adds a small heading at the start of the…
- `ID /K/N = <id>`: Send a namespace-specific command direct to the namespace folder currently displayed in the active Lister.
- `MENU /K = <name>`: Marks the spot where namespace-specific menu items will be displayed.
- `TOOLBAR /S`: Marks the spot where namespace-specific toolbar buttons are displayed.

## Play
The internal Play command is used to play selected sound files.
- `FILE /M`: <filename> … Plays the specified sound file or files.
- `QUIET /S`: Plays the specified (or selected) sounds without displaying the Play dialog.
- `STOPALL /S`: Stops any sounds that are currently playing in the background (due to the Play QUIET command).

## Prefs
The Prefs internal command can be used to: - Display the Preferences dialog which lets you change most configuration options - Display the Customize dialog to edit toolbars, menus and hotkeys - Display the File Types di…
- `ADDFTPSITE /S`: Adds the currently connected FTP site as a new entry in the FTP Address Book.
- `BACKUP /O = images|sounds|data|localstate|all|notabs`: (images) Automates the configuration backup process.
- `BACKUPRESTORE /S`: Initiates the Backup and Restore Configuration wizard, which lets you backup and restore your configuration, as well as export Opus to a US…
- `COLLAPSEALL /S`: Collapses all categories in the Preferences dialog.
- `CUSTOMIZE /O = <page>`: Displays the Customize dialog.
- `DESC /K = <description>`: Assign a description to a configuration backup (used with the BACKUP or BACKUPRESTORE argument).
- `FILETYPES /S`: Displays the File Types dialog.
- `FROM /K = <backup file>`: Specifies the configuration backup file to restore (used with the RESTORE argument to automate the configuration restore process).
- `FTPSITES /O = <site name>`: Displays the FTP Address Book.
- `HEADING /O = <heading text>`: When used with commands which generate a list of items (see dynamic buttons), the HEADING argument adds a small heading at the start of the…
- `KEYS /S`: Displays the Keys page of the Customize dialog (equivalent to Prefs CUSTOMIZE=keys).
- `LAYOUT /K = <layout name>`: Loads the named Lister layout.
- `LAYOUTCLOSELISTERS /K = yes|no|current|all`: (yes) When loading a layout with the LAYOUT argument, this overrides the Close all existing Listers when loading this layout flag set for the lay…
- `LAYOUTEDIT /S`: Opens the Preferences dialog and displays the Layouts and Styles / Layouts page (equivalent to Prefs PAGE=layouts).
- `LAYOUTIGNOREFORMATS /K = yes|no`: (yes) When loading a layout with the LAYOUT argument, this overrides the Ignore folder formats saved within this layout flag set for the layout,…
- `LAYOUTIGNORETOOLBARS /K = yes|no`: (yes) When loading a layout with the LAYOUT argument, this overrides the Ignore toolbars saved within this layout flag set for the layout, and fo…
- `LAYOUTLIST /S`: Displays a list of your saved Lister layouts (acts as a dynamic button).
- `LAYOUTMOUSERELATIVE /K = yes|no`: (yes) When loading a layout with the LAYOUT argument, this overrides the Open layout relative to the monitor the mouse is currently on flag set f…
- `LAYOUTNAME /K = <layout name>`: Specifies a name when saving a layout using the LAYOUTSAVE argument.
- `LAYOUTNOVIRTDESKTOP /K = yes|no`: (yes) When loading a layout, prevents Listers being restored to their original virtual desktops (overrides the setting in the Layout).
- `LAYOUTSAVE /O = single|noupdatesettings|updatecurrent`: (single) Saves the currently open Listers as a layout.
- `LAYOUTTHISLISTER /O = nopanels|size|pos|paths|noclose`: (nopanels) In conjunction with the LAYOUT argument, this applies the settings from the specified layout to the current Lister instead of opening a new…
- `LIMITPATH /K/M = <paths>|reset`: When opening a new Layout with the LAYOUT argument, this lets you restrict the newly opened Listers to one or more paths (and their descend…
- `MENUMARKERS /S`: When used with LAYOUTLIST, if the generated list of layouts includes any submenus, the top-level buttons will display a glyph indicating a…
- `MINIMIZE /S`: When used with CUSTOMIZE, opens the Customize dialog minimized.
- `NOSCRIPT /S`: Allows a script to run the Prefs LAYOUT command without triggering other scripts (or itself).
- `PAGE /K = <prefs page>`: Opens the Preferences dialog to the specified page.
- `PASSWORD /K = <password>`: Encrypt a configuration backup (used with the BACKUP or BACKUPRESTORE argument).
- `POS /K = <x,y>|lister|mouse`: Opens the Preferences, Customize or Scripts dialog at the specified coordinates, rather than at the coordinates the dialog had when it was…
- `QUIET /S`: Prevents the Backup and Restore Configuration wizard from appearing when the backup or restore are automated (when used with the BACKUP and…
- `RESTORE /O = images|sounds|data|localstate|replace|all`: (images) Automates the configuration restore process.
- `SCRIPTDISABLE /O = <script name>|enable|disable|toggle`: If no script name is given, the command toggles the global option to disable all script add-ins.
- `SCRIPTEDIT /K = <script name>`: Launches the Script Editor for the specified script.
- `SCRIPTINSTALL /O = <file path>`: Launches the Script Installer to install the currently selected script file.
- `SCRIPTS /O = <script name>`: Displays the Script Management dialog - the centralised hub for creating, editing, managing and sharing script add-ins.
- `SETLISTERDEFAULTS /O = force|quiet|nodeflister|toolbars|formats`: (force) Lets you select a Lister to save as the Default Lister, or to set other default parameters.
- `SHOWICONS /S`: Displays icons for dynamic lists generated by the LAYOUTLIST, STYLELIST and VFSPLUGINLIST arguments.
- `STYLE /K = <style name>`: Applies the specified style to the current Lister.
- `STYLEEDIT /S`: Displays the Layouts and Styles / Styles page in Preferences (equivalent to Prefs PAGE=styles).
- `STYLELIST /O = showprevious`: Displays a list of your saved Lister styles (acts as a dynamic button).
- `STYLESAVE /O = <style name>`: Saves the current appearance of the active Lister as a style.
- `THEMEIMPORT /K = <filename>`: Imports the specified theme by copying it to the configuration folder.
- `THEMELOAD /O = or|all|blending|colors|fonts|images|wincolors`: (or) All aspects of the theme specified by THEMENAME will be loaded.
- `THEMENAME /K = <theme file>`: Specifies the filename of the theme to load, when combined with the THEMELOAD argument.
- `TO /K = <backup file>`: Specifies the filename for the configuration backup (used with the BACKUP or BACKUPRESTORE argument).
- `TOOLBARS /S`: Displays the Toolbars tab in the Customize dialog (equivalent to Prefs CUSTOMIZE=toolbars).
- `VFSPLUGINABOUT /K = <plugin name>`: Displays the About dialog for the specified VFS plugin.
- `VFSPLUGINCONFIG /K = <plugin name>`: Displays the Configuration dialog for the specified VFS plugin.
- `VFSPLUGINDISABLE /K = <plugin name>|enable|disable|toggle`: Enable or disable the specified VFS plugin.
- `VFSPLUGINLIST /S`: Displays a list of the installed VFS plugins (acts as a dynamic button).
- `VFSPLUGINMANAGER /S`: Displays the Zip & Other Archives / Archive and VFS Plugins page in Preferences (equivalent to Prefs PAGE=vfsplugins).

## Print
The Print internal command can be used to: - Print photos and other images using the Windows Photo Printing wizard - Print supported image files directly - Print other files via their registered handlers - Generate a fo…
- `AS /K = txt|csv|tab`: (txt) Use plain text format when printing a folder to disk or the clipboard.
- `AUTOSIZECOLUMNS /K = yes|no`: (yes) When printing a folder listing to a printer, or as a plain-text file, column widths will be auto-calculated to fit their contents.
- `CALCSIZES /K = yes|no`: (yes) Calculate folder sizes when printing a folder.
- `DEFAULTLIST /S`: Displays a generated list of installed printers (acts as a dynamic button).
- `ENCODING /K = ansi|utf8|utf8nobom`: (ansi) When printing a folder listing to a file, specifies that ANSI encoding should be used.
- `FILTER /K = <filter>`: Use a filter when printing the contents of sub-folders (via the FLATVIEW argument).
- `FILTERDEF /K/R = <filter>`: Lets you define a filter in text format to filter the contents of sub-folders when printing folder contents.
- `FLATVIEW /K = no|mixed|nofolders|grouped`: (no) Do not print the contents of sub-folders when printing a folder listing.
- `FOLDER /O = selected|<path>`: (selected) Displays the Print Folder dialog, which lets you print or export the contents of the current folder displayed in the Lister.
- `FONT /K`: <name>,<size> Specify the font to use when printing to the printer.
- `FORMAT /K = <format name>`: Use the specified favorite folder format to control the columns, sort order, and similar details of the printed information.
- `HEADER /K = top|bottom|both|none`: (top) Print a header at the top of each page (or when printing to disk or the clipboard, at the top of the listing).
- `HEADING /O = <heading text>`: When used with commands which generate a list of items (see dynamic buttons), the HEADING argument adds a small heading at the start of the…
- `KEYWORDS /S`: When printing a folder listing, the headings for each column will show keywords (sometimes called "raw names") instead of display names.
- `NOWIZARD /S`: Bypass the Windows Photo Printing Wizard for image files; Opus can natively print any image format that it is able to view.
- `QUIET /S`: Print the folder using the specified options without displaying the Print Folder dialog first.
- `SETDEFAULT /K = <printer name>`: Set the named printer as the system default printer.
- `TO /K = <printer name>|<file name>|clip`: Print selected files or folders to the specified printer (overriding the default printer).
- `WHENEXISTS /K = replace|append|abort`: (replace) Specifies that if the file the folder contents are being printed to already exists, it should be replaced.

## Properties
The Properties internal command can be used to: - Display the system Properties dialog for files and folders - Display the Folder Options dialog for the current folder - Display the FTP Site Properties dialog for the cu…
- `ADDLABEL /O = shift`: In conjunction with the SETLABEL argument, this lets you add one or more labels without clearing any existing ones.
- `FILE (default arg) = <filename>`: Specifies the filename rather than using selected files.
- `FOLDERFORMAT /S`: Display the Folder Format dialog for the current folder.
- `FTPSITE /S`: Display the FTP Site Properties dialog for the currently connected FTP site.
- `HEADING /O = <heading text>`: When used with commands which generate a list of items (see dynamic buttons), the HEADING argument adds a small heading at the start of the…
- `LABELCATEGORY /K = <category>`: When used on a command that generates a list of labels (e.g.
- `LISTER /S`: Displays the system Properties dialog for the folder currently displayed in the source file display.
- `NOFROMFOCUS /S`: The default behaviour for the Properties command is to operate on either the source file display, or the Folder Tree, depending on which on…
- `POSITION /K = <x,y>|rel|center`: Specify the position for the Properties dialog in screen coordinates.
- `SETLABEL /O`: Displays a generated list of your configured labels (acts as a dynamic button).
- `SETLABELINFS /K = yes|no`: (yes) Specify in conjunction with the SETLABEL argument to override the state of the Enable label storage in the filesystem option on the Labels…
- `SETLABELREMOVE /O = shift`: Specify in conjunction with the SETLABEL argument to remove labels.
- `SETLABELTOGGLE /O = shift`: Specify in conjunction with the SETLABEL argument to toggle labels.
- `SETWALLPAPER /O = center|tile|stretch|fit|fill|span|menu`: (center) Sets the selected image file as the system wallpaper.
- `SINGLE /S`: Modifies the behaviour of the Properties command when more than one file or folder is selected.

## Recent
The Recent internal command can be used to: - Display a dynamic list of your Recent folders - Filter the recent to display only folders beneath a certain path - Clear the Recent list (no argument) - - Displays a dynamic…
- `CLEAR /S`: Clears the recent folders list.
- `COPY /O = quotes.`: <Copy command arguments> Selecting a folder from the recent list will trigger the Copy command with the specified arguments.
- `HEADING /O = <heading text>`: When used with commands which generate a list of items (see dynamic buttons), the HEADING argument adds a small heading at the start of the…
- `KEYARGS /K/M = <qualifier:arguments>`: … When displaying the recent list, this argument lets you assign different behaviour to the items in the list if a qualifier key is held do…
- `MULTIFUNC /O = tabs`: The generated list of recent folders will be multiple function buttons (three-button buttons) - clicking them with the left mouse button wi…
- `NAMESONLY /S`: Each item in the list will only display its respective folder's name, not the full path.
- `NEW /S`: Recent folders selected from the list generated by this command will open in a new Lister instead of the current one.
- `NEWTAB /O = deflister|findexisting|findinactive|nofocus|tofront`: (deflister) Recent folders selected from the list generated by this command will open in a new tab.
- `NOLABEL /S`: The recent list displayed by this command will not show any labels for the folders.
- `OPENINDEST /S`: Recent folders selected from the list will open in the destination file display or Lister.
- `OPENINDUAL /S`: Recent folders selected from the list will open in the other file display of a dual-display Lister.
- `OPENINLEFT /S`: Recent folders will open in the left-hand (or top) display of a dual-display Lister.
- `OPENINRIGHT /S`: Recent folders will open in the right-hand (or bottom) display of a dual-display Lister.
- `PATH (default arg) = <path>`: Filters the displayed recent list to only show folders matching or below the specified path.
- `SHOWICONS /S`: The recent list displayed by this command will display icons for the items within it.
- `USEQUALKEYS /S`: Activates pre-configured behaviour for the main qualifier keys - Control will open the recent folder in the dual-display, Shift in a new Li…

## Rename
The Rename internal command can be used to: - Trigger inline rename mode, letting you quickly edit the name of a file or folder - Display the Rename dialog, letting you perform wildcard and scripted renames on multiple…
- `ADVANCED /S`: Displays the Rename dialog in advanced mode.
- `APPLYNOMATCH /S`: Turns on the Apply actions even if pattern doesn't match option for the rename function.
- `AUTONUMBER /S`: Automatically adds an incrementing number to the end of new filenames if they clash with existing files.
- `BY /K/N = <increment>`: Specifies the increment when renaming files with automatic numbering (using the NUMBER option).
- `CASE /K = upper|lower|firstword|allwords|extupper|extlower|extignore`: (upper) Converts filenames to all-upper case.
- `FINDREP /O = ext`: Enable find-and-replace mode.
- `HEADING /O = <heading text>`: When used with commands which generate a list of items (see dynamic buttons), the HEADING argument adds a small heading at the start of the…
- `IGNOREEXT /S`: Turns on the Ignore extensions option for the rename function.
- `INLINE /O = all|name|endstem|ext|home|end|single`: (all) Activates inline renaming on the item in the source file display that currently has focus.
- `MACRO /K`: Lets you specify a rename macro operation string.
- `MATCHCASE /S`: Makes the rename operation case-sensitive.
- `NOFILEINFO /S`: Disable file information metadata insertion.
- `NOIGNOREEXT /S`: Turns off the Ignore Extension option in the Rename dialog when it first opens.
- `NOMATCHNOFAIL /S`: Files which do not match the rename pattern are not 'failed'.
- `NUMBER /O = <start>`: Automatically number files.
- `PATTERN /K = <pattern>`: Specifies a wildcard pattern that represents the old (original) filename.
- `PRESET /K = findrep|regexp|regexpfindrep|last|<preset>`: (findrep) Opens the Rename dialog in Find and Replace mode.
- `RECURSE /S`: The rename operation will operate recursively on all files inside selected sub-folders.
- `REGEXP /S`: Enables regular expression mode.
- `RENAMEMATCHING /S`: Keeps files with the same stem and different extensions together when renumbering.
- `SCRIPTARG /K/M = <option:value>`: Used to pass custom field values to a rename script.
- `SIMPLE /S`: Displays the Rename dialog in simple mode.
- `TO /O = <new name>`: Specifies the new name of the file to rename.
- `TYPE /K = files|dirs`: (files) Force the rename to only operate on files - any selected folders will be ignored.
- `WHENEXISTS /K = ask|delete|keep|rename|skip`: (ask) Controls what happens if the new filename already exists.

## Select
The Select internal command is used to: - Display the Select dialog (in either simple or advanced modes) - Select all, deselect all, and invert the current selection of all files and folders - Select or deselect files b…
- `ADVANCED /O = <filter name>`: Displays the Select dialog in advanced mode.
- `ALL /S`: Select all files and folders in the current source file display.
- `ALLDIRS /S`: Select all folders in the current source file display.
- `ALLFILES /S`: Select all files in the current source file display.
- `CASE /S`: Makes the wildcard selection case-sensitive.
- `DATE /K = <date>|oldest|newest|created|both|next`: Select files whose last modification timestamps match the specified date.
- `DESELECT /S`: Instead of selecting files, the command will deselect them.
- `DESELECTNOMATCH /S`: Files that don't match the pattern will be deselected (normally files that don't match are left alone).
- `DESELECTOTHERTYPE /S`: When used with the TYPE argument to restrict a selection to either files or folders (or with the ALLFILES and ALLDIRS arguments), DESELECTO…
- `DESTTOSOURCE /O = in|noext|notin`: (in) Selects all files and folders in the source file display that are currently selected in the destination.
- `DUPES /S`: Displays the Duplicates Selection dialog, which lets you select files after performing a duplicates search.
- `EXACT /S`: Indicates that the PATTERN argument is a literal file name and not a wildcard or regular expression.
- `FILTER /O = list`: Performs file selection using a pre-defined filter.
- `FILTERDEF /K/R = <filter>`: Lets you define a filter in text format to select matching files.
- `FILTERFLAGS /K = select|deselect|deselectnomatch|hide|hidenomatch|showhidden`: (select) This argument is used in conjunction with the FILTER argument.
- `FIRST /O = visible`: Select the first item in the source file display, deselect all other items.
- `FROMCHECKS /S`: Convert the state of checked items to selections (checked items will be selected, non-checked items will be deselected).
- `FROMSCRIPT /O = unhide`: This command should be used when running a Select command from a script (e.g.
- `GROUPNAME /O = <group name>`: When the file display is grouped, this lets you select files based on the group they are in.
- `HIDESEL /O = dirs|files`: (dirs) Hide all selected items (both files and folders).
- `HIDEUNAFFECTED /S`: When used with the synchronize tool, this hides any items from the list that are not marked to be synchronized (either copied or deleted).
- `HIDEUNSEL /O = dirs|files`: (dirs) Hide all unselected items (both files and folders).
- `IGNOREDIACRITICS /S`: Ignores diacritics when performing the wildcard selection.
- `IGNORECHECKBOXMODE /S`: The command will act as if the file display is not in checkbox mode, even if it is.
- `INVERT /S`: Inverts the selection state of all items in the source file display.
- `LAST /O = visible`: Selects the last item in the source file display, deselect all other items.
- `MAKEVISIBLE /O = immediate`: Ensures that the first selected item is visible in the file display.
- `NEXT /O = mark|nodeselect|row`: (mark) Selects the next item in the file display.
- `NOCOLUMN /S`: Lets you use the RANGE argument without having the Index column automatically added to the file display.
- `NONE /S`: Deselects all items in the source file display.
- `NOPATTERN /S`: The Select command normally requires a value for the PATTERN argument to operate, but in some cases you may need it to operate without supp…
- `NOTCOPYING /S`: Restricts the selection to files and folders not currently involved in a copy operation (either part of a running copy job or a queued job).
- `PATH (default arg) = <pattern>`: In a folder with FlatView enabled, or with expanded sub-folders, this lets a wildcard selection be restricted to entries in folders matchin…
- `PATTERN (default arg) = <pattern>`: Specify a wildcard pattern.
- `PREV /O = mark|nodeselect|row`: (mark) Select the previous item in the file display.
- `RANGE /K = <range>`: Selects a range of items based on their index (their position in the list).
- `REGEXP /S`: Use regular expression mode instead of standard pattern matching.
- `RESELECT /S`: Reselects all files and folders that were used (and deselected) by the previously executed command.
- `SETFOCUS /S`: Ensures that the first selected item is visible in the file display.
- `SHOWFOCUS /S`: If necessary, scrolls the file display to make the currently focused item visible.
- `SHOWHIDDEN /O = dirs|files`: (dirs) Reveal any files or folders that have previously been hidden by commands using the HIDESEL or HIDEUNSEL arguments.
- `SHOWUNAFFECTED /S`: When used with the synchronize tool, this reveals any items that have previously been hidden because they were not marked to be synchronize…
- `SIMILAR /S = trueext`: Selects all files with the same file extensions as the currently selected files.
- `SIMILARBASE /S`: Selects all files with the same base-names as the currently selected files.
- `SIMPLE /S`: Displays the Select dialog in simple mode.
- `SIZE /K = <size>|largest|smallest`: Select files whose size matches the specified size.
- `SOURCETODEST /O = in|noext|notin`: (in) Selects all files and folders in the destination file display that are currently selected in the source.
- `THIS /S`: Selects the current focus entry.
- `TOCHECKS /S`: Convert item selection states to check states.
- `TOGGLECHECKS /S`: Toggles the check state of all selected items (when in checkbox mode).
- `TYPE /K = files|dirs|focus`: (files) Force the selection to only affect files - even if folders match the pattern they will be unaffected.

## Set
The Set internal command can be used to: - Turn the various Lister elements (folder tree, metadata pane, viewer pane, dual display, etc) on or off in the current Lister - Add or remove information columns from the curre…
- `ADMIN /K = on|off|toggle|<timeout>`: (on) Turns Administrator mode in in the active Lister.
- `AUTOSIZE /K = on|off|toggle`: (on) Turns on the Auto-size all columns in Details and Power modes Folder Format option in the current file display.
- `AUTOSIZECOLUMNS /O = dest|left|right|both|focus|widest|col:column|override`: (dest) Automatically resizes all columns in the source file display (applies to details and power modes only).
- `BACKGROUNDIMAGE /K/M = all.`: <type>:<file> Sets the background image for one or more Lister elements to the specified filename.
- `BACKGROUNDIMAGEOPTS /K = <options>`: Specify one or more comma-separated options for the background image when changing it with the BACKGROUNDIMAGE argument.
- `BLURFILENAMES /K = on|off|toggle`: (on) Turns on blurring of filenames in the source Lister.
- `CALCFOLDERSIZES /K = all|local|fixed|off|selected|toggle|skipjunctions`: (all) Turns on the Preferences option to calculate folder sizes automatically (for all folders).
- `CHECKBOXMODE /K = on|off|toggle`: (on) Turns Checkbox mode on in the source file display.
- `CLEARFILTERS /S`: Clears all file and folder filters in the current source file display.
- `CLEARSYNC /S`: Once you've used the Find SYNC and Copy SYNC commands to automate the synchronize operation, you can use Set CLEARSYNC to exit synchronize…
- `COLUMNS /K = <format>`: <column>, … Changes which columns are displayed in the current source file display.
- `COLUMNSADD /K`: <column>, … Adds the specified columns to the current source file display.
- `COLUMNSFREEZE /K = <columns>|off`: Sets the number of frozen columns in the current source display.
- `COLUMNSREMOVE /O`: <column>, … Removes the specified columns from the current source display.
- `COLUMNSTOGGLE /K = any|columnlist|insert`: (any) <column>, … Toggles the specified columns on or off in the current source display.
- `CONFIRM /S`: Used to show a confirmation message specific to the command being run, often with a link to the Preferences setting for making the change p…
- `CONTENTFORMAT /K = <content group>`: Sets the current source file display to use the named content type folder format.
- `COPYFILTER /K = on|off|toggle`: (on) Turns on the recursive copy filter for the active Lister.
- `DARKMODE /K = on|off|toggle|togglesmart|reset|noreset`: (on) Forces dark mode on for Opus, regardless of current Windows setting.
- `DELFILTER /K = on|off|toggle`: (on) Turns on the recursive delete filter for the active Lister.
- `DELRECYCLEBIN /K = on|off|toggle`: (on) Turns on the Delete to Recycle Bin where possible option on the Deleting Files Preferences page.
- `DELRECYCLECONFIRM /K = on|off|toggle`: (on) Turns on the Skip confirmation when deleting to Recycle Bin option on the Deleting Files page in Preferences.
- `DEST /K = left|right|focus|toggle`: (left) Sets the left (or top) file display in a dual-display Lister to be the destination.
- `DISABLEGLOBALHOTKEYS /K = on|off|toggle`: (on) Temporarily disables all global hotkeys.
- `DUAL /K = on|off|toggle|horiz|vert|togglelayout|source|dest|right|left|remember`: (on) Turns on dual-display mode in the active Lister.
- `DUALSIZE /K = again.`: <size>[,<size>] Adjusts the splitter between the dual file displays in the active Lister.
- `ENABLELABELFILTER /K = <name>|on|off|toggle`: This command allows named wildcard labels and label filters to be turned on or off.
- `EVALUATORDISABLE /O = on|off|toggle`: (on) Disables the evaluator.
- `EXPANDABLEFOLDERS /O = on|off|toggle`: (on) Turns on expandable folders in the current Lister.
- `FAYTFINDOPTIONS /K = firstchar`: This command lets you toggle various options for the FAYT Find Mode from a command.
- `FDBTOOLBAR /O = <name>`: This command lets you change which toolbar is used for the File Display.
- `FILTERS /K = on|off|toggle`: (on) Turns both the copy and delete recursive filters for the active Lister.
- `FLATVIEW /K = on|off|toggle|toggleoff|grouped|mixed|mixednofolders|keepformat`: (on) Turns Flat View mode on in the source file display.
- `FOCUS /K = left|right|source|dest|tree|lefttree|righttree|toggle|pathfield|leftpathfield|rightpathfield|filedisplay|metapane|utilitypane|viewpane`: (left) Sets the input focus to the left-hand file display in a dual-display Lister.
- `FOLDERTREESIZE /K`: <size>[,<size>] [,left|right|dest] Adjusts the size of the folder tree pane in the active Lister.
- `FONTSCALE /K = <absolute factor>|<relative factor>|left|right|dest|both|details|thumbnails|all|quiet`: Sets the font scaling in the file display to the specified factor.
- `FORMAT /K = <format>`: Applies the named favorite folder format to the current source file display.
- `FORMATLIST /O = contenttype|favorites|icons|noreset`: (contenttype) Displays a generated list of your favorite and content type folder formats (acts as a dynamic button).
- `FORMATLOCK /K = on|off|toggle|left|right|source|dest|all`: (on) Turns the format lock on in the current Lister.
- `FORMATREMEMBER /S`: Stores (remembers) the current folder format in the source tab.
- `FORMATRESTORE /S`: Restores the previous remembered format.
- `FRIENDLYDATES /K = normal|today|off|toggles`: (normal) Turns on "friendly dates", where date columns display "Today" for today, "Yesterday" for yesterday, and weekday names ("Monday", etc.) for…
- `FTPMODE /K = ascii|binary|auto`: (ascii) Sets the file transfer mode for the current FTP connection to ASCII.
- `FULLROWSELECT /K = on|off|toggle|power|details|display|namecol`: (on) Turns full-row selection on.
- `GLOBALHIDEFILENAME /O = <pattern>`: Clears the Global hide filter filename filter (on the Filters page in Preferences).
- `GLOBALHIDEFILTER /K = on|off|toggle`: (on) Turns the Enable global wildcard filters option on (on the Filters page in Preferences).
- `GLOBALHIDEFOLDERS /O = <pattern>`: Clears the Global hide filter folder filter (on the Filters page in Preferences).
- `GLOBALHIDEHIDDEN /K = on|off|toggle`: (on) Turns the global Hide hidden files option on (on the Filters page in Preferences).
- `GRIDLINESH /K = on|off|toggle|reset|<style>`: (on) Turns horizontal grid lines on in the current file display (only visible in power or details view modes).
- `GRIDLINESV /K = on|off|toggle|reset|<style>`: (on) Turns vertical grid lines on in the current file display (only visible in power or details view modes).
- `GROUPBY /K = <column>|toggle|off|grouplist`: Groups the current file display by the specified column.
- `GROUPCOLLAPSE /K = on|off|toggle`: (on) Turns on the Collapsed option for grouping in the current file display.
- `GROUPCOMBINE /K = normal|never|other|cycle`: (normal) Sets the Grouping / Combine option to Combine similar values in the folder format for the current file display.
- `GROUPFOLDERSATTOP /K = on|off|toggle`: (on) Turns on the Keep folders at top when grouped option in the current file display.
- `GROUPREVERSE /K = on|off|toggle`: (on) Reverses the direction of grouping in the current file display.
- `GROUPSCHEME /O = <group>`: When used with the GROUPBY=grouplist argument, this displays submenus for any columns that have evaluator grouping schemes defined.
- `HEADING /O = <heading text>`: When used with commands which generate a list of items (see dynamic buttons), the HEADING argument adds a small heading at the start of the…
- `HIDE /S`: Hides any Set command toolbar button that would ordinarily be disabled because the function is not available.
- `HIDEEXT /K = on|off|toggle`: (on) Turns the Hide file extension in Filename column option on in the current file display.
- `HIDEFILTERATTR /O = <attributes>`: Clears the attributes hide filter in the source file display.
- `HIDEFILTERFILENAME /O = <pattern>`: Clears the filename hide filter in the source file display.
- `HIDEFILTERFOLDERATTR /O = <attributes>|off`: Clears the folder attributes hide filter in the source file display.
- `HIDEFILTERFOLDERS /O = <pattern>`: Clears the folders hide filter in the source file display.
- `HIDEFOLDERTABS /K = on|off|toggle`: (on) Temporarily hides the folder tab bar in the current Lister.
- `HIDESYSTEMFILES /K = on|off|toggle`: (on) Turns on the Hide protected operating system files option on the Filters page in Preferences.
- `ICONMODESORTHEADER /K = on|off|toggle`: (on) Turns on the display of the column header (for sorting) in the icon modes (large icon, thumbnail, etc).
- `ICONS /K = on|off|toggle|reset`: (on) Enables the display of icons in power and details view modes in the current file display.
- `IMAGEASPECTOVERLAYS /K = on|off|toggle`: (on) Turns on display of thumbnails-mode aspect ratio bars.
- `INFOTIPS /K = on|off|toggle|allmodes|details|icons|allfolders|network|local|fixed`: (on) Turns on file info tips.
- `INVERT /S`: Inverts the appearance of toolbar buttons that appear highlighted (or checked) when the Set option they control is currently on.
- `JOBSBAR /K = on|off|toggle`: (on) Displays the jobs bar in the current Lister.
- `KEEPFOLDERSALPHA /K = on|off|toggle`: (on) Turns the Keep folders sorted alphabetically option on in the source file display.
- `LAYOUT /K = remember|restore`: (remember) Remembers the current layout and appearance of the active Lister.
- `LISTERCMD /K = minimize|maximize|restore|togglemaximize|showall|minimizeall|tileh|tilev|cascade|undotilecascade|toggleminimizeall|tofront`: (minimize) Minimizes the currently active Lister window.
- `LISTERPOS /K`: <x>,<y> Sets the position of the active Lister to the specified x and y coordinates.
- `LISTERSIZE /K = auto`: <w>,<h> Sets the size of the currently active Lister to the specified width and height.
- `LISTERTITLE /O = <custom title>`: Resets the title of the current Lister back to its default.
- `MANUALSORT /K = on|off|toggle|<name>`: (on) Turn on manual sorting in the current file display.
- `MANUALSORTRESET /O = <name>`: Resets the current manual sort order for the folder in the source file display.
- `MANUALSORTSAVE /S`: Saves the current manual sort order in the current folder.
- `METAPANE /K = on|off|toggle|horiz|vert|togglelayout`: (on) Turns the metadata pane on in the currently active Lister.
- `METAPANESIZE /K`: <size>[,<size>] Adjusts the size of the metadata pane in the active Lister.
- `MINIMIZEPROGRESS /K = on|off|toggle`: (on) Turns on the Minimize progress indicators automatically option from the Progress Indicators page in Preferences.
- `NAVLOCK /K = on|off|toggle`: (on) Turns navigation lock on in the current Lister.
- `NOOP /O = success`: Guaranteed not to do anything.
- `NOSCRIPT /S`: Use the NOSCRIPT argument to prevent script events from firing in response to the Set command.
- `PAIREDFOLDERS /K = on|off|toggle`: (on) Enables the Paired Folders system for the current Lister.
- `PRESET /K = <preset name>`: When used in conjunction with the UTILITY argument, this lets you open the Find/Duplicates/ Synchronize panel and automatically load the sp…
- `PROGRESSCMD /K = minimize|restore|show|pause|resume|abort`: (minimize) Sends a "minimize" command to all current progress dialogs.
- `QUICKFILTER /O = <pattern>`: Displays the Filter Bar and gives keyboard focus to the pattern field on it.
- `QUICKFILTERCLEAR /S`: Clears the quick filter in the current source file display.
- `QUICKFILTERFLAGS /O = set|clear|showfiles|showdirs|hidefiles|hidedirs|disable|flatviewon|flatviewoff|regexpon|regexpoff|ignorediacriticson|ignorediacriticsoff|anywordon|anywordoff|partialon|partialoff|evalon|evaloff`: (set) Resets and clears the quick filter flags in the current source file display.
- `READONLY /K = on|off|toggle`: (on) Makes the current file display read-only.
- `RECYCLEBINEMPTY /S`: This has no effect as a command - its only use is with the @ifset and @icon command modifiers.
- `RELATIVEDATEGRAPHS /K = on|off|toggle`: (on) Turns on the Show graphs behind modified and created date and time columns option on the File Display Columns / Options page in Preferences.
- `RELATIVESIZEGRAPHS /K = on|off|toggle`: (on) Turns on the Show graphs behind size columns option on the File Display Columns / Options page in Preferences.
- `RELDIMENSIONOVERLAYS /K = on|off|toggle`: (on) Turns the display of thumbnails-mode relative dimension bars on.
- `SAVEFORMAT /O = folder|all|favorite|subfolders|replace|clear|quiet`: (folder) Displays the Save Folder Format dialog, which lets you save the folder format in the source file display.
- `SHOWEVERYTHING /K = on|off|toggle`: (on) Turns the Show Everything mode on in the source file display.
- `SHOWFILTERATTR /O = <attributes>`: Clears the attributes show filter in the source file display.
- `SHOWFILTERFILENAME /O = <pattern>`: Clears the filename show filter in the source file display.
- `SHOWFILTERFOLDERATTR /O = <attributes>|off`: Clears the folder attributes show filter in the source file display.
- `SHOWFILTERFOLDERS /O = <pattern>`: Clears the folders show filter in the source file display.
- `SHOWMILLIS /K = on|off|toggle`: (on) Turns on the display of milliseconds in file time columns.
- `SHOWSECONDS /K = on|off|toggle`: (on) Turns on the display of seconds in file time columns.
- `SIDE /K = left|right`: (left) When tested as a condition, returns true if the command is on a location bar toolbar attached to the left (or top) file display.
- `SORTBY /K = sortlist`: <column>, … Sorts the current file display by the specified column.
- `SORTNAMEEXTSEPARATELY /K = on|off|toggle`: (on) Turns the Sort name and extension separately option on in the source file display.
- `SORTNEWFILES /K = on|off|toggle|reset`: (on) Turns on the Sort newly created and copied files option in the source file display.
- `SORTNUMERIC /K = on|off|toggle`: (on) Turns the Numeric order filename sorting option on in the source file display.
- `SORTORDER /K = folders|files|mixed|cycle`: (folders) Changes the sort order in the source file display so that folders are listed before files.
- `SORTREVERSE /K = on|off|toggle|togglesmart|1.|2.|3.|1.|2.|3.`: (on) Reverses the sort order in the current file display.
- `SORTWORDS /K = on|off|toggle`: (on) Turns the Word sort option on in the source file display.
- `SOUNDS /K = on|off|toggle`: (on) Turns on the Enable Sound Events option on the Miscellaneous / Sounds page in Preferences.
- `SOURCE /K = left|right|focus|toggle`: (left) Sets the left (or top) file display in a dual-display Lister to be the source.
- `SPACING /K`: <item>:<value> Modifies the spacing of various user interface elements (those that can be changed by a user interface spacing scheme).
- `SPACINGSCHEME /O = <scheme name>`: Generates a list of configured user interface spacing schemes.
- `STATE /K = source|dest|lockoff`: (source) Sets the currently active Lister to be the source.
- `STATUSBAR /K = on|off|toggle`: (on) Turns the status bar on in the active Lister.
- `STATUSBARSTYLE /K = single|dual|independent|independentsame|bottom|nobottom|glass|noglass`: (single) Sets the status bar style to one single status bar even in a dual-display Lister.
- `TABPOSITION /K = above|below|left|right|together|apart|normal|reset|save`: (above) Set folder tabs in the current Lister to display above the file displays.
- `TABWIDTH /K = <size>|auto|source|dest|left|right|both|thinnest|widest`: Set the width of the folder tab bar, if it is displayed to the left or right of the file display.
- `THUMBNAILBORDERS /K = on|off|toggle|thumbnails|tiles|details|power|all`: (on) Turns the display of thumbnail borders on.
- `THUMBNAILLABELS /K = on|off|toggle`: (on) Turns the display of thumbnail labels on.
- `THUMBNAILRATINGS /K = on|off|toggle`: (on) Turns the thumbnail overlay of rating stars on or off.
- `THUMBSTRETCH /K = reset|<mode>`: (reset) Turns off any override of the thumbnail stretch mode which the current folder format is applying.
- `TITLEBARTOOLBARS /K = on|off|toggle`: (on) Turns on the Preferences option to move the top-row toolbars into the window title bar (i.e.
- `TREE /K = on|off|toggle|left|right|dual|source|dest`: (on) Turns the folder tree on in the active Lister.
- `TREELOCK /K = on|off|toggle`: (on) Turns the folder tree lock on for the active Lister (or when there are two trees, for the source file display).
- `TREESHOWPATHTOSEL /K = on|off|toggle`: (on) Turns the folder tree's Highlight path to selected folder option on.
- `UTILITY /K = find|findsimple|findadvanced|sync|dupe|undo|filelog|ftplog|scriptlog|email|on|off|toggle|focus|expand|noexpand|float`: (find) Displays the utility panel in Find Files mode.
- `VIEW /K = cycle`: <mode>[,<mode>] Changes the view mode in the current file display.
- `VIEWERTOOLBAR /O = <name>`: This command lets you change which toolbar is used for the Viewer Toolbar.
- `VIEWPANE /K = on|off|toggle|horiz|vert|togglelayout`: (on) Turns the viewer pane on in the currently active Lister.
- `VIEWPANELOCK /K = on|off|toggle`: (on) Turns on the viewer pane lock in the current Lister.
- `VIEWPANESHELLICONS /K = on|off|toggle`: (on) Enables shell icons in the viewer pane.
- `VIEWPANESHELLTHUMBS /K = on|off|toggle`: (on) Enables shell thumbnails in the viewer pane.
- `VIEWPANESIZE /K`: <size>[,<size>] Adjusts the size of the viewer pane in the active Lister.

## SetAttr
The SetAttr internal command can be used to: - Modify the attributes of files or folders - Compress (by setting the C attribute) or encrypt files (by setting the E attribute), and set the default compression/ encryption…
- `ATTR /K = <attributes>`: Sets the specified attributes for selected files and folders, and clears all others.
- `CHMOD /K = <attribute mask>`: Sets the specified attributes for files on a remote FTP site.
- `CLEARATTR /K = <attributes>`: Clears the specified attributes for selected files and folders.
- `COLLDATEADDED /K = <date/time>|now`: Sets the "date added" property for files and folders within file collections.
- `CREATED /K = <date/time>|now|modified|taken|digitized|parent|doccreated|docedited|docsaved`: Sets the creation timestamp for selected files and folders.
- `DEHYDRATE /S`: For cloud files on Windows 10 and above, this command "dehydrates" the file (removes local data and replaces it with a placeholder).
- `DESCRIPTION /O = <description>`: Displays the Set Description dialog, which lets you assign your own description string to selected files and folders.
- `FILE /M`: <filename>, … Specifies the name of the file or files to modify.
- `FILTER /K = <filter>`: Applies the specified filter to the contents of selected folders.
- `FILTERDEF /K/R = <filter>`: Lets you define a filter in text format to filter the contents of selected folders.
- `META /O/M`: Displays the Set Metadata dialog, which lets you modify the metadata for selected files and folders.
- `MODIFIED /K = <date/time>|now|created|taken|digitized|parent|doccreated|docedited|docsaved`: Sets the last modified timestamp for selected files and folders.
- `PIN /O = yes|no`: (yes) For cloud files on Windows 10 and above, this command toggles the "pinned" status of the file on and off.
- `RECURSE /O = no`: Changes made by this command will be recursively applied to files within selected folders.
- `SETATTR /K = <attributes>`: Sets the specified attributes for selected files and folders.
- `SETDESCRIPTION /O = <description>`: Clears the description for selected files and folders.
- `TOGGLEATTR /K = <attributes>`: Toggles (inverts) the state of the specified attributes.
- `ZIPCOMMENT /S`: Lets you edit the internal Zip comment when viewing the contents of a Zip archive.

## Show
The Show internal command can be used to: - Display selected image files in the standalone image viewer - Display a slideshow of the contents of the current folder - View and manipulate installed viewer plugins (third-p…
- `AUTOFILELIST /O = all`: Used to automatically populate the "next / previous" list in the viewer with other files visible in the folder tab which launched the comma…
- `FILE (default arg) = <file>`: Specifies the file or folder to show.
- `FULLSCREEN /S`: Opens the image viewer in full-screen mode.
- `HEADING /O = <heading text>`: When used with commands which generate a list of items (see dynamic buttons), the HEADING argument adds a small heading at the start of the…
- `LISTERLINK /O = close|toggle`: (close) The viewer which opens will be linked to the lister which ran the command.
- `LISTSIBLINGS /S`: When LISTSIBLINGS is used on its own, without AUTOFILELIST, it automatically populates the "next / previous" list in the viewer with other…
- `LOADALLTHUMBS /S`: Triggers the generation of thumbnail images for all files in the source folder, including those that are currently out-of-view.
- `PLUGIN /K = <plugin name>`: Forces the use of the specified plugin to display the files.
- `PLUGINABOUT /K = <plugin name>`: Displays the About dialog for the specified plugin.
- `PLUGINCONFIG /K = <plugin name>`: Displays the configuration dialog for the specified plugin (if it has one).
- `PLUGINDISABLE /O = enable|disable|toggle`: (enable) Toggles the enable state of the specified plugin.
- `PLUGINLIST /S`: Displays a dynamic list of your installed viewer plugins (acts as a dynamic button).
- `PLUGINMANAGER /S`: Displays the Viewer / Viewer Plugins page in Preferences, which lets you see and manage your installed viewer plugins.
- `POS /K`: <x>,<y> Overrides the default positioning of the standalone viewer, and opens its window at the specified coordinates.
- `SIZE /K`: <width>,<height> Overrides the default size of the standalone viewer.
- `SLIDESHOW /O = fade`: Initiates a slideshow of images.
- `THUMBNAILSIZE /K = <size>|<change>|left|right|source|dest|both|all|reset|list`: Sets the size of thumbnails in the active Lister to the specified size in pixels.
- `USEEXISTING /O = no|avoid|noavoid`: (no) Forces the re-use of an existing viewer window - a new window will never be opened if there is an existing viewer currently open.
- `VIEWERCMD /K = <command>|alpha|alwaysontop|backcol|channelall|channelalpha|channelblue|channelgreen|channelred|close|cmdbar|copy|copyto|crop|cut|delete|dragsel|first|flip|frame|fullscreen|gamma|<value>|reset|goto|help|hex|info|last|listerlink|mark|browse|clear|exchange|first|last|next|nohighlight|off|on|prev|return|toggle|view|markfirst|meta|<width>|grow|nofocus|off|on|toggle|minwidth|monitornext|monitorprev|moveto|next|nextrandom|nextlist|notfullscreen|onlyfullscreen|open|pluginabout|plugincfg|plugincmd|plugincmds|prev|prevlist|print|refresh|reselect|restore|rotate|<value>|reset|save|saveas|scroll|bottom|down|horiz|pagedown|pageup|top|up|vert|center|selaspect|selectall|selectfile|shortcutbar|slideshow|statusbar|toolbar|wallpaper|center|fill|fit|span|stretch|tile|zoom|+|-|<value>|fit|grow|tile|reset`: Only for use in the standalone viewer, this command forms the basis of the default viewer toolbar, context menu and hotkeys.
- `VIEWPANECMD /K = <command>|backcol|clear|frame|prev|next|open|rotateleft|rotateright|zoomfit|zoomgrow|zoomin|zoomout|zoomreset`: Sends commands to the Lister's viewer pane.

## Split
The Split internal command can be used to: - Split a file into two or more smaller parts - UUEncode the split files for transmission via email/usenet (no argument) - - Displays the Split File dialog, which lets you spli…
- `FROM /M`: <filename>, … Specify the file or files to be split.
- `HERE /S`: Split files will be written to the current source folder instead of the destination folder.
- `SIZE /K = <part size>`: Specify the size of the split parts.
- `TO /K = <destination>`: Split files will be written to the specified folder instead of the current destination file display.
- `UUENCODE /S`: Uuencodes the output files.

## Toolbar
The Toolbar internal command can be used to: - Open or close toolbars or toolbar sets - Open or close a floating toolbar, control its appearance and position on screen - Save a new set or modify the Default Toolbar Set…
- `APPBAR /K = left|top|right|bottom|off`: (left) When opening a floating toolbar, specify this argument to dock the toolbar with the left edge of the screen.
- `AUTOCLOSE /S`: Add this argument when opening a floating toolbar to make the toolbar close automatically after running a command.
- `CLICKTOEDIT /K = <milliseconds>|off`: Puts toolbars and menus into "click to edit" mode, where the next left-click on a button will open it for editing.
- `CLOSE /O = all`: Closes the toolbar specified with the NAME argument.
- `FLOAT /O = default|active|vertical|locked|autohide|roundededges|grid|frame|noframe|transparent|taskbar|glass|topopus|toplevel|hotkeys`: (default) Opens the toolbar as a floating toolbar.
- `HEADING /O = <heading text>`: When used with commands which generate a list of items (see dynamic buttons), the HEADING argument adds a small heading at the start of the…
- `IMPORT /S`: Imports the toolbar specified with the NAME argument into your Opus configuration.
- `LINE /K = <line>`: When opening a toolbar, specifies the toolbar line it is to appear on.
- `LIST /O = sets|add|replace|toggle|usekeys|nocontext`: (sets) Displays a generated list of all your toolbars (acts as a dynamic button).
- `LOADSET /O = add|replace|toggle|usekeys`: (add) Loads the set specified by the NAME argument.
- `LOCAL /O = no`: Opens a toolbar local to the current Lister.
- `NAME (default arg) = <toolbar name>|*this`: Specifies the name of the toolbar - used in conjunction with the other arguments to open or close the specified toolbar.
- `POS /K = mouse|mousel|mouser|mouset|mouseb`: (mouse) <x>,<y> Specifies the on-screen position when opening a floating toolbar.
- `RELOAD /S`: Reloads an open toolbar from disk.
- `RESETDEFAULTS /K = fdb|nolister|stateonly|quiet|viewer`: (fdb) Resets the toolbars to the factory defaults.
- `SAVESET /O = add|toggle|quiet`: (add) Saves the current toolbars as a toolbar set.
- `SETDEFAULT /O = quiet`: Saves the toolbars in the current Lister as the Default Toolbar Set.
- `STATE /K = top|bottom|fdbottom|left|right|center|viewpane|tree|float|floatactive|fdb`: (top) Opens the specified toolbar at the top of the Lister.
- `TOGGLE /S`: Toggles the toolbar specified with the NAME argument.
- `UPDATE /S`: Updates an existing floating toolbar with new appearance and position values.

## Undo
The Undo internal command can be used to: - Undo the last undoable file operation (undo delete to recycle bin, etc) - Undo any one of the previous operations via a menu - Display a list of undoable operations and undo a…
- `HEADING /O = <heading text>`: When used with commands which generate a list of items (see dynamic buttons), the HEADING argument adds a small heading at the start of the…
- `ITEM /K = <index>`: Undoes the specified action from the undo list.
- `LIST /O = nokeys|menu|redo|both`: (nokeys) Displays a list of undoable actions (acts as a dynamic button).
- `PAGE /S`: Displays the Undo Log page of the utility panel.
- `REDO /S`: If Sequential undo is enabled in Preferences, this command lets you redo an action you've just undone.
