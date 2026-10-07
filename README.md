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
- Use `stage: early`, `stage: mid`, or `stage: end` to control the progression badge shown on limited PvE guide cards.
- Standard external Markdown links such as `[video](https://example.com)` are supported in unit explanations.

Example:

`content/units/general/Sivi.md`

```md
---
id: Sivi
name: Sivi
wiki: https://mememori.fandom.com/wiki/Sivi
role: Support
stage: mid
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

The shared weapon investment and progression information card is defined once in `scripts/shared-ui.js` and rendered on both unit guide pages.

## Adding YouTube Clears

All battle-clear links live in `content/youtube-clears.yaml`, rather than in individual unit files.

- Add a mapping under `teams` for a video that uses an exact five-unit guide lineup. Unit order does not matter.
- Rarity suffixes (`SR`, `UR`, `LR`, and variants such as `LR5`) are ignored when matching. For example, a displayed `MoineauLR` icon matches `Moineau` in this file.
- One mapping automatically supplies the link everywhere that lineup appears on either unit guide page.
- Add the lineup to a unit's `teams` frontmatter first when a useful clear does not yet match a displayed team.

```yaml
teams:
  - slots: [Mertillier, Sivi, Cordie, Merlyn, LunaLR]
    video: https://www.youtube.com/watch?v=example
```

## Additional Guide Pages

The base pool guide uses `base-pool.html`, `content/pages/base-pool.yaml`, `content/base-pool-units/`, and `content/base-pool-order.yaml`.
Base-pool team examples are defined in each unit's `teams` frontmatter and are not inferred from the limited guide.

Future long-form guides, such as a level 1 strategy guide, should get their own HTML page plus a matching file under `content/pages/`.

The PvE Notes page uses `concepts.html`, `content/pages/concepts.yaml`, `content/concepts/`, and `content/concepts-order.yaml`.

## Building Generated Data

After editing content, run:

```sh
node scripts/build-content.js
```

The build fetches the AA API character list, banner history, and active banners. Character IDs and rerun intervals are
maintained in `content/aa-character-map.yaml`; omit `rerunMonths` for the six-month default and use `rerunMonths: 12`
for annual seasonal reruns. The build fails if a guide unit is missing from the mapping or an API name/title no longer
matches, preventing silent mismatches when the upstream character list changes.

Rerun predictions use Invocation of Chance for appearances one through three and Invocation of the Stars' Guidance
from appearance four onward. When a prediction reaches or passes the current month, the estimate moves to the month in
which the earliest currently active banner in the appropriate pool ends.

The displayed "Last updated" date comes from the latest Git commit that is not marked `[keepalive]`. After 45 days
without a commit, a scheduled build creates an empty `[keepalive]` commit to prevent GitHub from disabling the schedule,
without changing the date shown on the guide.

Then open `index.html` in a browser.

## Editing the Gear Guide

Edit `content/gear/guide.md`, then run `node scripts/build-gear.js` (also included in the full content build). The page is `gear.html`; its contents navigation is generated from the Markdown headings. The supported syntax is headings, paragraphs, bold, italics, and ordered/unordered lists.

Place illustrations in `images/gear/` and insert each on its own line: `![Descriptive caption](images/gear/example.png)`. The caption also serves as alt text; images open at full size in a new tab when clicked. Separate blocks with blank lines.

### Adding equipment example cards

1. Copy `content/gear/cordie-example.json` to `content/gear/your-name-example.json`.
2. Edit `name`, `level`, `rarity`, `portrait`, `role`, and the overall `title`.
3. Set `defaultStep` to the initially visible step (0 is first, 1 is second).
4. Each entry in `steps` is a tab with a `label`, optional `title` and `note`, and six `pieces`. Omit `note` or set it to `""` to hide the note without leaving an empty paragraph. The changed-piece legend still appears on later tabs. Keep pieces in this order: Weapon, Helmet, Accessory, Body, Gloves, Boots. Each piece needs `slot`, `rarity`, `level`, `upgrade`, and `image`.
5. Save generated equipment images in `images/gear/`; use their filenames in `image`. The portrait uses a path from the site root, such as `images/gear/cordie-lr5-400.png`. Generate the level and upgrades into the images; changing JSON numbers only changes accessible descriptions, not image pixels.
6. Insert this on its own line in `content/gear/guide.md` wherever the card should appear:

```markdown
<!-- gear-example: your-name -->
```

7. Run `node scripts/build-gear.js`, then refresh `gear.html`.

One step creates a single setup; multiple steps create a progression. Cards can be repeated or placed anywhere in the guide. Outlines automatically indicate pieces whose data differs from the preceding step. The build checks step selection, slot order, upgrades, and missing image files.

Generate images using [Tama's equipment generator](https://tamamo.dev/GenerateEquipmentIcon) and [character generator](https://tamamo.dev/GenerateCharacterIcon). Keep the image settings and JSON metadata in sync.

### Two-unit examples

Copy `content/gear/cordie-merlyn-example.json` as a starting point. Each step has a `units` array containing one or two character objects; each character has its own `name`, `level`, `rarity`, `portrait`, `role`, and six `pieces`. Keep the same characters in the same order across steps. The shared tabs switch both units together. Desktop shows two units side by side; smaller screens stack them. Changed pieces use a single outline style. Existing single-unit files also remain supported.
`title` is optional on both the example and each step. Omit it or set it to an empty string to hide that heading; no empty heading space is rendered.

### Renaming examples and preserving shared links

Rename `cordie-example.json` to, for example, `low-level-lr-example.json`, then change its Markdown marker from `<!-- gear-example: cordie -->` to `<!-- gear-example: low-level-lr -->`. Run `node scripts/build-gear.js`. Follow the same procedure for `cordie-merlyn-example.json`. Image filenames do not need changing.

Keep the JSON `shareId` unchanged when renaming a file: shared links use this stable identifier, independently of the filename. Each example needs a unique shareId. Examples appear as subsections in the table of contents. Click an example and copy the address-bar URL to share it. The label uses `tocTitle` if provided, otherwise the card title; `tocTitle` lets a card without a visible title still have a descriptive contents entry. Existing links with a ~step suffix remain supported. Copy links from the published site when sharing with other people.

`support-sr-example.json` is another two-unit template. All changed equipment uses the same outline style.
