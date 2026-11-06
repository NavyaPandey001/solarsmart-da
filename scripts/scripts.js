import { loadHeader, loadFooter } from '../blocks/header/header.js';

async function loadPage() {
    const header = document.createElement('header');
    document.body.prepend(header);

    const footer = document.createElement('footer');
    document.body.append(footer);

    await loadHeader(header);
    await loadFooter(footer);
}

loadPage();