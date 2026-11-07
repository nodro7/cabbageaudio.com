---
title: "Commands & Settings"
description: "Every Cabbage command in the VS Code command palette and every extension setting, grouped by task."
sidebar:
  order: 9
---

## Command Palette Access

All commands are accessible from the command palette:

- **Windows/Linux**: Press `Ctrl + Shift + P`
- **macOS**: Press `Cmd + Shift + P`

Once open, type "Cabbage" to filter extension commands.

:::tip
Assign custom shortcuts to any command by clicking the cogwheel icon next to the command in the palette.
:::

## Commands & Settings

### Running & Compilation

**Commands:**
- **Compile Cabbage Instrument** (`cabbage.compile`)
  - Saves the current .csd file and launches the instrument in a dedicated webview tab if it contains valid Cabbage JSON. Use this to compile manually when Compile On Save is disabled.

- **Start Cabbage Server** (`cabbage.startServer`)
  - Manually starts the Cabbage backend server (can also be started from the bottom right of the status panel)

- **Stop Cabbage Server** (`cabbage.stopServer`)
  - Stops the running Cabbage backend server

- **Edit Mode** (`cabbage.editMode`)
  - Toggles edit mode for the Cabbage interface. Right-click in edit-mode to add widgets or click existing widgets to edit their properties

- **Stop Csound** (`cabbage.stopCsound`)
  - Stops the running Csound process

- **Validate Installation** (`cabbage.validateInstallation`)
  - Runs the installation check. Use it when nothing appears on screen after you compile

**Settings:**
- **Compile On Save** (`cabbage.compileOnSave`)
  - Default: `true`
  - Automatically compile .csd instruments when saving. Disable to compile manually via the Compile Cabbage Instrument command.

- **Clear Console On Compile** (`cabbage.clearConsoleOnCompile`)
  - Default: `true`
  - Clear the console output each time Csound is compiled

- **Log Verbose** (`cabbage.logVerbose`)
  - Default: `false`
  - Enable verbose logging from Cabbage for troubleshooting

- **Launch In New Column** (`cabbage.launchInNewColumn`)
  - Default: `"Active"`
  - Options: `"Active"` | `"One"` | `"Two"` | `"Three"` | `"Beside"`
  - Choose which editor column the instrument UI opens in

- **Property Panel Position** (`cabbage.propertyPanelPosition`)
  - Default: `"right"`
  - Options: `"right"` | `"left"`
  - Position of the property panel in the webview editor

- **VU Meter Position** (`cabbage.vuMeterPosition`)
  - Default: `"bottom"`
  - Options: `"none"` | `"top"` | `"bottom"` | `"left"` | `"right"`
  - Position of the VU meter overlay in the instrument view. It shows one bar per output channel

- **VU Meter Show Readouts** (`cabbage.vuMeterShowReadouts`)
  - Default: `false`
  - Show text readouts (peak dB, RMS dB, overs) on the VU meter overlay

- **Save External JSON** (`cabbage.saveExternalJSON`)
  - Default: `true`
  - Automatically save external JSON when compiling a .csd file

### Document Formatting

**Commands:**
- **Format Document** (`cabbage.formatDocument`)
  - Formats the current .csd document according to Cabbage formatting rules and JSON settings

- **Expand Cabbage section** (`cabbage.expandCabbageJSON`)
  - Expands the `<Cabbage>` JSON section for easier editing

- **Collapse Cabbage section** (`cabbage.collapseCabbageJSON`)
  - Collapses the `<Cabbage>` JSON section to reduce visual clutter

- **Add a Cabbage section** (`cabbage.addCabbageSection`)
  - Inserts a new `<Cabbage>` section into the current document

- **Move Cabbage Section** (`cabbage.moveCabbageSection`)
  - Moves the existing `<Cabbage>` section to the top or bottom of the .csd file

**Settings:**
- **JSON Indent Spaces** (`cabbage.jsonIndentSpaces`)
  - Default: `4`
  - Range: 2-8
  - Number of spaces to use for JSON indentation

- **JSON Max Length** (`cabbage.jsonMaxLength`)
  - Default: `120`
  - Range: 0-200
  - Maximum line length for JSON formatting. Longer lines will be wrapped. Set to 0 for no wrapping

- **Show Warning Comment** (`cabbage.showWarningComment`)
  - Default: `true`
  - Show a warning comment above the `<Cabbage>` section when the extension writes JSON into the document

- **Snap To Size** (`cabbage.snapToSize`)
  - Default: `4`
  - Number of pixels to move by when dragging widgets in edit mode

