/*
===============================================================================
FILE: ccc-engine.js
PROJECT: Carnivore Command Center
VERSION: v1.1
AUTHOR: WDC / Carnivore Command Center
DESCRIPTION:
  Frontend-only dashboard engine for Carnivore Command Center.

  This engine powers the daily-use beta dashboard by handling:
  - readiness scoring
  - hydration scoring
  - stress, sleep, and factor rendering
  - protocol recommendation logic
  - dynamic Next Up card logic
  - streak calculation
  - check-in persistence using localStorage
  - dashboard UI updates

DEPENDENCIES:
  - No external JavaScript libraries
  - Requires matching element IDs in src/dashboard/index.html
  - Uses browser localStorage

IMPORTANT:
  - This is intentionally frontend-only for the founder beta.
  - Future backend migration target: Supabase or similar account/cloud system.
  - Keep this file simple, readable, and easy to evolve.
===============================================================================
*/

(() => {
  "use strict";

  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  const STORAGE_KEY = "ccc_checkins_v1";
  const LAST_ENTRY_KEY = "ccc_last_entry_v1";

  const DEFAULT_INPUTS = {
    sleep: 7,
    mood: 8,
    stress: 3,
    digestion: "Good",
    soreness: "Mild",
    workoutYesterday: "yes"
  };

  // ============================================================================
  // DOM HELPERS
  // ============================================================================

  const byId = (id) => document.getElementById(id);

  const setText = (id, value) => {
    const el = byId(id);

    if (el) {
      el.textContent = value;
    }
  };

  const clamp = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
  };

  // ============================================================================
  // ELEMENT CACHE
  // ============================================================================

  const els = {
    sleep: byId("sleep"),
    mood: byId("mood"),
    stress: byId("stress"),
    digestion: byId("digestion"),
    soreness: byId("soreness"),

    sleepValue: byId("sleepValue"),
    moodValue: byId("moodValue"),
    stressValue: byId("stressValue"),

    workoutButtons: Array.from(
      document.querySelectorAll("[data-workout]")
    ),

    submit: byId("submitCheckin")
  };

  // ============================================================================
  // STORAGE FUNCTIONS
  // ============================================================================

  function loadEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];

      return Array.isArray(parsed) ? parsed : [];

    } catch {
      return [];
    }
  }

  function saveEntries(entries) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(entries)
      );

    } catch {
      // localStorage can fail in private browsing or restricted environments.
    }
  }

  function loadLastEntry() {
    try {
      const raw = localStorage.getItem(LAST_ENTRY_KEY);
      return raw ? JSON.parse(raw) : null;

    } catch {
      return null;
    }
  }

  function saveLastEntry(entry) {
    try {
      localStorage.setItem(
        LAST_ENTRY_KEY,
        JSON.stringify(entry)
      );

    } catch {
      // No-op for local beta.
    }
  }

  // ============================================================================
  // LOCAL STATE
  // ============================================================================

  let entries = loadEntries();
  let workoutYesterday = DEFAULT_INPUTS.workoutYesterday;

  // ============================================================================
  // INPUT READING
  // ============================================================================

  function readInputs() {
    return {
      sleep: Number(els.sleep?.value || DEFAULT_INPUTS.sleep),
      mood: Number(els.mood?.value || DEFAULT_INPUTS.mood),
      stress: Number(els.stress?.value || DEFAULT_INPUTS.stress),
      digestion: els.digestion?.value || DEFAULT_INPUTS.digestion,
      soreness: els.soreness?.value || DEFAULT_INPUTS.soreness,
      workoutYesterday
    };
  }

  // ============================================================================
  // SCORE HELPERS
  // ============================================================================

  function scoreDigestion(value) {
    const map = {
      Bad: 35,
      Okay: 62,
      Good: 82,
      Great: 95
    };

    return map[value] || 70;
  }

  function scoreSoreness(value) {
    const map = {
      None: 95,
      Mild: 82,
      Medium: 62,
      High: 40
    };

    return map[value] || 70;
  }

  function scoreStress(stress) {
    return Math.round(
      clamp(
        100 - ((stress - 1) / 9) * 100,
        0,
        100
      )
    );
  }

  function scoreSleep(sleep) {
    return Math.round(
      clamp((sleep / 8) * 100, 0, 100)
    );
  }

  function scoreRecovery(soreness) {
    return scoreSoreness(soreness);
  }

  // ============================================================================
  // READINESS ENGINE
  // ============================================================================

  function computeReadiness(input) {
    const sleepScore = scoreSleep(input.sleep);

    const moodScore = Math.round(
      clamp((input.mood / 10) * 100, 0, 100)
    );

    const stressScore = scoreStress(input.stress);
    const digestionScore = scoreDigestion(input.digestion);
    const sorenessScore = scoreSoreness(input.soreness);

    const workoutBonus =
      input.workoutYesterday === "yes"
        ? 4
        : -2;

    const weighted =
      sleepScore * 0.30 +
      moodScore * 0.18 +
      stressScore * 0.22 +
      digestionScore * 0.15 +
      sorenessScore * 0.15 +
      workoutBonus;

    return Math.round(
      clamp(weighted, 25, 98)
    );
  }

  // ============================================================================
  // HYDRATION ENGINE
  // ============================================================================

  function computeHydration(input, readiness) {
    let hydration = 88;

    if (readiness < 65) hydration -= 14;
    if (input.stress >= 7) hydration -= 12;
    if (input.sleep < 6) hydration -= 8;
    if (input.mood <= 4) hydration -= 6;
    if (input.digestion === "Bad") hydration -= 8;

    return Math.round(
      clamp(hydration, 42, 96)
    );
  }

  // ============================================================================
  // MODE ENGINE
  // ============================================================================

  function getMode(readiness) {
    if (readiness >= 82) {
      return {
        zone: "Optimal Zone",
        mode: "Execute",
        delta: "▲ Ready to push"
      };
    }

    if (readiness >= 68) {
      return {
        zone: "Build Zone",
        mode: "Build",
        delta: "Stable output"
      };
    }

    if (readiness >= 52) {
      return {
        zone: "Recovery Zone",
        mode: "Recover",
        delta: "▼ Recovery needed"
      };
    }

    return {
      zone: "Reset Zone",
      mode: "Reset",
      delta: "▼ Reset required"
    };
  }

  // ============================================================================
  // LIMITER DETECTION
  // ============================================================================

  function getPrimaryLimiter(input, hydration, readiness) {
    if (hydration < 70) return "hydration";
    if (input.sleep < 6.5) return "sleep";
    if (input.stress >= 7) return "stress";

    if (
      input.digestion === "Bad" ||
      input.digestion === "Okay"
    ) {
      return "digestion";
    }

    if (
      input.soreness === "High" ||
      input.soreness === "Medium"
    ) {
      return "recovery";
    }

    if (readiness >= 82) return "performance";

    return "consistency";
  }

  // ============================================================================
  // PROTOCOL / RECOMMENDATION ENGINE
  // ============================================================================

  function buildProtocol(input, hydration, readiness) {
    const limiter =
      getPrimaryLimiter(input, hydration, readiness);

    const protocols = {
      hydration: {
        title: "Hydration First",
        insight:
          "Your hydration is low enough to affect energy, focus, digestion, and recovery.",
        recommendation:
          "Drink water early. Add electrolytes if training or sweating. Do not let coffee become your main fluid source.",
        missions: [
          "Hydrate + Electrolytes",
          "Walk 20 Minutes",
          "Protein on Target",
          "Sleep Priority"
        ],
        wins: [
          "32oz before noon",
          "Electrolytes added",
          "Hydration improved",
          "Energy stabilized"
        ],
        quote:
          "Water first. Then momentum."
      },

      sleep: {
        title: "Sleep Recovery",
        insight:
          "Low sleep suppresses recovery, focus, training output, and impulse control.",
        recommendation:
          "Reduce intensity today. Protect bedtime tonight. Hydrate and move early.",
        missions: [
          "Morning Sunlight",
          "Walk 20 Minutes",
          "Hydrate Early",
          "Early Bedtime"
        ],
        wins: [
          "Sunlight complete",
          "Hydration improved",
          "Stress reduced",
          "Sleep protected"
        ],
        quote:
          "You do not fix bad sleep with chaos."
      },

      stress: {
        title: "Stress Reduction",
        insight:
          "High stress flattens energy, digestion, recovery, and discipline.",
        recommendation:
          "Lower stimulation today. Walk, hydrate, breathe, and execute simply.",
        missions: [
          "Walk Outside",
          "Deep Work Block",
          "Hydrate Early",
          "No Late Caffeine"
        ],
        wins: [
          "Stress reduced",
          "Walk complete",
          "Focus improved",
          "Recovery protected"
        ],
        quote:
          "Reduce noise. Then execute."
      },

      digestion: {
        title: "Digestion Reset",
        insight:
          "Digestion issues affect energy, consistency, appetite control, and recovery.",
        recommendation:
          "Keep meals simple today. Hydrate. Walk after meals and reduce junk inputs.",
        missions: [
          "Simple Meals",
          "Hydrate Early",
          "Walk After Meal",
          "Track Digestion"
        ],
        wins: [
          "Simple meals complete",
          "Walk after eating",
          "Hydration improved",
          "Digestion tracked"
        ],
        quote:
          "Simple food. Simple data."
      },

      recovery: {
        title: "Recovery Focus",
        insight:
          "Recovery debt lowers output even when motivation is high.",
        recommendation:
          "Use movement, hydration, protein, mobility, and sleep instead of more intensity.",
        missions: [
          "Mobility 10 Min",
          "Walk 20 Min",
          "Protein on Target",
          "Sleep Priority"
        ],
        wins: [
          "Mobility complete",
          "Protein protected",
          "Hydration improved",
          "Recovery supported"
        ],
        quote:
          "Discipline is not always more intensity."
      },

      performance: {
        title: "Execute Mode",
        insight:
          "Readiness is high. Good day for training, focus, and building momentum.",
        recommendation:
          "Push today with structure. Train hard, hydrate, and finish meaningful work.",
        missions: [
          "Lift Hard",
          "Deep Work 90 Min",
          "Hydrate Early",
          "Protein Target"
        ],
        wins: [
          "Workout complete",
          "Deep work complete",
          "Protein target hit",
          "Momentum built"
        ],
        quote:
          "Momentum is hot. Do not waste it."
      },

      consistency: {
        title: "Consistency Day",
        insight:
          "Nothing is severely broken today. Keep execution simple and clean.",
        recommendation:
          "Hydrate, move, hit protein, and stay consistent.",
        missions: [
          "Hydrate Early",
          "Protein on Target",
          "Walk 20 Min",
          "Log Tonight"
        ],
        wins: [
          "Hydration improved",
          "Protein protected",
          "Movement complete",
          "Check-in logged"
        ],
        quote:
          "Boring consistency wins."
      }
    };

    return protocols[limiter];
  }

  // ============================================================================
  // NEXT UP ENGINE
  // ============================================================================

  function renderNextUp(input, readiness, hydration) {
    let title = "Stay Consistent Today";
    let text = "Protect momentum with simple execution.";

    if (hydration < 70) {
      title = "Hydrate Before More Coffee";
      text = "Low hydration is reducing energy, focus, digestion, and recovery.";

    } else if (input.sleep < 6) {
      title = "Protect Recovery Today";
      text = "Low sleep detected. Lower intensity and protect tonight's bedtime.";

    } else if (input.stress >= 7) {
      title = "Reduce Stress Load";
      text = "High stress is suppressing readiness. Walk, hydrate, and simplify.";

    } else if (
      input.soreness === "High" ||
      input.soreness === "Medium"
    ) {
      title = "Recovery Work First";
      text = "Soreness is elevated. Mobility, walking, protein, and sleep matter.";

    } else if (
      input.digestion === "Bad" ||
      input.digestion === "Okay"
    ) {
      title = "Keep Food Simple";
      text = "Digestion needs a clean baseline. Simple meals and a post-meal walk.";

    } else if (readiness >= 82) {
      title = "Push Your Main Mission";
      text = "High readiness detected. Strong day to train, focus, and build.";

    } else if (readiness >= 68) {
      title = "Build A Clean Day";
      text = "Solid readiness. Execute the basics and protect momentum.";

    } else {
      title = "Reset The System";
      text = "Low readiness. Hydrate, walk, eat simply, and avoid ego training.";
    }

    setText("nextUpTitle", title);
    setText("nextUpText", text);
  }

  // ============================================================================
  // STREAK ENGINE
  // ============================================================================

  function normalizeDay(dateLike) {
    const d = new Date(dateLike);

    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    ).toISOString();
  }

  function computeStreak(entriesList) {
    if (!entriesList.length) {
      return 0;
    }

    const uniqueDays = Array.from(
      new Set(
        entriesList.map((entry) => normalizeDay(entry.ts))
      )
    ).sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;

    let cursor = new Date();

    cursor = new Date(
      cursor.getFullYear(),
      cursor.getMonth(),
      cursor.getDate()
    );

    for (const day of uniqueDays) {
      const expected = cursor.toISOString();

      if (day === expected) {
        streak++;

        cursor.setDate(
          cursor.getDate() - 1
        );

        continue;
      }

      if (streak === 0) {
        cursor.setDate(
          cursor.getDate() - 1
        );

        if (day === cursor.toISOString()) {
          streak++;

          cursor.setDate(
            cursor.getDate() - 1
          );

          continue;
        }
      }

      break;
    }

    return streak;
  }

  // ============================================================================
  // RENDER: INPUT VALUES
  // ============================================================================

  function renderInputs(input) {
    if (els.sleepValue) {
      els.sleepValue.textContent =
        input.sleep.toFixed(1);
    }

    if (els.moodValue) {
      els.moodValue.textContent =
        String(input.mood);
    }

    if (els.stressValue) {
      els.stressValue.textContent =
        String(input.stress);
    }
  }

  // ============================================================================
  // RENDER: READINESS
  // ============================================================================

  function renderReadiness(readiness, mode) {
    setText("readinessScoreTop", readiness);
    setText("readinessScoreMain", readiness);
    setText("readinessZoneTop", mode.zone);
    setText("readinessDeltaTop", mode.delta);
    setText("modeMain", mode.mode + " Mode");
  }

  // ============================================================================
  // RENDER: HYDRATION
  // ============================================================================

  function renderHydration(hydration) {
    setText("hydrationPercent", hydration + "%");
    setText("hydrationFactorScore", hydration);

    const liters =
      ((3.6 * hydration) / 100).toFixed(1);

    setText(
      "hydrationGoal",
      liters + "L / 3.6L goal"
    );
  }

  // ============================================================================
  // RENDER: STRESS
  // ============================================================================

  function renderStress(input) {
    const stress = Number(input.stress || 3);

    let label = "Low";
    let detail = "HRV: 72";

    if (stress >= 8) {
      label = "High";
      detail = "Recovery pressure high";

    } else if (stress >= 5) {
      label = "Moderate";
      detail = "Monitor output";
    }

    setText("stressStatus", label);
    setText("stressDetail", detail);
  }

  // ============================================================================
  // RENDER: SLEEP
  // ============================================================================

  function renderSleep(input) {
    const sleep = Number(input.sleep || 7);
    const hours = Math.floor(sleep);
    const minutes = Math.round((sleep - hours) * 60);

    setText(
      "sleepStatus",
      hours + "h " + minutes + "m"
    );

    setText(
      "sleepDetail",
      sleep >= 8
        ? "Goal hit"
        : "Goal: 8h"
    );
  }

  // ============================================================================
  // RENDER: FACTORS
  // ============================================================================

  function renderFactors(input, readiness, hydration) {
    const sleepScore = scoreSleep(input.sleep);
    const stressScore = scoreStress(input.stress);
    const recoveryScore = scoreRecovery(input.soreness);

    setText("sleepFactorScore", sleepScore);
    setText("hrvFactorScore", stressScore);
    setText("recoveryFactorScore", recoveryScore);
    setText("hydrationFactorScore", hydration);
    setText("stressFactorScore", stressScore);
  }

  // ============================================================================
  // RENDER: PROTOCOL
  // ============================================================================

  function renderProtocol(protocol) {
    setText(
      "topInsightTitle",
      "Today's Priority: " + protocol.title
    );

    setText(
      "topInsightText",
      protocol.insight
    );

    setText(
      "recommendationText",
      protocol.recommendation
    );

    setText("mission1", protocol.missions[0]);
    setText("mission2", protocol.missions[1]);
    setText("mission3", protocol.missions[2]);
    setText("mission4", protocol.missions[3]);

    setText("win1", protocol.wins[0]);
    setText("win2", protocol.wins[1]);
    setText("win3", protocol.wins[2]);
    setText("focusTop", protocol.wins[3]);

    setText("coachQuote", protocol.quote);
  }

  // ============================================================================
  // RENDER: STREAK
  // ============================================================================

  function renderStreak(entriesList) {
    const streak = computeStreak(entriesList);

    const label =
      streak > 0
        ? streak + " Days"
        : "Start Today";

    const detail =
      streak > 0
        ? "Keep it moving."
        : "Log today to begin.";

    setText("streakValue", label);
    setText("sidebarStreakValue", label);
    setText("sidebarStreakDetail", detail);
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  function render(save = false) {
    const input = readInputs();
    const readiness = computeReadiness(input);
    const hydration = computeHydration(input, readiness);
    const mode = getMode(readiness);
    const protocol = buildProtocol(input, hydration, readiness);

    renderInputs(input);
    renderReadiness(readiness, mode);
    renderHydration(hydration);
    renderStress(input);
    renderSleep(input);
    renderFactors(input, readiness, hydration);
    renderProtocol(protocol);
    renderNextUp(input, readiness, hydration);
    renderStreak(entries);

    if (save) {
      const entry = {
        ts: new Date().toISOString(),
        ...input,
        readiness,
        hydration,
        mode: mode.mode,
        protocol: protocol.title
      };

      entries.push(entry);
      entries = entries.slice(-90);

      saveEntries(entries);
      saveLastEntry(entry);

      renderStreak(entries);

      if (els.submit) {
        els.submit.textContent = "Check-In Saved";

        setTimeout(() => {
          if (els.submit) {
            els.submit.textContent = "Submit Check-In";
          }
        }, 1400);
      }
    }
  }

  // ============================================================================
  // EVENT WIRING
  // ============================================================================

  function wireEvents() {
    els.workoutButtons.forEach((button) => {
      button.addEventListener("click", () => {
        workoutYesterday =
          button.dataset.workout || DEFAULT_INPUTS.workoutYesterday;

        els.workoutButtons.forEach((candidate) => {
          candidate.classList.remove("is-active");
        });

        button.classList.add("is-active");

        render(false);
      });
    });

    [
      els.sleep,
      els.mood,
      els.stress,
      els.digestion,
      els.soreness

    ].forEach((el) => {
      if (!el) return;

      el.addEventListener(
        "input",
        () => render(false)
      );

      el.addEventListener(
        "change",
        () => render(false)
      );
    });

    if (els.submit) {
      els.submit.addEventListener(
        "click",
        () => render(true)
      );
    }
  }

  // ============================================================================
  // INITIAL STATE RESTORE
  // ============================================================================

  function restoreLastEntry() {
    const lastEntry =
      loadLastEntry() ||
      entries[entries.length - 1];

    if (!lastEntry) return;

    if (
      els.sleep &&
      typeof lastEntry.sleep === "number"
    ) {
      els.sleep.value = lastEntry.sleep;
    }

    if (
      els.mood &&
      typeof lastEntry.mood === "number"
    ) {
      els.mood.value = lastEntry.mood;
    }

    if (
      els.stress &&
      typeof lastEntry.stress === "number"
    ) {
      els.stress.value = lastEntry.stress;
    }

    if (
      els.digestion &&
      lastEntry.digestion
    ) {
      els.digestion.value = lastEntry.digestion;
    }

    if (
      els.soreness &&
      lastEntry.soreness
    ) {
      els.soreness.value = lastEntry.soreness;
    }

    workoutYesterday =
      lastEntry.workoutYesterday ||
      DEFAULT_INPUTS.workoutYesterday;

    els.workoutButtons.forEach((button) => {
      button.classList.toggle(
        "is-active",
        button.dataset.workout === workoutYesterday
      );
    });
  }

  // ============================================================================
  // INITIALIZE
  // ============================================================================

  function init() {
    restoreLastEntry();
    wireEvents();
    render(false);

    // Debug access for founder beta testing.
    window.CCCEngine = {
      render,
      loadEntries,
      computeReadiness,
      computeHydration,
      buildProtocol,
      computeStreak
    };
  }

  // ============================================================================
  // STARTUP
  // ============================================================================

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {
    init();
  }

})();
