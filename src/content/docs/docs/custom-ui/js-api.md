---
title: "Cabbage JS API"
description: "Reference for the Cabbage JavaScript API, which carries values and messages between a web interface and the Cabbage backend."
---

The Cabbage JavaScript API provides the communication layer between webview UIs and the Cabbage backend. This API enables bidirectional communication for plugin development.

:::note
A `<Cabbage>{...}</Cabbage>` JSON structure is still required to define parameters for use in a host application. Objects declared in this structure are accessible through the API via a custom event handler (see below). These objects are sent at load time and can be updated at runtime using the [`cabbageSet`](/docs/opcodes/cabbageset/) and [`cabbageSetValue`](/docs/opcodes/cabbagesetvalue/) opcodes.
:::

## Architecture Overview

### UI → Backend (Outgoing Communication)
Three functions cover everything a UI sends to the backend. Use `Cabbage.sendControlData()` to send widget value changes; the backend automatically determines routing based on channel automatable status. Use `Cabbage.sendWidgetUpdate()` to send widget *property* updates (position, visibility, colours, and so on) as extended JSON packets. Use `Cabbage.sendChannelData()` to write a channel directly, bypassing the widget layer.

### Backend → UI (Incoming Communication)
Use `Cabbage.addMessageListener(callback)` to receive messages from the backend. This works in all environments — VS Code, native DAW plugins, and custom UI frameworks — without any environment-specific setup.

## API Reference

### Core Functions

#### `Cabbage.addMessageListener(callback)`

Register a listener for incoming messages from the Cabbage backend. This is the recommended way to handle all backend → UI communication. It abstracts the two runtime environments so that the same UI code works everywhere:

- **VS Code (custom UI / iframe relay)**: messages arrive as `window` message events
- **Native plugin (DAW)**: messages arrive via `window.hostMessageCallback`

**Parameters:**
- `callback` (function): Called with each incoming message object

**Returns:** A cleanup function — call it when the UI is torn down to avoid memory leaks.

**Incoming message shapes:**

| `command` | Fields | Sent by |
|-----------|--------|---------|
| `parameterChange` | `paramIdx`, `value` (may be top-level or nested in `data`) | DAW automation / backend |
| `widgetUpdate` | `id`, `value` | [`cabbageSetValue`](/docs/opcodes/cabbagesetvalue/) opcode |
| `widgetUpdate` | `id`, `widgetJson` | [`cabbageSet`](/docs/opcodes/cabbageset/) opcode |
| `channelDataUpdate` | `channel`, `value` | Csound channel data |
| `resizeResponse` | `accepted`, `width`, `height` | Response to `requestResize()` |

**Example — Vanilla HTML:**
```js
import { Cabbage } from './cabbage/cabbage.js';

Cabbage.addMessageListener((msg) => {
    if (msg.command === 'parameterChange') {
        // paramIdx/value may be top-level or nested in msg.data (DAW host dependent)
        const data = msg.data ?? msg;
        updateSlider(data.paramIdx, data.value);
    } else if (msg.command === 'widgetUpdate') {
        // id and value are always top-level
        if (msg.value !== undefined) {
            document.getElementById(msg.id).value = msg.value;
        } else if (msg.widgetJson !== undefined) {
            const widget = JSON.parse(msg.widgetJson);
            // apply full widget update...
        }
    }
});
```

**Example — Svelte:**
```js
import { Cabbage } from 'cabbage';
import { onMount, onDestroy } from 'svelte';

let removeListener;

onMount(() => {
    removeListener = Cabbage.addMessageListener((msg) => {
        if (msg.command === 'widgetUpdate' && msg.id === 'myChannel') {
            myValue = msg.value;
        }
    });
});

onDestroy(() => removeListener?.());
```

---

#### `Cabbage.sendControlData(data, vscode)`

Send widget value changes to the Cabbage backend. This is the primary API for user interactions.

**Parameters:**
- `data` (Object): Control data object
  - `channel` (string): The channel name
  - `value` (number|string): Value in natural range (e.g., 20-20000 Hz for frequency)
  - `gesture` (string, optional): Gesture type - `"begin"`, `"value"`, `"end"`, `"complete"` (default: `"complete"`)
- `vscode` (Object|null): VS Code API instance (pass `null` for plugin mode)

**Behavior:**
- Automatically routes based on channel automatable status
- Thread-safe: Asynchronous, doesn't block audio thread
- Values sent in natural ranges, backend handles normalization
- **String values**: on a non-automatable channel, a string value is stored as the channel's `stringValue` (and into the matching Csound string channel). String state is included in session/preset saves and re-pushed in the launch dumps — see [Persisting Custom UI State](/docs/custom-ui/persisting-ui-state/). The channel must be declared with `"type": "string"`, e.g. `"channels": [{ "id": "myState", "type": "string" }]`.

