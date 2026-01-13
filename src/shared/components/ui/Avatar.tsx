import * as React from 'react';
import { cn } from './Button';

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    shape?: 'circle' | 'square';
    size?: 'sm' | 'md' | 'lg'; // Can expand sizes if needed, default w-10 h-10 as per spec
}

const Avatar = ({ shape = 'circle', size = 'md', className, src, alt, ...props }: AvatarProps) => {
    // Specs:
    // Avatar: w-10 h-10 rounded-full
    // Thumbnail: w-16 h-16 rounded-lg represents 'square' here roughly or separate logic?
    // User spec says: Avatar (w-10 h-10 rounded-full), Thumbnail (w-16 h-16 rounded-lg)
    // I will treat 'square' as the thumbnail style.

    return (
        <div
            className={cn(
                "bg-grey-200 overflow-hidden flex items-center justify-center text-grey-400",
                {
                    'rounded-full w-10 h-10': shape === 'circle',
                    'rounded-lg w-16 h-16': shape === 'square',
                },
                className
            )}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt || "Avatar"}
                    className="w-full h-full object-cover"
                    {...props}
                />
            ) : (
                // Fallback placeholder could be an icon, but keeping it simple bg-grey-200 for now
                null
            )}
        </div>
    );
};

export { Avatar };
