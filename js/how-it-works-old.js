/* =========================================================
CCC HOW IT WORKS ONBOARDING ENGINE
File: js/how-it-works.js
Purpose:
- Powers the welcome + 14-step onboarding walkthrough
- Keeps Welcome separate from numbered check-in steps
- Updates sticky dashboard simulation as users scroll
========================================================= */

const cccOnboardingSteps = [
  {
    key: "welcome",
    counter: "Welcome",
    progress: 4,
    label: "Welcome",
    ready: 82,
    ring: "var(--ccc-onboard-green)",
    inputLabel: "Today’s Focus",
    inputValue: "Guided Check-In",
    inputHelp: "Metabo walks you through each signal and shows what CCC learns.",
    sleep: "7.5h",
    stress: "3/10",
    mood: "Good",
    nutrition: "88%",
    coachTitle: "What CCC gives back",
    coachText: "Readiness, recovery direction, craving risk, and momentum guidance.",
    bars: [48, 58, 66, 74, 82]
  },
  {
    key: "sleep",
    counter: "Step 1 of 14",
    progress: 7,
    label: "Sleep",
    ready: 68,
    ring: "var(--ccc-onboard-yellow)",
    inputLabel: "Enter Sleep",
    inputValue: "6h 12m",
    inputHelp: "Log actual sleep. CCC uses this to estimate recovery debt.",
    sleep: "6.2h",
    stress: "3/10",
    mood: "Good",
    nutrition: "88%",
    coachTitle: "Why it helps",
    coachText: "Poor sleep can raise cravings and lower readiness before you feel it.",
    bars: [82, 78, 72, 68, 61]
  },
  {
    key: "stress",
    counter: "Step 2 of 14",
    progress: 14,
    label: "Stress",
    ready: 56,
    ring: "var(--ccc-onboard-yellow)",
    inputLabel: "Rate Stress",
    inputValue: "8 / 10",
    inputHelp: "High stress can impact cravings, focus, discipline, and sleep.",
    sleep: "6.2h",
    stress: "8/10",
    mood: "Tense",
    nutrition: "78%",
    coachTitle: "CCC learns",
    coachText: "Stress load helps predict difficult decision days before they spiral.",
    bars: [76, 70, 65, 58, 52]
  },
  {
    key: "mood",
    counter: "Step 3 of 14",
    progress: 21,
    label: "Mood",
    ready: 60,
    ring: "var(--ccc-onboard-yellow)",
    inputLabel: "Select Mood",
    inputValue: "Low / Drained",
    inputHelp: "Mood gives CCC emotional recovery context.",
    sleep: "6.2h",
    stress: "8/10",
    mood: "Low",
    nutrition: "78%",
    coachTitle: "Why it matters",
    coachText: "Mood trends can reveal burnout, consistency risk, and recovery strain.",
    bars: [70, 64, 60, 58, 56]
  },
  {
    key: "digestion",
    counter: "Step 4 of 14",
    progress: 28,
    label: "Digestion",
    ready: 58,
    ring: "var(--ccc-onboard-yellow)",
    inputLabel: "Digestion Status",
    inputValue: "Off Track",
    inputHelp: "Digestion is body feedback from food quality, stress, and recovery.",
    sleep: "6.2h",
    stress: "8/10",
    mood: "Low",
    nutrition: "70%",
    coachTitle: "CCC learns",
    coachText: "Digestion patterns help expose food reactions and recovery stress.",
    bars: [68, 63, 59, 56, 54]
  },
  {
    key: "soreness",
    counter: "Step 5 of 14",
    progress: 35,
    label: "Soreness",
    ready: 54,
    ring: "var(--ccc-onboard-red)",
    inputLabel: "Rate Soreness",
    inputValue: "High",
    inputHelp: "Soreness helps CCC understand physical recovery and training load.",
    sleep: "6.2h",
    stress: "8/10",
    mood: "Low",
    nutrition: "70%",
    coachTitle: "User benefit",
    coachText: "CCC can suggest when to push, maintain, or pull back intelligently.",
    bars: [64, 60, 55, 52, 49]
  },
  {
    key: "nutrition",
    counter: "Step 6 of 14",
    progress: 42,
    label: "Nutrition",
    ready: 72,
    ring: "var(--ccc-onboard-green)",
    inputLabel: "Nutrition Quality",
    inputValue: "92%",
    inputHelp: "Rate how well today’s food supported your goals.",
    sleep: "6.8h",
    stress: "5/10",
    mood: "Stable",
    nutrition: "92%",
    coachTitle: "Why it helps",
    coachText: "Clean inputs often improve energy, digestion, cravings, and recovery.",
    bars: [50, 56, 63, 69, 72]
  },
  {
    key: "weight",
    counter: "Step 7 of 14",
    progress: 49,
    label: "Weight",
    ready: 72,
    ring: "var(--ccc-onboard-green)",
    inputLabel: "Optional Weight",
    inputValue: "Optional",
    inputHelp: "Use weight as trend context, not daily judgment.",
    sleep: "6.8h",
    stress: "5/10",
    mood: "Stable",
    nutrition: "92%",
    coachTitle: "CCC learns",
    coachText: "Weight trends can be compared with sleep, stress, digestion, and nutrition.",
    bars: [50, 56, 63, 69, 72]
  },
  {
    key: "timer",
    counter: "Step 8 of 14",
    progress: 56,
    label: "Timer",
    ready: 74,
    ring: "var(--ccc-onboard-green)",
    inputLabel: "Daily Ritual",
    inputValue: "00:58",
    inputHelp: "The timer reinforces a short daily pause and reflection habit.",
    sleep: "6.8h",
    stress: "5/10",
    mood: "Stable",
    nutrition: "92%",
    coachTitle: "Why it matters",
    coachText: "The goal is intentional awareness, not rushing through another form.",
    bars: [52, 58, 64, 70, 74]
  },
  {
    key: "save",
    counter: "Step 9 of 14",
    progress: 63,
    label: "Save",
    ready: 76,
    ring: "var(--ccc-onboard-green)",
    inputLabel: "Save Check-In",
    inputValue: "Today Logged",
    inputHelp: "Saving creates today’s signal snapshot.",
    sleep: "6.8h",
    stress: "5/10",
    mood: "Stable",
    nutrition: "92%",
    coachTitle: "What happens next",
    coachText: "CCC updates readiness, trends, momentum, and coaching guidance.",
    bars: [55, 61, 67, 72, 76]
  },
  {
    key: "readiness",
    counter: "Step 10 of 14",
    progress: 70,
    label: "Readiness",
    ready: 76,
    ring: "var(--ccc-onboard-green)",
    inputLabel: "Readiness Score",
    inputValue: "76",
    inputHelp: "Your signals become one simple readiness view.",
    sleep: "6.8h",
    stress: "5/10",
    mood: "Stable",
    nutrition: "92%",
    coachTitle: "How to use it",
    coachText: "High means push. Medium means steady. Low means recover before you spiral.",
    bars: [55, 61, 67, 72, 76]
  },
  {
    key: "patterns",
    counter: "Step 11 of 14",
    progress: 77,
    label: "Patterns",
    ready: 80,
    ring: "var(--ccc-onboard-green)",
    inputLabel: "Pattern Learning",
    inputValue: "7-Day Trend",
    inputHelp: "CCC connects your signals over time.",
    sleep: "7.4h",
    stress: "4/10",
    mood: "Good",
    nutrition: "90%",
    coachTitle: "CCC reveals",
    coachText: "What improves readiness, what triggers cravings, and what restores momentum.",
    bars: [48, 55, 63, 72, 80]
  },
  {
    key: "damage",
    counter: "Step 12 of 14",
    progress: 84,
    label: "Damage Control",
    ready: 48,
    ring: "var(--ccc-onboard-red)",
    inputLabel: "Recovery Plan",
    inputValue: "Reset Mode",
    inputHelp: "One bad day is data — not defeat.",
    sleep: "5.1h",
    stress: "8/10",
    mood: "Low",
    nutrition: "45%",
    coachTitle: "Recovery guidance",
    coachText: "Hydrate, eat clean next meal, walk, sleep early, and log honestly.",
    bars: [82, 70, 45, 52, 61]
  },
  {
    key: "momentum",
    counter: "Step 13 of 14",
    progress: 92,
    label: "Momentum",
    ready: 88,
    ring: "var(--ccc-onboard-green)",
    inputLabel: "Momentum Mode",
    inputValue: "14-Day Streak",
    inputHelp: "Consistency compounds. You are becoming harder to stop.",
    sleep: "8.0h",
    stress: "3/10",
    mood: "Strong",
    nutrition: "94%",
    coachTitle: "Final lesson",
    coachText: "The goal is not perfection. The goal is repeated recovery and momentum.",
    bars: [58, 66, 74, 81, 88]
  },
  {
    key: "dashboard",
    counter: "Step 14 of 14",
    progress: 100,
    label: "Dashboard",
    ready: 88,
    ring: "var(--ccc-onboard-green)",
    inputLabel: "Your Dashboard",
    inputValue: "Signals → Direction",
    inputHelp: "CCC turns check-in data into readiness, patterns, and next steps.",
    sleep: "8.0h",
    stress: "3/10",
    mood: "Strong",
    nutrition: "94%",
    coachTitle: "You are in control",
    coachText: "Your dashboard shows what is working, what is slipping, and what to do next.",
    bars: [58, 66, 74, 81, 88]
  }
];