- **Cabbage Section Placement** (`cabbage.cabbageSectionPlacement`)
  - Default: `"top"`
  - Options: `"top"` | `"bottom"`
  - Where new `<Cabbage>` sections are placed in .csd files. It only applies when a section is created. To move an existing section, use the Move Cabbage Section command

### Navigation

**Commands:**
- **Jump to widget definition** (`cabbage.jumpToWidgetObject`)
  - Shows a dropdown of all widgets in the current file. Select one to jump to its JSON definition

- **Go to widget definition** (`cabbage.goToDefinition`)
  - Context menu command to jump to a widget's definition from a reference in the code

- **Reorder Widgets** (`cabbage.reorderWidgets`)
  - Reorders widgets in the `<Cabbage>` section based on their position in the UI

### Project Creation

**Commands:**

Starter `.csd` files (built-in Cabbage widgets):

- **Create Effect File (Cabbage UI)** (`cabbage.createNewCabbageEffect`)
  - Creates a single .csd file with a basic effect template using Cabbage widgets. Export it later to VST3/AU/CLAP

- **Create Synth File (Cabbage UI)** (`cabbage.createNewCabbageSynth`)
  - Creates a single .csd file with a basic synthesizer template using Cabbage widgets. Export it later to VST3/AU/CLAP

Custom-UI plugin projects (no Cabbage widgets, full `.vst3` bundle + resources):

- **Create Vanilla VST3 Effect Project (Custom UI)** (`cabbage.createVanillaVST3Effect`)
  - Scaffolds a complete VST3 effect project with custom HTML/CSS/JS frontend and all bundled resources

- **Create Vanilla VST3 Synth Project (Custom UI)** (`cabbage.createVanillaVST3Synth`)
  - Scaffolds a complete VST3 synth project with custom HTML/CSS/JS frontend and all bundled resources

- **Create Project File (cabbage.project.json)** (`cabbage.createProjectFile`)
  - Creates a `cabbage.project.json` file beside the current .csd file. It tells the extension how to load a custom interface. See [Custom Interfaces](/docs/custom-ui/custom-interfaces/)

### Audio/MIDI Configuration

**Commands:**

- **Select Sampling Rate** (`cabbage.selectSamplingRate`)
  - Choose the audio sampling rate (e.g., 44100, 48000, 96000 Hz)

- **Select Buffer Size** (`cabbage.selectBufferSize`)
  - Choose the audio buffer size (affects latency vs. CPU usage)

- **Select Audio Driver** (`cabbage.selectAudioDriver`)
  - Choose the audio driver (Windows only: ASIO, DirectSound, etc.)

- **Select Audio Output Device** (`cabbage.selectAudioOutputDevice`)
  - Choose which audio output device to use

- **Select Audio Input Device** (`cabbage.selectAudioInputDevice`)
  - Choose which audio input device to use

- **Select MIDI Input Device** (`cabbage.selectMidiInputDevice`)
  - Choose which MIDI input device to use

- **Select MIDI Output Device** (`cabbage.selectMidiOutputDevice`)
  - Choose which MIDI output device to use

#### Audio Recording

**Commands:**

- **Start Recording to WAV** (`cabbage.startRecording`)
  - Opens a file browser to select output location and starts recording the processed audio output to a WAV file
  - Records in real-time while your instrument is performing
  - Shows a live status bar indicator with elapsed time (e.g., `🔴 Recording: recording.wav [00:23]`)
  - Click the status bar to stop recording, or use the Stop Recording command

- **Stop Recording** (`cabbage.stopRecording`)
  - Stops the current recording and saves the WAV file
  - Recording also stops automatically when:
    - You close the instrument panel
    - You use "Stop Csound" command
    - You enter Edit Mode

:::note
Recording captures the final processed audio output (post-Csound processing) at the current audio system sample rate.
:::

**Recording Settings:**

- **Recording Bit Depth** (`cabbage.recordingBitDepth`)
  - Default: `"32-bit float"`
  - Options: `"16-bit"` | `"32-bit float"`
  - Bit depth for audio recording
    - **16-bit**: Smaller file size, suitable for most music applications
    - **32-bit float**: Higher dynamic range and precision, no clipping, larger file size

**Settings:**
> These settings are managed by the commands above and stored in VS Code settings. They can also be edited directly in settings.json. Updating them via the command palette will also display a list of valid options.

- **Audio Output Device** (`cabbage.audioOutputDevice`)
  - Default: `"Default"`
  - Currently selected audio output device

- **Audio Input Device** (`cabbage.audioInputDevice`)
  - Default: `"Default"`
  - Currently selected audio input device

- **MIDI Output Device** (`cabbage.midiOutputDevice`)
  - Default: `"Default"`
  - Currently selected MIDI output device

