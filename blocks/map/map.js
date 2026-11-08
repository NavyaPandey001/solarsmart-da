
function loadCSS() {
    if (!document.querySelector('link[href="/blocks/map/map.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/blocks/map/map.css';
        document.head.append(link);
    }
}

export default function decorate(block) {
    loadCSS();

    const rows = [...block.children];

    const heading = rows[0]?.textContent.trim() || 'Visit Us';
    const address = rows[1]?.textContent.trim() || '';

    const mapLink = rows
        .flatMap((row) => [...row.querySelectorAll('a')])
        .map((link) => link.href)
        .find((href) => href.includes('google.com/maps'));

    const mapText = rows
        .map((row) => row.textContent.trim())
        .find((text) => text.includes('google.com/maps'));

    const mapURL = mapLink || mapText;

    const section = document.createElement('div');
    section.className = 'map-container';

    const title = document.createElement('h3');
    title.textContent = heading;
    section.append(title);

    if (address) {
        const addressText = document.createElement('p');
        addressText.className = 'map-address';
        addressText.textContent = address;
        section.append(addressText);
    }

    if (mapURL && /^https:\/\/www\.google\.com\/maps/.test(mapURL)) {
        const iframe = document.createElement('iframe');

        iframe.src = mapURL;
        iframe.title = `Map showing ${address || heading}`;
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.allowFullscreen = true;

        section.append(iframe);
    } else {
        const fallback = document.createElement('p');
        fallback.textContent = 'Map location is not configured yet.';
        section.append(fallback);
    }

    block.replaceChildren(section);
}
