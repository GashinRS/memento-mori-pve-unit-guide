# Memento Mori PvE Unit Guide

This is a static guide site. The editable guide content lives in `content/`; the browser reads generated data from `data/generated-content.js`.

## Editing Units

Each unit has one Markdown file in a category folder under `content/units/`.

- Frontmatter controls metadata such as role, weapons, pairs, and teams.
- The unit category comes from its folder: `general`, `quest`, `tower`, or `mention`.
- The Markdown body becomes the unit description.
- Edit `content/unit-order.yaml` to control where units appear inside each category.
- Use `aliases` when an icon id should display as the same character name, such as `FiaLR5`.

Example:

`content/units/general/Sivi.md`

```md
---
id: Sivi
name: Sivi
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

`content/unit-order.yaml`

```yaml
general:
  - Sivi
  - XTropon1
  - XSol
```

## Editing Page Copy

Edit `content/site.yaml` for the header, WIP banner, assumptions, section labels, section notes, and footer.

Edit `content/unit-names.yaml` when a team or pair references an icon id that does not have its own guide entry.

Glossary terms also live in `content/site.yaml`. Terms and aliases are automatically linked when they appear in unit explanations.

Names of units that have guide entries are automatically linked when mentioned in another unit's explanation.

## Building Generated Data

After editing content, run:

```sh
node scripts/build-content.js
```

Then open `index.html` in a browser.