- **MIDI Input Device** (`cabbage.midiInputDevice`)
  - Default: `"Default"`
  - Currently selected MIDI input device

- **Audio Sample Rate** (`cabbage.audioSampleRate`)
  - Default: `"44100"`
  - Currently selected sampling rate

- **Audio Buffer Size** (`cabbage.audioBufferSize`)
  - Default: `"32 samples"`
  - Currently selected buffer size

- **Audio Driver** (`cabbage.audioDriver`)
  - Currently selected audio driver (Windows only)

### Plugin Export

**Commands:**
- **Export as VST3 Effect** (`cabbage.exportVST3Effect`)
  - Exports the current instrument as a VST3 effect plugin

- **Export as VST3 Synth** (`cabbage.exportVST3Synth`)
  - Exports the current instrument as a VST3 synthesizer plugin

- **Export as VST3 Effect (ARA)** (`cabbage.exportVST3EffectARA`)
  - Exports the current instrument as a VST3 effect plugin with ARA support. See [ARA Support](/docs/using/ara-support/)

- **Export as VST3 Synth (ARA)** (`cabbage.exportVST3SynthARA`)
  - Exports the current instrument as a VST3 synthesizer plugin with ARA support

- **Export as AUv2 Effect** (`cabbage.exportAUEffect`)
  - Exports the current instrument as an AUv2 effect plugin (macOS only)

- **Export as AUv2 Synth** (`cabbage.exportAUSynth`)
  - Exports the current instrument as an AUv2 synthesizer plugin (macOS only)

- **Export as CLAP Effect** (`cabbage.exportCLAPEffect`)
  - Exports the current instrument as a CLAP effect plugin

- **Export as CLAP Synth** (`cabbage.exportCLAPSynth`)
  - Exports the current instrument as a CLAP synthesizer plugin

- **Export as AUv2 MidiFx** (`cabbage.exportAUMidiFx`)
  - Exports the current instrument as an AUv2 MidiFx plugin (macOS only)

#### Pro Plugin Export

:::note
These commands are only available in the 'pro' build of Cabbage.
:::

- **Setup Pro Binaries** (`cabbage.setupCabbageProBinaries`)
  - Sets up the paths to Cabbage Pro binaries for encrypted plugin export

- **Export as VST3 Effect (Pro)** (`cabbage.exportProVST3Effect`)
  - Exports the current instrument as a VST3 effect plugin with encryption (requires Pro)

- **Export as VST3 Synth (Pro)** (`cabbage.exportProVST3Synth`)
  - Exports the current instrument as a VST3 synthesizer plugin with encryption (requires Pro)

- **Export as CLAP Effect (Pro)** (`cabbage.exportProCLAPEffect`)
  - Exports the current instrument as a CLAP effect plugin with encryption (requires Pro)

- **Export as CLAP Synth (Pro)** (`cabbage.exportProCLAPSynth`)
  - Exports the current instrument as a CLAP synthesizer plugin with encryption (requires Pro)

- **Export as AUv2 Effect (Pro)** (`cabbage.exportProAUEffect`)
  - Exports the current instrument as an AUv2 effect plugin with encryption (requires Pro, macOS only)

- **Export as AUv2 Synth (Pro)** (`cabbage.exportProAUSynth`)
  - Exports the current instrument as an AUv2 synthesizer plugin with encryption (requires Pro, macOS only)

- **Export as AUv2 MidiFx (Pro)** (`cabbage.exportProAUMidiFx`)
  - Exports the current instrument as an AUv2 MidiFx plugin with encryption (requires Pro, macOS only)

**Settings:**

- **Folder Containing CabbagePro Binaries** (`cabbage.pathToCabbageProBinary`)
  - Default: `""`
  - Folder containing the CabbagePro binaries. Set this to enable Pro export with encrypted .csd files

- **Pro App Enabled** (`cabbage.proAppEnabled`)
  - Default: `true`
  - Use the Pro version of CabbageApp for development. When enabled, the CabbageApp from the Pro binaries folder is used instead of the public version

- **Pro Plugins Enabled** (`cabbage.proPluginsEnabled`)
  - Default: `true`
  - Use the Pro version of the Cabbage plugins for development. When enabled, the Pro plugin binaries are used instead of the public versions

### Custom Widgets

**Commands:**

- **Select Custom Widget Folder** (`cabbage.setCustomWidgetDirectory`)
  - Choose a folder for custom widgets. Automatically copies the required Cabbage framework structure

- **Create New Custom Widget** (`cabbage.createNewCustomWidget`)
  - Creates a new custom widget class from a template in your custom widgets folder

