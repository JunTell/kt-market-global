import * as React from 'react';
import { cn } from './Button';
import { ChevronLeft } from 'lucide-react';

// --- Top Header ---
interface TopHeaderProps {
    title?: string;
    onBack?: () => void;
    rightAction?: React.ReactNode;
    className?: string;
}

const TopHeader = ({ title, onBack, rightAction, className }: TopHeaderProps) => {
    return (
        <header className={cn(
            "fixed top-0 left-0 w-full h-[52px] z-50 px-4 flex items-center justify-between transition-all",
            "bg-base/80 backdrop-blur-md border-b border-border-divider",
            className
        )}>
            <div className="flex items-center w-10 shrink-0">
                {onBack && (
                    <button onClick={onBack} className="p-1 -ml-1 text-grey-900 hover:bg-black/5 rounded-full cursor-pointer" aria-label="Go back">
                        <ChevronLeft size={24} />
                    </button>
                )}
            </div>

            <div className="flex-1 text-center truncate px-2">
                {title && <h1 className="text-h4 font-bold text-grey-900 truncate">{title}</h1>}
            </div>

            <div className="flex items-center justify-end w-10 shrink-0">
                {rightAction}
            </div>
        </header>
    );
};


// --- Bottom Tab Bar ---
interface BottomTabBarProps {
    children: React.ReactNode;
    className?: string;
}

const BottomTabBar = ({ children, className }: BottomTabBarProps) => {
    return (
        <nav className={cn(
            "fixed bottom-0 left-0 w-full h-[56px] pb-safe z-40 bg-base border-t border-border-divider",
            className
        )}>
            <div className="grid grid-cols-4 h-full">
                {/* Assumes 4 items default, can be overridden by className or children structure if needed, 
            but grid-cols-4 is specified in reqs */}
                {children}
            </div>
        </nav>
    );
};

interface BottomTabItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
    icon: React.ReactNode;
    label: string;
}

const BottomTabItem = ({ active, icon, label, className, ...props }: BottomTabItemProps) => {
    return (
        <button
            className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors cursor-pointer",
                active ? "text-primary" : "text-grey-400",
                className
            )}
            {...props}
        >
            <div className="w-6 h-6 flex items-center justify-center">
                {icon}
            </div>
            <span className="text-[10px] font-medium leading-none">{label}</span>
        </button>
    );
};

export { TopHeader, BottomTabBar, BottomTabItem };
