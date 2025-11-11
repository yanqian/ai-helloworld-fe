import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  className,
  isLoading,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        {
          'bg-primary text-white hover:bg-primary-dark focus-visible:outline-primary-dark': variant === 'primary',
          'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-primary': variant === 'secondary',
          'text-slate-600 hover:text-slate-900 focus-visible:outline-primary': variant === 'ghost',
          'opacity-60 cursor-not-allowed': disabled || isLoading,
        },
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Please wait...' : children}
    </button>
  );
};
