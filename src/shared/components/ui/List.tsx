import * as React from 'react';
import { cn } from './Button';
import { ChevronRight } from 'lucide-react';

// --- List Header ---
interface ListHeaderProps {
    title: string;
    className?: string;
}

const ListHeader = ({ title, className }: ListHeaderProps) => {
    return (
        <div className={cn("px-5 py-3 bg-base mt-4", className)}>
            <h5 className="text-h5 font-bold text-grey-900">{title}</h5>
        </div>
    );
};

// --- List Row ---
interface ListRowProps extends React.HTMLAttributes<HTMLDivElement> {
    leftIcon?: React.ReactNode;
    title: string;
    subTitle?: string; // Optional subtitle if needed
    rightValue?: string | React.ReactNode;
    showArrow?: boolean;
    onClick?: () => void;
}

const ListRow = ({
    leftIcon,
    title,
    subTitle,
    rightValue,
    showArrow = true,
    className,
    onClick,
    ...props
}: ListRowProps) => {
    return (
        <div
            className={cn(
                "flex items-center justify-between px-5 py-4 bg-base transition-colors border-b border-border-divider",
                onClick && "cursor-pointer active:bg-pressed",
                className
            )}
            onClick={onClick}
            {...props}
        >
            {/* Left */}
            <div className="flex items-center gap-3 overflow-hidden">
                {leftIcon && (
                    <div className="w-10 h-10 rounded-full bg-grey-50 flex items-center justify-center shrink-0 overflow-hidden text-grey-400">
                        {leftIcon}
                    </div>
                )}
                <div className="flex flex-col overflow-hidden">
                    <span className="text-body1 font-medium text-grey-900 truncate">
                        {title}
                    </span>
                    {subTitle && (
                        <span className="text-body2 text-grey-500 truncate block">
                            {subTitle}
                        </span>
                    )}
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1 shrink-0 ml-4">
                {rightValue && (
                    <span className="text-body2 text-grey-500">{rightValue}</span>
                )}
                {showArrow && (
                    <ChevronRight size={16} className="text-grey-400" />
                )}
            </div>
        </div>
    );
};

export { ListHeader, ListRow };
