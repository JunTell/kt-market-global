import * as React from 'react';
import { cn } from './Button';

interface TabsProps {
    value: string;
    onChange: (value: string) => void;
    items: { label: string; value: string }[];
    className?: string;
}

const Tabs = ({ value, onChange, items, className }: TabsProps) => {
    return (
        <div className={cn(
            "sticky top-[52px] z-30 bg-white w-full flex border-b border-grey-200",
            className
        )}>
            {items.map((item) => {
                const isActive = value === item.value;
                return (
                    <button
                        key={item.value}
                        onClick={() => onChange(item.value)}
                        className={cn(
                            "flex-1 py-3 text-center cursor-pointer relative transition-colors",
                            isActive ? "text-grey-900 font-bold" : "text-grey-500"
                        )}
                    >
                        <span className="text-body1">{item.label}</span>
                        {isActive && (
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-grey-900 animate-fadeInUp" style={{ animationDuration: '0.2s' }} />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export { Tabs };
