import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DocumentList } from '../components/DocumentList';
import { AskPanel } from '../components/AskPanel';
import { AnswerCard } from '../components/AnswerCard';

const sampleDocs: UploadDocument[] = [
  { id: '1', title: 'Handbook', status: 'processed', createdAt: new Date().toISOString() },
  { id: '2', title: 'Draft', status: 'processing', createdAt: new Date().toISOString() },
] as const;

describe('UploadAsk UI pieces', () => {
  test('renders document list with statuses', () => {
    render(<DocumentList documents={sampleDocs} isLoading={false} />);

    expect(screen.getByText('Handbook')).toBeInTheDocument();
    expect(screen.getByText('processed')).toBeInTheDocument();
    expect(screen.getByText('processing')).toBeInTheDocument();
  });

  test('disables ask button while loading', async () => {
    const onAsk = jest.fn();
    render(<AskPanel documents={[]} onAsk={onAsk} isAsking error={undefined} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    await userEvent.type(screen.getByLabelText(/ask a question/i), 'hello?');
    expect(button).toBeDisabled();
  });

  test('renders citations', () => {
    render(
      <AnswerCard
        answer="Here is a response"
        sources={[
          { documentId: 'abc123', chunkIndex: 0, score: 0.9, preview: 'Preview text' },
        ]}
      />,
    );

    expect(screen.getByText(/response/i)).toBeInTheDocument();
    expect(screen.getByText(/Preview text/i)).toBeInTheDocument();
    expect(screen.getByText(/Score/)).toBeInTheDocument();
  });
});
