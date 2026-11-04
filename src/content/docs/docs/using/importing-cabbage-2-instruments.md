---
title: "Importing Cabbage 2 Instruments"
description: "Use the Cabbage 3 importer to convert a Cabbage 2 instrument, understand its limitations and check the result."
sidebar:
  order: 4
---

The Cabbage 3 extension includes an importer that converts a Cabbage 2 instrument's widget section to Cabbage 3 JSON and updates some orchestra channel calls. It is a starting point for migration, not a complete or behavior-preserving port. Review the converted file and test the instrument before relying on it.

## Import an instrument

1. In VS Code, open the Command Palette (`Ctrl+Shift+P` on Windows/Linux or `Cmd+Shift+P` on macOS).
2. Run **Cabbage: Import Cabbage 2 Instrument**.
3. Select the old `.csd` or `.txt` instrument.

The importer writes a new file beside the source, normally named `instrument_Cabbage3.csd`. It never overwrites the source; if that name already exists, it adds a number to the new filename. The converted file opens in the editor. Warnings are also shown in the Cabbage output channel.

The importer expects an old-style, non-JSON `<Cabbage>` section. It does not convert an already-JSON Cabbage section. Cabbage 3 requires Csound 7, so this import does not replace checking or updating Csound 6 orchestra code for Csound 7 compatibility. See [Csound 7](/docs/using/csound7/).

## What gets converted

The importer converts many familiar widget types and identifiers to Cabbage 3's camelCase JSON properties. It also makes selected orchestra changes:

- Widget `chnget` calls may become `cabbageGetValue`; widget `chnset` calls may become `cabbageSetValue`.
- Some literal property updates on `identChannel` become `cabbageSet`.
- Simple `#define NAME ...` macros and `$NAME` references in the Cabbage section are expanded.
- Plant blocks are flattened into individual widgets, with child positions offset by the plant's position.

See the [widget reference](/docs/widgets/overview/) for Cabbage 3 widget properties and [Cabbage commands](/docs/using/commands/) for importer command details.

## Important limitations

### The interface may not look or behave the same

Some Cabbage 2 widget types have no direct stock Cabbage 3 equivalent. These are retained for manual review and produce warnings. Other types are approximated: for example, `vmeter` and `hmeter` are mapped to sliders, and `line` is mapped to an image. Check every widget's appearance, interaction, sizing, styling and value range in the converted instrument.

Many identifiers map to Cabbage 3 properties, but unsupported or deprecated identifiers may be dropped silently. An unmapped identifier produces a warning, but a dropped identifier does not. Compare the output against the original interface and consult the [widget reference](/docs/widgets/overview/) to restore any missing properties.

### Orchestra rewrites are selective

Only channel names recognized as widget channels are rewritten; internal Csound channels are left alone. `chnget` is converted only for i-rate and k-rate variables. a-rate and string-rate (`S`) reads remain as `chnget`.

The importer can convert only a limited set of literal `identChannel` property updates. Dynamic property strings, unsupported properties and dynamic channel names cannot be converted safely; the importer comments out these `chnset` calls and adds a warning. Search the converted orchestra for `Cabbage2→3 manual conversion needed` and implement those updates yourself. Cabbage 2 mouse-related reserved channels were removed; their old calls are left in place with warnings and need a Cabbage 3 alternative.

### Check channels and repeated widgets

Duplicate channel IDs are reported but not renamed automatically. Cabbage 3 requires channel IDs to be unique, so resolve these warnings before testing. If the instrument uses `widgetArray`, verify the generated channels and any orchestra references for every expanded widget.

### Plants and macros are simplified

Plant grouping is not retained: children are flattened into the main widget list. Verify their layout and any behavior that depended on grouping. Macro handling is intentionally simple; conditional preprocessing and other Csound preprocessing behavior are not evaluated by the importer.

## After importing

1. Read the importer warnings in the output channel and search the generated file for manual-conversion comments.
2. Open and compile the converted instrument in Cabbage 3. Fix any Csound 7 errors separately.
3. Compare the interface with the original, including controls, automation, channel updates and any widgets that were approximated.
4. Test presets/state and any referenced media or other external files. Confirm that file paths still resolve in your setup.
5. Test the instrument in the intended host before exporting or sharing it.

For general workflow, see [Working with Instruments](/docs/using/working-with-instruments/) and [Working with Media Files](/docs/using/media-files/).

## Appendix: conversion rules

