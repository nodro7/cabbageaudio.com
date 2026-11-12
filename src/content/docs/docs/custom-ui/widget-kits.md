---
title: "Widget Kits"
description: "Themed widget sets that override built-in widgets without changing the .csd"
---

A widget kit is a themed set of widget classes. Unlike a normal custom widget
category, a kit **may redeclare a built-in widget type**. That is how a kit can
restyle `button`, `rotarySlider`, etc. without changing the `.csd`: the file
still contains `"type": "rotarySlider"`, but the active kit decides which class
backs that type.

## Bundled kits

The extension ships with eight kits:

| Kit | Id | Style |
| --- | --- | --- |
| Punch Light | `punch-light` | Light saturator-style controls |
| Punch Dark | `punch-dark` | Dark saturator-style controls |
| Vintage Light | `vintage-light` | Skeuomorphic cream metal with amber accents |
| Vintage Dark | `vintage-dark` | Skeuomorphic dark metal with glowing amber accents |
| Illum Light | `illum-light` | Light luminous controls with ice-cyan accents |
| Illum Dark | `illum-dark` | Dark luminous controls with ice-cyan accents |
| June Light | `june-light` | Warm cream controls with Cabbage blue accents |
| June Dark | `june-dark` | Warm charcoal controls with Cabbage green accents |

## Selecting a kit

Run **Cabbage: Select Widget Kit** from the command palette, or set
`cabbage.widgetKit` to a kit id. Leave the setting empty to use the built-in
widgets.

Changing the kit does not restart `CabbageApp`. It updates the widget registry
and insert menu; reload the instrument to re-theme widgets that are already on
screen.

:::note
The active kit is a VS Code setting, so every instrument open in that window
uses the same kit. There is no per-instrument kit setting.
:::

## What a kit changes

- Widget types the kit provides use the kit's classes.
- Widget types the kit does not provide continue to use the built-in widgets,
  so you can mix a kit and native widgets in the same form.
- A kit can also provide kit-only widget types; these appear under the kit's
  name in the insert menu.
- The `.csd` keeps the canonical type names. Instruments remain portable, and
  switching kits only changes the classes behind the types the kit provides.

## Kit folder layout

Bundled kits live in `<extension>/src/cabbage/widgets/kits/<kitId>/`. User kits
live in `<customWidgetFolder>/cabbage/widgets/kits/<kitId>/`.

```text
CustomWidgetFolder/
  cabbage/
    widgets/
      kits/
        studio-dark/
          kit.json          # optional metadata
          button.js         # exports a Button class, props.type = "button"
          rotarySlider.js
          inputs/
            MyKnob.js       # kit-only widget
```

Each kit is an immediate subfolder of `kits/`. `kit.json` is optional and can
provide a display name, description and id:

```json
{
  "id": "studio-dark",
  "name": "Studio Dark",
  "description": "A darker take on the built-in widgets"
}
```

If `kit.json` is missing, the folder name is used as the kit id.

## Authoring a kit widget

A kit widget is an ordinary custom widget class (see
[Custom Widgets](/docs/custom-ui/custom-widgets/)) with two differences:

1. `props.type` is the **built-in type** being themed, for example `"button"`
   or `"rotarySlider"`. That is what makes it an override.
2. It lives under `kits/<kitId>/` rather than directly under `widgets/`.

Keep one widget class per `.js` file. Shared helper files are fine; files that
do not export a widget class are ignored by discovery.

Use the stable import aliases so the widget works at any folder depth:

```js
import { Cabbage } from "cabbage";
import { CabbageUtils } from "cabbage/utils.js";
```

The webview provides an import map for `cabbage` and `cabbage/*`.

## Colours

Each bundled kit exposes a small colour palette through `style.color`:

- `accent` — active fills, tick marks and LEDs
- `text` — labels and primary text
- `muted` — value readouts and secondary text
- `track` — grooves and tracks
- `surface` — metal/plastic faces and backgrounds

These appear as colour pickers in the property panel. Individual widgets can
override any of them; unchanged values are omitted when the `.csd` is saved.

## Exporting

When a plugin is exported with a kit active, the kit's widget classes are copied
into the plugin and wired in with small re-export shims. The exported plugin
does not look up `cabbage.widgetKit` at runtime — the active kit is baked in at
export time, so export again after changing kits.
