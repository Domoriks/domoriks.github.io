---
title: "Dynamic EV Charging"
description: "Home Assistant integration for dynamic EV charging control based on live electricity meter power and monthly demand budget. Prevents new demand peaks to keep your capacity tariff low — built for Belgian grid tariffs."
image: "https://picsum.photos/800/400?random=308"
tags: ["Home Assistant", "EV", "Belgium", "Python"]
github: "https://github.com/domoriks/ha-dynamic-ev"
demo: ""
docs: ""
stars: ""
language: "Python"
license: "MIT"
version: "1.0.0"
---

## Overview

This Home Assistant custom integration dynamically throttles EV charging in real time to prevent new monthly demand peaks on your electricity connection.

In Belgium, residential grid tariffs include a **capacity tariff** (capaciteitstarief) based on your **monthly peak demand** — the single highest 15-minute average power (kW) recorded during the calendar month. Even one short spike can raise your tariff for the full year. This integration prevents that by watching your smart meter's live power consumption and adjusting EV charge current before a new peak forms.

{% include callout.html type="tip" title="Belgian grid tariffs" content="The capacity tariff applies in all Flemish, Walloon, and Brussels-Capital distribution zones from 2023 onwards. The exact rate per kW varies by DSO." %}

## How it works

Every second (or configurable interval), the integration:

1. Reads live grid power from your smart meter (via P1 port or digital meter integration)
2. Computes the rolling 15-minute average power
3. Compares the projected 15-minute average against your configured demand budget
4. If a new peak is threatened, reduces EV charge current via the charger integration
5. Restores charge current when headroom is available again

The algorithm is conservative: it reduces current early and gradually, rather than making sharp step changes that could stress the charger.

## Features

- **Real-time peak prevention** — sub-second response to power spikes
- **Monthly budget tracking** — tracks the current month's highest recorded 15-min average
- **Charger agnostic** — works with any HA-controllable charger (Peblar, Zaptec, Easee, generic OCPP)
- **Configurable budget** — set your demand budget in kW from the UI
- **Override mode** — manual override to charge at full speed (with peak risk warning)
- **Diagnostic entities** — current 15-min average, projected peak, headroom remaining
- **Automation-friendly** — exposes services for fine-grained control

## Entities

### Sensors
| Entity | Description |
|--------|-------------|
| `sensor.ev_charging_15min_avg` | Current rolling 15-min average power (kW) |
| `sensor.ev_charging_peak_this_month` | Highest 15-min average so far this month (kW) |
| `sensor.ev_charging_headroom` | Available power before new peak (kW) |
| `sensor.ev_charging_current_limit` | Active charge current limit being applied (A) |

### Controls
| Entity | Description |
|--------|-------------|
| `number.ev_charging_demand_budget` | Your monthly demand budget (kW) |
| `switch.ev_charging_peak_guard` | Enable / disable peak guard |
| `switch.ev_charging_override` | Override to full speed (ignores peak guard) |

## Configuration

In the HA setup flow you specify:

- **Meter power sensor** — the entity providing live grid import power (W or kW)
- **Charger current entity** — the `number` entity on your charger for max current
- **Demand budget (kW)** — your target monthly peak (e.g. 5 kW, 7 kW)
- **Minimum charge current** — floor below which charging stops entirely (default: 6A)
- **Update interval** — how often to recalculate (default: 10s)

## Requirements

- Home Assistant Core 2024.1+
- A smart meter integration exposing live power (e.g. DSMR, Fluvius P1, Home Wizard)
- A controllable EV charger integration with a `number` entity for charge current

## Installation

### HACS

1. HACS → Integrations → Custom repositories
2. Add `https://github.com/domoriks/ha-dynamic-ev`
3. Install **Dynamic EV Charging**
4. Restart Home Assistant

## Example: Zappi + Fluvius P1

```yaml
# Sensor from DSMR/P1 reader
sensor.p1_net_power          # live grid import (W)

# Charger entity from Zappi integration
number.zappi_charge_current  # 6–32A
```

Point the integration at these two entities, set your budget to 6 kW, and you're done.
