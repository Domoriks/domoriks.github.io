---
title: "Modbus Register Map"
description: "Complete Modbus RTU register map for all Domoriks module types."
icon: "📋"
permalink: /docs/modbus-registers/
prev_doc:
  title: "Building & Flashing Firmware"
  url: "/docs/firmware"
next_doc:
  title: "Configuration Tool"
  url: "/docs/configurator"
---

## Communication parameters

| Parameter | Default | Options |
|-----------|---------|---------|
| Baud rate | 9600 | 9600, 19200, 38400 |
| Data bits | 8 | Fixed |
| Parity | None | Fixed |
| Stop bits | 1 | Fixed |
| Mode | RTU | Fixed |
| Broadcast address | 255 | Read-only |

## Relay Module register map

### Coils — function codes FC01 (read), FC05 (write single), FC0F (write multiple)

Starting address 0x0001 (Modbus convention: coil 1 = address 0x0001).

| Coil | Address | Description |
|------|---------|-------------|
| Relay 1 | 0x0001 | 0 = de-energised (NO open), 1 = energised (NO closed) |
| Relay 2 | 0x0002 | |
| Relay 3 | 0x0003 | |
| Relay 4 | 0x0004 | |
| Relay 5 | 0x0005 | |
| Relay 6 | 0x0006 | |
| Relay 7 | 0x0007 | |
| Relay 8 | 0x0008 | |

### Holding registers — FC03 (read), FC06 (write single)

| Register | Address | R/W | Type | Description |
|----------|---------|-----|------|-------------|
| Firmware version | 0x0100 | R | UINT16 | High byte = major, low byte = minor |
| Modbus address | 0x0101 | R | UINT16 | Current address (read-back) |
| Baud rate | 0x0102 | R/W | UINT16 | 0=9600, 1=19200, 2=38400. Write triggers reboot. |
| HW revision | 0x0103 | R | UINT16 | Board hardware revision |
| Relay states (all) | 0x0110 | R | UINT16 | Bits 0–7 = relay 1–8 state (read-only mirror) |
| Uptime seconds | 0x0120 | R | UINT32 | Seconds since last boot (2 registers, MSW first) |

## Switch Module register map

### Discrete inputs — FC02 (read)

| Input | Address | Description |
|-------|---------|-------------|
| Switch 1 | 0x0001 | 0 = contact open, 1 = contact closed |
| Switch 2 | 0x0002 | |
| Switch 3 | 0x0003 | |
| Switch 4 | 0x0004 | |
| Switch 5 | 0x0005 | |
| Switch 6 | 0x0006 | |
| Switch 7 | 0x0007 | |
| Switch 8 | 0x0008 | |

### Holding registers — FC03 (read), FC06 (write single)

| Register | Address | R/W | Type | Description |
|----------|---------|-----|------|-------------|
| Firmware version | 0x0100 | R | UINT16 | |
| Modbus address | 0x0101 | R | UINT16 | |
| Baud rate | 0x0102 | R/W | UINT16 | 0=9600, 1=19200, 2=38400 |
| Input 1 debounce | 0x0110 | R/W | UINT16 | Debounce time in ms (default 20) |
| Input 2 debounce | 0x0111 | R/W | UINT16 | |
| Input 3 debounce | 0x0112 | R/W | UINT16 | |
| Input 4 debounce | 0x0113 | R/W | UINT16 | |
| Input 5 debounce | 0x0114 | R/W | UINT16 | |
| Input 6 debounce | 0x0115 | R/W | UINT16 | |
| Input 7 debounce | 0x0116 | R/W | UINT16 | |
| Input 8 debounce | 0x0117 | R/W | UINT16 | |
| Input states (all) | 0x0120 | R | UINT16 | Bits 0–7 = inputs 1–8 (read-only mirror) |

## Example raw Modbus frames

### Read relay 1 state (address=1)

Request:
```
01  01  00 01  00 01  FC 0A
│   │   │       │       └─ CRC
│   │   │       └───────── Quantity: 1 coil
│   │   └───────────────── Starting address: 0x0001
│   └───────────────────── Function code: 01 (read coils)
└───────────────────────── Slave address: 1
```

Response:
```
01  01  01  01  90 48
│   │   │   │   └─ CRC
│   │   │   └───── Coil value: 1 (energised)
│   │   └───────── Byte count: 1
│   └───────────── Function code: 01
└───────────────── Slave address: 1
```

### Set relay 1 ON (address=1)

Request:
```
01  05  00 01  FF 00  DC 0A
│   │   │       │       └─ CRC
│   │   │       └───────── Value: FF 00 = ON
│   │   └───────────────── Coil address: 0x0001
│   └───────────────────── Function code: 05 (write single coil)
└───────────────────────── Slave address: 1
```

### Set relay 1 OFF (address=1)

```
01  05  00 01  00 00  CD FA
```

(Same as above but value = 00 00 = OFF)

{% include callout.html type="tip" title="Raw command entity" content="In Home Assistant, use the raw command text entity and send button on the gateway device to send any Modbus frame directly from the HA UI — useful for testing and debugging." %}
