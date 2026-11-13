---
title: "Overview"
description: "The JSON format that describes a Cabbage interface: top-level properties, widget channels and the properties common to all widgets."
sidebar:
  order: 0
---

Beyond supporting custom JavaScript/HTML frameworks, Cabbage provides a declarative JSON syntax to define plugin properties and a robust set of native widgets. 

## Cabbage JSON 
A Cabbage UI is defined by a root JSON object and must contain a `widgets` array, which contains all the UI elements in the plugin interface:

```json
<Cabbage>{
    "widgets": [
        {
            "type": "rotarySlider",
            "id": "mainGain",
            "channels": [{ "id": "gain", "range": {"min": 0, "max": 1, "defaultValue": 0.5} }]
        }
    ]
}
</Cabbage>
```

Apart from the "widgets" array, the `<Cabbage>` block can also contain top-level configuration properties:

### Plugin ID

```json
"pluginId": "MyPl"
```

The unique identifier for the plugin. This is **required** for all plugins. If the ID is exactly 4 characters, it will be automatically prefixed with `com.cabbageaudio.` (e.g., `"MyPl"` becomes `com.cabbageaudio.MyPl`). If longer than 4 characters, it's assumed to be a complete reversed domain name (e.g., `"com.mycompany.myplugin"`).

### Package Object

```json
"package" : {
    "include": [ {"src": "sample", "dest": "samples"} ],
    "cabzOutputDir":""
}
```

The package object is used to manage the resources required by your instruments when they are exported. The package accepts an array of `src/dest` pairs. The `src` value may be a relative or absolute path and can include file wildcards (for example, * or **).

```json
"include": [ {"src": "/Users/me/cabbage3-recipes/samples/*.wav", "dest": "audioSamples"} ]
```

This example copies all `.wav` files from the samples folder into an audioSamples folder located at the top level of the exported plugin's resources directory. The `dest` directory is always the top level directory. If your `src` is a folder, and you leave out the `dest` dir, all the files from that folder will be placed in the top-level plugin resource directory. `cabzOutputDir` is the output location for encrypted resource, available only in the Cabbage pro add-on.

### Channel Configuration

```json
"channelConfig": [
    { "name": "Stereo",    "ins": "2",   "outs": "2" },
    { "name": "Mono",      "ins": "1",   "outs": "1" }
]
```

Defines the preferred audio I/O bus configuration for the plugin. In this example, the plugin indicates that both stereo and mono layouts are supported. 

See the [Audio Channel Configuration](/docs/using/audio-channels/) documentation for detailed information.

### Developer Tools

```json
"enableDevTools": true
```

When set to `true`, enables the browser developer tools in the plugin window (plugin mode only). Useful for debugging custom JavaScript interfaces.

### Logger

```json
"logger": {
    "enabled": true,
    "file": "debug.log",
    "replace": false
}
```

Configures file-based logging for debugging (plugin mode only):
- `enabled`: Whether to write debug logs to a file
- `file`: Path to the log file (relative to the .csd file location, or absolute)
- `replace`: If `true`, overwrites the existing log file on plugin initialization; if `false`, appends to it

### Complete Example

A complete Cabbage JSON structure with top-level configuration:

```json
<Cabbage>{
    "pluginId": "MyPl",
    "channelConfig": [
        { "name": "Stereo", "ins": "2", "outs": "2" }
    ],
    "widgets": [
        {
            "type": "form",
            "caption": "My Plugin",
            "size": {"width": 600, "height": 400}
        },
        {
            "type": "rotarySlider",
            "id": "mainGain",
            "channels": [{
                "id": "gain",
                "range": {"min": 0, "max": 1, "defaultValue": 0.5}
            }]
        }
    ],
    "enableDevTools": false,
    "logger": {
        "enabled": false,
        "file": "debug.log",
        "replace": true
    },
    "package": {
        "include": [ {"src": "samples", "dest": "samples"} ]
    }
}</Cabbage>
```


## Widget Channels

Each widget has a unique set of properties and associated Csound software channels, defined in JSON format. These channels define parameters and serve as the communication bridge between Cabbage’s graphical interface and the Csound audio engine. Most widget properties can be modified at any time to adjust their appearance or behavior.

Named channels are a central part of the Cabbage architecture: they carry values and parameter updates between the GUI and Csound, forming a software “bus” for data transfer. Every widget must have a channel `id`. Channel `id`s can be set at the widget’s top level, but more often they are defined within channel objects that form part of the `channels` array. The `channels` array allows multiple channels to be associated with a single widget, enabling extended interactions.

