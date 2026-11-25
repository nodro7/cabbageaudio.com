---
title: "Running Cabbage"
description: "How the Cabbage server runs inside VS Code and loads an instrument each time you save a .csd file."
sidebar:
  order: 2
---

The Cabbage VS Code extension includes a background service that acts as a server for Cabbage 3 instruments and effects within the IDE. After you install the extension, a green Cabbage logo labelled **Start Cabbage** appears in the lower‑right corner of the VS Code status bar. Clicking it starts the background service and sets up a communication protocol between Cabbage and VS Code. While the server is running, the label changes to **Stop Cabbage**; click it again to stop the server.

When Compile On Save is enabled (the default), saving a .csd file while the Cabbage server is running makes Cabbage parse the contents of the `<Cabbage>` section and send it to VS Code, which then constructs the UI accordingly. If Compile On Save is disabled, saving will not compile — use the Compile Cabbage Instrument command instead. You can start or restart the server as often as needed, and it will automatically restart whenever you change the extension’s settings. When running your instruments as plugins, communication between the frontend and the plugin is handled directly through a series of callbacks. Although the means in which the back and frontend communicate differs between the VS Code extension, and the plugin interface, the user experience remains the same. 
