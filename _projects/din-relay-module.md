---
title: "DIN Relay Module"
description: "8-channel relay output board in standard DIN-rail format. Powered at 24V DC, communicates over RS-485 Modbus RTU. Open KiCad schematics and Gerber files included."
image: "https://picsum.photos/800/400?random=302"
tags: ["Hardware", "PCB", "KiCad"]
github: "https://github.com/domoriks/din-relay-module"
demo: ""
docs: "/docs/din-relay-module"
stars: ""
language: "KiCad / C"
license: "MIT"
version: "1.0.0"
---

## Overview

The DIN Relay Module is the primary output device in the Domoriks ecosystem. It provides 8 individually controllable relay channels on a compact DIN-rail PCB that fits neatly inside a standard electrical cabinet.

Each channel is controlled via Modbus RTU commands over the RS-485 bus. The module acts as a Modbus RTU slave and holds its relay states independently of the bus master — if Home Assistant restarts, your lights stay as they were.

{% include callout.html type="note" title="PCB images" content="Placeholder — add your own KiCad 3D render or physical PCB photo here." %}

## Specifications

| Parameter | Value |
|-----------|-------|
| Form factor | 4 DIN units (72mm wide) |
| Supply voltage | 24V DC |
| Relay channels | 8 × SPDT |
| Max relay load | 10A @ 250V AC |
| Communication | RS-485, Modbus RTU |
| Baud rate | 9600 / 19200 / 38400 (configurable) |
| Modbus address | 1–247 (DIP switch) |
| MCU | STM32G0 series |
| Protection | Reverse polarity, TVS on RS-485 |

## Hardware design files

All design files are open source under MIT:

- **Schematic** — `hardware/din-relay-module/schematic.pdf`
- **PCB layout** — KiCad `.kicad_pcb` + Gerber export
- **BOM** — `hardware/din-relay-module/bom.csv`
- **3D model** — STEP file for cabinet planning

```
din-relay-module/
├── din-relay-module.kicad_pro
├── din-relay-module.kicad_sch
├── din-relay-module.kicad_pcb
├── bom.csv
├── gerbers/
│   ├── din-relay-module-F_Cu.gbr
│   ├── din-relay-module-B_Cu.gbr
│   └── ...
└── docs/
    ├── schematic.pdf
    └── assembly.pdf
```

## Modbus register map

| Register | Type | Description |
|----------|------|-------------|
| 0x0001 | Coil | Relay 1 (0 = off, 1 = on) |
| 0x0002 | Coil | Relay 2 |
| … | … | … |
| 0x0008 | Coil | Relay 8 |
| 0x0100 | Holding | Module firmware version |
| 0x0101 | Holding | Modbus address (read) |

## Wiring

Power and RS-485 bus enter via a 4-pin screw terminal:

```
Terminal 1: +24V DC
Terminal 2: GND
Terminal 3: RS-485 A (non-inverting)
Terminal 4: RS-485 B (inverting)
```

Each relay output has its own 3-pin screw terminal (COM / NO / NC).

{% include callout.html type="warning" title="Mains wiring" content="Relay outputs switch mains voltages. All mains wiring must be performed by a qualified electrician in accordance with local regulations." %}

## Firmware

The relay module firmware is written in C and targets the STM32G0. See the [Firmware docs](/docs/firmware) for build and flash instructions.

## Fabrication

You can order PCBs from any standard PCB fab using the Gerber files in the repository. See [PCB Fabrication](/docs/pcb-fabrication) for recommended fabs and tips on component sourcing.
