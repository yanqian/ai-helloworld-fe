import type { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  onClear?: () => void;
}

export const TextArea = ({ label, className, onClear, ...props }: TextAreaProps) => {
  const fieldValue = props.value ?? props.defaultValue;
  const hasValue =
    fieldValue !== undefined &&
    fieldValue !== null &&
    (typeof fieldValue === 'string'
      ? fieldValue.length > 0
      : Array.isArray(fieldValue)
        ? fieldValue.length > 0
        : true);
  const shouldShowClear = Boolean(onClear && hasValue);

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <div className="relative">
        <textarea
          className={clsx(
            'w-full rounded-md border border-slate-300 bg-white p-3 pr-16 text-base text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40',
            className,
          )}
          {...props}
        />
        {shouldShowClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label={`Clear ${label}`}
            className="absolute right-3 top-3 rounded-full bg-white/60 px-2 py-1 text-xs font-medium text-slate-500 transition hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Clear
          </button>
        )}
      </div>
    </label>
  );
};
