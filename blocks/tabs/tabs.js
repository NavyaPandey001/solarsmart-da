
function loadCSS() {
    const href = '/blocks/tabs/tabs.css';

    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.append(link);
    }
}

// Convert tab labels into valid CSS-friendly IDs
function toClassName(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

export default function decorate(block) {
    loadCSS();

    const tablist = document.createElement('div');
    tablist.className = 'tabs-list';
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('aria-label', 'Information tabs');

    const rows = [...block.children];

    rows.forEach((tabpanel, i) => {
        const tab = tabpanel.firstElementChild;

        if (!tab) return;

        const id = `${toClassName(tab.textContent) || 'tab'}-${i}`;

        // Decorate tab panel
        tabpanel.className = 'tabs-panel';
        tabpanel.id = `tabpanel-${id}`;
        tabpanel.setAttribute('role', 'tabpanel');
        tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
        tabpanel.setAttribute('aria-hidden', i !== 0 ? 'true' : 'false');
        tabpanel.setAttribute('tabindex', '0');

        // Create tab button
        const button = document.createElement('button');
        button.className = 'tabs-tab';
        button.id = `tab-${id}`;
        button.type = 'button';
        button.innerHTML = tab.innerHTML;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-controls', `tabpanel-${id}`);
        button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        button.setAttribute('tabindex', i === 0 ? '0' : '-1');

        // Switch between tabs
        button.addEventListener('click', () => {
            block.querySelectorAll('.tabs-panel').forEach((panel) => {
                panel.setAttribute('aria-hidden', 'true');
            });

            tablist.querySelectorAll('button').forEach((btn) => {
                btn.setAttribute('aria-selected', 'false');
                btn.setAttribute('tabindex', '-1');
            });

            tabpanel.setAttribute('aria-hidden', 'false');
            button.setAttribute('aria-selected', 'true');
            button.setAttribute('tabindex', '0');
        });

        tablist.append(button);

        // Remove the original tab label cell
        tab.remove();
    });

    block.prepend(tablist);
}
