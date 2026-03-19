---
title: "Compact Switch Module"
description: "8-input switch and push-button interface module in compact DIN-rail format. Lets your existing wall switches and momentary buttons communicate over RS-485 Modbus RTU — no rewiring required."
image: "https://picsum.photos/800/400?random=303"
tags: ["Hardware", "PCB", "KiCad"]
github: "https://github.com/domoriks/switch-module"
demo: ""
docs: "/docs/switch-module"
stars: ""
language: "KiCad / C"
license: "MIT"
version: "1.0.0"
---

## Overview

The Compact Switch Module connects your existing wall switches and push buttons to the Domoriks RS-485 bus. You keep your standard switches exactly where they are, wired exactly as before. The module reads their state and reports it via Modbus RTU — no rewiring, no smart switch replacements, no signal wire changes.

This makes Domoriks ideal for retrofitting an existing installation.

{% include callout.html type="note" title="Module images" content="Placeholder — add your own KiCad 3D render or module photo here." %}

## How it works

Each of the 8 inputs is connected to a standard switch or push button. The module monitors input state changes (open/close, momentary press) and exposes them as Modbus discrete input registers. The Home Assistant integration reads these registers and triggers automations or controls relay outputs accordingly.

```
Wall switch (NO) ──┬── Input terminal (module)
                   │
                  GND
```

Inputs are optically isolated and accept both dry contacts (switch/button) and low-voltage signal lines (0–5V or 0–12V depending on variant).

## Specifications

| Parameter | Value |
|-----------|-------|
| Form factor | 2 DIN units (36mm wide) |
| Supply voltage | 24V DC |
| Input channels | 8× dry contact / optocoupled |
| Input type | Potential-free (NO or NC) |
| Communication | RS-485, Modbus RTU |
| Baud rate | 9600 / 19200 / 38400 (configurable) |
| Modbus address | 1–247 (DIP switch) |
| MCU | STM32G0 series |
| Debounce | Configurable in firmware (default 20ms) |

## Modbus register map

| Register | Type | Description |
|----------|------|-------------|
| 0x0001 | Discrete Input | Switch 1 state (0 = open, 1 = closed) |
| 0x0002 | Discrete Input | Switch 2 state |
| … | … | … |
| 0x0008 | Discrete Input | Switch 8 state |
| 0x0010 | Discrete Input | Switch 1 last edge (0 = falling, 1 = rising) |
| 0x0100 | Holding | Module firmware version |
| 0x0101 | Holding | Debounce time (ms) |

## Wiring

```
Terminal 1: +24V DC
Terminal 2: GND
Terminal 3: RS-485 A
Terminal 4: RS-485 B
Terminal 5–12: Switch inputs 1–8 (dry contact to GND)
```

## Use cases

- **Standard toggle switches** — e.g. single/double rocker switches for lights
- **Momentary push buttons** — doorbell, scene buttons, staircase switches
- **Reed contacts** — door/window sensors connected to the bus without a separate sensor module
- **PIR motion sensors** — dry-contact output connected directly

{% include callout.html type="tip" title="Automations" content="In Home Assistant, switch input events can trigger any automation — not just the relay on the same bus. Combine switch inputs with the relay module or any other HA-controlled device." %}

## Repository

See [GitHub →](https://github.com/domoriks/switch-module)
