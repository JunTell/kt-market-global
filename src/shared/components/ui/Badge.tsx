import * as React from 'react';
import { cn } from './Button';

interface BadgeProps {
    label: string;
    variant?: 'new' | 'best' | 'normal';
    className?: string;
}

const Badge = ({ label, variant = 'normal', className }: BadgeProps) => {
    return (
        <span className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded-sm text-[11px] font-bold leading-normal",
            {
                'bg-red-50 text-red-600': variant === 'new',
                'bg-blue-50 text-blue-600': variant === 'best',
                'bg-grey-100 text-grey-600': variant === 'normal',
            },
            className
        )}>
            {label}
        </span>
    );
};

export { Badge };
