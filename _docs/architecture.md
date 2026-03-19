---
title: "Architecture Overview"
description: "How Domoriks modules, the RS-485 bus, and the Home Assistant integration fit together."
icon: "🗺️"
permalink: /docs/architecture/
prev_doc:
  title: "Introduction"
  url: "/docs/introduction"
next_doc:
  title: "Quick Start"
  url: "/docs/quick-start"
---

## System overview

A Domoriks installation consists of:

1. One or more **Relay Modules** (8-channel output, controls lights/loads)
2. One or more **Switch Modules** (8-channel input, reads wall switches/buttons)
3. A shared **RS-485 bus** connecting all modules
4. A **USB-to-RS485 adapter** (or direct RS-485 port) on the Home Assistant host
5. The **Domoriks HA Integration** running on Home Assistant

```
Home Assistant Host
  │
  │ USB / Serial
  ▼
USB-RS485 Adapter
  │
  │ RS-485 (two-wire)
  ├───────────────────┬───────────────────┐
  ▼                   ▼                   ▼
Relay Module #1   Switch Module #1   Relay Module #2
(address 1)       (address 2)        (address 3)
8× relay out      8× switch in       8× relay out
```

## RS-485 bus

RS-485 is a differential two-wire serial bus. Key properties for Domoriks:

- **Up to 32 devices** on one segment without a repeater
- **Distances up to ~1200m** at 9600 baud (more than enough for any home)
- **Noise-resistant** — differential signalling ignores common-mode interference from mains wiring
- **Single master** — the HA integration is the master; modules are slaves

### Wiring topology

RS-485 works best as a daisy-chain (bus topology), not a star:

```
HA Host ─── Module 1 ─── Module 2 ─── Module 3
                                           │
                                     120Ω terminator
```

Use a 120Ω termination resistor at the far end of the cable. The USB-RS485 adapter typically includes a built-in terminator that you enable via a jumper.

### Cable

Twisted-pair cable is required. Suitable options:

- CAT5/CAT6 (use one twisted pair for A/B, another for ground)
- Dedicated RS-485 cable (e.g. Belden 9841)
- LIYCY shielded data cable

{% include callout.html type="warning" title="Do not use flat cable" content="Untwisted cable is susceptible to noise from nearby mains wiring and will cause intermittent communication errors." %}

## Modbus RTU protocol

Domoriks uses **Modbus RTU** over RS-485. Modbus RTU is a simple, well-established industrial protocol:

- The HA integration (master) sends a request frame
- The addressed module (slave) replies
- One transaction at a time — no collision detection needed

### Frame format

```
[Address 1B] [Function code 1B] [Data N×B] [CRC 2B]
```

Common function codes used:

| Code | Operation | Used for |
|------|-----------|---------|
| 0x01 | Read Coils | Read relay states |
| 0x05 | Write Single Coil | Set one relay on/off |
| 0x0F | Write Multiple Coils | Set all 8 relays at once |
| 0x02 | Read Discrete Inputs | Read switch states |
| 0x03 | Read Holding Registers | Read config registers |
| 0x06 | Write Single Register | Write config register |

## Module addresses

Each module has a unique **Modbus address** (1–247), set via DIP switches on the board or via the Configurator tool. The address is stored in EEPROM and survives power loss.

No two modules on the same bus can share an address. The Configurator will warn you if it detects a conflict during a bus scan.

## Home Assistant integration internals

The integration runs a background polling loop:

```
Every N seconds (configurable, default 1s):
  For each registered module:
    → Read coil states (relay modules)
    → Read discrete input states (switch modules)
    → Update HA entity states
```

State changes from HA (e.g. user taps a switch in a dashboard) trigger an immediate write command outside the polling loop:

```
User taps switch entity
  → integration sends FC05 Write Single Coil
  → module updates relay
  → polling loop confirms state on next cycle
```

## Gateway device

The integration creates a **gateway device** in HA for each config entry (serial port). This device has diagnostic entities for monitoring bus health:

- **Last RX timestamp** — when the last valid Modbus response was received
- **Last TX timestamp** — when the last command was sent
- **Bus status** — `ok`, `timeout`, or `error`

If the bus status enters `timeout` or `error`, HA will mark dependent entities as unavailable.

## Configurator tool

The optional Qt/Python Configurator desktop app talks to the RS-485 bus independently of Home Assistant. Use it to:

- Discover modules and assign addresses
- Label outputs and inputs
- Export a JSON configuration file that can be imported by the HA integration

The JSON config file is a plain text file you can version-control and edit by hand.
