import { __testables } from '../api';

describe('summarizer api utilities', () => {
  it('parses SSE formatted chunks', () => {
    const raw = 'data: {"partial_summary":"chunk 1"}\n\n' +
      'data: {"partial_summary":"chunk 2","completed":true,"keywords":["alpha"]}\n\n';

    const result = __testables.parseSseChunk(raw);

    expect(result).toEqual([
      { partialSummary: 'chunk 1', completed: false, keywords: undefined },
      { partialSummary: 'chunk 2', completed: true, keywords: ['alpha'] },
    ]);
  });
});
