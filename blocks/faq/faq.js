
function loadCSS() {
    const href = '/blocks/faq/faq.css';

    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.append(link);
    }
}

export default function decorate(block) {
    loadCSS();

    [...block.children].forEach((row) => {
        const cells = [...row.children];

        if (cells.length < 2) return;

        // Create the question/label
        const label = cells[0];
        const summary = document.createElement('summary');
        summary.className = 'faq-item-label';
        summary.append(...label.childNodes);

        // Create the answer/body
        const body = cells[1];
        body.className = 'faq-item-body';

        // Create expandable faq item
        const details = document.createElement('details');
        details.className = 'faq-item';

        details.append(summary, body);

        row.replaceWith(details);
    });
}
