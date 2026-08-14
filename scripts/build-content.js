const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const contentDir = path.join(root, "content");
const unitsDir = path.join(contentDir, "units");
const basePoolUnitsDir = path.join(contentDir, "base-pool-units");
const conceptsDir = path.join(contentDir, "concepts");
const outputPath = path.join(root, "data", "generated-content.js");
const aaCharacterMapPath = path.join(contentDir, "aa-character-map.yaml");

function latestCommitDate() {
    const value = execFileSync("git", ["log", "-1", "--format=%cs"], {
        cwd: root,
        encoding: "utf8",
    }).trim();
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) {
        throw new Error(`Could not read the latest Git commit date: "${value}"`);
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))));
}
const AA_API_BASE = "https://api.aabot.dev";

const CATEGORY_KEYS = ["general", "quest", "tower", "mention"];
const CATEGORY_VARIABLES = {
    general: "GENERAL_UNITS",
    quest: "QUEST_UNITS",
    tower: "TOWER_UNITS",
    mention: "HONORABLE_MENTIONS",
};
const SPEED_VALUES = new Set([
    "before-dps",
    "before-enemies",
    "before-target",
    "first",
    "prefer-slow",
    "none",
    "usually-none",
    "role-dependent",
    "team-dependent",
    "situational",
    "dps-among-slowest",
]);
const CONTAINER_KEYS = new Set([
    "aliases",
    "assumptions",
    "cards",
    "footer",
    "header",
    "items",
    "pairs",
    "intro",
    "sections",
    "teams",
    "weapons",
    "wip",
    "units",
    "concepts",
    "general",
    "glossary",
    "terms",
    "quest",
    "tower",
    "mention",
]);

function parseScalar(value) {
    const trimmed = value.trim();
    if (trimmed === "") return null;
    if (trimmed === "true") return true;
    if (trimmed === "false") return false;
    if (trimmed === "null") return null;
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        const inner = trimmed.slice(1, -1).trim();
        if (!inner) return [];
        return inner.split(",").map((item) => parseScalar(item.trim()));
    }
    if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
        return trimmed.slice(1, -1);
    }
    return trimmed;
}

function countIndent(line) {
    return line.match(/^ */)[0].length;
}

function parseYaml(source) {
    const lines = source.replace(/\r\n/g, "\n").split("\n");
    const rootObject = {};
    const stack = [{ indent: -1, value: rootObject }];

    function parentFor(indent) {
        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
            stack.pop();
        }
        return stack[stack.length - 1].value;
    }

    for (let index = 0; index < lines.length; index += 1) {
        const raw = lines[index];
        if (!raw.trim() || raw.trim().startsWith("#")) continue;

        const indent = countIndent(raw);
        const line = raw.trim();
        const parent = parentFor(indent);

        if (line.startsWith("- ")) {
            if (!Array.isArray(parent)) {
                throw new Error(`Invalid YAML list item near: ${raw}`);
            }

            const itemText = line.slice(2);
            if (!itemText) {
                const item = {};
                parent.push(item);
                stack.push({ indent, value: item });
                continue;
            }

            const colonIndex = itemText.indexOf(":");
            if (colonIndex === -1) {
                parent.push(parseScalar(itemText));
                continue;
            }

            const key = itemText.slice(0, colonIndex).trim();
            const valueText = itemText.slice(colonIndex + 1).trim();
            const item = {};
            parent.push(item);
            stack.push({ indent, value: item });

            if (valueText === "") {
                if (!CONTAINER_KEYS.has(key)) {
                    item[key] = null;
                    continue;
                }
                const nextLine = lines[index + 1] || "";
                const nextTrimmed = nextLine.trim();
                item[key] = nextTrimmed.startsWith("- ") ? [] : {};
                stack.push({ indent: indent + 2, value: item[key] });
            } else if (valueText === "|") {
                const block = [];
                while (
                    index + 1 < lines.length &&
                    (lines[index + 1].trim() === "" || countIndent(lines[index + 1]) > indent)
                ) {
                    index += 1;
                    block.push(lines[index].trim() === "" ? "" : lines[index].slice(indent + 2));
                }
                item[key] = block.join("\n").replace(/\n+$/, "");
            } else {
                item[key] = parseScalar(valueText);
            }
            continue;
        }

        const colonIndex = line.indexOf(":");
        if (colonIndex === -1 || Array.isArray(parent)) {
            throw new Error(`Invalid YAML entry near: ${raw}`);
        }

        const key = line.slice(0, colonIndex).trim();
        const valueText = line.slice(colonIndex + 1).trim();

        if (valueText === "") {
            if (!CONTAINER_KEYS.has(key)) {
                parent[key] = null;
                continue;
            }
            const nextLine = lines[index + 1] || "";
            const nextTrimmed = nextLine.trim();
            parent[key] = nextTrimmed.startsWith("- ") ? [] : {};
            stack.push({ indent, value: parent[key] });
        } else if (valueText === "|") {
            const block = [];
            while (
                index + 1 < lines.length &&
                (lines[index + 1].trim() === "" || countIndent(lines[index + 1]) > indent)
            ) {
                index += 1;
                block.push(lines[index].trim() === "" ? "" : lines[index].slice(indent + 2));
            }
            parent[key] = block.join("\n").replace(/\n+$/, "");
        } else {
            parent[key] = parseScalar(valueText);
        }
    }

    return rootObject;
}