These tables describe the importer's current behavior. They are a practical reference, not a guarantee that every generated property is supported by every widget; check the target widget's entry in the [widget reference](/docs/widgets/overview/).

### Widget type names

| Cabbage 2 type | Cabbage 3 output | Rule |
| --- | --- | --- |
| `rslider`, `hslider`, `vslider`, `nslider` | `rotarySlider`, `horizontalSlider`, `verticalSlider`, `numberSlider` | Renamed |
| `combobox`, `checkbox`, `groupbox`, `gentable` | `comboBox`, `checkBox`, `groupBox`, `genTable` | Renamed |
| `filebutton`, `infobutton`, `optionbutton`, `texteditor`, `listbox`, `csoundoutput`, `xypad` | `fileButton`, `infoButton`, `optionButton`, `textEditor`, `listBox`, `csoundOutput`, `xyPad` | Renamed |
| `hrange`, `vrange` | `horizontalRangeSlider`, `verticalRangeSlider` | Renamed |
| `vmeter`, `hmeter` | `verticalSlider`, `horizontalSlider` | Approximation; Cabbage 3 has no stock meter widget |
| `line` | `image` | Approximation; review its appearance |
| `soundfiler`, `signaldisplay`, `eventsequencer`, `fftdisplay`, `encoder`, `textbox`, `light`, `screw`, `cvoutput`, `cvinput`, `oscserver`, `popupmenu`, `sourcebutton`, `path`, `presetbutton`, `loadbutton`, `directorylist`, `keyboarddisplay`, `stepper` | Kept under the original type name | Manual-review warning; not mapped to a stock widget |
| `form`, `button`, `label`, `image`, `keyboard`, `table`, `tablex`, and other types without a rename above | Kept under the original type name | No type rename; unrecognized types may still need manual work |

### Common identifier mappings

| Cabbage 2 identifier | Cabbage 3 JSON output | Notes |
| --- | --- | --- |
| `bounds(x,y,w,h)` | `bounds: { left, top, width, height }` | Coordinates and dimensions are copied as numbers |
| `pos(x,y)`, `size(w,h)` | `bounds.left/top`, `bounds.width/height` | On `form`, `size` becomes `size: { width, height }` |
| `channel("name")` | `channels: [{ id: "name", event: "valueChanged" }]` | Multiple names create multiple channel entries |
| `identChannel("name")` | `channels[0].id` | If `channel()` is also present, its first channel name takes precedence |
| `range(...)`, `rangeX(...)`, `rangeY(...)` | `channels[].range` | `rangeY` targets the second channel; a missing increment is calculated |
| `value(n)`, `defaultValue(n)` | `channels[0].range.defaultValue` | `min`, `max`, `increment`, `skew` also map under the first channel's `range` |
| `channelType("string")` | `channels[0].type: "string"` | Other values become `"number"` |
| `caption("...")`, `pluginId("...")` | `caption`, top-level `pluginId` | `pluginId` is moved out of the form widget |
| `items("A","B")` | `items: ["A", "B"]` | `text("A","B")` also becomes `items` for combo boxes and list boxes |
| `text("Off","On")` | `label.text: { off: "Off", on: "On" }` | For button, infoButton, optionButton, and fileButton when two or more strings are supplied |
| `text("...")` | `label.text: "..."` | Other widget types use a label; button-family widgets with one string also use a string |
| `colour(...)`, `color(...)` | `style.thumb.backgroundColor` on sliders; otherwise `style.backgroundColor` | RGB(A) values and recognized colour names are converted to CSS colours |
| `colour:0(...)`, `colour:1(...)` | `style.off.backgroundColor`, `style.on.backgroundColor` | State-specific background colours |
| `textColour(...)`, `fontColour(...)` | Slider: `style.label.fontColor`, `style.valueText.fontColor`; other widgets: `style.fontColor` | These two identifiers have different slider meanings |
| `outlineColour(...)`, `outlineThickness(n)` | Slider: `style.thumb.borderColor/borderWidth`; other widgets: `style.borderColor/borderWidth` | Verify each target widget's supported style paths |
| `alpha(n)`, `corners(n)`, `shape("sharp"/"rounded")` | `style.opacity`, `style.borderRadius` | `shape` maps to radius `0` or `4`; other shape values are ignored |
| `trackerColour(...)`, `trackerBackgroundColour(...)`, `trackerThickness(n)` | `style.track.fillColor`, `style.track.backgroundColor`, `style.track.width` | Intended for slider-like widgets |
| `visible(n)`, `active(n)`, `automatable(n)`, `latched(n)` | `visible`, `active`, `automatable`, `latched` | Converted to booleans; `latched` is intended for buttons |
| `valuePrefix(...)`, `valuePostfix(...)`, `textBox(n)` / `valueTextBox(n)` | `valueText.prefix/postfix/visible` | Prefix/postfix are also written to top-level `valuePrefix`/`valuePostfix` |
| `file(...)`, `filmstrip(...)`, `mode(...)` | `file`, `filmStrip.file/frames.count`, `mode` | Filmstrip orientation and frame dimensions are not carried over |
| `plant(...) { ... }` | Container plus flattened widgets | Child bounds are offset by the container's position; grouping is lost |
| `widgetArray("name", N)` | N separate widgets | Value channel names get numeric suffixes; inspect generated IDs and orchestra references |

