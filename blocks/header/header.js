
function loadCSS(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.href = href;

        document.head.appendChild(link);
    }
}

export async function loadHeader(block) {

    loadCSS('/blocks/header/header.css');

    block.innerHTML = `
        <nav class="header-nav">
            <div class="logo">SolarSmart</div>

            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/solutions">Solutions</a></li>
                <li><a href="/savings-calculator">Calculator</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    `;
}

