document.querySelector('h1').textContent = GEAR_CONTENT.title;
const wip = SITE_CONTENT.wip;
document.getElementById('wip-banner').innerHTML =
    '<div class="wip-banner"><div class="wip-icon">&#9998;</div><div class="wip-body">' +
    '<div class="wip-title">' + wip.title + '</div>' +
    '<div class="wip-text">' + wip.text + '</div>' +
    '<ul class="wip-list">' + wip.items.map(item => '<li>' + item + '</li>').join('') + '</ul>' +
    '</div></div>';
document.getElementById('gear-article').innerHTML = GEAR_CONTENT.body;
const toc = document.getElementById('gear-toc');
GEAR_CONTENT.headings.forEach(heading => {
    const link = document.createElement('a');
    link.href = '#' + heading.id;
    link.textContent = heading.title;
    link.className = 'gear-toc-level-' + heading.level;
    toc.appendChild(link);
});
const contents = document.querySelector('.gear-contents');
document.querySelectorAll('[data-gear-example]').forEach((mount, instance) => {
    const example = GEAR_CONTENT.examples[mount.dataset.gearExample];
    const safe = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    const prefix = 'equipment-' + instance;
    const anchor = 'example-' + example.shareId;
    mount.id = anchor;
    const title = typeof example.title === 'string' ? example.title.trim() : '';
    mount.innerHTML = '<section class="equipment-example" aria-label="' + safe(title || 'Equipment example') + '">' +
        (title ? '<div class="equipment-heading"><h3>' + safe(title) + '</h3></div>' : '') +
        '<div class="equipment-tabs" role="tablist" aria-label="Equipment progression">' + example.steps.map((step, i) =>
            '<button type="button" role="tab" id="' + prefix + '-tab-' + i + '" aria-controls="' + prefix + '-panel" aria-selected="false" tabindex="-1">' + (i + 1) + '. ' + safe(step.label) + '</button>').join('') + '</div>' +
        '<div role="tabpanel" id="' + prefix + '-panel" tabindex="0"></div>' +
        '</section>';
    const tabs = [...mount.querySelectorAll('[role="tab"]')];
    const panel = mount.querySelector('[role="tabpanel"]');
    function select(index, focus = false) {
        const step = example.steps[index];
        const previous = example.steps[index - 1];
        tabs.forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
        panel.setAttribute('aria-labelledby', tabs[index].id);
        const units = step.units || [{ ...example, pieces: step.pieces }];
        const previousUnits = previous && (previous.units || [{ ...example, pieces: previous.pieces }]);
        const takeaway =
            (typeof step.title === 'string' && step.title.trim() ? '<strong>' + safe(step.title.trim()) + '</strong>' : '') +
            (typeof step.note === 'string' && step.note.trim() ? '<p>' + safe(step.note.trim()) + '</p>' : '') +
            (previous ? '<small class="equipment-change-key">Outlined pieces change from the previous step.</small>' : '');
        panel.innerHTML = '<div class="equipment-units' + (units.length === 2 ? ' equipment-duo' : '') + '">' + units.map((unit, unitIndex) => {
            const oldUnit = previousUnits && previousUnits[unitIndex];
            return '<div class="equipment-board" role="group" aria-label="' + safe(unit.name) + ' equipment"><div class="equipment-character">' +
                '<img src="' + safe(unit.portrait) + '" alt="' + safe(unit.name) + ', level ' + unit.level + ', ' + safe(unit.rarity) + '">' +
                '<strong>' + safe(unit.name) + '</strong><small>' + safe(unit.role || '') + '</small></div>' +
                unit.pieces.map((piece, i) => {
                    const changed = oldUnit && JSON.stringify(piece) !== JSON.stringify(oldUnit.pieces[i]);
                    return '<div class="equipment-piece equipment-piece-' + i + (changed ? ' equipment-changed' : '') + '"><img src="images/gear/' + safe(piece.image) + '" alt="' + safe(piece.rarity + ' ' + piece.slot) + ', level ' + piece.level + ', upgrade +' + piece.upgrade + (changed ? ', changed from previous step' : '') + '"></div>';
                }).join('') + '</div>';
        }).join('') + '</div>' +
            (takeaway ? '<div class="equipment-takeaway">' + takeaway + '</div>' : '');
        if (focus) tabs[index].focus();
    }
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => select(index));
        tab.addEventListener('keydown', event => {
            let next;
            if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
            if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = tabs.length - 1;
            if (next !== undefined) { event.preventDefault(); select(next, true); }
        });
    });
    select(example.defaultStep);
    function openSharedStep() {
        const [target, step] = location.hash.slice(1).split('~');
        if (target !== anchor) return;
        const index = Number(step) - 1;
        select(Number.isInteger(index) && example.steps[index] ? index : example.defaultStep);
        requestAnimationFrame(() => mount.scrollIntoView({ block: 'start' }));
    }
    window.addEventListener('hashchange', openSharedStep);
    openSharedStep();

});
if (window.matchMedia('(max-width: 800px)').matches) contents.open = false;
// Keep unfinished sections visible without presenting them as completed examples.
document.querySelectorAll('.gear-article h2').forEach(heading => {
    if (!heading.nextElementSibling || /^H[2]$/.test(heading.nextElementSibling.tagName)) {
        const note = document.createElement('p');
        note.className = 'gear-pending';
        note.textContent = 'Examples coming soon.';
        heading.after(note);
    }
});
