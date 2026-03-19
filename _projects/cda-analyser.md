---
title: "CdA Analyser"
description: "Python application for analysing aerodynamic drag (CdA) from .fit cycling files. Processes ride data to calculate and visualise CdA, providing actionable insights into aerodynamic performance."
image: "https://picsum.photos/800/400?random=306"
tags: ["Python", "Cycling", "Data Analysis"]
github: "https://github.com/domoriks/cda-analyser"
demo: ""
docs: ""
stars: ""
language: "Python"
license: "MIT"
version: "1.0.0"
---

## Overview

CdA Analyser is a Python-based desktop application for cyclists and aerodynamicists who want to extract CdA (aerodynamic drag coefficient × frontal area) values from `.fit` file ride data.

It processes power, speed, elevation, and wind data from a structured test ride and outputs CdA calculations alongside visualisations to help understand where drag is coming from.

{% include callout.html type="note" title="Screenshots" content="Placeholder — add application screenshots here." %}

## What is CdA?

CdA (drag coefficient × frontal area, in m²) is the primary metric for quantifying how aerodynamic a cyclist is. A lower CdA means less energy wasted overcoming air resistance at a given speed.

CdA can be estimated from field tests by measuring power output and speed under controlled conditions and solving the equation of motion:

```
P_aero = CdA × ρ/2 × (v + v_wind)² × v
P_total = P_aero + P_rolling + P_gravity + P_drivetrain
```

## Features

- **`.fit` file import** — reads Garmin/Wahoo `.fit` files directly
- **CdA calculation** — solves for CdA using the virtual elevation method or direct power-speed method
- **Lap-based analysis** — calculate CdA per test lap for back-to-back position comparisons
- **Environmental correction** — account for air density (altitude, temperature, humidity)
- **Rolling resistance estimation** — Crr estimation from coasting segments
- **Visualisations** — CdA vs. time, virtual vs. GPS elevation overlay, power/speed traces
- **CSV export** — export per-lap CdA results for spreadsheet analysis
- **Configurable** — set rider+bike mass, wheel circumference, drivetrain efficiency

## Supported test protocols

- **Flat constant-speed laps** — classic velodrome or flat course protocol
- **Virtual elevation (Chung method)** — any course, using GPS altitude cross-reference
- **Ramp test sections** — isolate specific segments of a ride

## Installation

```bash
pip install cda-analyser
cda-analyser
```

Or from source:

```bash
git clone https://github.com/domoriks/cda-analyser
cd cda-analyser
pip install -r requirements.txt
python -m cda_analyser
```

## Quick example

```python
from cda_analyser import FitRide, CdACalculator

ride = FitRide.load("my_aerotest.fit")
calc = CdACalculator(ride, mass_kg=72.5, crr=0.004)

for lap in calc.laps():
    print(f"Lap {lap.number}: CdA = {lap.cda:.4f} m²")
```

## Requirements

- Python 3.11+
- fitparse
- numpy, scipy
- matplotlib or plotly
- PySide6 (optional, for GUI)