function parseFrontmatter(source, filePath) {
    const normalized = source.replace(/\r\n/g, "\n");
    if (!normalized.startsWith("---\n")) {
        throw new Error(`${filePath} is missing YAML frontmatter`);
    }

    const end = normalized.indexOf("\n---", 4);
    if (end === -1) {
        throw new Error(`${filePath} has unterminated YAML frontmatter`);
    }

    return {
        data: parseYaml(normalized.slice(4, end)),
        body: normalized.slice(end + 4).trim(),
    };
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function applyInlineMarkdown(value) {
    return escapeHtml(value)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function markdownToHtml(markdown) {
    const blocks = markdown.replace(/\r\n/g, "\n").split(/\n{2,}/);

    return blocks
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => {
            if (block.startsWith("<")) return block;
            const heading = block.match(/^(#{1,6})\s+(.+)$/);
            if (heading) {
                const level = Math.min(heading[1].length + 2, 6);
                return `<h${level}>${applyInlineMarkdown(heading[2])}</h${level}>`;
            }
            const lines = block.split("\n");
            if (lines.every((line) => line.trim().startsWith("- "))) {
                const items = lines
                    .map((line) => `<li>${applyInlineMarkdown(line.trim().slice(2))}</li>`)
                    .join("");
                return `<ul>${items}</ul>`;
            }
            return `<p>${applyInlineMarkdown(lines.join(" "))}</p>`;
        })
        .join("\n");
}

function normalizePairs(pairs) {
    if (!Array.isArray(pairs)) return [];
    return pairs.map((pair) => ({
        id: pair.id,
        name: pair.name || null,
        badge: pair.badge ? String(pair.badge).toLowerCase() : "",
    }));
}

function normalizeTeams(teams) {
    if (!Array.isArray(teams)) return [];
    return teams.map((team) => ({
        label: team.label || null,
        slots: (team.slots || []).map((slot) => (typeof slot === "string" ? { id: slot } : slot)),
    }));
}

function unitNameMap(units) {
    const namesPath = path.join(contentDir, "unit-names.yaml");
    const names = fs.existsSync(namesPath) ? parseYaml(fs.readFileSync(namesPath, "utf8")) : {};
    units.forEach((unit) => {
        names[unit.id] = unit.name;
        unit.aliases.forEach((alias) => {
            names[alias.id] = alias.name || unit.name;
        });
    });
    return names;
}

function hydrateUnitReferences(units, names) {
    return units.map((unit) => {
        if (unit.speed && !SPEED_VALUES.has(unit.speed)) {
            throw new Error(`Unit "${unit.id}" has unknown speed value "${unit.speed}"`);
        }
        if (unit.speedNote && !unit.speed) {
            throw new Error(`Unit "${unit.id}" has a speedNote without a speed value`);
        }
        return {
            id: unit.id,
            name: unit.name,
            role: unit.role,
            scalable: unit.scalable || undefined,
            speed: unit.speed || null,
            speedNote: unit.speedNote || null,
            aliases: unit.aliases,
            weapons: Array.isArray(unit.weapons) ? unit.weapons : [],
            pairs: normalizePairs(unit.pairs).map((pair) => ({
                ...pair,
                name: pair.name || names[pair.id] || pair.id,
            })),
            teams: normalizeTeams(unit.teams).map((team) => ({
                ...team,
                slots: team.slots.map((slot) => ({
                    id: slot.id,
                    name: slot.name || names[slot.id] || slot.id,
                })),
            })),
            desc: markdownToHtml(unit.body),
        };
    });
}

function readUnitFile(filePath, extraData = {}) {
    const parsed = parseFrontmatter(fs.readFileSync(filePath, "utf8"), filePath);
    return {
        ...parsed.data,
        ...extraData,
        body: parsed.body,
        aliases: parsed.data.aliases || [],
    };
}

function sortUnitsByOrder(units, orderedIds, label) {
    const byId = new Map(units.map((unit) => [unit.id, unit]));
    const seen = new Set();
    const sorted = [];

    orderedIds.forEach((id) => {
        const unit = byId.get(id);
        if (!unit) {
            throw new Error(`${label} references missing unit "${id}"`);
        }
        sorted.push(unit);
        seen.add(id);
    });

    units
        .filter((unit) => !seen.has(unit.id))
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((unit) => sorted.push(unit));

    return sorted;
}

function loadUnits() {
    const orderPath = path.join(contentDir, "unit-order.yaml");
    const unitOrder = fs.existsSync(orderPath) ? parseYaml(fs.readFileSync(orderPath, "utf8")) : {};
    const unitsById = new Map();
    const units = [];

    CATEGORY_KEYS.forEach((category) => {
        const categoryDir = path.join(unitsDir, category);
        if (!fs.existsSync(categoryDir)) return;

        fs.readdirSync(categoryDir)
            .filter((file) => file.endsWith(".md"))
            .sort()
            .forEach((file) => {
                const filePath = path.join(categoryDir, file);
                const unit = readUnitFile(filePath, { category });
                if (unitsById.has(unit.id)) {
                    throw new Error(`Duplicate unit id "${unit.id}" in ${filePath}`);
                }
                unitsById.set(unit.id, unit);
                units.push(unit);
            });
    });

    const names = unitNameMap(units);
    const grouped = Object.fromEntries(CATEGORY_KEYS.map((key) => [key, []]));

    CATEGORY_KEYS.forEach((category) => {
        const orderedIds = Array.isArray(unitOrder[category]) ? unitOrder[category] : [];
        const categoryUnits = units.filter((unit) => unit.category === category);
        grouped[category] = sortUnitsByOrder(
            categoryUnits,
            orderedIds,
            `content/unit-order.yaml ${category}`
        );
    });

    return {
        names,
        grouped: Object.fromEntries(
            Object.entries(grouped).map(([category, categoryUnits]) => [
                category,
                hydrateUnitReferences(categoryUnits, names),
            ])
        ),
    };
}

function loadBasePoolUnits(names) {
    if (!fs.existsSync(basePoolUnitsDir)) return [];
    const orderPath = path.join(contentDir, "base-pool-order.yaml");
    const orderData = fs.existsSync(orderPath) ? parseYaml(fs.readFileSync(orderPath, "utf8")) : {};
    const orderedIds = Array.isArray(orderData.units) ? orderData.units : [];
    const units = fs
        .readdirSync(basePoolUnitsDir)
        .filter((file) => file.endsWith(".md"))
        .sort()
        .map((file) => readUnitFile(path.join(basePoolUnitsDir, file)));
    units.forEach((unit) => {
        names[unit.id] = unit.name;
        unit.aliases.forEach((alias) => {
            names[alias.id] = alias.name || unit.name;
        });
    });
    return hydrateUnitReferences(
        sortUnitsByOrder(units, orderedIds, "content/base-pool-order.yaml"),
        names
    );
}

function loadConcepts() {
    if (!fs.existsSync(conceptsDir)) return [];
    const orderPath = path.join(contentDir, "concepts-order.yaml");
    const orderData = fs.existsSync(orderPath) ? parseYaml(fs.readFileSync(orderPath, "utf8")) : {};
    const orderedIds = Array.isArray(orderData.concepts) ? orderData.concepts : [];
    const concepts = fs
        .readdirSync(conceptsDir)
        .filter((file) => file.endsWith(".md"))
        .sort()
        .map((file) => {
            const parsed = parseFrontmatter(fs.readFileSync(path.join(conceptsDir, file), "utf8"), file);
            return {
                ...parsed.data,
                body: markdownToHtml(parsed.body),
            };
        });
    return sortUnitsByOrder(concepts, orderedIds, "content/concepts-order.yaml");
}

function siteMarkdownToHtml(value, key = "") {
    if (Array.isArray(value)) return value.map(siteMarkdownToHtml);
    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([childKey, child]) => [childKey, siteMarkdownToHtml(child, childKey)])
        );
    }
    if (typeof value !== "string") return value;
    if (!["text", "note", "definition"].includes(key)) return value;
    return markdownToHtml(value);
}

