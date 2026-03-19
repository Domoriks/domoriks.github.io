---
title: "Domoriks Core"
description: "Decentralised home automation platform. Custom DIN-rail hardware communicating over RS-485 Modbus RTU, controlled via a native Home Assistant integration."
image: "https://picsum.photos/800/400?random=301"
tags: ["Hardware", "Firmware", "Home Automation"]
github: "https://github.com/domoriks/domoriks"
demo: ""
docs: "/docs/introduction"
stars: ""
language: "C / Python"
license: "MIT"
version: "1.0.0"
---

## What is Domoriks?

Domoriks is a fully open source, decentralised home automation platform built around DIN-rail hardware modules communicating over RS-485 Modbus RTU. It is designed to live in your electrical cabinet alongside your breakers, using standard wiring practices.

The platform has three layers:

1. **Hardware** — custom PCB modules in DIN-rail format (relay outputs and switch inputs)
2. **Firmware** — embedded C running on each module, implementing the Modbus RTU slave protocol
3. **Software** — a Home Assistant custom integration acting as the Modbus RTU master over USB or RS-485

{% include callout.html type="tip" title="Where to start" content="New to Domoriks? Start with the Architecture Overview doc to understand how the pieces fit together, then follow the Quick Start guide." %}

## Design principles

**Decentralised.** Each module is autonomous — it responds to Modbus commands independently. There is no central controller; the Home Assistant integration is the bus master, but the modules will hold their last state if the controller goes offline.

**Cabinet-native.** All modules fit standard 35mm DIN rail. They are designed to be installed alongside your circuit breakers, not screwed to a wall somewhere else.

**No cloud.** All communication is local. The RS-485 bus is a physical wire. The integration talks directly to the bus adapter over USB or a USB-to-RS485 dongle. Nothing leaves your LAN.

**Existing switches work.** The compact switch input modules let you keep your existing wall switches and push buttons exactly where they are, wired the same way. They just also appear as entities in Home Assistant.

## Repository structure

```
domoriks/
├── hardware/
│   ├── din-relay-module/      # 8-channel relay output board (KiCad)
│   └── switch-module/         # Compact switch input board (KiCad)
├── firmware/
│   ├── relay-module/          # Embedded C for relay board
│   └── switch-module/         # Embedded C for switch board
├── software/
│   └── ha-integration/        # Home Assistant custom component
└── tools/
    └── configurator/          # Qt/Python configuration tool
```

## Hardware overview

| Module | Format | I/O | Protocol |
|--------|--------|-----|----------|
| DIN Relay Module | 4 DIN units | 8× relay outputs | Modbus RTU slave |
| Compact Switch Module | 2 DIN units | 8× switch inputs | Modbus RTU slave |

Both modules are powered at 24V DC and communicate on a shared RS-485 two-wire bus. Each module has a unique configurable Modbus address (set via DIP switches or the configurator tool).

## Getting started

See the [Quick Start guide](/docs/quick-start) or go directly to the [Hardware docs](/docs/din-relay-module).
