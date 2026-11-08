
function loadCSS(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

export default function decorate(block) {
    // Load Hero CSS
    loadCSS('/blocks/hero/hero.css');

    const rows = [...block.children];
    const content = [];
    const links = [];

    rows.forEach((row) => {
        [...row.children].forEach((cell) => {
            const anchor = cell.querySelector('a');

            if (anchor) {
                links.push(anchor.cloneNode(true));
            } else if (cell.textContent.trim()) {
                content.push(cell.textContent.trim());
            }
        });
    });

    const heroContent = document.createElement('div');
    heroContent.className = 'hero-content';

    const heading = document.createElement('h1');
    heading.textContent = content[0] || 'Power Your Home with Clean Solar Energy';

    const description = document.createElement('p');
    description.textContent = content[1] ||
        'Save on electricity bills with clean solar energy.';

    const buttons = document.createElement('div');
    buttons.className = 'hero-buttons';

    links.forEach((link, index) => {
        link.classList.add(
            index === 0 ? 'hero-primary-btn' : 'hero-secondary-btn'
        );
        buttons.append(link);
    });

    heroContent.append(heading, description, buttons);

    block.textContent = '';
    block.append(heroContent);
}
