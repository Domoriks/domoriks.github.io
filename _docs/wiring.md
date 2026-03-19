---
title: "Wiring Guide"
description: "How to wire modules on the RS-485 bus, cable selection, termination, and cabinet layout tips."
icon: "🔌"
permalink: /docs/wiring/
prev_doc:
  title: "Compact Switch Module"
  url: "/docs/switch-module"
next_doc:
  title: "PCB Fabrication"
  url: "/docs/pcb-fabrication"
---

## RS-485 bus topology

RS-485 is a **bus** (daisy-chain), not a star. Modules connect in series from the USB adapter through each module in turn:

```
USB-RS485 adapter
  │
  ├── Module 1 (address 1)
  │       │
  ├── Module 2 (address 2)
  │       │
  ├── Module 3 (address 3)
  │       │
  └── [far end] ── 120Ω terminator
```

Each module has two RS-485 screw terminals — use both: one for the incoming wire from the previous device, one for the outgoing wire to the next.

{% include callout.html type="warning" title="Star wiring causes problems" content="Connecting multiple modules to a central hub (star topology) creates impedance mismatches and reflections that cause intermittent communication errors, especially at higher baud rates." %}

## Cable selection

### Recommended

| Cable type | Notes |
|-----------|-------|
| CAT5e UTP | Use one twisted pair for A/B. Cheap and widely available. |
| CAT6 UTP | Slightly better performance at longer runs. |
| Belden 9841 | Industrial RS-485 cable, rated for continuous flex. |
| LIYCY 2×0.5mm² | Screened twisted pair, good in electrically noisy environments. |

Use one twisted pair for A and B. If your cable has a screen/shield, connect it to GND at one end only (typically at the USB adapter end) to avoid ground loops.

### Wire gauge

| Bus length | Minimum wire gauge |
|-----------|-------------------|
| Up to 100 m | 0.2 mm² (AWG 24) |
| 100–500 m | 0.5 mm² (AWG 20) |
| 500–1200 m | 0.75 mm² (AWG 18) |

For a typical home installation (single building, sub-100m runs), CAT5e is entirely adequate.

## Termination

A **120Ω resistor** at the far end of the bus reduces signal reflections:

- Place it between the A and B terminals of the **last module** on the bus
- Many USB-RS485 adapters have a built-in switchable terminator — enable it if the adapter is at the far end
- For short runs (under ~10 m, one or two modules), termination is optional but still recommended

{% include callout.html type="tip" title="When to add termination" content="If you see intermittent communication errors or the bus status reports 'error' frequently, try adding or removing termination. Incorrect termination is the most common cause of RS-485 problems." %}

## Power wiring

Each module requires 24V DC on its power terminals. Options:

### Single power supply, one run

Run 24V and GND from a single DIN-rail PSU alongside the RS-485 cable:

```
PSU 24V+ ─────┬────── Module 1 terminal 1
               └────── Module 2 terminal 1 (daisy-chained)
PSU GND  ─────┬────── Module 1 terminal 2
               └────── Module 2 terminal 2
```

### Per-module power (larger installations)

For many modules spread across a building, you may prefer a PSU in each cabinet zone and only run the RS-485 signal cable between zones.

In this case, ensure all GND references are common (connect the GND of each PSU together, or to PE).

## Cabinet layout example

A typical DIN-rail cabinet section for a 4-room floor:

```
DIN rail (top section):
  [MCB breakers] [RCDs] [24V PSU]

DIN rail (middle section):
  [Relay Module A: addr 1] [Relay Module B: addr 2]

DIN rail (bottom section):
  [Switch Module: addr 3] [USB-RS485 adapter] [Patch terminals]
```

The USB-RS485 adapter is mounted near the Raspberry Pi / HA Yellow, which can live adjacent to the cabinet or inside it if space permits.

## Grounding and shielding

- RS-485 A, B, and GND should all share a common 0V reference
- If running cables through electrically noisy environments (near motor drives, fluorescent lights), use screened cable and ground the screen at one end
- Do not run RS-485 signal cable in the same conduit as mains wiring for long parallel runs

## Maximum bus length

At 9600 baud (Domoriks default), RS-485 is rated to 1200 m. In practice, for a home, the limit will never be reached. Even a large house will have total bus runs well under 200 m.

If you do need longer runs, drop to 4800 baud (set via holding register) or add a bus repeater.
