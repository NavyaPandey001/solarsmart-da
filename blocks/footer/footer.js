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