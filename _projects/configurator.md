---
title: "Domoriks Configurator"
description: "Qt-based Python desktop application for configuring Domoriks modules and managing your home layout. Saves configuration in human-readable, editable JSON files."
image: "https://picsum.photos/800/400?random=305"
tags: ["Python", "Qt", "Tooling"]
github: "https://github.com/domoriks/configurator"
demo: ""
docs: "/docs/configurator"
stars: ""
language: "Python / Qt"
license: "MIT"
version: "0.9.0"
---

## Overview

The Domoriks Configurator is a cross-platform desktop application for setting up and managing your Domoriks installation. It provides a graphical interface for module discovery, address assignment, output naming, and saving your entire home layout to JSON configuration files.

{% include callout.html type="note" title="Screenshot" content="Placeholder — add configurator screenshot here." %}

## Features

### Module discovery
Scan the RS-485 bus for connected modules. The configurator auto-detects the module type (relay or switch) and firmware version for each Modbus address.

### Address assignment
Assign or change the Modbus address of any module directly from the GUI — no DIP switch fiddling needed after initial setup. Changes are written to the module's EEPROM.

### Output and input labelling
Name every relay output and switch input with a human-readable label. These labels are stored in the JSON config and can be imported by the Home Assistant integration.

### JSON configuration files
All settings are saved to a plain `.json` file:

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
        { "channel": 1, "label": "Living Room Main Light", "icon": "mdi:ceiling-light" },
        { "channel": 2, "label": "Kitchen Counter Spots",  "icon": "mdi:spotlight" }
      ]
    },
    {
      "address": 2,
      "type": "switch",
      "label": "Ground Floor Switches",
      "inputs": [
        { "channel": 1, "label": "Living Room Switch", "type": "toggle" },
        { "channel": 2, "label": "Kitchen Switch",     "type": "momentary" }
      ]
    }
  ]
}
```

Files are plain text — version-control them with git, diff them, edit them by hand if needed.

### HA config export
Export the current configuration as a ready-to-import bundle for the Home Assistant integration. This pre-populates all entity names and icons, skipping the manual naming step during HA setup.

### Firmware update
Flash firmware updates to connected modules over the RS-485 bus via the bootloader.

## Installation

### pip (any platform)

```bash
pip install domoriks-configurator
domoriks-configurator
```

### From source

```bash
git clone https://github.com/domoriks/configurator
cd configurator
pip install -r requirements.txt
python -m domoriks_configurator
```

### Requirements

- Python 3.11+
- PySide6 (Qt 6)
- pyserial
- pymodbus

## Supported platforms

| Platform | Status |
|----------|--------|
| Linux | ✓ Fully supported |
| macOS | ✓ Fully supported |
| Windows | ✓ Supported (installer coming) |
