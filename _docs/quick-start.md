---
title: "Quick Start"
description: "From hardware in hand to a working Home Assistant switch entity in under 30 minutes."
icon: "⚡"
permalink: /docs/quick-start/
prev_doc:
  title: "Architecture Overview"
  url: "/docs/architecture"
next_doc:
  title: "DIN Relay Module"
  url: "/docs/din-relay-module"
---

## What you need

- 1× Domoriks DIN Relay Module (assembled and tested)
- 1× USB-to-RS485 adapter (CH340, FTDI, or CP2102 based)
- 1× 24V DC power supply
- 3-wire connection: RS-485 A, B, and GND between adapter and module
- Home Assistant 2024.1 or later

## Step 1 — Wire the module

Connect the USB-RS485 adapter to the module's RS-485 terminals:

```
Adapter A  →  Module terminal 3 (RS-485 A)
Adapter B  →  Module terminal 4 (RS-485 B)
Adapter GND → Module terminal 2 (GND)
```

Apply 24V DC to terminals 1 (+24V) and 2 (GND).

The module's power LED should illuminate. The status LED will blink once on boot.

{% include callout.html type="tip" title="Termination" content="For a single module connected directly to the USB adapter, enable the termination jumper on the adapter if it has one. For longer runs with multiple modules, see the Wiring Guide." %}

## Step 2 — Set the module address

Out of the box the relay module ships with Modbus address **1**. If this is your only module, leave the DIP switches as-is.

If you have multiple modules on one bus, set each to a unique address using the DIP switches before connecting them. See the [DIN Relay Module docs](/docs/din-relay-module) for the DIP switch table.

## Step 3 — Plug in the USB adapter

Plug the USB-RS485 adapter into your Home Assistant host (e.g. Raspberry Pi, HA Yellow, x86 mini-PC).

Verify the port appears:

```bash
# On the HA host shell (Terminal add-on or SSH)
ls /dev/ttyUSB*
# Expected: /dev/ttyUSB0
```

## Step 4 — Install the Domoriks integration

**Via HACS (recommended):**

1. Open HACS → Integrations → ⋮ → Custom repositories
2. Add `https://github.com/domoriks/ha-integration`, category: Integration
3. Find **Domoriks** in the list and click **Download**
4. Restart Home Assistant

**Manual:**

```bash
# In your HA config directory
mkdir -p custom_components/domoriks
cp -r /path/to/ha-integration/custom_components/domoriks/* \
      custom_components/domoriks/
```

Then restart Home Assistant.

## Step 5 — Add the integration

1. Go to **Settings → Devices & Services → Add Integration**
2. Search for **Domoriks**
3. Select your serial port (e.g. `/dev/ttyUSB0`)
4. Leave baud rate at **9600** (default)
5. Click **Submit**

The integration scans the bus. After a few seconds you will see:

```
Found: Relay Module (address 1) — 8 outputs
```

## Step 6 — Name your outputs

The setup flow presents a form for each discovered output. Give each relay channel a descriptive name and pick an icon:

| Channel | Name | Icon |
|---------|------|------|
| 1 | Living Room Main Light | `mdi:ceiling-light` |
| 2 | Kitchen Counter Spots | `mdi:spotlight` |
| … | … | … |

Click **Finish**.

## Step 7 — Use your entities

Navigate to **Settings → Devices & Services → Domoriks**. You will see:

- One **device** per module (e.g. "Relay Module #1")
- One **gateway device** with bus diagnostic sensors
- One **switch entity** per output (e.g. `switch.living_room_main_light`)

Add a switch card to your dashboard and toggle it. The corresponding relay on the module should click.

**Congratulations — your first Domoriks entity is live.**

## Next steps

- Add a **Switch Module** to connect your wall switches → [Switch Module docs](/docs/switch-module)
- Wire multiple modules on a single RS-485 bus → [Wiring Guide](/docs/wiring)
- Set up automations → [Automations guide](/docs/ha-automations)
- Explore raw command access → [Entities Reference](/docs/ha-entities)
