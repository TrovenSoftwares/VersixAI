import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'text',
    width,
    height,
    animation = 'pulse'
}) => {
    const baseClasses = 'bg-slate-200 dark:bg-slate-700';

    const variantClasses = {
        text: 'rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-none',
        rounded: 'rounded-xl'
    };

    const animationClasses = {
        pulse: 'animate-pulse',
        wave: 'animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%]',
        none: ''
    };

    const style: React.CSSProperties = {
        width: width || '100%',
        height: height || (variant === 'text' ? '1em' : undefined)
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
            style={style}
        />
    );
};

// Pre-built skeleton patterns
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className = '' }) => (
    <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
                key={i}
                variant="text"
                height={14}
                width={i === lines - 1 ? '60%' : '100%'}
            />
        ))}
    </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 ${className}`}>
        <div className="flex items-center justify-between mb-4">
            <Skeleton variant="text" width={100} height={12} />
            <Skeleton variant="rounded" width={44} height={44} />
        </div>
        <Skeleton variant="text" width="70%" height={32} className="mb-2" />
        <Skeleton variant="text" width={150} height={12} />
    </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number; columns?: number; className?: string }> = ({
    rows = 5,
    cols,
    columns,
    className = ''
}) => {
    const activeCols = columns || cols || 4;
    return (
        <div className={`bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                {Array.from({ length: activeCols }).map((_, i) => (
                    <Skeleton key={i} variant="text" width={`${100 / activeCols}%`} height={12} />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIdx) => (
                <div
                    key={rowIdx}
                    className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0"
                >
                    {Array.from({ length: activeCols }).map((_, colIdx) => (
                        <Skeleton
                            key={colIdx}
                            variant="text"
                            width={colIdx === 0 ? '30%' : `${70 / (activeCols - 1)}%`}
                            height={14}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const SkeletonAvatar: React.FC<{ size?: number; className?: string }> = ({
    size = 40,
    className = ''
}) => (
    <Skeleton variant="circular" width={size} height={size} className={className} />
);

export const SkeletonButton: React.FC<{ width?: number | string; className?: string }> = ({
    width = 120,
    className = ''
}) => (
    <Skeleton variant="rounded" width={width} height={40} className={className} />
);

export const SkeletonChart: React.FC<{ height?: number; className?: string }> = ({
    height = 300,
    className = ''
}) => (
    <div className={`p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 ${className}`}>
        <div className="flex items-center justify-between mb-6">
            <Skeleton variant="text" width={150} height={20} />
            <div className="flex gap-2">
                <Skeleton variant="rounded" width={80} height={32} />
                <Skeleton variant="rounded" width={80} height={32} />
            </div>
        </div>
        <Skeleton variant="rounded" width="100%" height={height} />
    </div>
);

// Dashboard specific skeleton
export const SkeletonDashboard: React.FC = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <SkeletonChart height={280} />
            <SkeletonChart height={280} />
        </div>

        {/* Table */}
        <SkeletonTable rows={5} cols={5} />
    </div>
);

export default Skeleton;
