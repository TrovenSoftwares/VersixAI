import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalResults,
    itemsPerPage,
    onPageChange,
}) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalResults);

    return (
        <div className="border-t border-[#e7edf3] dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Mostrando <span className="font-bold text-slate-900 dark:text-white">{totalResults === 0 ? 0 : startIndex + 1}-{endIndex}</span> de <span className="font-bold text-slate-900 dark:text-white">{totalResults}</span> resultados
            </p>

            <div className="flex items-center gap-4">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-20 transition-all active:scale-95 shadow-sm"
                    aria-label="Página anterior"
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
                    aria-label="Próxima página"
                >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
