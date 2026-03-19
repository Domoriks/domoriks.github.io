---
title: "Configuration Tool"
description: "Using the Qt/Python Domoriks Configurator desktop app to set up and manage your installation."
icon: "🖥️"
permalink: /docs/configurator/
prev_doc:
  title: "Modbus Register Map"
  url: "/docs/modbus-registers"
next_doc:
  title: "Integration Setup"
  url: "/docs/ha-integration"
---

## What the configurator does

The Domoriks Configurator is a standalone Qt-based Python desktop application. It connects to the RS-485 bus independently of Home Assistant and is used to:

- Discover all modules on the bus
- Assign or change Modbus addresses
- Label outputs and inputs with human-readable names
- Set per-input debounce times
- Save your complete home layout to a `.json` file
- Export a configuration bundle for the HA integration
- Flash firmware updates

{% include callout.html type="note" title="Screenshots" content="Add Configurator screenshots here — main window, module discovery, output labelling." %}

## Installation

```bash
pip install domoriks-configurator
```

Or from source:
```bash
git clone https://github.com/domoriks/configurator
cd configurator
pip install -e .
```

Launch:
```bash
domoriks-configurator
# or: python -m domoriks_configurator
```

## First run: connect to the bus

1. Launch the app
2. From the toolbar, select your serial port (e.g. `/dev/ttyUSB0`)
3. Select baud rate (default 9600)
4. Click **Connect**

The status bar should show **Connected** and the bus activity indicator will start blinking.

## Module discovery

Click **Scan Bus** to discover all modules:

- The app sends a broadcast query and listens for responses
- Discovered modules appear in the left panel with their address and type
- If a module does not appear, check power and wiring

{% include callout.html type="tip" title="Slow scan" content="The full bus scan (addresses 1–247) takes about 25 seconds at 9600 baud. Most installations with known addresses can use Quick Scan (addresses 1–32) which completes in 3 seconds." %}

## Address assignment

To change a module's address:

1. Select the module in the left panel
2. Click **Change Address**
3. Enter the new address (1–247)
4. Click **Apply** — the change is written to the module's Flash
5. The module reboots and appears at the new address

{% include callout.html type="warning" title="Avoid duplicates" content="The configurator will warn you if the target address is already in use. Never apply a duplicate address — it will cause both modules to respond to the same request, corrupting communication." %}

## Labelling outputs and inputs

Select a module, then select an output or input channel in the detail panel:

- **Label** — free text (e.g. "Kitchen Counter Spots")
- **Icon** — MDI icon name (e.g. `mdi:spotlight`) — used in HA
- **Type** (switch inputs only) — `toggle` or `momentary`
- **Debounce** (switch inputs only) — milliseconds

Changes are saved to the JSON file; they do not write to the module itself (labels are not stored in module firmware).

## Saving and loading configurations

Click **Save** to write the current configuration to a `.json` file. The file is human-readable:

```json
{
  "site_name": "My Home",
  "bus_port": "/dev/ttyUSB0",
  "baud_rate": 9600,
  "modules": [
    {
      "address": 1,
      "type": "relay",
      "label": "Ground Floor Relays",
      "outputs": [
        { "channel": 1, "label": "Living Room Main Light", "icon": "mdi:ceiling-light" }
      ]
    }
  ]
}
```

Store this file in version control. When you add a module or rename an output, the diff is human-readable.

## Exporting for Home Assistant

**File → Export HA Bundle** creates a `.zip` file containing:

- `config.json` — the full site configuration
- A pre-populated import file for the Domoriks HA integration

During HA integration setup, you can import this bundle to skip the manual naming step and have all entity names and icons populated automatically.

## Firmware update

1. Download the latest `.hex` file from the firmware release page
2. Select the module to update
3. **Tools → Flash Firmware**
4. Select the `.hex` file
5. The app programs the module via Modbus bootloader protocol

The module reboots automatically after flashing. Verify the firmware version in the module info panel.
