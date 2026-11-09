function loadCSS() {
    if (!document.querySelector(
        'link[href="/blocks/contact-form/contact-form.css"]'
    )) {
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

    let submitButton;

    rows.forEach((row) => {
        const cells = [...row.children];
        if (!cells.length) return;

        const label = cells[0].textContent.trim();
        const type = cells[1]?.textContent.trim().toLowerCase();

        if (!label) return;

        if (type === 'submit') {
            submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = label;
            submitButton.className = 'contact-submit';
            form.append(submitButton);
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

    if (!submitButton) {
        submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Submit Enquiry';
        submitButton.className = 'contact-submit';
        form.append(submitButton);
    }

    const message = document.createElement('p');
    message.className = 'contact-form-message';
    message.setAttribute('aria-live', 'polite');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const formData = {};

        [...form.querySelectorAll('input, textarea')].forEach((field) => {
            formData[field.name] = field.value.trim();
        });

        const payload = {
            name: formData.name || formData['full-name'] || '',
            email: formData.email || '',
            phone: formData.phone || formData['phone-number'] || '',
            message: formData.message || '',
        };

        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        message.textContent = 'Submitting your enquiry...';
        message.className = 'contact-form-message loading';

        try {
            const response = await fetch(
                'https://solarsmart-api.free.beeceptor.com/lead',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                },
            );

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();

            message.textContent =
                data.message || 'Thank you! Your enquiry has been submitted.';

            message.className = 'contact-form-message success';

            form.reset();
        } catch (error) {
            message.textContent =
                'Unable to submit your enquiry. Please try again later.';

            message.className = 'contact-form-message error';

            console.error('Contact Form API error:', error);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Enquiry';
        }
    });

    form.append(message);
    block.replaceChildren(form);
}