`range` objects are defined within channel objects. These are used both to name plugin parameters and to define their ranges. A typical channel definition with an embedded `range` object might look like this:

```json
{
    "type": "rotarySlider",
    "channels": [
        {
            "id": "Gain", 
            "range": {
                "min": 0, "max": 1, "defaultValue": 0, "skew": 1, "increment": 0.01
            }
        }
    ]
}
```

`channel.id`, in this case `"Gain"`, will be registered as a plugin parameter in a host DAW, with `0` and `1` defining its minimum and maximum range. The [`cabbageSetValue`](/docs/opcodes/cabbagesetvalue/) and [`cabbageGetValue`](/docs/opcodes/cabbagegetvalue/) opcodes can be used to send values back and forth to these channels.

Certain widgets, such as a `groupBox`, will rarely be set up to function as parameters. In these cases, a top-level `id` can be set. For example:

```json
{
    "type": "groupBox",
    "id": "adsrPanel"
}
```

In such cases, the [`cabbageSet`](/docs/opcodes/cabbageset/) and [`cabbageGet`](/docs/opcodes/cabbageget/) opcodes can be used to send JSON data back and forth. Widgets can also combine a top-level `id` with channel `id`s. Consider an `image` widget for example, with multiple channels defined:

```json
{
    "type": "image",
    "channels": [
        {
            "id": "mouseX",
            "event": "mouseMoveX",
            "range": {"min": 0, "max": 1000, "defaultValue": 0, "skew": 1, "increment": 0.01}
        },
        {
            "id": "mouseY",
            "event": "mouseMoveY",
            "range": {"min": 0, "max": 1000, "defaultValue": 0, "skew": 1, "increment": 0.01}
        },
        {
            "id": "image1MousePress",
            "event": "mousePressLeft"
        }
    ]
}
```

:::note
While it is possible to use `cabbageSet` to update a widget's value, it's not advised to do so. When calling cabbageSet, the widget's entire JSON data is passed from the backend to the frontend. When updating a value using `cabbageSetValue` only the value and channel name are sent, this results in much less overhead.
:::

If no top-level `id` is set, the `channels[0].id` channel can be used, but the resulting code might not be very intuitive, for instance, calling `cabbageSet` to set the color of `mouseX` doesn’t make much sense. In such cases, it helps to define a more appropriately named top-level `id`:

```json
{
    "type": "image",
    "id": "frequencyXyPad",
    "channels": [
        {
            "id": "mouseX",
            "event": "mouseMoveX",
            "range": {"min": 0, "max": 1000, "defaultValue": 0, "skew": 1, "increment": 0.01}
        },
        {
            "id": "mouseY",
            "event": "mouseMoveY",
            "range": {"min": 0, "max": 1000, "defaultValue": 0, "skew": 1, "increment": 0.01}
        },
        {
            "id": "image1MousePress",
            "event": "mousePressLeft"
        }
    ]
}
```

Using well-named top-level `id`s to manage a widget’s visual state offers many benefits, not least when it comes to debugging complex instruments. 

Cabbage accepts JSONC-style comments: use `//` for a single-line comment or `/* ... */` for a block comment. Trailing commas are not supported. Comments are highlighted in the editor.

:::caution
A widget's range is fixed and cannot be changed at run-time. However, there are ways to make it appear as though the range has changed. Please ask on the forum for tips and tricks on making this work.
:::

## Widget Properties 

Each and every Cabbage widget has a set of properties that define its behavior and appearance. All properties, except for `channels` and `automatable`, can be updated dynamically during run-time. The following properties are common to all widgets:

**Bounds**

```json
"bounds": {"left":0, "top":0, "width":100, "height":100}
```

* Sets the placement and dimensions of the widget within the main form.

**Visible**

```json
"visible": true
```

* Determines whether the component is visible.

**Active**

```json
"active": true
```

* Will disable a widget if set to `false`. Interaction is not supported with widgets that have `active` set to `false`.

**Automatable**

```json
"automatable": true
```

* Defaults to `true`. Determines if a widget is automatable by a host DAW. Automatable widgets show up as plug-in parameters in the host. Non-automatable widgets can still communicate with Csound but are not accessible by the host. Note that hosts do not allow this parameter to change dynamically. If you change this setting, the plugin will need to be reloaded.

**Z-Index**

