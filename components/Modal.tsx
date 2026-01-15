import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md'
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        '2xl': 'max-w-6xl',
        'full': 'max-w-[95vw]'
    };

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full ${sizeClasses[size]} transform flex flex-col max-h-[90vh] rounded-2xl bg-white dark:bg-slate-900 shadow-2xl shadow-black/20 transition-all animate-in zoom-in-95 slide-in-from-bottom-4 duration-300`}>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex-shrink-0">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <div className="px-6 py-5 overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {footer && (
                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 px-6 py-4 rounded-b-2xl flex-shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default Modal;

