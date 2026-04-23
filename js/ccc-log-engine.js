const STORAGE_KEY = "cccEntries";

export function getEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addEntry(entry) {
  const entries = getEntries();
  entries.push(entry);
  const trimmed = entries.slice(-90);
  saveEntries(trimmed);
  return trimmed;
}

export function getLatestEntry() {
  const entries = getEntries();
  return entries.length ? entries[entries.length - 1] : null;
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function computeScore({
  sleep = 7,
  mood = 8,
  stress = 3,
  digestion = "Good",
  soreness = "Mild",
  workoutYesterday = "yes"
} = {}) {
  const digestionMap = { Bad: -14, Okay: -6, Good: 4, Great: 8 };
  const sorenessMap = { None: 6, Mild: 2, Medium: -5, High: -12 };

  let score = 50;
  score += (Number(sleep) - 7) * 8;
  score += (Number(mood) - 5) * 4;
  score -= (Number(stress) - 3) * 5;
  score += digestionMap[digestion] || 0;
  score += sorenessMap[soreness] || 0;
  score += workoutYesterday === "yes" ? 4 : -2;

  return Math.round(clamp(score, 35, 98));
}

export function buildState(score) {
  if (score >= 80) {
    return {
      mode: "Execute",
      recommendation:
        "Strong readiness. Push today, but do it with structure. Lift upper body, protect protein, and get one clean deep work block done before noon.",
      missions: [
        "Lift: Upper Body",
        "Walk & Sunlight",
        "Protein on Target",
        "8 Hours Sleep"
      ],
      wins: [
        "Lift upper body",
        "90 min deep work",
        "Hydrate before coffee 2"
      ],
      quote:
        "You are hot right now. Stop negotiating. Lift. Focus. Protein. Momentum is hot. Do not waste it."
    };
  }

  if (score >= 65) {
    return {
      mode: "Build",
      recommendation:
        "Good day to execute, but stay measured. Moderate training, lock in protein, and protect the evening so momentum keeps building.",
      missions: [
        "Moderate Lift",
        "Deep Work 60 Min",
        "Hydrate Early",
        "Sleep on Time"
      ],
      wins: [
        "Moderate training",
        "One clean focus block",
        "Protect recovery tonight"
      ],
      quote:
        "Solid enough to move. Do not waste energy on chaos. Build a clean day and keep momentum alive."
    };
  }

  if (score >= 50) {
    return {
      mode: "Recover",
      recommendation:
        "Recovery should lead today. Walk, hydrate, reduce intensity, and make tonight’s sleep the real win.",
      missions: [
        "20 Min Walk",
        "Hydrate + Electrolytes",
        "Light Mobility",
        "Sleep Priority"
      ],
      wins: [
        "Walk complete",
        "Hydration improved",
        "Protect sleep tonight"
      ],
      quote:
        "Not every win is a hard push. Recover on purpose so tomorrow does not have to pay for today."
    };
  }

  return {
    mode: "Reset",
    recommendation:
      "Bad inputs detected. Reset today. No ego training, no chaos. Hydrate, walk, simplify food, and protect sleep tonight.",
    missions: [
      "Hydrate Aggressively",
      "Walk Only",
      "Simple Food",
      "Early Bedtime"
    ],
    wins: [
      "Electrolytes in",
      "Walk complete",
      "Early bedtime locked"
    ],
    quote:
      "You are not behind. You are unstable. Reset the system, stop forcing it, and win the basics."
  };
}

export function buildEntry(payload) {
  const score = computeScore(payload);
  const state = buildState(score);

  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    ts: new Date().toISOString(),
    sleep: Number(payload.sleep),
    mood: Number(payload.mood),
    stress: Number(payload.stress),
    digestion: payload.digestion,
    soreness: payload.soreness,
    workoutYesterday: payload.workoutYesterday,
    notes: payload.notes || "",
    score,
    mode: state.mode,
    recommendation: state.recommendation,
    missions: state.missions,
    wins: state.wins,
    quote: state.quote
  };
}

export function formatDateTime(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}