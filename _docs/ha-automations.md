---
title: "Automations"
description: "Example Home Assistant automations using Domoriks switch inputs and relay outputs."
icon: "⚙️"
permalink: /docs/ha-automations/
prev_doc:
  title: "Entities Reference"
  url: "/docs/ha-entities"
next_doc:
  title: "Changelog"
  url: "/docs/changelog"
---

## Overview

The Domoriks integration creates standard HA entities — `switch` for relay outputs and `binary_sensor` for switch inputs. Automations work exactly like any other HA automation: use the visual automation editor or write YAML directly.

## Basic: wall switch controls light

The most common use case — a wall switch input triggering a relay output:

```yaml
alias: "Hallway Switch → Hallway Light"
description: "Toggle hallway light when switch is pressed"
trigger:
  - platform: state
    entity_id: binary_sensor.hallway_switch
    to: "on"
action:
  - service: switch.toggle
    target:
      entity_id: switch.hallway_ceiling_light
mode: single
```

## Push button: momentary press toggles light

For momentary push buttons, trigger on the rising edge (`off` → `on`):

```yaml
alias: "Kitchen Button → Kitchen Lights"
trigger:
  - platform: state
    entity_id: binary_sensor.kitchen_button
    from: "off"
    to: "on"
action:
  - service: switch.toggle
    target:
      entity_id: switch.kitchen_main_light
```

## Long press: different action

Detect a long press (held for > 1 second) vs a short press:

```yaml
alias: "Living Room Button — Long Press → All Off"
trigger:
  - platform: state
    entity_id: binary_sensor.living_room_button
    to: "on"
    for:
      seconds: 1
action:
  - service: switch.turn_off
    target:
      entity_id:
        - switch.living_room_main_light
        - switch.living_room_spots
        - switch.living_room_floor_lamp
```

## Scene: one button activates a scene

```yaml
alias: "Movie Button → Movie Scene"
trigger:
  - platform: state
    entity_id: binary_sensor.lounge_scene_button
    to: "on"
action:
  - service: scene.turn_on
    target:
      entity_id: scene.movie_mode
```

## Time-based: turn off lights at midnight

```yaml
alias: "Midnight → All Ground Floor Lights Off"
trigger:
  - platform: time
    at: "00:00:00"
action:
  - service: switch.turn_off
    target:
      entity_id:
        - switch.living_room_main_light
        - switch.hallway_ceiling_light
        - switch.kitchen_main_light
```

## Conditional: staircase timer

Turn on staircase light when switch pressed, turn off after 3 minutes:

```yaml
alias: "Staircase Light Timer"
trigger:
  - platform: state
    entity_id: binary_sensor.staircase_button
    to: "on"
action:
  - service: switch.turn_on
    target:
      entity_id: switch.staircase_light
  - delay:
      minutes: 3
  - service: switch.turn_off
    target:
      entity_id: switch.staircase_light
mode: restart   # restart timer if button pressed again
```

## Raw command in automation

Use the `domoriks.send_raw_command` service for operations not covered by standard entities:

```yaml
alias: "All Relays Off — Raw Command"
trigger:
  - platform: state
    entity_id: input_boolean.away_mode
    to: "on"
action:
  - service: domoriks.send_raw_command
    data:
      entry_id: "your_config_entry_id_here"
      command: "01 0F 00 01 00 08 01 00"
      # FC0F: write 8 coils starting at 0x0001, all OFF
```

## Bus health monitoring

Alert when the bus enters an error state:

```yaml
alias: "Domoriks Bus Error Alert"
trigger:
  - platform: state
    entity_id: sensor.domoriks_ttyusb0_bus_status
    to: "error"
    for:
      seconds: 10
action:
  - service: notify.mobile_app_phone
    data:
      title: "Domoriks Bus Error"
      message: "RS-485 bus on /dev/ttyUSB0 is reporting errors. Check wiring."
```

{% include callout.html type="tip" title="Automation editor" content="All of the above can be built using the Home Assistant visual automation editor — you do not need to write YAML by hand. The YAML here is shown for clarity and for use in automation.yaml if preferred." %}
