import { initMetadataHandler } from './metadata-handler.js';
import { loadHeader } from '../blocks/header/header.js';
import { loadFooter } from '../blocks/footer/footer.js';
import { decorateBlocks, loadBlocks } from './aem.js';

console.log('scripts.js running');

function loadGlobalCSS() {
    const href = '/styles/styles.css';

    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.href = href;

        document.head.append(link);

        console.log('Global styles.css loaded:', href);
    }
}

async function loadPage() {

    console.log('Loading page');

    loadGlobalCSS();

    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    await loadHeader(header);
    await loadFooter(footer);

    decorateBlocks(document.body);
    await loadBlocks(document.body);

    initMetadataHandler();

    console.log('Header, footer, blocks and metadata loaded');
}

loadPage();
