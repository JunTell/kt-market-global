import * as React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'md' | 'lg';
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center font-bold transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
                    {
                        // Variants
                        'bg-primary text-white hover:bg-primary-hover shadow-sm': variant === 'primary',
                        'bg-base text-grey-900 border border-border-default hover:bg-grey-50 active:bg-pressed': variant === 'secondary',
                        'bg-transparent text-grey-700 hover:bg-black/5 active:bg-pressed': variant === 'ghost',

                        // Sizes (Height based on mobile touch targets)
                        'h-12 text-[16px] rounded-lg': size === 'md', // 48px
                        'h-14 text-[18px] rounded-lg': size === 'lg', // 56px

                        // Width
                        'w-full': fullWidth,
                    },
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';

interface BottomCTAProps {
    children: React.ReactNode;
    className?: string;
}

// Fixed bottom container for CTA
const BottomCTA = ({ children, className }: BottomCTAProps) => {
    return (
        <div className={cn(
            "fixed bottom-0 left-0 w-full bg-base border-t border-border-divider pb-safe z-50",
            "p-4", // standard padding
            className
        )}>
            {children}
        </div>
    );
};

export { Button, BottomCTA, cn };