```json
"zIndex": 0
```

* Sets the stacking order of the widget. Widgets with higher `zIndex` values appear in front of widgets with lower values. The default is `0`.

Each widget also has a unique set of styling properties accessed through the `style` object. Here, users can control how their widgets look. In a break from Cabbage 2 convention, and to align with CSS/HTML naming schemes, all style properties use CSS-style spelling—for example, background color is listed as `backgroundColor`. A full list of supported styles, along with all other properties, can be found in each widget's manual entry.

## Widget Hints

The `Cabbage: Generate UI from Channels` command builds widgets from the channels referenced by `cabbageGetValue`, `cabbageSetValue`, `cabbageGet` and `cabbageSet` calls in your orchestra. Cabbage infers a widget type from each channel's name and value type, but you can override that inference with an inline `@widget` hint on the reference line:

```csound
freq:k = cabbageGetValue("cutoff") ; @widget type("rotarySlider") range(20, 20000, 800, 0.5)
```

The hint takes the following form:

```text
@widget type("widgetType") range(min, max, value[, increment[, skew]])
```

* `type("...")` is required and names the widget type to create, for example `"rotarySlider"`, `"horizontalSlider"` or `"checkBox"`.
* `range(...)` is optional. It accepts `min`, `max` and `value`, followed by optional `increment` and `skew` values. The `value` is used as both the default and current value.
* A comma between the two clauses is optional, so Cabbage 2-style `type("...") , range(...)` hints are also accepted.
* Without a range, generated widgets use a `0` to `1` range. `button`, `checkBox`, `comboBox` and `listBox` widgets use an increment of `1`; all other widget types use `0.001`.

```csound
; Choose the type without changing the default range
gain:k = cabbageGetValue("gain") ; @widget type("horizontalSlider")

; Set the type and range
cutoff:k = cabbageGetValue("cutoff") ; @widget type("rotarySlider") range(20, 20000, 800)

; Include an increment and skew
pan:k = cabbageGetValue("pan") ; @widget type("rotarySlider") range(-1, 1, 0, 0.01, 1)
```

:::note
Widget hints are only read by the Generate UI command. They do not create widgets at compile time, and they are ignored once the widget exists in the `<Cabbage>` section.
:::

A hint applies to every channel found on its line. If a channel is referenced on several lines, the first hint found is used. Channel names must be static string literals; references that build a channel name dynamically, for example with `sprintf` or a variable, are skipped. If a hint is malformed, or if its range does not contain at least three numbers, the hint or range is ignored and Cabbage falls back to inference.

See [Working with Instruments](/docs/using/working-with-instruments/) and [Commands](/docs/using/commands/) for more on generating an interface from an existing orchestra.

## Plugin Parameters and Automation

All widgets include an `automatable` property. Only widgets with `automatable` set to `true` will appear as automatable parameters in a host environment. Through the named channels, these widgets can be controlled or modulated by the host, ensuring synchronisation between the interface and the audio engine. Many of the stock widgets that ship with Cabbage have their `automatable` property set to `true` by default.

Widgets with `automatable: false` can still send and receive data over named channels, but they will not appear in the list of plugin parameters presented in the DAW. A `fileButton` is a good example of one such widget. It makes little sense to give the DAW control to open a native file browser dialog. Note that this property cannot be toggled on and off; the host needs to know what is automatable when it loads.



## Examples and Documentation

Each widget in Cabbage is documented with its properties and available channels. Example .csd files are provided to demonstrate how to integrate the widget into a project and use its channels in practice.


- [Button](/docs/widgets/button/)
- [Checkbox](/docs/widgets/checkbox/)
- [ComboBox](/docs/widgets/combobox/)
- [Csound Output](/docs/widgets/csound-output/)
- [File Button](/docs/widgets/file-button/)
- [Form](/docs/widgets/form/)
- [GenTable](/docs/widgets/gentable/)
- [GroupBox](/docs/widgets/groupbox/)
- [Horizontal Slider](/docs/widgets/horizontal-slider/)
- [Image](/docs/widgets/image/)
- [Keyboard](/docs/widgets/keyboard/)
- [Label](/docs/widgets/label/)
- [Number Slider](/docs/widgets/number-slider/)
- [Option Button](/docs/widgets/option-button/)
- [Rotary Slider](/docs/widgets/rotary-slider/)
- [Vertical Slider](/docs/widgets/vertical-slider/)
- [XY Pad](/docs/widgets/xy-pad/)

