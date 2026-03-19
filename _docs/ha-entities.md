---
title: "Entities Reference"
description: "Complete reference for all Home Assistant entities created by the Domoriks integration."
icon: "📊"
permalink: /docs/ha-entities/
prev_doc:
  title: "Integration Setup"
  url: "/docs/ha-integration"
next_doc:
  title: "Automations"
  url: "/docs/ha-automations"
---

## Entity overview

The Domoriks integration creates entities in three groups:

| Group | Entity type | Source |
|-------|------------|--------|
| Relay outputs | `switch` | One per relay channel per relay module |
| Switch inputs | `binary_sensor` | One per input channel per switch module |
| Gateway diagnostics | `sensor`, `text`, `button` | One set per config entry |

## Switch entities (relay outputs)

**Entity ID format:** `switch.<name_you_gave_during_setup>`

**Example:** `switch.living_room_main_light`

| Attribute | Value |
|-----------|-------|
| State | `on` / `off` |
| `module_address` | Modbus address of the parent module |
| `channel` | Relay channel number (1–8) |
| `last_updated` | HA timestamp of last state change |

**Services:**
- `switch.turn_on` — energises the relay (NO closes)
- `switch.turn_off` — de-energises the relay (NO opens)
- `switch.toggle` — reverses current state

### Dashboard card example

```yaml
type: button
entity: switch.living_room_main_light
name: Living Room
icon: mdi:ceiling-light
tap_action:
  action: toggle
```

## Binary sensor entities (switch inputs)

**Entity ID format:** `binary_sensor.<name_you_gave_during_setup>`

**Example:** `binary_sensor.hallway_light_switch`

| Attribute | Value |
|-----------|-------|
| State | `on` (closed/pressed) / `off` (open) |
| `module_address` | Modbus address of the parent module |
| `channel` | Input channel number (1–8) |
| `input_type` | `toggle` or `momentary` |

{% include callout.html type="note" title="Polling latency" content="Switch input state changes are detected on the next polling cycle. At the default 1-second poll interval, latency is 0–1 second. Reduce the poll interval in integration options for faster response (minimum: 200ms)." %}

## Gateway diagnostic entities

One set per config entry (per serial port). These entities are on the **gateway device**.

### Sensors

| Entity | ID | Description |
|--------|-----|-------------|
| Last RX | `sensor.domoriks_<port>_last_rx` | Timestamp of last received Modbus frame |
| Last TX | `sensor.domoriks_<port>_last_tx` | Timestamp of last transmitted frame |
| Bus status | `sensor.domoriks_<port>_bus_status` | `ok`, `timeout`, or `error` |
| Active modules | `sensor.domoriks_<port>_module_count` | Number of responding modules |

**Bus status values:**

| Value | Meaning |
|-------|---------|
| `ok` | All modules responding within timeout |
| `timeout` | One or more modules not responding |
| `error` | CRC errors or framing errors on bus |

### Raw command entities

These entities allow sending arbitrary Modbus RTU frames from the HA UI or automations.

**Text entity** — `text.domoriks_<port>_raw_command`

Enter a hex-encoded Modbus frame (without CRC — the integration appends the correct CRC):

```
01 05 00 01 FF 00
```

(Set relay 1 on module address 1 to ON)

**Button entity** — `button.domoriks_<port>_send_command`

Press to send the command currently staged in the text entity. The response appears in the HA log at DEBUG level.

{% include callout.html type="tip" title="Command format" content="Enter bytes as space-separated hex pairs. Do not include the trailing CRC bytes — the integration calculates and appends them automatically." %}

## Service: `domoriks.send_raw_command`

For automation use, the `domoriks.send_raw_command` service sends a raw frame programmatically:

```yaml
service: domoriks.send_raw_command
data:
  entry_id: "abc123def456"   # config entry ID
  command: "01 0F 00 01 00 08 01 FF"   # Write all 8 relays ON
```

Find the `entry_id` in Settings → Devices & Services → Domoriks → entry URL.

## Diagnostics download

Each config entry has a **Download Diagnostics** option:

Settings → Devices & Services → Domoriks → ⋮ → Download Diagnostics

The downloaded JSON includes:

```json
{
  "integration": "domoriks",
  "config_entry": { "port": "/dev/ttyUSB0", "baud_rate": 9600 },
  "bus_stats": {
    "tx_count": 14523,
    "rx_count": 14490,
    "error_count": 12,
    "timeout_count": 21
  },
  "modules": [...],
  "entities": [...]
}
```

Sensitive values (port path, entity names) are included. Share redacted version when reporting issues.

## Integration options

After setup, configure advanced options via:

Settings → Devices & Services → Domoriks → **Configure**

| Option | Default | Description |
|--------|---------|-------------|
| Poll interval | 1000 ms | How often to read module states |
| Command timeout | 500 ms | How long to wait for a module response |
| Retry count | 2 | Retries on timeout before marking error |
| Auto-reconnect | Enabled | Reconnect after serial port disconnection |
