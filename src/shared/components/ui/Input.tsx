import * as React from 'react';
import { cn } from './Button'; // Reusing cn utility

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, helperText, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2 w-full">
                {label && (
                    <label className="text-body2 font-bold text-grey-800">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        "h-12 w-full px-4 rounded-lg outline-none transition-all placeholder:text-grey-400 text-body1 text-grey-900",
                        "bg-bg-input border border-border-strong",
                        // Focus & Error states
                        {
                            "focus:bg-base focus:border-border-focus focus:ring-1 focus:ring-border-focus": !error,
                            "bg-red-50 text-status-error border-border-error focus:ring-1 focus:ring-status-error": error,
                        },
                        className
                    )}
                    {...props}
                />
                {helperText && (
                    <span className={cn(
                        "text-caption mt-1",
                        error ? "text-status-error" : "text-grey-500"
                    )}>
                        {helperText}
                    </span>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };
