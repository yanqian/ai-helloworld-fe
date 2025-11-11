import type { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  optional?: boolean;
}

export const TextField = ({ label, optional, className, ...props }: TextFieldProps) => (
  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
    <span>
      {label}
      {optional && <span className="ml-1 text-xs font-normal text-slate-500">(optional)</span>}
    </span>
    <input
      className={clsx(
        'rounded-md border border-slate-300 bg-white p-3 text-base text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40',
        className,
      )}
      {...props}
    />
  </label>
);