async function fetchAA(pathname) {
    const response = await fetch(`${AA_API_BASE}${pathname}`, {
        signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) {
        throw new Error(`AA API request failed (${response.status}) for ${pathname}`);
    }
    const payload = await response.json();
    if (!payload || payload.data == null) {
        throw new Error(`AA API returned no data for ${pathname}`);
    }
    return payload.data;
}

function flattenGachaBanners(data) {
    const banners = ["fleeting", "ioc", "iosg"].flatMap((key) =>
        Array.isArray(data[key]) ? data[key] : []
    );
    (Array.isArray(data.chosen) ? data.chosen : []).forEach((group) => {
        if (Array.isArray(group.banners)) banners.push(...group.banners);
    });
    // Eminence is a permanent, player-age-based pool rather than a current rerun banner.
    return banners;
}

function bannerMonth(value) {
    const match = String(value || "").match(/^(\d{4})-(\d{2})-/);
    if (!match) return null;
    return { year: Number(match[1]), month: Number(match[2]) };
}

function addMonths(value, amount) {
    const monthIndex = value.year * 12 + value.month - 1 + amount;
    return {
        year: Math.floor(monthIndex / 12),
        month: (monthIndex % 12) + 1,
    };
}

function compareMonths(left, right) {
    return left.year * 12 + left.month - (right.year * 12 + right.month);
}

function formatMonthYear(value) {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(Date.UTC(value.year, value.month - 1, 1)));
}

