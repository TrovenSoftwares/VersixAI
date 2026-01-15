import React from 'react';
import { Link } from 'react-router-dom';
import { FlowyLogo } from './BrandedIcons';

interface PublicHeaderProps {
    backLink?: string;
    backLabel?: string;
    showBackButton?: boolean;
    pageName?: string;
    showHelpBreadcrumb?: boolean;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({
    backLink = "/",
    backLabel = "Voltar ao Início",
    showBackButton = false,
    pageName,
    showHelpBreadcrumb = true
}) => {
    return (
        <header className="bg-white dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 py-4 px-6 md:px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/80 dark:bg-slate-850/80 transition-all duration-300">
            <div className="flex items-center gap-4">
                {showBackButton && (
                    <Link
                        to={backLink}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all hover:scale-110 active:scale-90 flex items-center justify-center"
                        aria-label="Voltar"
                    >
                        <span className="material-symbols-outlined text-slate-500">arrow_back</span>
                    </Link>
                )}
                <Link to="/" className="flex items-center">
                    <FlowyLogo id="public-header" className="h-[35px] md:h-[40px] w-auto transition-transform hover:scale-105" />
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {pageName && (
                    <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-800 pr-4 mr-2">
                        {showHelpBreadcrumb && (
                            <>
                                <Link to="/help" className="hover:text-primary transition-colors">Ajuda</Link>
                                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                            </>
                        )}
                        <span className="text-slate-600 dark:text-slate-300">{pageName}</span>
                    </div>
                )}
                {backLabel && (
                    <Link
                        to={backLink}
                        className="text-sm font-bold text-primary hover:text-primary-dark transition-all hover:scale-105 active:scale-95 flex items-center gap-1 group"
                    >
                        <span className="group-hover:underline">{backLabel}</span>
                        {!showBackButton && <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>}
                    </Link>
                )}
            </div>
        </header>
    );
};

export default PublicHeader;
