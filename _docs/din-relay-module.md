---
title: "DIN Relay Module"
description: "Hardware reference for the Domoriks 8-channel DIN-rail relay output board."
icon: "⚡"
permalink: /docs/din-relay-module/
prev_doc:
  title: "Quick Start"
  url: "/docs/quick-start"
next_doc:
  title: "Compact Switch Module"
  url: "/docs/switch-module"
---

## Overview

The DIN Relay Module is a compact 4-unit DIN-rail board carrying 8 SPDT relays, an STM32G0 microcontroller, and RS-485 interface circuitry. It is the primary output device in a Domoriks installation.

{% include callout.html type="note" title="PCB images" content="Add your KiCad 3D render or physical board photo here." %}

## Specifications

| Parameter | Value |
|-----------|-------|
| DIN rail width | 4 units (72 mm) |
| PCB dimensions | 72 × 90 mm |
| Supply voltage | 24V DC |
| Supply current | ~120 mA idle, ~300 mA all relays energised |
| Relay type | SPDT, 10A @ 250V AC |
| Relay isolation | 4kV (coil to contact) |
| Relay life | 100,000 mechanical operations |
| MCU | STM32G030F6P6 |
| RS-485 transceiver | SN65HVD3082E |
| Communication | RS-485, Modbus RTU |
| Default baud rate | 9600 8N1 |
| Modbus address range | 1–247 |
| Address selection | 8-position DIP switch |
| Protection | Reverse polarity on 24V, TVS on RS-485 lines |
| Connectors | 4-pin screw terminal (power + bus); 3-pin per relay (COM/NO/NC) |
| Operating temperature | −10 to +55 °C |

## Terminal layout

### Power and bus (J1)

```
Pin 1  +24V DC
Pin 2  GND
Pin 3  RS-485 A (non-inverting, typically marked +)
Pin 4  RS-485 B (inverting, typically marked −)
```

### Relay outputs (J2–J9, one per channel)

```
Pin 1  COM  — common
Pin 2  NO   — normally open (open when relay de-energised)
Pin 3  NC   — normally closed (closed when relay de-energised)
```

Default state at power-on: all relays **de-energised** (NO open, NC closed).

## DIP switch address table

The 8-position DIP switch sets the Modbus address in binary:

| Address | SW1 | SW2 | SW3 | SW4 | SW5 | SW6 | SW7 | SW8 |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|
| 1 (default) | ON | OFF | OFF | OFF | OFF | OFF | OFF | OFF |
| 2 | OFF | ON | OFF | OFF | OFF | OFF | OFF | OFF |
| 3 | ON | ON | OFF | OFF | OFF | OFF | OFF | OFF |
| 4 | OFF | OFF | ON | OFF | OFF | OFF | OFF | OFF |
| … | … | … | … | … | … | … | … | … |

SW1 = bit 0 (LSB), SW8 = bit 7 (MSB). Address 0 is reserved; address 255 is broadcast.

{% include callout.html type="tip" title="Address 0" content="Never set all DIP switches OFF (address 0). This is the Modbus broadcast address and will interfere with bus operation." %}

## Modbus register map

### Coils (FC01 read, FC05/FC0F write)

| Coil address | Description |
|-------------|-------------|
| 0x0001 | Relay 1 (0 = de-energised, 1 = energised) |
| 0x0002 | Relay 2 |
| 0x0003 | Relay 3 |
| 0x0004 | Relay 4 |
| 0x0005 | Relay 5 |
| 0x0006 | Relay 6 |
| 0x0007 | Relay 7 |
| 0x0008 | Relay 8 |

### Holding registers (FC03 read, FC06 write)

| Register | R/W | Description |
|----------|-----|-------------|
| 0x0100 | R | Firmware version (MSB major, LSB minor) |
| 0x0101 | R | Modbus address (read-back) |
| 0x0102 | R/W | Baud rate (0=9600, 1=19200, 2=38400) |
| 0x0103 | R | Board hardware revision |

## LED indicators

| LED | Colour | Behaviour |
|-----|--------|-----------|
| PWR | Green | Solid when 24V present |
| STATUS | Yellow | Blinks once per Modbus transaction |
| RELAY 1–8 | Red | On when corresponding relay is energised |

## Design files

Available in the [GitHub repository](https://github.com/domoriks/din-relay-module):

- `din-relay-module.kicad_pro` / `.kicad_sch` / `.kicad_pcb` — KiCad 7 project
- `gerbers/` — production-ready Gerber files
- `bom.csv` — bill of materials with LCSC part numbers
- `docs/schematic.pdf` — PDF schematic
- `docs/assembly.pdf` — annotated assembly guide

{% include callout.html type="warning" title="Mains voltage" content="Relay contacts switch mains voltages. All connection and installation work must comply with local electrical codes and be carried out by a qualified person." %}
