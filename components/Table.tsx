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
    return (
        <div className="border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Anterior
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Próxima
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700 dark:text-slate-400">
                        Mostrando <span className="font-medium">{startIndex + 1}</span> até <span className="font-medium">{Math.min(startIndex + itemsPerPage, totalItems)}</span> de{' '}
                        <span className="font-medium">{totalItems}</span> resultados
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50"
                        >
                            <span className="sr-only">Anterior</span>
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50"
                        >
                            <span className="sr-only">Próxima</span>
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};
