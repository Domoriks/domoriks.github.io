---
title: "Peblar HA Integration"
description: "Home Assistant custom integration for local monitoring and control of Peblar EV chargers via the built-in REST API. No cloud — all communication is directly on your local network."
image: "https://picsum.photos/800/400?random=307"
tags: ["Other", "Home Assistant", "EV", "Python"]
github: "https://github.com/domoriks/ha-peblar"
demo: ""
docs: ""
stars: ""
language: "Python"
license: "MIT"
version: "1.0.0"
---

## Overview

A Home Assistant custom integration for Peblar EV chargers that uses the charger's built-in local REST API. No cloud account, no external service, no data leaving your home network. The charger and your HA instance communicate directly on your LAN.

{% include callout.html type="note" title="Compatibility" content="Compatible with Peblar chargers that expose the local REST API (check your charger's firmware version in the Peblar app)." %}

## Features

- **Local-only** — communicates directly with the charger over your LAN
- **No cloud dependency** — works even if Peblar's cloud services are unavailable
- **Monitoring entities** — state of charge, session energy, charge power, status
- **Control** — start/stop charging, set current limit
- **HACS installable** — no manual file copying

## Entities

### Sensors
| Entity | Description |
|--------|-------------|
| `sensor.peblar_status` | Charger status (available, charging, error…) |
| `sensor.peblar_charge_power` | Current charging power (W) |
| `sensor.peblar_session_energy` | Energy delivered in current session (kWh) |
| `sensor.peblar_total_energy` | Lifetime energy delivered (kWh) |
| `sensor.peblar_charge_current` | Active charging current (A) |
| `sensor.peblar_voltage` | Supply voltage (V) |

### Controls
| Entity | Description |
|--------|-------------|
| `switch.peblar_charging` | Start / stop charging |
| `number.peblar_max_current` | Maximum charging current (6–32A) |

## Installation

### HACS

1. HACS → Integrations → Custom repositories
2. Add `https://github.com/domoriks/ha-peblar`
3. Install **Peblar EV Charger**
4. Restart Home Assistant

### Setup

Settings → Integrations → Add → **Peblar** → enter the charger's local IP address.

## Example automation

```yaml
# Charge only when solar excess is available
automation:
  trigger:
    - platform: numeric_state
      entity_id: sensor.solar_excess_power
      above: 1500
  action:
    - service: switch.turn_on
      target:
        entity_id: switch.peblar_charging
```
