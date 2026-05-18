/*
===============================================================================
FILE: ccc-engine.js
PROJECT: Carnivore Command Center
VERSION: v1.0
PURPOSE:
  Frontend-only CCC dashboard engine for localStorage check-ins, readiness scoring,
  hydration logic, mode recommendations, streak handling, and protocol generation.
===============================================================================
*/

(() => {
  "use strict";

  // ============================================================================
  // STORAGE
  // ============================================================================

  const STORAGE_KEY = "ccc_checkins_v1";
  const LAST_ENTRY_KEY = "ccc_last_entry_v1";

  // ============================================================================
  // HELPERS
  // ============================================================================

  const byId = (id) => document.getElementById(id);

  const setText = (id, value) => {
    const el = byId(id);
    if (el) el.textContent = value;
  };

  const clamp = (value, min, max) =>
    Math.max(min, Math.min(max, value));

  // ============================================================================
  // ELEMENTS
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
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveEntries(entries) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(entries)
    );
  }

  function saveLastEntry(entry) {
    localStorage.setItem(
      LAST_ENTRY_KEY,
      JSON.stringify(entry)
    );
  }

  function loadLastEntry() {
    try {
      const raw = localStorage.getItem(LAST_ENTRY_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // ============================================================================
  // STATE
  // ============================================================================

  let entries = loadEntries();

  let workoutYesterday = "yes";

  // ============================================================================
  // INPUTS
  // ============================================================================

  function readInputs() {
    return {
      sleep: Number(els.sleep?.value || 7),
      mood: Number(els.mood?.value || 8),
      stress: Number(els.stress?.value || 3),
      digestion: els.digestion?.value || "Good",
      soreness: els.soreness?.value || "Mild",
      workoutYesterday
    };
  }

  // ============================================================================
  // SCORING ENGINE
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

  function computeReadiness(input) {

    const sleepScore =
      clamp((input.sleep / 8) * 100, 0, 100);

    const moodScore =
      clamp((input.mood / 10) * 100, 0, 100);

    const stressScore =
      clamp(
        100 - ((input.stress - 1) / 9) * 100,
        0,
        100
      );

    const digestionScore =
      scoreDigestion(input.digestion);

    const sorenessScore =
      scoreSoreness(input.soreness);

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
  // HYDRATION
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

    if (input.sleep < 6.5)
      return "sleep";

    if (input.stress >= 7)
      return "stress";

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

    if (readiness >= 82)
      return "performance";

    return "consistency";
  }

  // ============================================================================
  // PROTOCOL ENGINE
  // ============================================================================

  function buildProtocol(input, hydration, readiness) {

    const limiter =
      getPrimaryLimiter(
        input,
        hydration,
        readiness
      );

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
  // STREAK ENGINE
  // ============================================================================

  function computeStreak(entriesList) {

    if (!entriesList.length)
      return 0;

    const uniqueDays = Array.from(
      new Set(
        entriesList.map((entry) => {
          const d = new Date(entry.ts);

          return new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate()
          ).toISOString();
        })
      )
    ).sort((a, b) =>
      new Date(b) - new Date(a)
    );

    let streak = 0;

    let cursor = new Date();

    cursor = new Date(
      cursor.getFullYear(),
      cursor.getMonth(),
      cursor.getDate()
    );

    for (const day of uniqueDays) {

      const expected =
        cursor.toISOString();

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
  // RENDER FUNCTIONS
  // ============================================================================

  function renderInputs(input) {

    if (els.sleepValue)
      els.sleepValue.textContent =
        input.sleep.toFixed(1);

    if (els.moodValue)
      els.moodValue.textContent =
        input.mood;

    if (els.stressValue)
      els.stressValue.textContent =
        input.stress;
  }

  function renderReadiness(
    readiness,
    mode
  ) {

    setText(
      "readinessScoreTop",
      readiness
    );

    setText(
      "readinessScoreMain",
      readiness
    );

    setText(
      "readinessZoneTop",
      mode.zone
    );

    setText(
      "readinessDeltaTop",
      mode.delta
    );

    setText(
      "modeMain",
      mode.mode + " Mode"
    );
  }

  function renderHydration(hydration) {

    setText(
      "hydrationPercent",
      hydration + "%"
    );

    setText(
      "hydrationFactorScore",
      hydration
    );

    const liters =
      (
        (3.6 * hydration) / 100
      ).toFixed(1);

    setText(
      "hydrationGoal",
      liters + "L / 3.6L goal"
    );
  }

  function renderStress(input) {

  const stress =
    Number(input.stress || 3);

  let label = "Low";
  let detail = "HRV: 72";

  if (stress >= 8) {

    label = "High";
    detail =
      "Recovery pressure high";

  } else if (stress >= 5) {

    label = "Moderate";
    detail =
      "Monitor output";
  }

  setText(
    "stressStatus",
    label
  );

  setText(
    "stressDetail",
    detail
  );
}

  function renderProtocol(protocol) {

    setText(
      "topInsightTitle",
      "Today's Priority: " +
        protocol.title
    );

    setText(
      "topInsightText",
      protocol.insight
    );

    setText(
      "recommendationText",
      protocol.recommendation
    );

    setText(
      "mission1",
      protocol.missions[0]
    );

    setText(
      "mission2",
      protocol.missions[1]
    );

    setText(
      "mission3",
      protocol.missions[2]
    );

    setText(
      "mission4",
      protocol.missions[3]
    );

    setText(
      "win1",
      protocol.wins[0]
    );

    setText(
      "win2",
      protocol.wins[1]
    );

    setText(
      "win3",
      protocol.wins[2]
    );

    setText(
      "focusTop",
      protocol.wins[3]
    );

    setText(
      "coachQuote",
      protocol.quote
    );
  }

  function renderStreak(entriesList) {

    const streak =
      computeStreak(entriesList);

    const label =
      streak > 0
        ? streak + " Days"
        : "Start Today";

    setText(
      "streakValue",
      label
    );

    setText(
      "sidebarStreakValue",
      label
    );
  }
    // ============================================================================
  // MAIN RENDER
  // ============================================================================

  function render(save = false) {

    const input =
      readInputs();

    const readiness =
      computeReadiness(input);

    const hydration =
      computeHydration(
        input,
        readiness
      );

    const mode =
      getMode(readiness);

    const protocol =
      buildProtocol(
        input,
        hydration,
        readiness
      );

    renderInputs(input);

    renderReadiness(
      readiness,
      mode
    );

    renderHydration(
  hydration
);

renderStress(input);

renderSleep(input);

renderFactors(
  input,
  readiness,
  hydration
);
    function renderSleep(input) {

  const sleep =
    Number(input.sleep || 7);

  const hours =
    Math.floor(sleep);

  const minutes =
    Math.round((sleep - hours) * 60);

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

function renderFactors(input, readiness, hydration) {

  const sleepScore =
    Math.round(
      clamp((input.sleep / 8) * 100, 0, 100)
    );

  const stressScore =
    Math.round(
      clamp(
        100 - ((input.stress - 1) / 9) * 100,
        0,
        100
      )
    );

  const recoveryScore =
    input.soreness === "None"
      ? 95
      : input.soreness === "Mild"
        ? 82
        : input.soreness === "Medium"
          ? 62
          : 42;

  setText("sleepFactorScore", sleepScore);
  setText("hrvFactorScore", stressScore);
  setText("recoveryFactorScore", recoveryScore);
  setText("hydrationFactorScore", hydration);
  setText("stressFactorScore", stressScore);
}

    renderProtocol(
      protocol
    );

    renderStreak(entries);

    // ========================================================================
    // SAVE ENTRY
    // ========================================================================

    if (save) {

      const entry = {
        ts: new Date().toISOString(),

        ...input,

        readiness,
        hydration,

        mode: mode.mode,

        protocol:
          protocol.title
      };

      entries.push(entry);

      entries =
        entries.slice(-90);

      saveEntries(entries);

      saveLastEntry(entry);

      renderStreak(entries);

      if (els.submit) {

        els.submit.textContent =
          "Check-In Saved";

        setTimeout(() => {

          els.submit.textContent =
            "Submit Check-In";

        }, 1400);
      }
    }
  }

  // ============================================================================
  // EVENT WIRING
  // ============================================================================

  function wireEvents() {

    els.workoutButtons.forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            workoutYesterday =
              button.dataset.workout;

            els.workoutButtons.forEach(
              (candidate) => {

                candidate.classList.remove(
                  "is-active"
                );
              }
            );

            button.classList.add(
              "is-active"
            );

            render(false);
          }
        );
      }
    );

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
  // INITIALIZE
  // ============================================================================

  function init() {

    const lastEntry =
      loadLastEntry();

    if (lastEntry) {

      if (
        els.sleep &&
        typeof lastEntry.sleep ===
          "number"
      ) {
        els.sleep.value =
          lastEntry.sleep;
      }

      if (
        els.mood &&
        typeof lastEntry.mood ===
          "number"
      ) {
        els.mood.value =
          lastEntry.mood;
      }

      if (
        els.stress &&
        typeof lastEntry.stress ===
          "number"
      ) {
        els.stress.value =
          lastEntry.stress;
      }

      if (
        els.digestion &&
        lastEntry.digestion
      ) {
        els.digestion.value =
          lastEntry.digestion;
      }

      if (
        els.soreness &&
        lastEntry.soreness
      ) {
        els.soreness.value =
          lastEntry.soreness;
      }

      workoutYesterday =
        lastEntry.workoutYesterday ||
        "yes";

      els.workoutButtons.forEach(
        (button) => {

          button.classList.toggle(
            "is-active",

            button.dataset.workout ===
              workoutYesterday
          );
        }
      );
    }

    wireEvents();

    render(false);

    // ========================================================================
    // DEBUG ACCESS
    // ========================================================================

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
  // START
  // ============================================================================

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();
  }

})();