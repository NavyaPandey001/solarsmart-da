
function loadCSS(href) {
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }
}

export async function loadFooter(block) {

    // Automatically load footer CSS
    loadCSS('/blocks/footer/footer.css');

    block.innerHTML = `
        <div class="footer-content">
            <p>© 2026 SolarSmart. All rights reserved.</p>

            <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/privacy-policy">Privacy Policy</a></li>
            </ul>
        </div>
    `;
}

