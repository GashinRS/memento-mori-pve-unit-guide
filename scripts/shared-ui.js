(function() {
    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function videoLinkHtml(url, label, className) {
        if (!url) return '';
        var description = label ? 'Watch ' + label + ' on YouTube' : 'Watch clear on YouTube';
        return '<a class="video-link ' + (className || '') + '" href="' + escapeHtml(url) + '" ' +
            'target="_blank" rel="noopener noreferrer" aria-label="' + escapeHtml(description) + '" ' +
            'title="' + escapeHtml(description) + '"><span aria-hidden="true">&#9654;</span></a>';
    }

    function guideLegendHtml() {
        return '<div>' +
            '<div class="legend-group-title">Unique Weapon Investment</div>' +
            '<div class="legend-items">' +
            '<div class="legend-item">' +
            '<div class="legend-weapon-sample">' +
            '<div class="weapon-icon optional" style="width:36px;height:36px"></div>' +
            '<div class="weapon-marker optional"></div>' +
            '</div>' +
            'Optional — minor gains' +
            '</div>' +
            '<div class="legend-item">' +
            '<div class="legend-weapon-sample">' +
            '<div class="weapon-icon recommended" style="width:36px;height:36px"></div>' +
            '<div class="weapon-marker recommended"><span></span></div>' +
            '</div>' +
            'Recommended — noticeable upgrade' +
            '</div>' +
            '<div class="legend-item">' +
            '<div class="legend-weapon-sample">' +
            '<div class="weapon-icon required" style="width:36px;height:36px"></div>' +
            '<div class="weapon-marker required"><span></span><span></span></div>' +
            '</div>' +
            'Required — unit needs this' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div>' +
            '<div class="legend-group-title">Progression</div>' +
            '<div class="legend-items">' +
            '<div class="legend-item"><span class="stage-badge early">Early Game</span> Before level link 240</div>' +
            '<div class="legend-item"><span class="stage-badge mid">Mid Game</span> Level link 240-400</div>' +
            '<div class="legend-item"><span class="stage-badge end">End Game</span> Level link 400+</div>' +
            '</div>' +
            '</div>';
    }

    function renderGuideLegends() {
        document.querySelectorAll('[data-guide-legend]').forEach(function(element) {
            element.classList.add('legend');
            element.innerHTML = guideLegendHtml();
        });
    }

    function renderSiteChrome() {
        var page = window.location.pathname.split('/').pop() || 'index.html';
        var unitPages = ['index.html', 'base-pool.html'];
        var items = [
            { href: 'index.html', label: 'Unit Guides', active: unitPages.indexOf(page) !== -1 },
            { href: 'team-building.html', label: 'Team Building', active: page === 'team-building.html' },
            { href: 'gear.html', label: 'Gear Guide', active: page === 'gear.html' },
            { href: 'concepts.html', label: 'PvE Notes', active: page === 'concepts.html' }
        ];
        document.querySelectorAll('.page-nav').forEach(function(nav) {
            nav.setAttribute('aria-label', 'Guide categories');
            nav.innerHTML = items.map(function(item) {
                return '<a href="' + item.href + '"' + (item.active ? ' aria-current="' + (page === item.href ? 'page' : 'true') + '"' : '') + '>' + item.label + '</a>';
            }).join('');
            if (page === 'index.html' || page === 'base-pool.html') {
                var subnav = document.createElement('nav');
                subnav.className = 'nav guide-subnav';
                subnav.setAttribute('aria-label', 'Unit guides');
                subnav.innerHTML = ['index.html', 'base-pool.html'].map(function(href, i) {
                    return '<a href="' + href + '"' + (page === href ? ' aria-current="page"' : '') + '>' + ['Limited PvE Guide', 'Base Pool Guide'][i] + '</a>';
                }).join('');
                nav.insertAdjacentElement('afterend', subnav);
            }
        });
        var footer = document.getElementById('site-footer');
        if (footer) footer.innerHTML = '<p class="footer-credits">' + SITE_CONTENT.footer.credits + '</p>' +
            '<p>' + SITE_CONTENT.footer.disclaimer + ' <span>' + SITE_CONTENT.footer.brand + '</span>.</p>';
    }

    function initialize() {
        renderGuideLegends();
        renderSiteChrome();
    }

    window.GuideUI = {
        videoLinkHtml: videoLinkHtml,
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
}());
