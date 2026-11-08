function loadCSS(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

export default function decorate(block) {
    loadCSS('/blocks/testimonials/testimonials.css');

    const rows = [...block.children];

    const testimonialsList = document.createElement('div');
    testimonialsList.className = 'testimonials-list';

    rows.forEach((row) => {
        const cells = [...row.children];

        const quoteText = cells[0]?.textContent.trim();
        const customerName = cells[1]?.textContent.trim();
        const designationText = cells[2]?.textContent.trim();

        if (!quoteText && !customerName && !designationText) return;

        const card = document.createElement('div');
        card.className = 'testimonial-card';

        if (quoteText) {
            const quote = document.createElement('p');
            quote.className = 'testimonial-quote';
            quote.textContent = `“${quoteText}”`;
            card.append(quote);
        }

        if (customerName) {
            const name = document.createElement('h3');
            name.className = 'testimonial-name';
            name.textContent = customerName;
            card.append(name);
        }

        if (designationText) {
            const designation = document.createElement('p');
            designation.className = 'testimonial-designation';
            designation.textContent = designationText;
            card.append(designation);
        }

        testimonialsList.append(card);
    });

    block.textContent = '';
    block.append(testimonialsList);
}