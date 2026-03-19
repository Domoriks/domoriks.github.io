---
title: "Home Assistant Integration"
description: "Custom Home Assistant integration acting as Modbus RTU master over USB or RS-485. UI-only setup, live bus diagnostics, switch entities for every output, and raw command access for automations."
image: "https://picsum.photos/800/400?random=304"
tags: ["Home Assistant", "Python", "Modbus"]
github: "https://github.com/domoriks/ha-integration"
demo: ""
docs: "/docs/ha-integration"
stars: ""
language: "Python"
license: "MIT"
version: "1.0.0"
---

## Overview

The Domoriks Home Assistant integration connects your HA instance to the RS-485 bus as the Modbus RTU master. It communicates with Domoriks modules over a USB-to-RS485 adapter (or a direct RS-485 interface), and exposes each module's inputs and outputs as native HA entities.

{% include callout.html type="tip" title="Installation" content="Install via HACS or copy the custom_components/domoriks folder into your HA config directory. See the full setup guide in the docs." %}

## Features

### UI-based setup
Configure everything through the Home Assistant UI. No `configuration.yaml` editing required. The setup flow walks you through port selection, module discovery, and entity naming.

### Serial Modbus RTU communication
Communicates with modules over:
- **USB** — plug a USB-to-RS485 adapter into your HA host
- **RS-485** — direct serial port on a Home Assistant Yellow, RPi, or similar

Configurable baud rate, parity, stop bits, and polling interval.

### Switch entities
Each relay output channel appears as a `switch` entity in Home Assistant. Name them, assign icons, and use them in dashboards and automations exactly like any other switch.

### Gateway diagnostics device
A dedicated gateway device is created per config entry with the following diagnostic entities:

| Entity | Type | Description |
|--------|------|-------------|
| `sensor.domoriks_last_rx` | Sensor | Timestamp of last received Modbus frame |
| `sensor.domoriks_last_tx` | Sensor | Timestamp of last transmitted frame |
| `sensor.domoriks_bus_status` | Sensor | `ok` / `timeout` / `error` |
| `text.domoriks_raw_command` | Text | Stage a raw hex Modbus command |
| `button.domoriks_send_command` | Button | Send the staged raw command |

### Per-module output naming
During setup, name each relay output individually. Names and icons are stored in HA's entity registry and appear in all dashboards.

### Duplicate prevention
The integration prevents registering the same serial port twice, avoiding bus conflicts between multiple config entries.

### Raw command service
An `domoriks.send_raw_command` service is available for automations that need to send arbitrary Modbus frames:

```yaml
service: domoriks.send_raw_command
data:
  entry_id: "abc123"
  command: "01 05 00 01 FF 00"
```

### Diagnostics download
Every config entry has a **Download Diagnostics** button in HA's integration settings. The downloaded JSON includes bus stats, entity states, and connection parameters (sensitive values redacted).

## Installation

### HACS (recommended)

1. Open HACS → Integrations → Custom repositories
2. Add `https://github.com/domoriks/ha-integration`
3. Install **Domoriks**
4. Restart Home Assistant

### Manual

```bash
# In your HA config directory:
mkdir -p custom_components/domoriks
cp -r ha-integration/custom_components/domoriks/* custom_components/domoriks/
```

## Setup flow

1. Settings → Integrations → Add Integration → search **Domoriks**
2. Select your serial port from the dropdown
3. Configure baud rate (default: 9600)
4. The integration scans the bus and lists found modules
5. Name each output, assign icons
6. Done — entities appear immediately

## Compatibility

- Home Assistant Core 2024.1+
- Python 3.11+
- Any USB-to-RS485 adapter (CH340, FTDI, CP2102 based)
- RS-485 on native UART (RPi GPIO, HA Yellow, etc.)
