
function loadCSS() {
    if (!document.querySelector('link[href="/blocks/columns/columns.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/blocks/columns/columns.css';
        document.head.append(link);
    }
}

export default function decorate(block) {
    loadCSS();

    const rows = [...block.children];
    const columnCount = Math.max(
        ...rows.map((row) => row.children.length),
    );

    const columns = [];

    for (let i = 0; i < columnCount; i += 1) {
        const column = document.createElement('div');
        column.className = 'columns-card';

        rows.forEach((row, rowIndex) => {
            const cell = row.children[i];

            if (!cell) return;

            const content = cell.cloneNode(true);

            if (rowIndex === 0) {
                content.classList.add('columns-card-title');
            } else {
                content.classList.add('columns-card-content');
            }

            column.append(content);
        });

        columns.push(column);
    }

    block.replaceChildren(...columns);
}
