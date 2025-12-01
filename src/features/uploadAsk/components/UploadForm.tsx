import { useState, type FormEvent } from 'react';
import clsx from 'clsx';

interface UploadFormProps {
  onUpload: (file: File, title?: string) => Promise<void> | void;
  isUploading?: boolean;
  error?: string;
}

export const UploadForm = ({ onUpload, isUploading, error }: UploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) return;
    await onUpload(file, title);
    setTitle('');
    setFile(null);
    const input = document.getElementById('upload-file-input') as HTMLInputElement | null;
    if (input) {
      input.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <label htmlFor="upload-file-input" className="text-sm font-semibold text-slate-700">
          Upload a document
        </label>
        <input
          id="upload-file-input"
          type="file"
          accept=".txt,.pdf,.md,.doc,.docx"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full cursor-pointer rounded-lg border border-border bg-slate-50 px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-primary"
          aria-label="Upload file"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="upload-title" className="text-sm font-semibold text-slate-700">
          Title (optional)
        </label>
        <input
          id="upload-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project docs, receipts, transcripts..."
          className="w-full rounded-lg border border-border px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={!file || isUploading}
        className={clsx(
          'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition',
          isUploading || !file
            ? 'cursor-not-allowed bg-slate-200 text-slate-500'
            : 'bg-primary text-white shadow-sm hover:bg-primary/90',
        )}
      >
        {isUploading ? 'Uploading...' : 'Upload & queue'}
      </button>
    </form>
  );
};
