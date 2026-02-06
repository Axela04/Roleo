const planLimits = {
  launch: { applications: 10, aiEdits: 10 },
  advance: { applications: 15, aiEdits: 25 },
  accelerate: { applications: 25, aiEdits: 50 },
  executive: { applications: 50, aiEdits: 100 }
} as const;

export function getPlanLimit(tier: keyof typeof planLimits, key: 'applications' | 'aiEdits') {
  return planLimits[tier][key];
}
