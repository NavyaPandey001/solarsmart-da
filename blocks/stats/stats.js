

function loadCSS() {
    if (!document.querySelector('link[href="/blocks/stats/stats.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/blocks/stats/stats.css';
        document.head.append(link);
    }
}

export default function decorate(block) {
    loadCSS();

    const rows = [...block.children];
    const valueRow = rows[0];
    const labelRow = rows[1];

    if (!valueRow || !labelRow) return;

    const values = [...valueRow.children];
    const labels = [...labelRow.children];

    const stats = values.map((cell, index) => {
        const card = document.createElement('div');
        card.className = 'stats-card';

        const value = document.createElement('div');
        value.className = 'stats-value';
        value.textContent = cell.textContent.trim();

        const label = document.createElement('p');
        label.className = 'stats-label';
        label.textContent = labels[index]?.textContent.trim() || '';

        card.append(value, label);
        return card;
    });

    block.replaceChildren(...stats);
}






