export default function decorate(block) {
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