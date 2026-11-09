export function getPageMetadata() {
    const metadata = {};

    document.querySelectorAll('meta[name], meta[property]').forEach((meta) => {
        const key = meta.getAttribute('name') || meta.getAttribute('property');

        if (key) {
            metadata[key] = meta.getAttribute('content');
        }
    });

    metadata.title = document.title;

    return metadata;
}

export function getSectionMetadata() {
    const sections = document.querySelectorAll('main > div');

    return Array.from(sections).map((section, index) => ({
        sectionId: section.id || `section-${index + 1}`,
        animate: section.dataset.animate || '',
        trackClicks: section.dataset.trackClicks === 'true',
        faqCategory: section.dataset.faqCategory || '',
        trackImpression: section.dataset.trackImpression === 'true',
        ctaId: section.dataset.ctaId || '',
    }));
}

export function initMetadataHandler() {
    const pageMetadata = getPageMetadata();
    const sectionMetadata = getSectionMetadata();

    window.digitalData = {
        page: {
            title: 'SolarSmart Home',
            template: 'homepage',
            audience: 'consumer',
        },


        sections: [],


        events: [
            {
                event: 'page_view',
                page: '/index',
            },
            {
                event: 'click',
                element: 'Explore Solutions',
            },
            {
                event: 'form_submit',
                form: 'contact-form',
            },
        ],
    };

    console.log('SolarSmart Page Metadata:', pageMetadata);
    console.log('SolarSmart Section Metadata:', sectionMetadata);

    document.addEventListener('click', (event) => {
        const section = event.target.closest('main > div');

        if (!section || section.dataset.trackClicks !== 'true') return;

        const link = event.target.closest('a, button');

        if (!link) return;

        const clickData = {
            event: 'section-click',
            sectionId: section.id || '',
            ctaId: section.dataset.ctaId || '',
            elementText: link.textContent.trim(),
            href: link.href || '',
        };

        window.dispatchEvent(
            new CustomEvent('solarsmart:section-click', {
                detail: clickData,
            }),
        );

        console.log('SolarSmart Click Event:', clickData);
    });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const section = entry.target;

                if (section.dataset.trackImpression !== 'true') return;

                const impressionData = {
                    event: 'section-impression',
                    sectionId: section.id || '',
                    ctaId: section.dataset.ctaId || '',
                };

                window.dispatchEvent(
                    new CustomEvent('solarsmart:section-impression', {
                        detail: impressionData,
                    }),
                );

                console.log('SolarSmart Impression:', impressionData);

                observer.unobserve(section);
            });
        }, {
            threshold: 0.5,
        });

        document.querySelectorAll('main > div').forEach((section) => {
            if (section.dataset.trackImpression === 'true') {
                observer.observe(section);
            }
        });
    }

    return window.digitalData;
}
