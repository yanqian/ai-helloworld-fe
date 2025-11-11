import { FormEvent, useState } from 'react';
import { Button } from '@/components/common/Button';
import { TextArea } from '@/components/common/TextArea';
import { TextField } from '@/components/common/TextField';

interface SummarizerFormProps {
  onSubmit: (payload: { text: string; prompt?: string }) => void;
  onStream: (payload: { text: string; prompt?: string }) => void;
  isLoading: boolean;
  isStreaming: boolean;
}

export const SummarizerForm = ({ onSubmit, onStream, isLoading, isStreaming }: SummarizerFormProps) => {
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) {
      return;
    }

    onSubmit({ text, prompt: prompt || undefined });
  };

  const handleStream = () => {
    if (!text.trim()) {
      return;
    }

    onStream({ text, prompt: prompt || undefined });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <TextArea
        label="Paragraph"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={8}
        placeholder="Paste or type the text you want summarized"
        required
      />

      <TextField
        label="Prompt override"
        optional
        placeholder="e.g. Summarize with tone for executives"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
      />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" isLoading={isLoading} disabled={isStreaming}>
          Generate Summary
        </Button>
        <Button type="button" variant="secondary" onClick={handleStream} isLoading={isStreaming}>
          Stream Summary
        </Button>
      </div>
    </form>
  );
};
