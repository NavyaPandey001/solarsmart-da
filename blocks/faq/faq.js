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

        const summary = document.createElement('button');
        summary.className = 'faq-item-label';
        summary.type = 'button';
        summary.setAttribute('aria-expanded', 'false');
        summary.append(...cells[0].childNodes);

        const body = document.createElement('div');
        body.className = 'faq-item-body';
        body.setAttribute('aria-hidden', 'true');

        const inner = document.createElement('div');
        inner.className = 'faq-item-inner';
        inner.append(...cells[1].childNodes);

        body.append(inner);

        const item = document.createElement('div');
        item.className = 'faq-item';

        item.append(summary, body);

        let animation;

        summary.addEventListener('click', () => {
            const isOpen = summary.getAttribute('aria-expanded') === 'true';

            if (animation) {
                animation.cancel();
            }

            const startHeight = body.getBoundingClientRect().height;

            if (isOpen) {
                summary.setAttribute('aria-expanded', 'false');
                body.setAttribute('aria-hidden', 'true');

                animation = body.animate(
                    [
                        { height: `${startHeight}px` },
                        { height: '0px' }
                    ],
                    {
                        duration: 350,
                        easing: 'ease-in-out',
                        fill: 'forwards'
                    }
                );

                animation.onfinish = () => {
                    body.style.height = '0px';
                    animation = null;
                };
            } else {
                summary.setAttribute('aria-expanded', 'true');
                body.setAttribute('aria-hidden', 'false');

                body.style.height = 'auto';

                const endHeight = body.scrollHeight;

                body.style.height = `${startHeight}px`;

                animation = body.animate(
                    [
                        { height: `${startHeight}px` },
                        { height: `${endHeight}px` }
                    ],
                    {
                        duration: 350,
                        easing: 'ease-in-out',
                        fill: 'forwards'
                    }
                );

                animation.onfinish = () => {
                    body.style.height = 'auto';
                    animation = null;
                };
            }
        });

        row.replaceWith(item);
    });
}
