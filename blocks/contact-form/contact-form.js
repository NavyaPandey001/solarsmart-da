
function loadCSS() {
    if (!document.querySelector('link[href="/blocks/contact-form/contact-form.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/blocks/contact-form/contact-form.css';
        document.head.append(link);
    }
}

export default function decorate(block) {
    loadCSS();

    const rows = [...block.children];
    const form = document.createElement('form');

    form.className = 'contact-form-element';
    form.id = 'contact-form';

    rows.forEach((row) => {
        const cells = [...row.children];

        if (!cells.length) return;

        const label = cells[0].textContent.trim();
        const type = cells[1]?.textContent.trim().toLowerCase();

        if (!label) return;

        if (type === 'submit') {
            const button = document.createElement('button');
            button.type = 'submit';
            button.textContent = label;
            button.className = 'contact-submit';
            form.append(button);
            return;
        }

        const field = document.createElement('div');
        field.className = 'contact-field';

        const fieldLabel = document.createElement('label');
        fieldLabel.textContent = label;

        const fieldName = label.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        fieldLabel.htmlFor = fieldName;

        let input;

        if (type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 4;
        } else {
            input = document.createElement('input');
            input.type = ['email', 'tel', 'number'].includes(type)
                ? type
                : 'text';
        }

        input.id = fieldName;
        input.name = fieldName;
        input.required = true;

        if (type === 'email') {
            input.placeholder = 'Enter your email address';
        } else if (type === 'tel') {
            input.placeholder = 'Enter your phone number';
        } else {
            input.placeholder = `Enter ${label.toLowerCase()}`;
        }

        field.append(fieldLabel, input);
        form.append(field);
    });

    const message = document.createElement('p');
    message.className = 'contact-form-message';
    message.setAttribute('aria-live', 'polite');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        message.textContent =
            'Thank you! Your request has been received.';
        message.classList.add('success');

        form.reset();
    });

    form.append(message);
    block.replaceChildren(form);
}