Some other recognized identifiers have widget-specific outputs: for example, `ampRange` writes `range.y` and possibly `tableNumber`; `populate` and `sort` write under `populate`; and keyboard colours are written under `color`. Any identifier not recognized or explicitly dropped is left out of the JSON with an “unmapped identifier” warning.

### Identifiers dropped without a warning

The importer silently ignores the following identifiers because they are treated as deprecated or unsupported. This is separate from the “unmapped identifier” warning, so compare the original instrument if any of these are present.

| Area | Dropped identifiers |
| --- | --- |
| GUI and layering | `guimode`, `guirefresh`, `autoupdate`, `opengl`, `movebehind`, `tofront`, `isparent`, `glshader`, `urlinfo` |
| Slider and marker details | `trackercentre`, `trackerstart`, `trackerend`, `trackerinsideradius`, `trackeroutsideradius`, `markerstart`, `markerend`, `markerthickness`, `gapmarkers`, `sliderbounds`, `midctrl`, `toggle`, `zoom`, `popuptext` |
| Keyboard details | `keyseparatorcolour`, `mouseoverkeycolour`, `mousedownkeyoutlinecolour`, `mouseoverkeyoutlinethickness`, `arrowcolour`, `keywidth`, `keywidthscale`, `blacknotelength`, `blacknotewidth`, `mouseoeverkeycolour` |
| Meter, table and display details | `overlaycolour`, `metercolour`, `samplerange`, `scrubberposition`, `showscrubber`, `displaytype`, `signalvariable`, `tablenumbers`, `tablecolours`, `tablecolour:0`, `tablecolour:1` |
| List and text editing | `highlighteditemcolour`, `highlightedtextcolour`, `protecteditems`, `numberofclicks`, `caretcolour`, `doubleclicktogglesedit`, `textboxcolour`, `textboxoutlinecolour` |
| Form, build and metadata | `titlebarcolour`, `titlebargradient`, `titlebarheight`, `bundle`, `import`, `opcodedir`, `opcode6dir64`, `sidechain`, `manufacturer`, `author`, `factoryfolder`, `userfolder`, `latency`, `macrostrings`, `macronames` |
| Styling | `style` |

Names are matched case-insensitively. The importer also corrects the common misspellings `oulinecolour` → `outlinecolour` and `vvisible` → `visible`. Note that the `line` **widget type** is approximated as `image`, while an identifier named `line(...)` is dropped.

### Orchestra channel calls

| Cabbage 2 call | Cabbage 3 output | Rule |
| --- | --- | --- |
| `kValue chnget "widgetChannel"` or `iValue chnget "widgetChannel"` | `kValue cabbageGetValue "widgetChannel"` or `iValue cabbageGetValue "widgetChannel"` | Only recognized widget channels and i-/k-rate reads are rewritten |
| `chnset value, "widgetChannel"` | `cabbageSetValue "widgetChannel", value` | Only recognized widget channels are rewritten |
| `chnset "visible(0)", "identChannel"` | `cabbageSet "widgetChannel", "visible", 0` | Only supported literal property strings are converted; the widget's value channel is used when present |
| Internal Csound channel calls | Remain `chnget` / `chnset` | Not considered widget channels |
| Dynamic or unsupported property updates | Commented out with a manual-conversion warning | Search for `Cabbage2→3 manual conversion needed` in the output |
| Removed mouse channels | Left in place with a warning | Replace with an appropriate Cabbage 3 widget event or other design |
