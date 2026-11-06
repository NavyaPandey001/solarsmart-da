export async function loadHeader(block) {
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

export async function loadFooter(block) {
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