- **Select Widget Kit** (`cabbage.selectWidgetKit`)
  - Choose the active widget kit. Lists the kits bundled with the extension and any kits in your custom widget folders. Choose **None** to use the built-in widgets
  - Reload the instrument after changing; the Cabbage server is not restarted

**Settings:**

- **Custom Widget Folders** (`cabbage.customWidgetDirectories`)
  - Default: `[]`
  - Array of paths to custom widget folders. Each folder should contain a `cabbage` folder structure
  - **Recommended**: Use the "Select Custom Widget Folder" command which automatically sets up the required structure

- **Widget Kit** (`cabbage.widgetKit`)
  - Default: `""`
  - The id of the active widget kit. Leave empty to use the built-in widgets
  - Kit folders live in `<widgets>/kits/<kitId>/`; bundled kits include `punch-light`, `punch-dark`, `vintage-light` and `vintage-dark`
  - Reload the instrument after changing

### Daisy Development

Commands for building Csound code for the [Electrosmith Daisy](https://www.electro-smith.com/daisy) hardware platform:

**Commands:**

- **Make for Daisy** (`cabbage.makeForDaisy`)
  - Compiles the current .csd file for Daisy hardware

- **Make clean for Daisy** (`cabbage.makeCleanForDaisy`)
  - Cleans the Daisy build directory

- **Make boot for Daisy** (`cabbage.makeBootForDaisy`)
  - Creates a bootloader for Daisy

- **Make dfu for Daisy** (`cabbage.makeDfuForDaisy`)
  - Creates a DFU (Device Firmware Update) file for Daisy

- **Select Csound Include Folder (for Daisy)** (`cabbage.setCsoundIncludeDir`)
  - Sets the path to Csound header files needed for Daisy compilation

- **Select Csound Library Folder (for Daisy)** (`cabbage.setCsoundLibraryDir`)
  - Sets the path to Csound library files needed for Daisy compilation

**Settings:**

- **Folder Containing Csound Includes** (`cabbage.pathToCsoundIncludeDir`)
  - Default: `""`
  - Folder containing Csound includes - used when building for Daisy

- **Folder Containing Csound Library** (`cabbage.pathToCsoundLibraryDir`)
  - Default: `""`
  - Folder containing Csound library - used when building for Daisy

### Advanced Settings

:::caution
The Cabbage source folder and the Cabbage binary folder are set automatically by the extension. Only change them if you know what you're doing, or if you're using a custom build.
:::

**Commands:**

- **Select Cabbage Source Folder** (`cabbage.setCabbageSourcePath`)
  - Sets the path to the Cabbage JavaScript source folder

- **Select Cabbage Binary Folder** (`cabbage.setCabbageBinaryPath`)
  - Sets the path to the Cabbage backend executable (CabbageApp)

- **Reset CabbageApp (not vscode) settings file** (`cabbage.resetCabbageAppSettingsFiles`)
  - Resets the Cabbage backend settings file to defaults (does not affect VS Code settings)

- **Set Custom Comment Decoration Color** (`cabbage.setCustomCommentDecorationColor`)
  - Sets the color for comment decorations in Cabbage JSON sections

**Settings:**

- **Folder Containing Cabbage Service App** (`cabbage.pathToCabbageBinary`)
  - Default: `""`
  - Folder containing Cabbage service app. Leave empty to use the default location bundled with the extension

- **Folder Containing Cabbage Javascript on Windows** (`cabbage.pathToJsSourceWindows`)
  - Default: `""`
  - Folder containing Cabbage Javascript on Windows. Leave empty to use default location

- **Folder Containing Cabbage Javascript on macOS** (`cabbage.pathToJsSourceMacOS`)
  - Default: `""`
  - Folder containing Cabbage Javascript on macOS. Leave empty to use default location

- **Folder Containing Cabbage Javascript on Linux** (`cabbage.pathToJsSourceLinux`)
  - Default: `""`
  - Folder containing Cabbage Javascript on Linux. Leave empty to use default location

- **Custom Comment Decoration Color** (`cabbage.customCommentDecorationColor`)
  - Default: `"#666666"`
  - Color for `//` comment properties in Cabbage JSON sections. Use the Set Custom Comment Decoration Color command to pick a color

### Utilities

**Commands:**

- **Open a widget example** (`cabbage.openCabbageExample`)
  - Browse and open example .csd files demonstrating various widgets and techniques

- **Opens the Csound 7 opcode reference page** (`cabbage.openOpcodeReference`)
  - Opens the Csound 7 opcode documentation in your browser

- **Update old-style Cabbage code to JSON** (`cabbage.updateToCabbage3`)
  - Converts old Cabbage syntax to the new JSON format
