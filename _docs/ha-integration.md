---
title: "Integration Setup"
description: "Installing and configuring the Domoriks Home Assistant integration step by step."
icon: "🏠"
permalink: /docs/ha-integration/
prev_doc:
  title: "Configuration Tool"
  url: "/docs/configurator"
next_doc:
  title: "Entities Reference"
  url: "/docs/ha-entities"
---

## Requirements

- Home Assistant Core, OS, or Supervised — version **2024.1 or later**
- A USB-to-RS485 adapter connected to the HA host
- One or more Domoriks modules wired and powered on the RS-485 bus
- The serial port must be accessible to Home Assistant (USB adapters are usually auto-detected)

## Installation

### Via HACS (recommended)

1. Open HACS in your Home Assistant instance
2. Go to **Integrations → ⋮ → Custom repositories**
3. Add repository URL: `https://github.com/domoriks/ha-integration`
4. Set category to **Integration** and click **Add**
5. Find **Domoriks** in the HACS integration list and click **Download**
6. **Restart Home Assistant**

### Manual installation

```bash
# SSH into your HA host, or use the Terminal add-on
cd /config
mkdir -p custom_components/domoriks
# Copy files from the repository
cp -r /path/to/ha-integration/custom_components/domoriks/* \
      custom_components/domoriks/
```

Restart Home Assistant.

## Adding the integration

1. Navigate to **Settings → Devices & Services**
2. Click **Add Integration** (bottom right)
3. Search for **Domoriks** and select it

### Setup step 1 — Serial port

Select your USB-RS485 adapter from the dropdown. The list shows all detected serial ports on the HA host. Common device names:

| Platform | Typical path |
|----------|-------------|
| HA OS / Supervised (USB) | `/dev/ttyUSB0`, `/dev/ttyUSB1` |
| HA OS (built-in UART) | `/dev/ttyAMA0` |
| Home Assistant Yellow | `/dev/ttyAMA1` |
| Docker (USB passed through) | `/dev/ttyUSB0` |

Set the **baud rate** to match your modules (default: 9600).

Click **Submit**.

### Setup step 2 — Module discovery

The integration scans the bus. This takes 5–30 seconds depending on the number of modules. When complete, a list of discovered modules is shown:

```
✓ Relay Module   address=1  firmware=1.0.0   8 outputs
✓ Switch Module  address=3  firmware=1.0.0   8 inputs
```

If a module is missing, check wiring and power, then click **Rescan**.

### Setup step 3 — Name your outputs and inputs

For each relay output and switch input, enter:

- **Name** — appears as the entity name in HA
- **Icon** — MDI icon code (optional, e.g. `mdi:ceiling-light`)

If you have a Configurator JSON file, click **Import from JSON** to populate all fields automatically.

### Setup step 4 — Finish

Click **Finish**. The integration creates:

- One HA device per module
- One gateway device for bus diagnostics
- Switch entities for each relay output
- Binary sensor entities for each switch input

## Updating module configuration

To rename outputs or change icons after setup:

1. Settings → Devices & Services → Domoriks
2. Click **Configure** on the config entry
3. Edit names and icons
4. Click **Save**

## Multiple serial ports

You can add the Domoriks integration more than once — once per serial port / physical RS-485 bus. This is useful if you have a large installation split across multiple cable runs.

Each config entry is independent. Duplicate prevention operates per port: you cannot add the same `/dev/ttyUSB0` twice.

## Removing the integration

Settings → Devices & Services → Domoriks → **Delete**. All entities and devices are removed. Configuration is deleted from HA. The modules on the bus are unaffected.

{% include callout.html type="tip" title="Backup first" content="Before removing the integration, export diagnostics and save your entity names somewhere — they will need to be re-entered if you add the integration again." %}
