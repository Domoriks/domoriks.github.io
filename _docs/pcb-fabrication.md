---
title: "PCB Fabrication"
description: "How to order Domoriks PCBs from a fab, source components, and assemble boards."
icon: "🔧"
permalink: /docs/pcb-fabrication/
prev_doc:
  title: "Wiring Guide"
  url: "/docs/wiring"
next_doc:
  title: "Building & Flashing Firmware"
  url: "/docs/firmware"
---

## Ordering PCBs

The Gerber files for both modules are in their respective GitHub repositories. Any standard PCB fab will accept them.

### Recommended fabs

| Fab | Notes |
|-----|-------|
| JLCPCB | Low cost, fast. Minimum 5 boards. Also does PCBA (assembly). |
| PCBWay | Good quality, slightly higher price. Good for prototypes. |
| Aisler | European fab (Germany). Faster delivery to EU. |
| OSH Park | US fab, purple boards, per-board pricing, excellent quality. |

### PCB settings (both modules)

| Parameter | Value |
|-----------|-------|
| Layers | 2 |
| Thickness | 1.6 mm |
| Surface finish | HASL or ENIG |
| Copper weight | 1 oz |
| Colour | Any (black recommended for DIN-rail aesthetics) |
| Min hole size | 0.3 mm |

### Gerber export from KiCad

If you modify the design, re-export Gerbers from KiCad:

1. Open the `.kicad_pcb` file
2. **File → Fabrication Outputs → Gerbers**
3. Set output folder to `gerbers/`
4. Enable all layers: F.Cu, B.Cu, F.Silkscreen, B.Silkscreen, F.Mask, B.Mask, Edge.Cuts
5. Export **Drill Files** as well (Excellon format)
6. Zip the `gerbers/` folder and upload to the fab

## PCBA (assembly) at JLCPCB

JLCPCB can assemble most components for you if you also order the BOM:

1. Export BOM from KiCad: **File → Fabrication Outputs → BOM**
2. Export CPL (Component Placement List): **File → Fabrication Outputs → Component Placement**
3. On JLCPCB's order page, enable **PCB Assembly** and upload BOM + CPL
4. Review the LCSC part matches (most standard parts are stocked)
5. Note: through-hole parts (screw terminals, DIP sockets) must be hand-soldered

The `bom.csv` in each repository already contains LCSC part numbers for JLCPCB PCBA.

{% include callout.html type="tip" title="PCBA tip" content="Order PCBA for SMD components only. The screw terminals, relay sockets, and DIP switch are easy to hand-solder and are often not stocked by JLCPCB." %}

## Key components

### Relay Module BOM highlights

| Reference | Part | Notes |
|-----------|------|-------|
| U1 | STM32G030F6P6 | MCU, TSSOP-20 |
| U2 | SN65HVD3082E | RS-485 transceiver, SOIC-8 |
| RY1–RY8 | Songle SRD-05VDC-SL-C or Omron G5LE-1 | 5V SPDT relay |
| Q1–Q8 | 2N7002 or BSS138 | N-MOSFET relay driver |
| D1–D8 | 1N4148 | Flyback diodes |
| PSU1 | RAC02-24SK/277 or similar | 24V→5V DC/DC (or use separate 5V supply) |
| J1 | Phoenix Contact 1844370 or equiv. | 4-pos 5.08mm screw terminal |
| J2–J9 | Phoenix Contact 1844354 or equiv. | 3-pos 5.08mm screw terminal |

### Switch Module BOM highlights

| Reference | Part | Notes |
|-----------|------|-------|
| U1 | STM32G030F6P6 | MCU |
| U2 | SN65HVD3082E | RS-485 transceiver |
| U3 | PC817 ×8 | Optocoupler for input isolation |
| R1–R8 | 10kΩ | Input pull-ups |
| J1 | 4-pos screw terminal | Power + bus |
| J2–J9 | 2-pos screw terminal | Switch inputs |

## Hand assembly tips

1. **Solder SMD components first** — MCU, transceiver, MOSFETs, diodes, passives
2. **Test 3.3V and 5V rails** before soldering relays
3. **Relays last** — they are the heaviest components and stress the board if handled roughly before solder is cured
4. **Flux is your friend** — use flux paste on pads before placing TSSOP packages
5. **Check with a magnifier** — TSSOP-20 pins are 0.65mm pitch; bridges are common

## Flashing firmware before installation

Flash the STM32 via SWD before mounting the board in the cabinet. You'll need an ST-Link V2 (cheap clones work) or a JLink. See the [Firmware docs](/docs/firmware).

{% include callout.html type="warning" title="Test before cabinet installation" content="Always bench-test a new board — verify power rails, Modbus communication, and all relay channels — before mounting it in your cabinet." %}
