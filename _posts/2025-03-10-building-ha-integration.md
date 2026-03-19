---
layout: post
title: "Building a Home Assistant Integration From Scratch"
date: 2025-03-10
author: "Domoriks"
image: "https://picsum.photos/900/400?random=402"
tags: ["home-assistant", "python", "tutorial"]
---

The Domoriks Home Assistant integration is the part I spent the most time on. Getting hardware to talk Modbus RTU is relatively straightforward — writing a HA integration that feels like it belongs in the platform took more iteration.

Here's what I learned.

## The config_flow

The thing that makes an integration feel native is the `config_flow` — the UI-based setup wizard. Without it, users have to edit `configuration.yaml`, which is not a friendly experience for something that should be plug-and-play.

HA's config flow is a multi-step wizard driven by Python classes. Each step returns either a form schema (asking the user for input) or a result (success, error, or abort). The tricky part is that you need to validate user input on the server side and report errors back to the form in a way HA understands.

For Domoriks, the flow has three steps:

1. **Serial port** — dropdown of detected ports + baud rate
2. **Module discovery** — non-interactive, shows discovered modules
3. **Output naming** — dynamic form generated per module per channel

The dynamic form on step 3 was the interesting challenge. HA's `vol.Schema` (voluptuous) is evaluated at class definition time, but the number of fields depends on what modules were found at step 2. The solution is to build the schema dictionary dynamically in the step handler and pass it to `vol.Schema()` at runtime.

## Entity lifecycle

HA entities need to be set up, maintained, and removed cleanly. Domoriks uses the `DataUpdateCoordinator` pattern:

1. The coordinator runs a background task that polls the bus on a fixed interval
2. All entities subscribe to coordinator updates
3. When the coordinator gets fresh data, all entities update their state in one cycle
4. If the coordinator encounters a bus error, all entities are marked unavailable

This is cleaner than having each entity poll independently, and it ensures all state updates arrive atomically (no partial updates where relay 1 is current and relay 8 is stale).

## The gateway device

Something I added that isn't in many integrations: a dedicated "gateway" device that represents the serial connection itself, not any physical module. It has:

- `last_rx` and `last_tx` sensors (useful for confirming the bus is actually alive)
- A `bus_status` sensor that goes to `timeout` or `error` if modules stop responding
- A raw command text + button pair for debugging

The raw command interface was particularly useful during development. Rather than writing a test script every time I wanted to send a Modbus frame, I could just type the hex bytes in a HA dashboard card and press the button. It's now documented as a feature, but it started as a debugging tool.

## Diagnostics

HA has a built-in diagnostics framework — implement `async_get_config_entry_diagnostics` and HA adds a **Download Diagnostics** button to the integration page automatically. The returned dict gets serialised to JSON.

I include bus stats (TX/RX counts, error rates), module states, and entity metadata in the diagnostics dump. When someone opens an issue, asking them to share their diagnostics JSON gives me almost everything I need to understand their setup.

## Testing

Integration testing against a real RS-485 bus from a CI environment is tricky. I solve this with a lightweight test harness: a Python script that simulates a Modbus RTU slave over a virtual serial port (`socat` creates a pty pair). Tests run against the fake device on every PR.

```bash
# In CI:
socat PTY,link=/tmp/ttyDMR0,rawer PTY,link=/tmp/ttyDMR1,rawer &
python tests/fake_modbus_slave.py --port /tmp/ttyDMR1 --address 1 &
pytest tests/integration/ --port /tmp/ttyDMR0
```

It's not perfect — it doesn't simulate RS-485 bus errors or timing jitter — but it catches regressions in the integration logic.

## What I'd do differently

The output naming step in the config flow generates one field per channel per module. With two modules of 8 channels each, that's 16 fields on one form. Workable, but not elegant. I'd like to split this into a per-module flow where you name one module at a time, like HA's own Zigbee integration does.

If you're building a HA integration and have questions about any of this, open a discussion on the repo. Happy to help.
