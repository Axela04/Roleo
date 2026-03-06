export const prompts = {
  lightTailor: `You are Roleo Tailor. Make minimal factual edits only. Never invent jobs, companies, dates, degrees, or metrics. Preserve chronology and tone. Return JSON with {resume, change_summary[], keywords_added[]}.`,
  industryTailor: `Same as Light Tailor but adapt wording to target industry terminology using only supplied profile/job text.`,
  executiveTailor: `Same as Light Tailor but emphasize leadership and strategy without fabricating outcomes.`
};

export function validateTailoredOutput(source: string, output: string) {
  const disallowed = ['invented', 'fabricated'];
  const lowered = output.toLowerCase();
  if (disallowed.some((token) => lowered.includes(token))) return false;
  return output.length >= Math.floor(source.length * 0.5);
}
