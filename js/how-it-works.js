/* =============================================================================
   CCC HOW IT WORKS — LIGHTWEIGHT ONBOARDING ENGINE
============================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const counter = document.getElementById("cccStepCounter");
  const progress = document.getElementById("cccStepProgress");
  const chips = Array.from(document.querySelectorAll(".ccc-onboarding-flow span"));

  if (!counter || !progress) return;

  const stepOrder = [
    "welcome",
    "sleep",
    "stress",
    "mood",
    "digestion",
    "soreness",
    "nutrition",
    "weight",
    "timer",
    "save",
    "readiness",
    "patterns",
    "damage",
    "momentum",
    "dashboard"
  ];

  const stepLabels = {
    welcome: "Welcome",
    sleep: "Step 1 — Sleep",
    stress: "Step 2 — Stress",
    mood: "Step 3 — Mood",
    digestion: "Step 4 — Digestion",
    soreness: "Step 5 — Soreness",
    nutrition: "Step 6 — Nutrition",
    weight: "Step 7 — Weight",
    timer: "Step 8 — Ritual",
    save: "Step 9 — Save",
    readiness: "Step 10 — Readiness",
    patterns: "Step 11 — Patterns",
    damage: "Step 12 — Damage Control",
    momentum: "Step 13 — Momentum",
    dashboard: "Step 14 — Dashboard"
  };

  const chipMap = {
    sleep: "Sleep",
    stress: "Stress",
    mood: "Mood",
    digestion: "Digestion",
    soreness: "Soreness",
    nutrition: "Nutrition",
    weight: "Weight",
    timer: "Ritual",
    save: "Save",
    readiness: "Readiness",
    patterns: "Patterns",
    damage: "Damage Control",
    momentum: "Momentum",
    dashboard: "Dashboard"
  };

  function updateActiveChip(key) {
    chips.forEach(chip => {
      chip.classList.toggle("is-active", chip.textContent.trim() === chipMap[key]);
    });
  }

  function updateProgressFromHash() {
    const hash = window.location.hash.replace("#", "") || "welcome";
    const key = stepOrder.includes(hash) ? hash : "welcome";
    const index = stepOrder.indexOf(key);

    counter.textContent = stepLabels[key];

    const percent = index === 0
      ? 6
      : (index / (stepOrder.length - 1)) * 100;

    progress.style.width = `${percent}%`;

    updateActiveChip(key);
  }

  window.addEventListener("hashchange", updateProgressFromHash);

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", () => {
      setTimeout(updateProgressFromHash, 80);
    });
  });

  updateProgressFromHash();
});