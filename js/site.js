// js/site.js
(function () {
  // Footer year (safe on all pages)
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Active nav link highlighting
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;

    const normalized = href === "/" ? "/" : href.replace(/\/$/, "");
    if (normalized === path) {
      a.classList.add("is-active");
      a.setAttribute("aria-current", "page");
    }
  });

  // Mobile nav toggle
  const toggle = document.querySelector(".nav__toggle");
  const nav = document.querySelector(".nav-links[data-nav]");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close after click (mobile UX)
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
})();
