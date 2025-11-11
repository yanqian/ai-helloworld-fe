const BASE_PROMPT = `You are an expert writing assistant that summarizes user provided text and extracts the most important keywords. Respond using the format:
SUMMARY:
<summary>

KEYWORDS:
keyword1, keyword2, ...`;

export const composePrompt = (override?: string): string | undefined => {
  const trimmed = override?.trim();
  if (!trimmed) {
    return undefined;
  }

  return `${BASE_PROMPT}\n\nAdditional instructions:\n${trimmed}`;
};
