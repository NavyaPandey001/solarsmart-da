export function decorateBlocks(main) {
    const blocks = main.querySelectorAll(
        '.cards, .hero, .savings-calculator, .testimonials'
    );

    blocks.forEach((block) => {
        block.classList.add('block');
    });
}

export async function loadBlocks(main) {
    const blocks = main.querySelectorAll(
        '.blog-list, .cards, .columns, .contact-form, .hero, .map, .offer-banner, .savings-calculator, .stats, .testimonials, .timeline'
    );

    for (const block of blocks) {
        if (block.classList.contains('cards')) {
            const { default: decorateCards } = await import(
                '../blocks/cards/cards.js'
                );
            decorateCards(block);
        }

        if (block.classList.contains('hero')) {
            const { default: decorateHero } = await import(
                '../blocks/hero/hero.js'
                );
            decorateHero(block);
        }

        if (block.classList.contains('savings-calculator')) {
            const { default: decorateCalculator } = await import(
                '../blocks/savings-calculator/savings-calculator.js'
                );
            decorateCalculator(block);
        }

        if (block.classList.contains('testimonials')) {
            const { default: decorateTestimonials } = await import(
                '../blocks/testimonials/testimonials.js'
                );
            decorateTestimonials(block);
        }
        if (block.classList.contains('timeline')) {
            const { default: decorateTimeline } = await import(
                '../blocks/timeline/timeline.js'
                );
            decorateTimeline(block);
        }
        if (block.classList.contains('columns')) {
            const { default: decorateColumns } = await import(
                '../blocks/columns/columns.js'
                );
            decorateColumns(block);
        }
        if (block.classList.contains('contact-form')) {
            const { default: decorateForm } = await import(
                '../blocks/contact-form/contact-form.js'
                );
            decorateForm(block);
        }
        if (block.classList.contains('map')) {
            const { default: decorateMap } = await import(
                '../blocks/map/map.js'
                );
            decorateMap(block);
        }
        if (block.classList.contains('stats')) {
            const { default: decorateStats } = await import(
                '../blocks/stats/stats.js'
                );
            decorateStats(block);
        }
        if (block.classList.contains('blog-list')) {
            const { default: decorateBlogList } = await import(
                '../blocks/blog-list/blog-list.js'
                );
            decorateBlogList(block);
        }
        if (block.classList.contains('offer-banner')) {
            const { default: decorateBanner } = await import(
                '../blocks/offer-banner/offer-banner.js'
                );
            decorateBanner(block);
        }
    }
}