const cccOnboardingUI = {
  counter: document.getElementById("cccStepCounter"),
  progress: document.getElementById("cccStepProgress"),
  label: document.getElementById("cccPhoneStepLabel"),
  ready: document.getElementById("cccReadyScore"),
  circle: document.getElementById("cccReadinessCircle"),
  inputLabel: document.getElementById("cccInputLabel"),
  inputValue: document.getElementById("cccInputValue"),
  inputHelp: document.getElementById("cccInputHelp"),
  sleep: document.getElementById("cccSleepVal"),
  stress: document.getElementById("cccStressVal"),
  mood: document.getElementById("cccMoodVal"),
  nutrition: document.getElementById("cccNutritionVal"),
  coachTitle: document.getElementById("cccCoachTitle"),
  coachText: document.getElementById("cccCoachText"),
  bars: document.querySelectorAll("#cccMiniChart span")
};

function activateCCCOnboardingStep(stepKey) {
  const step = cccOnboardingSteps.find((item) => item.key === stepKey);

  if (!step) return;

  cccOnboardingUI.counter.textContent = step.counter;
  cccOnboardingUI.progress.style.width = `${step.progress}%`;
  cccOnboardingUI.label.textContent = step.label;
  cccOnboardingUI.ready.textContent = step.ready;

  cccOnboardingUI.circle.style.setProperty("--ring", `${step.ready}%`);
  cccOnboardingUI.circle.style.setProperty("--ring-color", step.ring);

  cccOnboardingUI.inputLabel.textContent = step.inputLabel;
  cccOnboardingUI.inputValue.textContent = step.inputValue;
  cccOnboardingUI.inputHelp.textContent = step.inputHelp;

  cccOnboardingUI.sleep.textContent = step.sleep;
  cccOnboardingUI.stress.textContent = step.stress;
  cccOnboardingUI.mood.textContent = step.mood;
  cccOnboardingUI.nutrition.textContent = step.nutrition;

  cccOnboardingUI.coachTitle.textContent = step.coachTitle;
  cccOnboardingUI.coachText.textContent = step.coachText;

  cccOnboardingUI.bars.forEach((bar, index) => {
    bar.style.height = `${step.bars[index]}%`;
  });
}

function initCCCOnboardingObserver() {
  const stepSections = document.querySelectorAll(".ccc-onboard-step");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activateCCCOnboardingStep(entry.target.dataset.step);
      }
    });
  }, {
    threshold: 0.55
  });

  stepSections.forEach((section) => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", () => {
  activateCCCOnboardingStep("welcome");
  initCCCOnboardingObserver();
});