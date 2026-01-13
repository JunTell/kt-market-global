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
                        "h-12 w-full px-4 rounded-lg outline-none transition-all placeholder:text-grey-500 text-body1 text-grey-900",
                        "bg-grey-50 border border-transparent",
                        // Focus & Error states
                        {
                            "focus:bg-white focus:ring-2 focus:ring-blue": !error,
                            "bg-red-50 text-red-500 ring-2 ring-red-500 focus:ring-red-500": error,
                        },
                        className
                    )}
                    {...props}
                />
                {helperText && (
                    <span className={cn(
                        "text-caption mt-1",
                        error ? "text-red-500" : "text-grey-500"
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
