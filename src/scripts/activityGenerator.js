// This key can be updated to generate new combinations
export const SELECTION_KEY = "2025-v1";

// Simple hash function to generate a number from a string
export function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Fisher-Yates shuffle with a seed
export function seededShuffle(array, seed) {
  const shuffled = [...array];
  let currentIndex = shuffled.length;
  const random = mulberry32(seed);

  while (currentIndex != 0) {
    const randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }

  return shuffled;
}

// Seeded random number generator
export function mulberry32(a) {
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function formatDate(date) {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
}

export function generateActivitySelections(
  birthdayDate,
  fullName,
  activities,
  selectionCount = 4,
) {
  if (!birthdayDate || !fullName) {
    return null;
  }

  // Create a deterministic seed based on name, date and selection key
  const formattedDate = formatDate(birthdayDate);
  const seed = hashCode(fullName.toLowerCase() + formattedDate + SELECTION_KEY);

  // Get deterministic selections
  const shuffled = seededShuffle(activities, seed);
  return shuffled.slice(0, selectionCount);
}
