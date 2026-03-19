---
title: "Changelog"
description: "Version history for Domoriks hardware, firmware, and software."
icon: "📅"
permalink: /docs/changelog/
prev_doc:
  title: "Automations"
  url: "/docs/ha-automations"
next_doc:
  title: "Contributing"
  url: "/docs/contributing"
---

## HA Integration

### v1.0.0 — 2025-03-01 — Initial release

- UI-only setup flow: serial port selection, baud rate, module discovery, output naming
- Switch entities for every relay output channel
- Binary sensor entities for every switch input channel
- Gateway device with `last_rx`, `last_tx`, `bus_status` sensors
- Raw command `text` and `button` entities on gateway device
- `domoriks.send_raw_command` service for automations
- Per-output name and icon configuration during setup
- Duplicate prevention per serial port
- Diagnostics download per config entry
- HACS compatible (`hacs.json` included)
- Python 3.11 / Home Assistant 2024.1+
- Dependency: `pymodbus 3.x`

---

## Relay Module Firmware

### v1.0.0 — 2025-03-01 — Initial release

- Modbus RTU slave, 9600/19200/38400 baud
- FC01 read coils, FC05 write single coil, FC0F write multiple coils
- FC03 read holding registers, FC06 write single register
- Address and baud rate writable via FC06, saved to Flash on write
- Power-on state: all relays de-energised
- IWDG watchdog (5s timeout, configurable)
- Debug UART on USART2 at 115200 baud
- Targets STM32G030F6P6

---

## Switch Module Firmware

### v1.0.0 — 2025-03-01 — Initial release

- Modbus RTU slave, 9600/19200/38400 baud
- FC02 read discrete inputs
- FC03 read holding registers, FC06 write single register
- Configurable per-channel debounce (0–1000 ms, default 20 ms)
- Power-on: reports current switch states immediately
- Optocoupler input, active-low
- Targets STM32G030F6P6

---

## DIN Relay Module Hardware

### v1.0 — 2025-02-01 — Initial release

- 4 DIN units, 72 × 90 mm PCB
- 8× SPDT relay (Songle SRD-05VDC or Omron G5LE-1)
- STM32G030F6P6 MCU
- SN65HVD3082E RS-485 transceiver
- 24V input, onboard 24→5V DC/DC
- TVS protection on RS-485
- Reverse polarity protection on 24V
- 8-position DIP switch for address
- KiCad 7 source files

---

## Compact Switch Module Hardware

### v1.0 — 2025-02-01 — Initial release

- 2 DIN units, 36 × 90 mm PCB
- 8× optocoupled dry-contact input (PC817)
- STM32G030F6P6 MCU
- SN65HVD3082E RS-485 transceiver
- 24V input, onboard 24→3.3V DC/DC
- 8-position DIP switch for address
- KiCad 7 source files

---

## Configurator

### v0.9.0 — 2025-03-01 — Beta release

- Bus scan (full 1–247 and quick 1–32)
- Module discovery with type and firmware version detection
- Address assignment via FC06 register write
- Output and input labelling with MDI icon support
- JSON configuration file save/load
- HA bundle export
- PySide6 (Qt6) GUI
- Cross-platform: Linux, macOS, Windows
- Firmware flash via Modbus bootloader (in progress)
