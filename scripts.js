import { loadHeader } from './blocks/header/header.js';
import { loadFooter } from './blocks/footer/footer.js';

console.log('scripts.js running');

async function loadPage() {
    console.log('loading page');

    const header = document.createElement('header');
    document.body.prepend(header);

    const footer = document.createElement('footer');
    document.body.append(footer);

    await loadHeader(header);
    await loadFooter(footer);

    console.log('header and footer loaded');
}

loadPage();