async function loadAARerunData(units) {
    if (!fs.existsSync(aaCharacterMapPath)) {
        throw new Error("Missing content/aa-character-map.yaml");
    }
    const mappingData = parseYaml(fs.readFileSync(aaCharacterMapPath, "utf8"));
    const mappingEntries = Array.isArray(mappingData.units) ? mappingData.units : [];
    const mapping = Object.fromEntries(mappingEntries.map((entry) => [entry.guideId, entry]));
    const missingMappings = units.filter((unit) => !mapping[unit.id]).map((unit) => unit.id);
    if (missingMappings.length) {
        throw new Error(`Missing AA character mappings for: ${missingMappings.join(", ")}`);
    }

    const [characters, historyData, activeData] = await Promise.all([
        fetchAA("/strings/character"),
        fetchAA("/gacha?is_active=false&include_future=false"),
        fetchAA("/gacha?is_active=true&include_future=false"),
    ]);

    units.forEach((unit) => {
        const entry = mapping[unit.id];
        const aaId = Number(entry.aaId);
        const character = characters[String(aaId)];
        if (!Number.isInteger(aaId) || !character) {
            throw new Error(`Unit "${unit.id}" maps to unknown AA character ID "${entry.aaId}"`);
        }
        if (entry.apiName && character.name !== entry.apiName) {
            throw new Error(
                `AA character ${aaId} name changed: expected "${entry.apiName}", received "${character.name}"`
            );
        }
        if (entry.apiTitle && character.title !== entry.apiTitle) {
            throw new Error(
                `AA character ${aaId} title changed: expected "${entry.apiTitle}", received "${character.title}"`
            );
        }
    });

    const history = flattenGachaBanners(historyData);
    const activeIds = new Set(flattenGachaBanners(activeData).map((banner) => Number(banner.char_id)));
    const now = new Date();
    const currentMonth = { year: now.getFullYear(), month: now.getMonth() + 1 };

    const reruns = Object.fromEntries(
        units.map((unit) => {
            const entry = mapping[unit.id];
            const aaId = Number(entry.aaId);
            const active = activeIds.has(aaId);
            const latest = history
                .filter((banner) => Number(banner.char_id) === aaId)
                .sort((left, right) => String(right.start).localeCompare(String(left.start)))[0];
            const lastRunMonth = latest ? bannerMonth(latest.start) : null;

            if (active) {
                return [
                    unit.id,
                    {
                        aaId,
                        active: true,
                        lastRun: lastRunMonth ? formatMonthYear(lastRunMonth) : null,
                        estimate: null,
                    },
                ];
            }

            if (!lastRunMonth) {
                return [unit.id, { aaId, active: false, lastRun: null, estimate: null }];
            }

            const interval = Number(entry.rerunMonths) || 6;
            let estimate = addMonths(lastRunMonth, interval);
            // Once an inactive estimate arrives or passes, keep the estimate forward-looking.
            if (compareMonths(estimate, currentMonth) <= 0) {
                estimate = addMonths(currentMonth, 1);
            }
            return [
                unit.id,
                {
                    aaId,
                    active: false,
                    lastRun: formatMonthYear(lastRunMonth),
                    estimate: formatMonthYear(estimate),
                },
            ];
        })
    );

    console.log(`Fetched AA rerun data for ${Object.keys(reruns).length} guide units`);
    return reruns;
}

