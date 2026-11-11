
function loadCSS() {
    if (!document.querySelector(
        'link[href="/blocks/offer-banner/offer-banner.css"]'
    )) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/blocks/offer-banner/offer-banner.css';
        document.head.append(link);
    }
}

export default function decorate(block) {
    loadCSS();

    // Extract the image from DA before replacing the block content
    const originalPicture = block.querySelector('picture');
    const originalImage = block.querySelector('img');

    let bannerImage = null;

    if (originalPicture) {
        bannerImage = originalPicture.cloneNode(true);
    } else if (originalImage) {
        bannerImage = originalImage.cloneNode(true);
    }

    // Main banner
    const banner = document.createElement('div');
    banner.className = 'offer-banner-container';

    // Two-column layout
    const layout = document.createElement('div');
    layout.className = 'offer-banner-layout';

    // Left content
    const content = document.createElement('div');
    content.className = 'offer-banner-content';

    const title = document.createElement('h2');
    title.textContent = 'Loading latest offers...';

    const description = document.createElement('p');
    description.textContent =
        'Please wait while we fetch our latest solar offers.';

    const discount = document.createElement('span');
    discount.className = 'offer-discount';

    const button = document.createElement('a');
    button.className = 'offer-cta';
    button.textContent = 'Explore Offers';
    button.href = '/solutions';

    content.append(title, description, discount, button);

    // Right image
    const imageContainer = document.createElement('div');
    imageContainer.className = 'offer-banner-image';

    if (bannerImage) {
        imageContainer.append(bannerImage);
    } else {
        imageContainer.classList.add('no-image');
    }

    // Assemble banner
    layout.append(content, imageContainer);
    banner.append(layout);

    block.replaceChildren(banner);

    // API URL
    const API_URL = 'https://solarsmart-api.free.beeceptor.com/offers';

    async function loadOffer() {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(
                    `API request failed: ${response.status}`
                );
            }

            const data = await response.json();

            if (
                !data.success ||
                !Array.isArray(data.offers) ||
                !data.offers.length
            ) {
                throw new Error('No offers available');
            }

            const offer = data.offers[0];

            title.textContent =
                offer.title || 'Special Solar Offer';

            description.textContent =
                offer.description ||
                'Explore our latest solar offers.';

            discount.textContent = offer.discount || '';

            button.textContent =
                offer.ctaText || 'Explore Offers';

            button.href = offer.ctaLink || '/solutions';

            banner.classList.add('offer-loaded');

        } catch (error) {
            title.textContent = 'Solar Offers';

            description.textContent =
                'Our latest offers are temporarily unavailable. Please check back soon.';

            discount.textContent = '';

            button.textContent = 'Explore Solutions';
            button.href = '/solutions';

            banner.classList.add('offer-error');

            console.error('Offer Banner API error:', error);
        }
    }

    loadOffer();
}
