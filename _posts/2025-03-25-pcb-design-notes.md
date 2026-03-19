---
layout: post
title: "Designing DIN-Rail PCBs in KiCad: Lessons From the Relay Board"
date: 2025-03-25
author: "Domoriks"
image: "https://picsum.photos/900/400?random=403"
tags: ["hardware", "kicad", "pcb"]
---

The relay board is physically simple: power rail, MCU, RS-485 transceiver, eight relay driver circuits, eight relays. But designing it to live comfortably inside a DIN-rail cabinet required thinking about things that don't come up in hobbyist projects.

Here are the design decisions and the reasoning behind them.

## DIN-rail form factor

A standard DIN-rail module unit is 17.5 mm wide. "4 units" means 70 mm — but in practice, DIN modules are 72 mm wide, with the 2 mm shared between adjacent modules. This means the PCB must be **narrower than the enclosure**, typically by about 4 mm on each side.

For the relay board I ended up at 72 mm wide × 90 mm tall. The PCB sits on a custom front panel (the part you can see when the cabinet is closed) that snaps onto the DIN rail clip.

The key constraint is **height**. DIN-rail cabinets use horizontal rail spacing, and most standard cabinets have rails spaced 125 mm apart. Your module (PCB + front panel + whatever protrudes from the back) must fit comfortably in 125 mm.

## Relay selection

The relays are the physically dominant component. I went with the **Omron G5LE-1** (5V coil, SPDT, 10A @ 250V AC). They're common, well-documented, available from multiple distributors, and the footprint is standard.

The coil is 5V, which is unusual for a 24V-powered board. I drive the relay coils from the onboard 5V rail (from a 24→5V DC/DC), switched by N-MOSFETs (BSS138) controlled by the STM32 GPIOs. Each MOSFET has a flyback diode (1N4148) to absorb the coil's inductive kick when the relay de-energises.

I considered 24V coil relays to eliminate the 5V rail entirely, but the MCU still needs a low-voltage supply and the RS-485 transceiver runs at 3.3V, so a multi-output DC/DC was unavoidable regardless.

## Creepage and clearance

This is the part that trips up most PCB designers who are new to mains-voltage boards.

IEC 60664-1 (the relevant standard for insulation coordination in low-voltage equipment) specifies minimum distances between conductors at different potentials:

- **Creepage** (distance along the PCB surface between conductors)
- **Clearance** (shortest distance through air between conductors)

For 230V AC mains on a PCB intended for use in a fixed installation (Pollution Degree 2, Overvoltage Category II), the minimum clearance is **3 mm** and creepage is typically **6 mm**.

This affects relay footprint design, conductor routing near relay contact pads, and the PCB edge clearance. It also means you cannot route any 3.3V signal traces near the relay contact pads without explicit spacing checks.

In KiCad, I set up a custom net class for the mains-side nets with expanded clearance rules and ran DRC to verify. It's not perfect (KiCad doesn't do full IEC 60664 calculations), but it catches obvious violations.

{% include callout.html type="warning" title="This is not a safety certification" content="The Domoriks relay board is open hardware for personal use. It has not been tested or certified to any safety standard. If you build one, have it inspected by a qualified electrician before installation. Mains voltages are dangerous." %}

## The RS-485 driver

The **SN65HVD3082E** from TI is a robust choice: 15 kV ESD protection on the bus pins, ±12V common-mode range, and a low-power standby mode. I added a pair of **TVS diodes** (SMAJ6.5A) on the A and B lines for additional surge protection — the RS-485 cable runs close to mains wiring inside the cabinet, and induced transients are a real concern.

The driver is configured in half-duplex mode (single pair, direction controlled by the MCU's DE/RE pins). The STM32's USART in RS-485 mode handles the DE/RE assertion timing automatically, which is a nice hardware feature.

## PCB stackup and copper pour

I used standard 2-layer FR4, 1 oz copper. The ground plane is on the bottom layer; signal and power traces on top. The key decision was the pour strategy near the relays: I excluded copper pour on the top layer inside the relay contact area to maintain creepage distances, and added a fiducial mark to help visual inspection.

## What I changed in revision 1.1

The first prototype had two issues:

1. **Power LED too bright** — 3mm green LED with a 470Ω series resistor. Changed to 2.2kΩ. Now it's visible without being aggressive in a dark cabinet.

2. **DIP switch placement** — I put it on the back of the PCB in revision 1.0. Inconvenient for address changes after installation. Moved to the front panel in 1.1, accessible from the front without removing the module.

The KiCad files in the repository are for revision 1.1.
