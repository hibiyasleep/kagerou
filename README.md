# kagerou

ACT-OverlayPlugin skin for FF14. pronounced as /ka-ge-row/ (not j-like g).

Modern, Easily configurable, always up-to-date.


## Usage

No download, please first read `Warning` below.
Use this as overlay URL: `https://hibiyasleep.github.io/kagerou/overlay`.

1. Open ACT.
2. Plugins > OverlayPlugin.dll > Add 'Mini Parse' with any name.
3. Read warning below.
4. go to 'YOUR NAME HERE' tab, and set url as above.

## Warning

### EnmityOverlay may conflict with OverlayPlugin

that's no way, since I don't have many knowledge for plugins.

### **OverlayPlugin 0.3.3.11** Required!!!

if you are using older version, settings WILL NOT saved!

1. Open ACT.
2. Plugins > OverlayPlugin.dll > Click any tab, except 'General'
3. If there's 2 buttons: you are on legacy. Get [Latest](https://github.com/hibiyasleep/OverlayPlugin/releases/tag/0.3.3.11) here.
   There should be 3 buttons, named like this: "Copy", "Open DevTools", "Reload".

## Features / Screenshots

![Overlay Preview](https://d.hibiya.moe/obZ.png)

* RDPS/RHPS
* Solo Mode
* History lookup
* Merge/Unmerge Pet stats
* Blur/Unblur other user's name
* Configurable tabbed column set
* (WIP) Display initial of name, instead of full long name
* Localization: Korean, English, or Add your language!

![Settings window - General](https://d.hibiya.moe/zLm.png)

* Fully configurable, No Notepad!

![CSS Customizing; HotS logo spinning](https://d.hibiya.moe/rne.png)

* Custom CSS: Setting isn't enough? Expand as you want!

## Contribute

### If you are not developer

Since I only play on korean server, I need your feedback and suggestion for
Global server support.

Pending features:

* ?

### Else

* Pull Requests is welcome, but please keep this code clean as possible.
* 2 spaces.
* NO semicolon in Javascript, except `;(function`.
* 80 char per line. Inline SVG is an exception, keep them in one line.
* No raster images; exclude job icons, use SVG.
* Target is Chrome 45, when support of other platform is needed and code should
  follow that; then I'll use Babel.
* Locale file is in `share/lang`.

## License

GPLv3.