async function build() {
    const site = parseYaml(fs.readFileSync(path.join(contentDir, "site.yaml"), "utf8"));
    const basePoolPage = parseYaml(fs.readFileSync(path.join(contentDir, "pages", "base-pool.yaml"), "utf8"));
    const conceptsPage = parseYaml(fs.readFileSync(path.join(contentDir, "pages", "concepts.yaml"), "utf8"));
    const { names, grouped } = loadUnits();
    const basePoolUnits = loadBasePoolUnits(names);
    const concepts = loadConcepts();
    const guideUnits = CATEGORY_KEYS.flatMap((category) => grouped[category]);
    const reruns = await loadAARerunData(guideUnits);
    guideUnits.forEach((unit) => {
        unit.rerun = reruns[unit.id] || null;
    });
    const normalizedSite = {
        ...siteMarkdownToHtml(site),
        lastUpdated: latestCommitDate(),
    };
    const normalizedBasePoolPage = siteMarkdownToHtml(basePoolPage);
    const normalizedConceptsPage = siteMarkdownToHtml(conceptsPage);

    const lines = [
        "/* Generated by scripts/build-content.js. Edit content/ instead. */",
        `const UNIT_NAMES = ${JSON.stringify(names, null, 4)};`,
        "",
    ];

    CATEGORY_KEYS.forEach((category) => {
        lines.push(`const ${CATEGORY_VARIABLES[category]} = ${JSON.stringify(grouped[category], null, 4)};`);
        lines.push("");
    });

    lines.push(`const BASE_POOL_UNITS = ${JSON.stringify(basePoolUnits, null, 4)};`);
    lines.push("");
    lines.push(`const CONCEPT_ARTICLES = ${JSON.stringify(concepts, null, 4)};`);
    lines.push("");

    lines.push(`const SITE_CONTENT = ${JSON.stringify(normalizedSite, null, 4)};`);
    lines.push("");
    lines.push(`const BASE_POOL_CONTENT = ${JSON.stringify(normalizedBasePoolPage, null, 4)};`);
    lines.push("");
    lines.push(`const CONCEPTS_CONTENT = ${JSON.stringify(normalizedConceptsPage, null, 4)};`);
    lines.push("");
    lines.push("const UNITS = {");
    lines.push("    general: GENERAL_UNITS,");
    lines.push("    quest: QUEST_UNITS,");
    lines.push("    tower: TOWER_UNITS,");
    lines.push("    mention: HONORABLE_MENTIONS,");
    lines.push("};");
    lines.push("");

    fs.writeFileSync(outputPath, lines.join("\n"));
    console.log(`Generated ${path.relative(root, outputPath)}`);
}

build().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
