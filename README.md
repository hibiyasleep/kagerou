# kagerou

ACT-OverlayPlugin skin for FF14. pronounced as /ka-ge-row/ (not j-like g).

Modern, Material Design, easily configurable, cloud-hosted and always up-to-date.

## Warning

### **OverlayPlugin 0.3.3.11** Required!!!

If you are using older version, settings WILL NOT saved!

If there's 2 buttons: you are on legacy. Get [Latest](https://github.com/ngld/OverlayPlugin/releases/latest) here.
   There should be 3 buttons, named like this: `Copy`, `Open DevTools`, `Reload`. See screenshots below.

---

## Usage

### Quick setup

No download needed, please first read `Warning` above.
Use this as overlay URL:

> `https://hibiyasleep.github.io/kagerou/overlay`

![act-settings](https://veltall.github.io/kagerou/images/act-settings.png)

### Detailed

1. Open ACT.
2. Plugins > OverlayPlugin.dll > Add 'Mini Parse' with any name (e.g. Totoro).
3. Read warning below.
4. Go to the new tab (e.g. Totoro), and set url as above.

![detailed instructions](https://veltall.github.io/kagerou/images/totoro.png)


## Features / Screenshots

![Overlay Preview](https://d.hibiya.moe/obZ.png)

* RDPS/RHPS
* Solo Mode
* History lookup
* Merge/Unmerge Pet stats
* Blur/Unblur other user's name
* Configurable info table (column width, ordering, colors, etc.)
* (WIP) Display abbreviated name, instead of full long name
* Localization: Korean, English, or Add your language!

---

![Settings window - General](https://d.hibiya.moe/zLm.png)

* Fully configurable, no Notepad! (Settings require `OverlayPlugin 0.3.3.11` to **Save**)

---

![CSS Customizing; HotS logo spinning](https://d.hibiya.moe/rne.png)

* Custom CSS: Setting isn't enough? Expand as you want!  
Use the DevTools to find the CSS selectors that you wish to modify.

![how to use custom CSS and DevTools](https://veltall.github.io/kagerou/images/custom-css.png)

---

## Contribute

### If you are not developer

Since I only play on Korean server, I need your feedback and suggestion for
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
