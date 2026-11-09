function loadCSS(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

export default function decorate(block) {

    loadCSS('/blocks/cards/cards.css');

    const rows = [...block.children];

    const ul = document.createElement('ul');

    rows.forEach((row) => {

        const li = document.createElement('li');

        while (row.firstElementChild) {

            const cell = row.firstElementChild;

            if (cell.textContent.trim()) {

                const content = document.createElement(
                    li.children.length === 0 ? 'h3' : 'p'
                );

                content.textContent = cell.textContent.trim();

                li.append(content);
            }

            cell.remove();
        }

        ul.append(li);
    });

    block.textContent = '';

    block.append(ul);
}
