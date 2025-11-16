import { fireEvent, render, screen } from '@testing-library/react';
import { SmartFAQForm } from '../SmartFAQForm';

describe('SmartFAQForm', () => {
  const defaultProps = {
    question: '',
    mode: 'hybrid' as const,
    isLoading: false,
    onQuestionChange: jest.fn(),
    onModeChange: jest.fn(),
    onSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits question with selected mode', () => {
    const props = { ...defaultProps, question: 'How far is the moon?' };
    render(<SmartFAQForm {...props} />);

    const textarea = screen.getByLabelText(/ask anything/i);
    const form = textarea.closest('form');
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    expect(props.onSubmit).toHaveBeenCalledWith({ question: 'How far is the moon?', mode: 'hybrid' });
  });

  it('propagates question and mode changes', () => {
    const props = { ...defaultProps };
    render(<SmartFAQForm {...props} />);

    const textarea = screen.getByLabelText(/ask anything/i);
    fireEvent.change(textarea, { target: { value: 'How far is the moon?' } });
    expect(props.onQuestionChange).toHaveBeenCalledWith('How far is the moon?');

    fireEvent.click(screen.getByText(/Exact match/i));
    expect(props.onModeChange).toHaveBeenCalledWith('exact');
  });
});
