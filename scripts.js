import { loadHeader } from './blocks/header/header.js';
import { loadFooter } from './blocks/footer/footer.js';
import { decorateBlocks, loadBlocks } from './scripts/aem.js';

console.log('scripts.js running');

async function loadPage() {
    console.log('loading page');

    const header = document.createElement('header');
    document.body.prepend(header);

    const footer = document.createElement('footer');
    document.body.append(footer);

    await loadHeader(header);
    await loadFooter(footer);

    // Find and initialize blocks on the page
    decorateBlocks(document.body);
    await loadBlocks(document.body);

    console.log('header, footer and blocks loaded');
}

loadPage();