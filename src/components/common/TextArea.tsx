import type { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea = ({ label, className, ...props }: TextAreaProps) => (
  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
    <span>{label}</span>
    <textarea
      className={clsx(
        'rounded-md border border-slate-300 bg-white p-3 text-base text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40',
        className,
      )}
      {...props}
    />
  </label>
);
