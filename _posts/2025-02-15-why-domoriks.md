---
layout: post
title: "Why I Built Domoriks"
date: 2025-02-15
author: "Domoriks"
image: "https://picsum.photos/900/400?random=401"
tags: ["story", "hardware", "home-automation"]
---

I have a fairly standard Belgian semi-detached house, built in the 1970s. Standard wiring, standard distribution board, standard dumb switches on the walls.

When I decided to automate the lights, I spent a few weeks researching options. Most of them shared one or more of the following problems:

**Cloud dependency.** A surprising number of "smart" products are dumb hardware with a cloud relay. If the company decides to shut down, pivots their business model, or just has an outage, your lights stop working. I own my house. I want to own my home automation too.

**Replacing the switches.** Most smart switch solutions require replacing your existing switches with new "smart" ones. In Belgium, many people have built-in wall plates that are architecturally integrated — not something you want to rip out. And if you're renting, forget it.

**Complexity hidden in simplicity.** I tried a few "easy" solutions. They were easy until something went wrong, at which point the debugging surface was enormous — cloud, app, Wi-Fi, firmware, hub — and I had no visibility into any of it.

**Price.** Eight "smart" bulbs from a major brand, plus the hub, comes to a lot of money. For what is, functionally, some relays and a wireless radio.

## What I wanted

My requirements were simple:

1. Works entirely locally — no internet required
2. Existing wall switches continue to work physically, not just as "smart" devices
3. Lives inside my distribution cabinet, not on a wall somewhere
4. Standard HA entities — I can automate them the usual way
5. Open schematics and source — I can fix it myself in five years

RS-485 with Modbus RTU is the obvious answer. It's used in industrial automation for exactly this reason: simple, robust, long distances, no IP stack required. An STM32 with a handful of relays and a 485 transceiver is a very small, very understandable system.

## Building it

The first relay board took about two evenings in KiCad. Ordered prototypes from JLCPCB. Soldered them by hand. Wrote a minimal Modbus RTU slave implementation from scratch — it's maybe 400 lines of C.

The Home Assistant integration took longer. The existing Modbus integration in HA is powerful but complex to configure via YAML. I wanted something that felt native: UI setup, named entities, no `configuration.yaml` editing. Python, pymodbus, the config_flow API.

The result is Domoriks. It's in my own distribution board right now, has been running for several months, and has worked correctly every day since commissioning. My regular wall switches still click satisfyingly. The HA dashboard has a switch for each circuit. Automations work the same as with any other entity.

## What's next

The immediate plan is to tidy up the documentation, add the switch input module (for reading push buttons and toggle switches without the mains circuit involvement), and publish everything properly.

If you're building something similar — or want to adapt this for your own house — the repos are all public and the licence is MIT. Open an issue if you have questions.
