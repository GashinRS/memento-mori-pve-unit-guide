# Memento Mori PvE Unit Guide

This is a static guide site. The editable guide content lives in `content/`; the browser reads generated data from `data/generated-content.js`.

## Editing Units

Each unit has one Markdown file in a category folder under `content/units/`.

- Frontmatter controls metadata such as role, weapons, pairs, teams, and speed tuning.
- `speed` renders a compact tuning label. Add `speedNote` only for a meaningful exception or interaction.
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
speed: before-dps
speedNote: Main DPS should be the slowest ally for the cooldown reduction.
teams:
  - label:
    slots: [Mertillier, Sivi, Cordie, Merlyn, LunaLR]
---

Write the unit explanation here.
```

Supported speed values are `before-dps`, `before-enemies`, `before-target`, `first`, `prefer-slow`, `none`,
`usually-none`, `role-dependent`, `team-dependent`, `situational`, and `dps-among-slowest`.

`content/unit-order.yaml`

```yaml
general:
  - Sivi
  - XTropon1
  - XSol
```

## Editing Page Copy

Edit `content/site.yaml` for the header, WIP banner, assumptions, section labels, section notes, and footer.
It references `schemas/site.schema.json`, which provides project-specific validation and autocomplete in supporting editors.

Edit `content/unit-names.yaml` when a team or pair references an icon id that does not have its own guide entry.

Glossary terms also live in `content/site.yaml`. Terms and aliases are automatically linked when they appear in unit explanations.

Names of units that have guide entries are automatically linked when mentioned in another unit's explanation.

## Additional Guide Pages

The base pool guide uses `base-pool.html`, `content/pages/base-pool.yaml`, `content/base-pool-units/`, and `content/base-pool-order.yaml`.

Future long-form guides, such as a level 1 strategy guide, should get their own HTML page plus a matching file under `content/pages/`.

The PvE concepts page uses `concepts.html`, `content/pages/concepts.yaml`, `content/concepts/`, and `content/concepts-order.yaml`.

## Building Generated Data

After editing content, run:

```sh
node scripts/build-content.js
```

The build fetches the AA API character list, banner history, and active banners. Character IDs and rerun intervals are
maintained in `content/aa-character-map.yaml`; omit `rerunMonths` for the six-month default and use `rerunMonths: 12`
for annual seasonal reruns. The build fails if a guide unit is missing from the mapping or an API name/title no longer
matches, preventing silent mismatches when the upstream character list changes.

The displayed "Last updated" date comes from the latest Git commit, so scheduled builds do not change it unless the
guide itself has been committed again.

Then open `index.html` in a browser.
