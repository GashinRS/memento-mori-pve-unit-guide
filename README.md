# Memento Mori PvE Unit Guide

This is a static guide site. The editable guide content lives in `content/`; the browser reads generated data from `data/generated-content.js`.

## Editing Units

Each unit has one Markdown file in `content/units/`.

- Frontmatter controls metadata such as category, role, weapons, pairs, and teams.
- The Markdown body becomes the unit description.
- Use `order` to control where a unit appears inside its category.
- Use `aliases` when an icon id should display as the same character name, such as `FiaLR5`.

Example:

```md
---
id: Sivi
name: Sivi
category: general
order: 1
role: Support
weapons:
  - level: SiviUR
    tier: recommended
    description: todo
pairs:
  - id: Cordie
    badge: dps
teams:
  - label:
    slots: [Mertillier, Sivi, Cordie, Merlyn, LunaLR]
---

Write the unit explanation here.

**Speed Tuning —** Add speed notes here.
```

## Editing Page Copy

Edit `content/site.yaml` for the header, WIP banner, assumptions, section labels, section notes, and footer.

Edit `content/unit-names.yaml` when a team or pair references an icon id that does not have its own guide entry.

## Building Generated Data

After editing content, run:

```sh
node scripts/build-content.js
```

Then open `index.html` in a browser.
