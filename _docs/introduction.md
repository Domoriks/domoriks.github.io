---
title: "Introduction"
description: "What Domoriks is, how it fits together, and what you need to get started."
icon: "🏠"
permalink: /docs/introduction/
next_doc:
  title: "Architecture Overview"
  url: "/docs/architecture"
---

## What is Domoriks?

Domoriks is an open source, decentralised home automation platform built around custom DIN-rail hardware modules. It is designed to be installed inside a standard electrical cabinet alongside your circuit breakers, using ordinary electrician wiring practices.

The name comes from **"domo"** (home, as in domotics) + **"rix"** (Latin for ruler/controller) — a home that is under your control.

## Three-layer architecture

```
┌─────────────────────────────────────────────────┐
│               Home Assistant UI                  │
│  (dashboards, automations, voice control, …)    │
├─────────────────────────────────────────────────┤
│            Domoriks HA Integration               │
│  (Modbus RTU master, entity management, diag)   │
├─────────────────────────────────────────────────┤
│              RS-485 / USB Bus                    │
├──────────────────┬──────────────────────────────┤
│  Relay Module    │       Switch Module           │
│  (8× relay out) │   (8× switch/button input)   │
└──────────────────┴──────────────────────────────┘
```

**Hardware layer** — DIN-rail PCB modules, each an independent Modbus RTU slave. No embedded Linux, no Wi-Fi, no MQTT. Just a microcontroller, some relays, and a two-wire RS-485 connection.

**Communication layer** — RS-485 Modbus RTU. A standard two-wire differential bus that runs reliably over long distances inside a building. Up to 32 modules on a single bus without a repeater.

**Software layer** — A Home Assistant custom integration that acts as the Modbus RTU master. It polls modules, exposes entities, and handles configuration entirely through the HA UI.

## Design principles

**Decentralised.** Modules hold their own state. If your Home Assistant instance reboots, your lights stay as they were. There is no central controller node that becomes a single point of failure.

**Cabinet-native.** The hardware format is standard DIN rail. Everything fits inside an existing electrical cabinet. No extra junction boxes, no surface-mounted devices, no signal-wire chasing.

**Existing switches work.** The switch input module connects directly to your existing wall switches. You keep your physical switches exactly where they are — they continue to function as local controls and also feed events into Home Assistant.

**No cloud.** Communication is entirely local. The RS-485 bus is a physical wire. Nothing leaves your LAN, nothing requires an internet connection, and there is no vendor cloud to shut down.

**Open everything.** KiCad schematics, Gerber files, BOM, firmware source code, and integration source are all published under the MIT licence.

{% include callout.html type="tip" title="Ready to build?" content="Jump to the Quick Start guide for the fastest path from unboxing to a working HA entity." %}

## What you need

- One or more Domoriks DIN modules (relay and/or switch)
- A 24V DC power supply (DIN-rail mount recommended)
- A USB-to-RS485 adapter or direct RS-485 interface on your HA host
- Home Assistant OS, Core, or Supervised — version 2024.1 or later
- Basic electrical wiring skills (or a willing electrician)

## What you do not need

- Any cloud account
- Any internet connection (after downloading the integration)
- YAML configuration files
- A dedicated always-on controller other than your existing HA instance
