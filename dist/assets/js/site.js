(function(){
  const year = new Date().getFullYear();

  const headerHTML = `
    <header class="site-header">
      <a class="brand" href="/">
        <img src="/assets/ccc_logo_primary_transparent.png" alt="Carnivore Command Center logo" />
        <div class="name">
          <strong>Carnivore</strong>
          <span>Command Center</span>
        </div>
      </a>

      <nav class="nav" aria-label="Primary">
        <a href="/about/">About</a>
        <a href="/beta/">Beta</a>
        <a href="/investor/">Investors</a>
        <a href="/contact/">Contact</a>
        <a href="/privacy/">Privacy</a>
        <a href="/terms/">Terms</a>
        <a href="/disclaimer/">Disclaimer</a>
        <span class="cta">Early Access • Building now</span>
      </nav>
    </header>
  `;

  const footerHTML = `
    <footer class="footer">
      <div>© ${year} Carnivore Command Center. All rights reserved.</div>
      <div>
        <a href="/privacy/">Privacy</a> ·
        <a href="/terms/">Terms</a> ·
        <a href="/disclaimer/">Disclaimer</a>
      </div>
    </footer>
  `;

  const headerMount = document.getElementById("site-header");
  if (headerMount) headerMount.innerHTML = headerHTML;

  const footerMount = document.getElementById("site-footer");
  if (footerMount) footerMount.innerHTML = footerHTML;
})();
