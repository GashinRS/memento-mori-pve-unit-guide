(function() {
    function guideLegendHtml() {
        return '<div>' +
            '<div class="legend-group-title">Weapon Investment</div>' +
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderGuideLegends);
    } else {
        renderGuideLegends();
    }
}());
