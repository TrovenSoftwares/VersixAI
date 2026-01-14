import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
    return (
        <div
            className={`
        bg-white dark:bg-slate-850 
        rounded-xl border border-slate-200 dark:border-slate-700 
        shadow-sm overflow-hidden 
        ${noPadding ? '' : 'p-6'} 
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export default Card;
