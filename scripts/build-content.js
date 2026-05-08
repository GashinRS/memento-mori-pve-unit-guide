const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const contentDir = path.join(root, "content");
const unitsDir = path.join(contentDir, "units");
const outputPath = path.join(root, "data", "generated-content.js");

const CATEGORY_KEYS = ["general", "quest", "tower", "mention"];
const CATEGORY_VARIABLES = {
    general: "GENERAL_UNITS",
    quest: "QUEST_UNITS",
    tower: "TOWER_UNITS",
    mention: "HONORABLE_MENTIONS",
};
const CONTAINER_KEYS = new Set([
    "aliases",
    "assumptions",
    "cards",
    "footer",
    "header",
    "items",
    "pairs",
    "sections",
    "teams",
    "weapons",
    "wip",
    "general",
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
    return units.map((unit) => ({
        id: unit.id,
        name: unit.name,
        role: unit.role,
        scalable: unit.scalable || undefined,
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
    }));
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
                const parsed = parseFrontmatter(fs.readFileSync(filePath, "utf8"), filePath);
                const unit = {
                    ...parsed.data,
                    category,
                    body: parsed.body,
                    aliases: parsed.data.aliases || [],
                };
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
        const categoryUnits = units
            .filter((unit) => unit.category === category)
            .sort((a, b) => a.name.localeCompare(b.name));
        const categoryById = new Map(categoryUnits.map((unit) => [unit.id, unit]));
        const seen = new Set();

        orderedIds.forEach((id) => {
            const unit = categoryById.get(id);
            if (!unit) {
                throw new Error(`content/unit-order.yaml references missing ${category} unit "${id}"`);
            }
            grouped[unit.category].push(unit);
            seen.add(id);
        });

        categoryUnits.forEach((unit) => {
            if (!seen.has(unit.id)) grouped[category].push(unit);
        });
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

function siteMarkdownToHtml(value, key = "") {
    if (Array.isArray(value)) return value.map(siteMarkdownToHtml);
    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([childKey, child]) => [childKey, siteMarkdownToHtml(child, childKey)])
        );
    }
    if (typeof value !== "string") return value;
    if (!["text", "note"].includes(key)) return value;
    return markdownToHtml(value);
}

function build() {
    const site = parseYaml(fs.readFileSync(path.join(contentDir, "site.yaml"), "utf8"));
    const { names, grouped } = loadUnits();
    const normalizedSite = siteMarkdownToHtml(site);

    const lines = [
        "/* Generated by scripts/build-content.js. Edit content/ instead. */",
        `const UNIT_NAMES = ${JSON.stringify(names, null, 4)};`,
        "",
    ];

    CATEGORY_KEYS.forEach((category) => {
        lines.push(`const ${CATEGORY_VARIABLES[category]} = ${JSON.stringify(grouped[category], null, 4)};`);
        lines.push("");
    });

    lines.push(`const SITE_CONTENT = ${JSON.stringify(normalizedSite, null, 4)};`);
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

build();
