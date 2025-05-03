import React, { ReactNode } from 'react';

interface ShinyTextProps {
    text?: string;
    children?: ReactNode;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, children, disabled = false, speed = 5, className = '' }) => {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={`text-[#0d3528]/70 bg-clip-text inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
            style={{
                backgroundImage: 'linear-gradient(120deg, rgba(13, 53, 40, 0) 40%, rgba(13, 53, 40, 0.9) 50%, rgba(13, 53, 40, 0) 60%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                animationDuration: animationDuration,
            }}
        >
            {text || children}
        </div>
    );
};

export default ShinyText;
