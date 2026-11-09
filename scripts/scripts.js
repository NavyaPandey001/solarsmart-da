
import { initMetadataHandler } from './metadata-handler.js';
import { loadHeader } from '../blocks/header/header.js';
import { loadFooter } from '../blocks/footer/footer.js';
import { decorateBlocks, loadBlocks } from './aem.js';

console.log('scripts.js running');

// Load global CSS
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

    // IMPORTANT: Call the global CSS loader
    loadGlobalCSS();

    // Create header
    const header = document.createElement('header');
    document.body.prepend(header);

    // Create footer
    const footer = document.createElement('footer');
    document.body.append(footer);

    // Load header and footer
    await loadHeader(header);
    await loadFooter(footer);

    // Load custom blocks
    decorateBlocks(document.body);
    await loadBlocks(document.body);

    // Initialize metadata
    initMetadataHandler();

    console.log('Header, footer, blocks and metadata loaded');
}

loadPage();
