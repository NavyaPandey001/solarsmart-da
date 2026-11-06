import { decorateBlocks, loadBlocks } from './scripts/aem.js';

import { loadHeader } from './blocks/header/header.js';
import { loadFooter } from './blocks/footer/footer.js';

console.log('scripts.js running');

async function loadPage() {
    const header = document.createElement('header');
    document.body.prepend(header);

    const footer = document.createElement('footer');
    document.body.append(footer);

    await loadHeader(header);
    await loadFooter(footer);

    const main = document.querySelector('main');

    if (main) {
        decorateBlocks(main);
        await loadBlocks(main);
    }

    console.log('Header, footer and blocks loaded');
}

loadPage();

