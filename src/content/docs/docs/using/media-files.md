---
title: "Working with Media Files"
description: "How to use images and audio files in an instrument, and how to bundle them when you export."
sidebar:
  order: 7
---

Because Cabbage uses a web frontend, all image files used in a UI are sand-boxed. This means that for security reasons, Cabbage UIs can only access files within its own designated directory structure. The browser-based interface cannot directly access files from arbitrary locations on your computer - they must be properly included in your project's folder. 


## File Organization

Due to the strict sand-boxed nature of web UIs, you must place all your media files in a structured way into a dedicated `media` folder in your project directory, i.e., the folder that contains your `.csd` file. 

## Accessing Media Files

Media files can be selected from the property panel or added manually to a widget's JSON structure:
- Use only the filename and extension. Cabbage will automatically search the media folder from the root directory.
- When using the UI editor, widgets that support image files (e.g., image, rotarySlider) will automatically display a list of available images from the media folder in the File property of the property panel.

Inline SVG can be used instead of a separate image file on the [image](/docs/widgets/image/), [button](/docs/widgets/button/), and [file button](/docs/widgets/file-button/) widgets (and on `infoButton`, which has no manual page). Set the widget's `svg` object:

```json
    "svg"       : {
        "markup": "<svg width=\"39\" height=\"28\" viewBox=\"0 0 39 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <path d=\"M27.0766 19.6261L37.4187\" fill=\"white\"/> </svg>",
        "padding": {"left": 3, "right": 6, "top": 6, "bottom": 6}
    },
```

:::note
The `svg` object embeds markup directly in the CSD. It is different from the image widget's `file` property, which references an SVG file from the `media` folder.
:::

## Accessing audio files

Audio files are read by Csound, hence they don't need any special considerations. However, you should also make sure to use full absolute paths for all sound files. The simplest way of doing this is to make sure your sound files are located in the same directory as your .csd file. Then use the `CSD_PATH` reserved channel to construct the full paths:

```csound
    SFileName1 = "loop1.wav"
    SFileName1 = sprintf("%s/%s", chnget:S("CSD_PATH"), SFileName1)
```



## Packaging Media Files

When exporting your instrument as a plugin, use the top-level `package` object in the `<Cabbage>` section to copy extra files into the plugin's resource directory. The following example copies all `.wav` files from `/Users/me/cabbage3-recipes/samples/` into a folder called `audioSamples` at the top level of the exported plugin's resources:

```json
{
    "pluginId": "def1",
    "package" : {
        "include": [ {"src": "/Users/me/cabbage3-recipes/samples/*.wav", "dest": "audioSamples"} ]
    },
    "widgets": [
        {
            "type": "form",
            "caption": "Button Example",
            "size": {"width": 380, "height": 300},
            "guiMode": "queue"
        }
    ]
}
```

`dest` is always a directory relative to the resources root, not a file name. To copy a single file, give its full path in `src`; the file keeps its own name inside `dest`:

```json
"package": {
    "include": [ {"src": "/Users/me/cabbage3-recipes/samples/test.jpeg", "dest": "media"} ]
}
```

This copies `test.jpeg` to `media/test.jpeg` in the exported plugin's resource directory. If you omit `dest`, files are copied to the top level of the resources directory.

For more information, see the [Package Object](/docs/widgets/overview/#package-object) section of the widgets overview.

:::note
Images can be included as base64 strings
:::
