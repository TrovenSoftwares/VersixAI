import React from 'react';

// --- Table Wrapper ---
interface TableProps {
    children: React.ReactNode;
    className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => {
    return (
        <div className={`w-full overflow-x-auto ${className}`}>
            <table className="w-full text-left border-collapse min-w-[800px]">
                {children}
            </table>
        </div>
    );
};

// --- Table Header ---
interface TableHeaderProps {
    children: React.ReactNode;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
    return (
        <thead>
            <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                {children}
            </tr>
        </thead>
    );
};

// --- Table Head Cell (TH) ---
interface TableHeadCellProps {
    children: React.ReactNode;
    align?: 'left' | 'center' | 'right';
    className?: string;
    width?: string;
}

export const TableHeadCell: React.FC<TableHeadCellProps> = ({
    children,
    align = 'left',
    className = '',
    width
}) => {
    const alignClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }[align];

    return (
        <th
            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap ${alignClass} ${className}`}
            style={width ? { width } : undefined}
        >
            {children}
        </th>
    );
};

// --- Table Body ---
interface TableBodyProps {
    children: React.ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
    return (
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {children}
        </tbody>
    );
};

// --- Table Row ---
interface TableRowProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className = '', onClick }) => {
    return (
        <tr
            onClick={onClick}
            className={`
        group transition-colors 
        ${onClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/20'} 
        ${className}
      `}
        >
            {children}
        </tr>
    );
};

// --- Table Cell (TD) ---
interface TableCellProps {
    children: React.ReactNode;
    align?: 'left' | 'center' | 'right';
    className?: string;
    colSpan?: number;
}

export const TableCell: React.FC<TableCellProps> = ({
    children,
    align = 'left',
    className = '',
    colSpan
}) => {
    const alignClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }[align];

    return (
        <td
            colSpan={colSpan}
            className={`px-6 py-4 text-sm text-slate-700 dark:text-slate-300 ${alignClass} ${className}`}
        >
            {children}
        </td>
    );
};

// --- Table Empty State ---
interface TableEmptyStateProps {
    colSpan: number;
    message?: string;
    icon?: string;
    children?: React.ReactNode;
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({
    colSpan,
    message = "Nenhum dado encontrado.",
    icon = "inbox",
    children
}) => {
    return (
        <tr>
            <td colSpan={colSpan} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">{icon}</span>
                    <p className="text-sm font-medium">{message}</p>
                    {children}
                </div>
            </td>
        </tr>
    );
};

// --- Table Loading State ---
interface TableLoadingStateProps {
    colSpan: number;
    message?: string;
}

export const TableLoadingState: React.FC<TableLoadingStateProps> = ({
    colSpan,
    message = "Carregando dados..."
}) => {
    return (
        <tr>
            <td colSpan={colSpan} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                    <p className="text-sm font-medium animate-pulse">{message}</p>
                </div>
            </td>
        </tr>
    );
};

// --- Table Pagination ---
interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
    startIndex: number;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    startIndex
}) => {
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return (
        <div className="border-t border-[#e7edf3] dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Mostrando <span className="font-bold text-slate-900 dark:text-white">{totalItems === 0 ? 0 : startIndex + 1}-{endIndex}</span> de <span className="font-bold text-slate-900 dark:text-white">{totalItems}</span> resultados
            </p>

            <div className="flex items-center gap-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-20 transition-all active:scale-95 shadow-sm"
                >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>

                <div className="text-sm font-bold text-primary dark:text-blue-400 min-w-[44px] text-center tracking-tight">
                    {currentPage} / {totalPages || 1}
                </div>

                <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-20 transition-all active:scale-95 shadow-sm"
                >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
            </div>
        </div>
    );
};
