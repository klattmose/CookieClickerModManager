# Cookie Clicker Mod Manager (CCMM)

*Current version : 1.4.0*

**CCMM** is a browser extension to manage the javascript add-ons a player may want to use with the game [Cookie Clicker][CookieClickerLink].

## How to use it

Add the extension to your browser. 

* [Firefox][FirefoxLink]
* [Chrome][ChromeLink]

Once the extension is added to your browser, a small icon of a cookie will appear in the URL bar when you are playing Cookie Clicker (Firefox). Clicking this icon will bring up the Mod Manager Main Menu. 

#### Main Menu

![Main menu][MainMenu]

In the Main Menu you can:
1. Toggle CCMM on and off
1. Open the Options Menu
1. Toggle individual mods on and off
1. Open the Add/Edit Mod Menu
1. Load mods that aren't already loaded
1. Reorder mods by dragging and dropping

### Options Menu

![Options menu][OptionsMenu]

Here you can 
1. Toggle Asynchronous mode, which may load faster, but also may load mods out of order
1. Toggle Cached mode, which may load faster, but also may not load the latest version of a mod
1. View CCMM's current configuration (in JSON format)
1. Any changes you make in the text box will not take effect until you click "Save changes"
1. Back up your configuration to a file for safekeeping
1. As a just-in-case, you can restore CCMM to its default settings (will not take effect until "Save changes" is clicked)

### Add/Edit Mod Menu

![Edit menu][EditMenu]

1. Paste the URL of the mod you want to add into the "URL" textbox (no such thing as intuitive design)
	* If transferring from a bookmarklet, the URL is only the part between the parentheses after "Game.LoadMod"
	*     javascript:(function() {Game.LoadMod('https://cookiemonsterteam.github.io/CookieMonster/dist/CookieMonster.js');}());
	* would become
	*     https://cookiemonsterteam.github.io/CookieMonster/dist/CookieMonster.js
1. When the URL is changed, CCMM tries to guess a name for the mod in the "Name" textbox. This can be overwritten
1. Any changes you make will not take effect until you click "Save changes"
1. Click "Cancel" to undo all changes and return to the Main Menu
1. "Delete" will, naturally, remove the currently selected mod

## Bugs and suggestions

Any bug or suggestion should be **opened as an issue** [in the repository][IssueLink] for easier tracking. This allows me to close issues once they're fixed.

## Version History

**09/08/2020 - 1.4.0**
* Now waits for the script of one mod to be loaded before starting the next one
* Also always reloads a mod, ignoring any cached version
* The changes can be undone in the Options menu

**06/20/2020 - 1.3.5**
* Fixed the drag-and-drop reordering mechanic

**02/04/2020 - 1.3.4**
* Now works on the other official website: https://cookieclicker.eu/cookieclicker/

**08/11/2019 - 1.3.3**
* Changed the default configuration

**06/07/2019 - 1.2.2**
* Can now right-click to paste things
* Options menu now gives a message when unsaved changes are present
* "Restore default config" button now only changes the content of the text-box. The user will still need to click the "Save changes" button before it will take effect

**06/02/2019 - 1.2**
* Some style changes
* Drag 'n' drop functionality for reordering mods

**05/30/2019 - 1.0**
* Changed a couple of icons
* Code altered for compatibility with Google chrome

**05/28/2019 - 0.83**
* Removed a script-injection vulnerability
* Changed a button's icon and text to be more intuitive

**05/26/2019 - 0.80**
* Initial release

## Special thanks

Anyone who gives a suggestion or bugfix, especially code that gets implemented into CCMM, will be listed here along with their contribution.

* klattmose
	* Writing this thing

[CookieClickerLink]: https://orteil.dashnet.org/cookieclicker
[FirefoxLink]: https://addons.mozilla.org/en-US/firefox/addon/cookie-clicker-mod-manager/
[ChromeLink]: https://chrome.google.com/webstore/detail/cookie-clicker-mod-manage/gehplcbdghdjeinldbgkjdffgkdcpned
[MainMenu]: https://i.imgur.com/UsP1mHg.png
[OptionsMenu]: https://i.imgur.com/QSBJOjF.png
[EditMenu]: https://i.imgur.com/3agOOti.png
[IssueLink]: https://github.com/klattmose/CookieClickerModManager/issues
