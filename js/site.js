// =============================================================================
// FILE: site.js
// PROJECT: Carnivore Command Center
// VERSION: v1.2
// DESCRIPTION:
//   Shared site behavior for CCC pages.
//   Handles footer year, active navigation highlighting, and mobile menu toggle.
// =============================================================================

(function () {
  "use strict";

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const path =
    window.location.pathname.replace(/\/$/, "") || "/";

  document.querySelectorAll(".site-nav a").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    const normalized =
      href === "/"
        ? "/"
        : href.replace(/\/$/, "");

    if (normalized === path) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  const toggle = document.querySelector(".site-header__toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = nav.classList.toggle("is-open");

    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-is-open", isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-is-open");
    });
  });

  document.addEventListener("click", function (event) {
    const clickedInsideNav = nav.contains(event.target);
    const clickedToggle = toggle.contains(event.target);

    if (!clickedInsideNav && !clickedToggle) {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-is-open");
    }
  });
})();