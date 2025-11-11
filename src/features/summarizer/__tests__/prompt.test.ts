import { composePrompt } from '../prompt';

describe('composePrompt', () => {
  it('returns undefined when override is empty', () => {
    expect(composePrompt('')).toBeUndefined();
    expect(composePrompt('   ')).toBeUndefined();
    expect(composePrompt()).toBeUndefined();
  });

  it('wraps user override with base instructions', () => {
    const prompt = composePrompt('Focus on tone');
    expect(prompt).toMatch(/SUMMARY:/);
    expect(prompt).toMatch(/KEYWORDS:/);
    expect(prompt).toMatch(/Additional instructions:/);
    expect(prompt).toMatch(/Focus on tone/);
  });
});
