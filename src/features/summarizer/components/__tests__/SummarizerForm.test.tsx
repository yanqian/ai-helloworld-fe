import { fireEvent, render, screen } from '@testing-library/react';
import { SummarizerForm } from '../SummarizerForm';

describe('SummarizerForm', () => {
  it('submits payload when text is provided', () => {
    const handleSubmit = jest.fn();
    const handleStream = jest.fn();

    render(
      <SummarizerForm
        onSubmit={handleSubmit}
        onStream={handleStream}
        isLoading={false}
        isStreaming={false}
      />,
    );

    const textarea = screen.getByLabelText('Paragraph');
    fireEvent.change(textarea, { target: { value: 'Test paragraph' } });
    const form = screen.getByRole('button', { name: /generate summary/i }).closest('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    expect(handleSubmit).toHaveBeenCalledWith({ text: 'Test paragraph', prompt: undefined });
  });

  it('invokes stream handler when clicking stream', () => {
    const handleSubmit = jest.fn();
    const handleStream = jest.fn();

    render(
      <SummarizerForm
        onSubmit={handleSubmit}
        onStream={handleStream}
        isLoading={false}
        isStreaming={false}
      />,
    );

    const textarea = screen.getByLabelText('Paragraph');
    fireEvent.change(textarea, { target: { value: 'Stream paragraph' } });

    fireEvent.click(screen.getByRole('button', { name: /stream summary/i }));

    expect(handleStream).toHaveBeenCalledWith({ text: 'Stream paragraph', prompt: undefined });
  });
});
