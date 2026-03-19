---
title: "Contributing"
description: "How to contribute to Domoriks hardware, firmware, software, and documentation."
icon: "🤝"
permalink: /docs/contributing/
prev_doc:
  title: "Changelog"
  url: "/docs/changelog"
---

## Welcome

Domoriks is a community project. All contributions — hardware improvements, firmware fixes, integration features, documentation corrections, or just sharing your installation — are welcome.

## Repositories

| Repository | Language | What's in it |
|-----------|----------|-------------|
| [domoriks/din-relay-module](https://github.com/domoriks/din-relay-module) | KiCad / C | Relay module hardware + firmware |
| [domoriks/switch-module](https://github.com/domoriks/switch-module) | KiCad / C | Switch module hardware + firmware |
| [domoriks/ha-integration](https://github.com/domoriks/ha-integration) | Python | Home Assistant integration |
| [domoriks/configurator](https://github.com/domoriks/configurator) | Python / Qt | Desktop configurator |
| [domoriks/domoriks.github.io](https://github.com/domoriks/domoriks.github.io) | Jekyll | This website |

## How to contribute

### Reporting bugs

Open an issue in the relevant repository. Include:

- What you were doing
- What you expected to happen
- What actually happened
- Relevant logs (HA logs, debug UART output, Configurator logs)
- Hardware version and firmware version

### Feature requests

Open an issue with the label `enhancement`. Describe the use case, not just the feature — this helps us understand the context and find the best implementation.

### Code contributions

1. **Fork** the repository
2. **Create a branch** — use a descriptive name: `fix/modbus-timeout`, `feat/firmware-update-via-modbus`
3. **Make your changes** — small, focused PRs are easier to review than large ones
4. **Test your changes** — for firmware: bench test on hardware; for HA: test with a real bus or the included test harness
5. **Open a PR** against the `main` branch

### Hardware contributions

If you have PCB improvements (component substitutions, layout optimisations, new module designs):

- Export clean Gerber files and update the BOM
- Provide a KiCad DRC clean project (no errors)
- Document the change in the PR description

### Documentation

The website source is in [domoriks/domoriks.github.io](https://github.com/domoriks/domoriks.github.io). Documentation is in `_docs/` as Markdown files. Corrections, clarifications, and new pages are all welcome.

## Code style

### Python (HA integration, Configurator)

- Black formatter (`black .`)
- Ruff linter (`ruff check .`)
- Type hints on public functions
- Docstrings on classes and public methods

```bash
pip install black ruff
black .
ruff check .
```

### C (firmware)

- `clang-format` with the project's `.clang-format` file
- No dynamic memory allocation (no `malloc`)
- All functions documented with Doxygen comments

```bash
clang-format -i src/*.c src/*.h
```

### KiCad (hardware)

- Run ERC and DRC with zero errors before submitting
- Use standard footprints from the KiCad library where possible
- Include LCSC part numbers in the BOM for all components

## Licence

All Domoriks projects are MIT licensed. By contributing you agree that your contribution will be released under the same licence.

{% include callout.html type="tip" title="First contribution?" content="Look for issues labelled 'good first issue' — these are scoped to be achievable without deep knowledge of the full codebase." %}
