const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function inline(value) {
    return escape(value).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
}
function buildGear() {
    const source = fs.readFileSync(path.join(root, 'content/gear/guide.md'), 'utf8');
    const headings = [];
    const used = new Set();
    let title = 'Gear Guide';
    let paragraph = [];
    let list = null;
    const html = [];
    const examples = {};
    const shareIds = new Set();
    function flush() {
        if (paragraph.length) html.push('<p>' + inline(paragraph.join(' ')) + '</p>');
        paragraph = [];
        if (list) html.push('</' + list + '>');
        list = null;
    }
    for (const line of source.replace(/\r\n/g, '\n').split('\n')) {
        const heading = line.match(/^(#{1,6})\s+(.+)$/);
        const image = line.trim().match(/^!\[([^\]]*)\]\(([^\s)]+)\)$/);
        const item = line.match(/^\s*(?:([-*])|\d+\.)\s+(.+)$/);
        const marker = line.trim().match(/^<!-- gear-example: ([a-z0-9-]+) -->$/);
        if (marker) {
            flush();
            const id = marker[1];
            const example = JSON.parse(fs.readFileSync(path.join(root, `content/gear/${id}-example.json`), 'utf8'));
            example.shareId = example.shareId || id;
            if (!/^[a-z0-9-]+$/.test(example.shareId) || shareIds.has(example.shareId)) throw new Error(`${id}: shareId must be unique and use lowercase letters, numbers, and hyphens`);
            shareIds.add(example.shareId);
            const slots = ['Weapon', 'Helmet', 'Accessory', 'Body', 'Gloves', 'Boots'];
            if (!example.steps?.length || !Number.isInteger(example.defaultStep) || !example.steps[example.defaultStep]) throw new Error(`${id}: invalid steps/defaultStep`);
            for (const step of example.steps) {
                if (!step.label || !step.note) throw new Error(`${id}: each step needs label and note`);
                const units = step.units || [{ ...example, pieces: step.pieces }];
                if (units.length < 1 || units.length > 2) throw new Error(`${id}: use one or two units`);
                const firstUnits = example.steps[0].units || [example];
                if (units.length !== firstUnits.length) throw new Error(`${id}: keep the same units in every step`);
                units.forEach((unit, unitIndex) => {
                if (!unit.name || unit.name !== firstUnits[unitIndex].name || unit.pieces?.length !== 6) throw new Error(`${id}: keep unit order and provide six pieces per unit`);
                if (!fs.existsSync(path.join(root, unit.portrait))) throw new Error(`${id}: missing portrait`);
                unit.pieces.forEach((piece, index) => {
                    if (piece.slot !== slots[index] || !piece.rarity || !Number.isInteger(piece.level) || !Number.isInteger(piece.upgrade) || piece.upgrade < 0 || piece.upgrade > piece.level) throw new Error(`${id}: invalid ${slots[index]} data`);
                    if (!fs.existsSync(path.join(root, 'images/gear', piece.image))) throw new Error(`${id}: missing image ${piece.image}`);
                });
                });
            }
            examples[id] = example;
            headings.push({ id: 'example-' + example.shareId, title: example.tocTitle || example.title || 'Equipment example', level: 3 });
            html.push(`<div data-gear-example="${id}"></div>`);
        } else if (heading) {
            flush();
            if (heading[1].length === 1) { title = heading[2]; continue; }
            const base = heading[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
            let id = base, suffix = 2;
            while (used.has(id)) id = base + '-' + suffix++;
            used.add(id);
            const level = heading[1].length;
            headings.push({ id, title: heading[2], level });
            html.push(`<h${level} id="${id}">${inline(heading[2])}<a class="gear-anchor" href="#${id}" aria-label="Link to ${escape(heading[2])}">#</a></h${level}>`);
        } else if (image) {
            flush();
            if (!/^(?:https?:\/\/|images\/)/i.test(image[2])) throw new Error('Gear images must use an images/ path or HTTP(S) URL');
            html.push(`<figure><a href="${escape(image[2])}" target="_blank" rel="noopener noreferrer" aria-label="Enlarge image: ${escape(image[1])}"><img src="${escape(image[2])}" alt="${escape(image[1])}" loading="lazy"></a><figcaption>${escape(image[1])}</figcaption></figure>`);
        } else if (item) {
            const type = item[1] ? 'ul' : 'ol';
            if (list !== type) { flush(); html.push('<' + type + '>'); list = type; }
            html.push('<li>' + inline(item[2]) + '</li>');
        } else if (!line.trim()) flush();
        else { if (list) flush(); paragraph.push(line.trim()); }
    }
    flush();
    fs.writeFileSync(path.join(root, 'data/generated-gear.js'), '/* Generated from content/gear/. */\nconst GEAR_CONTENT = ' + JSON.stringify({ title, headings, body: html.join('\n'), examples }, null, 4) + ';\n');
    console.log('Generated data/generated-gear.js');
}
if (require.main === module) buildGear();
module.exports = buildGear;
