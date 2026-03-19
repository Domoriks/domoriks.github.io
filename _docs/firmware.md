---
title: "Building & Flashing Firmware"
description: "How to build the Domoriks module firmware from source and flash it to a board."
icon: "💾"
permalink: /docs/firmware/
prev_doc:
  title: "PCB Fabrication"
  url: "/docs/pcb-fabrication"
next_doc:
  title: "Modbus Register Map"
  url: "/docs/modbus-registers"
---

## Overview

The firmware for both relay and switch modules is written in C, targeting the STM32G030F6 microcontroller. It is built with the ARM GCC toolchain and uses the STM32 HAL library. CMake is used as the build system.

The firmware:
- Implements Modbus RTU slave protocol over USART (RS-485)
- Manages relay outputs or reads switch inputs
- Stores configuration (address, baud rate) in EEPROM emulation (Flash)
- Supports in-field firmware update via Modbus or SWD

## Prerequisites

```bash
# Ubuntu / Debian
sudo apt install cmake ninja-build gcc-arm-none-eabi binutils-arm-none-eabi

# macOS (Homebrew)
brew install cmake ninja arm-none-eabi-gcc

# Windows
# Install ARM GCC from developer.arm.com
# Install CMake from cmake.org
# Install Ninja from github.com/ninja-build/ninja/releases
```

Verify:
```bash
arm-none-eabi-gcc --version
# arm-none-eabi-gcc 12.x.x
cmake --version
# cmake version 3.x
```

## Clone the repository

```bash
git clone https://github.com/domoriks/din-relay-module
cd din-relay-module/firmware
```

For the switch module:
```bash
git clone https://github.com/domoriks/switch-module
cd switch-module/firmware
```

## Build

```bash
mkdir build && cd build
cmake .. -G Ninja -DCMAKE_BUILD_TYPE=Release
ninja
```

Output files in `build/`:
```
domoriks-relay.elf      # ELF binary (for debugging)
domoriks-relay.hex      # Intel HEX (for flashing)
domoriks-relay.bin      # Raw binary
```

## Flash via ST-Link (SWD)

An **ST-Link V2** is the easiest flashing tool. Cheap clones (< €5) work fine.

### Using OpenOCD

```bash
# Install OpenOCD
sudo apt install openocd   # Ubuntu
brew install open-ocd      # macOS

# Flash
openocd \
  -f interface/stlink.cfg \
  -f target/stm32g0x.cfg \
  -c "program build/domoriks-relay.hex verify reset exit"
```

### Using STM32CubeProgrammer (GUI)

1. Download STM32CubeProgrammer from STMicroelectronics
2. Connect ST-Link to the SWD header on the PCB (SWDIO, SWDCLK, GND, optionally 3.3V)
3. Open the `.hex` file and click **Download**

### SWD header pinout

```
Pin 1  SWDIO
Pin 2  SWDCLK
Pin 3  GND
Pin 4  3.3V (optional — board can be self-powered via 24V)
Pin 5  NRST (optional)
```

{% include callout.html type="tip" title="Power during flashing" content="You can power the board via the SWD header's 3.3V pin (max 100mA from ST-Link) or by applying 24V to the normal power terminals. The relays will not energise at 3.3V only — that's normal." %}

## Firmware configuration

Before building, edit `firmware/config.h` to set defaults:

```c
#define DEFAULT_MODBUS_ADDRESS   1       // 1–247
#define DEFAULT_BAUD_RATE        9600    // 9600, 19200, 38400
#define RELAY_DEFAULT_STATE      0       // 0 = all off on boot
#define WATCHDOG_TIMEOUT_MS      5000    // 0 = disable
```

These are compile-time defaults. The Modbus address and baud rate can be changed at runtime via Holding Register writes (and are then saved to Flash).

## Over-the-air update via Modbus (planned)

A Modbus-based firmware update mechanism (writing firmware pages via FC16 to a reserved register block) is planned for a future firmware release. For now, SWD is required.

## Debug output

USART2 on the STM32G030 outputs debug logs at 115200 baud on the debug connector (separate from the RS-485 bus USART1). Connect a USB-serial adapter to read logs:

```bash
picocom -b 115200 /dev/ttyUSB1
```

Log output format:
```
[BOOT] Domoriks Relay v1.0.0 addr=1 baud=9600
[MB] RX: 01 01 00 01 00 08 3C 09
[MB] TX: 01 01 01 00 51 88
[RELAY] ch=1 state=1
```

## Continuous integration

The firmware repository uses GitHub Actions to build on every push:

```yaml
# .github/workflows/firmware.yml
- uses: carlosperate/arm-none-eabi-gcc-action@v1
- run: cmake .. -G Ninja && ninja
- run: arm-none-eabi-size domoriks-relay.elf
```

This ensures the firmware always builds cleanly and reports binary size.
