import { initMetadataHandler } from './metadata-handler.js';

import { loadHeader } from '../blocks/header/header.js';

import { loadFooter } from '../blocks/footer/footer.js';

import { decorateBlocks, loadBlocks } from './aem.js';

console.log('scripts.js running');

async function loadPage() {

    function loadGlobalCSS() {
        const href = '/styles/styles.css';

        if (!document.querySelector(`link[href="${href}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            document.head.append(link);
        }
    }

    console.log('loading page');

    const header = document.createElement('header');
    document.body.prepend(header);

    const footer = document.createElement('footer');
    document.body.append(footer);

    await loadHeader(header);

    await loadFooter(footer);

    decorateBlocks(document.body);

    await loadBlocks(document.body);

    // Initialize page and section metadata
    initMetadataHandler();

    console.log('header, footer, blocks and metadata loaded');
}

loadPage();