**Examples:**
```js
// Basic usage
Cabbage.sendControlData({ channel: "frequency", value: 1000 }, null);

// String state (persists across UI reloads via session save)
Cabbage.sendControlData({ channel: "myState", value: JSON.stringify(myState) }, null);

// With gesture for DAW automation recording
Cabbage.sendControlData({ channel: "volume", value: 0.8, gesture: "begin" }, null);
Cabbage.sendControlData({ channel: "volume", value: 0.9, gesture: "value" }, null);
Cabbage.sendControlData({ channel: "volume", value: 0.9, gesture: "end" }, null);
```

---

#### `Cabbage.sendChannelData(channel, data, vscode)`

Send channel data directly to Csound without DAW automation — bypasses all widget routing and validation.

**Parameters:**
- `channel` (string): Csound channel name
- `data` (number|string): Data to send
- `vscode` (Object|null): VS Code API instance

**Notes:**
- Use `sendControlData()` instead for most cases as it determines the best route automatically
- Bypasses DAW automation system
- Automatically determines string vs numeric data


---

#### `Cabbage.sendWidgetUpdate(widget, vscode)`

Send extended JSON widget property packets to the Cabbage backend. The packet is merge-patched into the stored widget object, so this is the recommended way for a custom frontend to update widget properties such as `bounds`, `visible`, or colours at runtime. It is the counterpart to `sendControlData()`: values travel through `sendControlData()`, everything else travels through here.

**Parameters:**
- `widget` (Object): Widget packet. Must identify the widget with an `id`, either a top-level `id` or any `channels[].id`, plus the properties to change
- `vscode` (Object|null): VS Code API instance (pass `null` for plugin mode)

**Behavior:**
- Merge-patch semantics: only the supplied properties are merged, so partial packets are fine, but a `null` value **deletes** its key, and **arrays replace wholesale**, so always send complete arrays (e.g. a full `channels` array, never a fragment of one)
- Values cannot travel this way: `value` and `range.value` are stripped before sending, along with binding and runtime keys (`parameterIndex`, `channel`, `samples`, file paths), value changes must go through `sendControlData()` (or `sendChannelData()`). Stripping happens twice, `sendWidgetUpdate()` sanitizes the packet via `CabbageUtils.sanitizeForEditor()`, and the backend strips the same keys again before merging, so the guarantee holds even for hand-built packets. Note stored widgets may already show a backend-stamped top-level `value`: that is live runtime state, and a packet's `value` never overwrites it
- Fire-and-forget: the backend applies the patch without echoing it back, so apply the change locally in the UI as well; packets with an unknown id fail silently, so double-check the spelling. The silence is deliberate: re-broadcasting full widget packets, which can carry large `samples` arrays, risks echo loops that flood the strings-only message queue, so property updates are applied without notifying other views

**Example:**
```js
// Move a widget and hide another, from a custom frontend
Cabbage.sendWidgetUpdate({ id: "mainGain", bounds: { left: 40, top: 20 } }, null);
Cabbage.sendWidgetUpdate({ id: "debugPanel", visible: 0 }, null);
```

---

#### `Cabbage.sendMidiMessageFromUI(statusByte, dataByte1, dataByte2, vscode)`

Send MIDI messages from the UI to the backend.

**Parameters:**
- `statusByte` (number): MIDI status byte
- `dataByte1` (number): First data byte
- `dataByte2` (number): Second data byte
- `vscode` (Object|null): VS Code API instance

**Example:**
```js
Cabbage.sendMidiMessageFromUI(144, 60, 100, null); // Note on
```

---

#### `Cabbage.MidiMessageFromHost(statusByte, dataByte1, dataByte2)`

Handle incoming MIDI messages from the backend (callback function).

**Parameters:**
- `statusByte` (number): MIDI status byte
- `dataByte1` (number): First data byte
- `dataByte2` (number): Second data byte


---

#### `Cabbage.isReadyToLoad(vscode)`

Signal that the UI is ready to load and initialize. This must be called in order to notify the backend that the front has completed its initial load.

**Parameters:**
- `vscode` (Object|null): VS Code API instance

### Utility Functions

---

#### `Cabbage.triggerFileOpenDialog(vscode, channel, options)`

Trigger a file open dialog for file selection widgets.

**Parameters:**
- `vscode` (Object|null): VS Code API instance
- `channel` (string): Associated channel name
- `options` (Object, optional): Dialog options
  - `directory` (string): Starting directory
  - `filters` (string): File filters
  - `openAtLastKnownLocation` (boolean): Use last known location

**Example:**
```js
Cabbage.triggerFileOpenDialog(null, "audioFile", {
    filters: "*.wav;*.aiff",
    openAtLastKnownLocation: true
});
```

---

#### `Cabbage.openUrl(vscode, url, file)`

Open a URL or file in the system default application.

