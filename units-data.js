/**
 * units-data.js — Memento Mori PvE Pull Guide
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS IS THE ONLY FILE YOU NEED TO EDIT to add or update units.
 * The HTML file reads this and builds all cards automatically.
 *
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * FIELD REFERENCE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * id        {string}   Drives all icon paths automatically:
 *                        Unit portrait  → icons/units/{id}.png
 *                        Pair icons     → icons/units/{pair.id}.png
 *                        Team slot icons→ icons/units/{id}.png
 *
 * name      {string}   Display name on the card header.
 *
 * role      {string}   Short subtitle, e.g. "Healer · Buffer". Free text.
 *
 * weapons   {Array}    List of weapon objects, one per weapon level that matters.
 *                      Leave as an empty array [] if the unit needs no weapons.
 *                      Each weapon object has:
 *
 *   .level  {string}   The weapon level label shown in the tooltip on hover,
 *                      e.g. "W1", "W240", "Wmax". Also used to build the icon
 *                      path: icons/weapons/{level}.png
 *                      Use whatever filenames match your actual icon files.
 *
 *   .tier   {string}   How important this specific weapon level is.
 *                      One of three values:
 *
 *                      "optional"      — Nice to have, not needed to function.
 *                                        Rendered dimmed/faded.
 *
 *                      "recommended"   — Noticeably stronger with it, but the
 *                                        unit still works without. Rendered
 *                                        normally with a subtle warm border.
 *
 *                      "required"      — Unit is significantly weaker or
 *                                        broken without this. Rendered with a
 *                                        colored glow border.
 *
 *                      EXAMPLE — unit needs W240 to function, Wmax is a big
 *                      upgrade but not essential:
 *                        weapons: [
 *                          { level: "W240", tier: "required"    },
 *                          { level: "Wmax", tier: "recommended" },
 *                        ]
 *
 *                      EXAMPLE — unit is fine at 0 weapons but scales well:
 *                        weapons: [
 *                          { level: "W1",   tier: "optional"    },
 *                          { level: "W240", tier: "recommended" },
 *                        ]
 *
 *                      EXAMPLE — unit needs nothing:
 *                        weapons: []
 *
 * pairs     {Array}    Units shown in the "Pairs Well With" row.
 *                      Hovering an icon shows the unit name as a tooltip.
 *   .id     {string}   Icon path → icons/units/{id}.png
 *   .name   {string}   Shown in the hover tooltip.
 *   .badge  {string}   "dps" | "support" | "required"
 *
 * teams     {Array}    Each entry = one suggested team (array of 5 objects).
 *                      The FIRST slot is always the featured unit (accented border).
 *                      Hovering any slot shows the unit name.
 *   Each slot object:
 *   .id     {string}   Icon path → icons/units/{id}.png
 *   .name   {string}   Shown in the hover tooltip.
 *
 * desc      {string}   HTML string. Write freely with template literals (backticks).
 *                      <strong>text</strong> → dark bold emphasis
 *                      <em>text</em>         → sepia italic highlight
 */

const UNITS = {

    /* ═══════════════════════════════════════════════════════════════════════
       GENERALLY USEFUL — valuable across most PvE content
    ═══════════════════════════════════════════════════════════════════════ */
    general: GENERAL_UNITS,


    /* ═══════════════════════════════════════════════════════════════════════
       MAIN QUEST ONLY — strong in story/auto-battle, weaker elsewhere
    ═══════════════════════════════════════════════════════════════════════ */
    quest: QUEST_UNITS,


    /* ═══════════════════════════════════════════════════════════════════════
       TOWER ONLY — specialist picks for the infinite tower
    ═══════════════════════════════════════════════════════════════════════ */
    tower: TOWER_UNITS,


    /* ═══════════════════════════════════════════════════════════════════════
       HONORABLE MENTIONS — niche, situational, or budget picks
    ═══════════════════════════════════════════════════════════════════════ */
    mention: HONORABLE_MENTIONS

};
