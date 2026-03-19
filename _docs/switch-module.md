---
title: "Compact Switch Module"
description: "Hardware reference for the Domoriks 8-input DIN-rail switch and button interface board."
icon: "💡"
permalink: /docs/switch-module/
prev_doc:
  title: "DIN Relay Module"
  url: "/docs/din-relay-module"
next_doc:
  title: "Wiring Guide"
  url: "/docs/wiring"
---

## Overview

The Compact Switch Module reads 8 dry-contact switch or push-button inputs and reports their state over the RS-485 Modbus RTU bus. It is designed to integrate your existing wall switches and momentary push buttons into the Domoriks system without any changes to the switch wiring.

{% include callout.html type="note" title="Module images" content="Add your KiCad 3D render or module photo here." %}

## Specifications

| Parameter | Value |
|-----------|-------|
| DIN rail width | 2 units (36 mm) |
| PCB dimensions | 36 × 90 mm |
| Supply voltage | 24V DC |
| Supply current | ~50 mA |
| Input channels | 8× |
| Input type | Potential-free dry contact (NO or NC) |
| Input voltage | 0V (closed) / floating (open) — internally pulled up |
| Optical isolation | Yes — inputs are galvanically isolated from MCU |
| Debounce | 20 ms default (configurable in firmware) |
| MCU | STM32G030F6P6 |
| RS-485 transceiver | SN65HVD3082E |
| Communication | RS-485, Modbus RTU |
| Default baud rate | 9600 8N1 |
| Modbus address range | 1–247 |
| Address selection | 8-position DIP switch |
| Connectors | 4-pin screw terminal (power + bus); 2-pin per input |
| Operating temperature | −10 to +55 °C |

## Terminal layout

### Power and bus (J1)

```
Pin 1  +24V DC
Pin 2  GND
Pin 3  RS-485 A
Pin 4  RS-485 B
```

### Switch inputs (J2–J9, one per channel)

```
Pin 1  IN  — connect one side of switch/button
Pin 2  GND — connect other side of switch/button
```

Inputs are active-low. A closed contact (Pin 1 connected to GND) reads as **1** (closed/pressed) in Modbus.

{% include callout.html type="tip" title="NC switches" content="If your switch is normally closed (NC), it will read as 1 at rest and 0 when pressed. You can invert the logic in HA automations or set the debounce register for NC operation in firmware." %}

## Wiring wall switches

Standard single-pole toggle switches are wired with two wires:

```
Switch terminal 1 → Module IN  (e.g. terminal 5 for input 1)
Switch terminal 2 → Module GND (e.g. terminal 2)
```

The existing 230V circuit on the switch is **not** disconnected. The switch continues to function as a local control for the load, while also sending its state to the RS-485 bus.

{% include callout.html type="warning" title="Low-voltage only" content="The switch module input terminals carry 3.3V signal levels. Never connect mains voltage to an input terminal. The switch input wires must be a separate low-voltage run from the switch, NOT shared with the mains switch loop." %}

## Modbus register map

### Discrete inputs (FC02 read)

| Register | Description |
|----------|-------------|
| 0x0001 | Input 1 state (0 = open, 1 = closed) |
| 0x0002 | Input 2 state |
| … | … |
| 0x0008 | Input 8 state |

### Holding registers (FC03 read, FC06 write)

| Register | R/W | Description |
|----------|-----|-------------|
| 0x0100 | R | Firmware version |
| 0x0101 | R | Modbus address |
| 0x0102 | R/W | Baud rate |
| 0x0110 | R/W | Input 1 debounce (ms, default 20) |
| 0x0111 | R/W | Input 2 debounce (ms) |
| … | … | … |
| 0x0117 | R/W | Input 8 debounce (ms) |

## Input event types in Home Assistant

The HA integration exposes each switch input as a **binary sensor** entity. Input events arrive via the polling loop.

For push buttons (momentary contacts), use an HA automation triggered on state change:

```yaml
trigger:
  - platform: state
    entity_id: binary_sensor.doorbell_button
    to: "on"
action:
  - service: notify.mobile_app
    data:
      message: "Someone at the door"
```

## DIP switch addressing

Same scheme as the relay module. See the [DIN Relay Module docs](/docs/din-relay-module) for the full address table. Ensure switch and relay modules have different addresses on the same bus.

## Design files

Available in the [GitHub repository](https://github.com/domoriks/switch-module):

- KiCad project files
- Gerber files
- BOM with LCSC part numbers
- Schematic PDF