**Parameters:**
- `vscode` (Object|null): VS Code API instance
- `url` (string): URL to open
- `file` (string): File path to open

---

#### `Cabbage.consumeKeypresses(consume)` *(Windows plugin mode only)*

Control whether keyboard events are captured by the webview or forwarded to the host DAW.

By default (`false`), all key events are passed through to the DAW so keyboard shortcuts keep working while the plugin UI has focus. This is handled automatically by Cabbage's internal key listener.

**Parameters:**
- `consume` (boolean): `true` to capture keys in the webview, `false` to pass them through to the DAW (default)

**Notes:**
- Native `<input>` and `<textarea>` elements are handled automatically — no need to call this
- Only required for custom text-entry widgets built from non-native elements (e.g. a `div`-based code editor)
- Always restore to `false` when the custom widget loses focus

**Example:**
```js
myCustomEditor.addEventListener('focus', () => Cabbage.consumeKeypresses(true));
myCustomEditor.addEventListener('blur',  () => Cabbage.consumeKeypresses(false));
```

---

#### `Cabbage.requestResize(width, height, vscode)`

Request a resize of the plugin GUI window (plugin mode only).

**Parameters:**
- `width` (number): Requested width in pixels
- `height` (number): Requested height in pixels
- `vscode` (Object|null): VS Code API instance

**Notes:**
- Only works in plugin mode (CLAP/VST3/AUv2)
- Host may accept or reject the request
- Backend sends a `resizeResponse` message indicating acceptance and final dimensions
- Sizes are given in CSS pixels, the same units used by the rest of the UI. They are converted to physical pixels for the host automatically, so no DPI scaling is needed here.


#### `Cabbage.sendCustomCommand(command, vscode, data)`

Send a custom command to the backend for specialized operations.

**Parameters:**
- `command` (string): Command name
- `vscode` (Object|null): VS Code API instance
- `data` (Object, optional): Additional data to send

**Example:**
```js
Cabbage.sendCustomCommand('cabbageIsReadyToLoad', null);
```

---

## Incoming Messages (Backend → UI)

Use `Cabbage.addMessageListener()` to handle all incoming messages. See [the full API entry above](#cabbageaddmessagelistenercallback) for details and examples.

### Message Types

#### `parameterChange`
- **Purpose**: Parameter updates from DAW automation or backend
- **Fields**: `paramIdx`, `value` — may be top-level or nested inside `data` depending on the host
- **Action**: Update visual display only — **never** call `sendControlData()` in response (causes feedback loops)

---

#### `widgetUpdate`
- **Purpose**: Widget value or property update from Csound opcodes (`cabbageSetValue`, `cabbageSet`)
- **Fields**: `id` (string), and either `value` (number) for simple updates or `widgetJson` (string) for full property updates
- **Action**: Update the corresponding widget's value or properties

---

#### `channelDataUpdate`
- **Purpose**: Channel data from Csound
- **Fields**: `channel`, `value`

---

#### `csoundOutputUpdate`
- **Purpose**: Csound console output for debugging
- **Fields**: `text`
- **Action**: Display or log Csound output

---

#### `resizeResponse`
- **Purpose**: Response to GUI resize requests
- **Fields**: `accepted` (boolean), `width` (number), `height` (number)
- **Action**: Handle resize acceptance/rejection and update UI dimensions

---

## Gesture Types

Use appropriate gestures for proper DAW automation recording:

- **`"begin"`**: Start of user interaction (e.g., mouse down on slider)
- **`"value"`**: Continuous updates during interaction (e.g., mouse drag)
- **`"end"`**: End of continuous interaction (e.g., mouse up)
- **`"complete"`**: Discrete actions (e.g., button clicks, default)


## Best Practices

### Avoiding Feedback Loops
When receiving `parameterChange` messages, **only update the visual display**. Never call `sendControlData()` in response, as this creates feedback loops that interfere with DAW automation.

### isDragging Pattern
When a user is actively dragging a slider, ignore incoming `parameterChange` updates to prevent the UI fighting with the user's input:

```js
let isDragging = false;

slider.addEventListener('pointerdown', () => { isDragging = true; });
slider.addEventListener('pointerup',   () => { isDragging = false; });

Cabbage.addMessageListener((msg) => {
    if (msg.command === 'parameterChange' && !isDragging) {
        const data = msg.data ?? msg;
        slider.value = data.value;
    }
});
```

### Thread Safety
All outgoing functions are asynchronous and thread-safe. They queue messages without blocking the audio thread.

### Value Ranges
Send values in their full/natural ranges (e.g., 20-20000 Hz for frequency). The backend handles all DAW normalization automatically.

### Environment Detection
Pass `null` for the `vscode` parameter in all API calls — the library detects the environment automatically. The `vscode` parameter is a legacy option retained for backwards compatibility with older custom UIs that acquired the VS Code API directly.
