import React from 'react';

interface ShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ShortcutItem {
    key: string;
    description: string;
    category: 'geral' | 'navegacao' | 'acoes';
}

const shortcuts: ShortcutItem[] = [
    // Geral
    { key: 'Ctrl + /', description: 'Abrir / Fechar Guia de Atalhos', category: 'geral' },
    { key: 'Ctrl + K', description: 'Abrir Busca Rápida', category: 'geral' },
    { key: 'ESC', description: 'Fechar Modais / Menus', category: 'geral' },

    // Navegação
    { key: 'Alt + 1', description: 'Ir para Dashboard', category: 'navegacao' },
    { key: 'Alt + 2', description: 'Ir para Transações', category: 'navegacao' },
    { key: 'Alt + 3', description: 'Ir para Vendas', category: 'navegacao' },
    { key: 'Alt + 4', description: 'Ir para Contatos', category: 'navegacao' },
    { key: 'Alt + 5', description: 'Ir para Relatórios', category: 'navegacao' },
    { key: 'Alt + 6', description: 'Ir para Carteira', category: 'navegacao' },
    { key: 'Alt + 7', description: 'Ir para Revisão IA', category: 'navegacao' },
    { key: 'Alt + 8', description: 'Ir para Ajustes', category: 'navegacao' },

    // Ações (Futuras ou já existentes na paleta)
];

const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const renderCategory = (category: string, title: string, icon: string) => {
        const filtered = shortcuts.filter(s => s.category === category);
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{title}</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {filtered.map((s, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all group">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                {s.description}
                            </span>
                            <kbd className="inline-flex items-center justify-center px-2 py-1 min-w-[24px] text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm group-hover:border-primary/30 group-hover:text-primary transition-all uppercase whitespace-nowrap">
                                {s.key}
                            </kbd>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-3xl">keyboard</span>
                            Atalhos do Flowy
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Aumente sua produtividade navegando no ERP como um profissional.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-10">
                        {renderCategory('geral', 'Atalhos Gerais', 'tune')}
                        {renderCategory('acoes', 'Ações Rápidas', 'bolt')}
                    </div>
                    <div>
                        {renderCategory('navegacao', 'Navegação Direta', 'explore')}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                        <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                        Dica: Use Alt + Número para mudar de página rapidamente
                    </div>
                    <span className="text-xs font-black text-primary opacity-50 italic">Flowy ERP v1.2.2</span>
                </div>
            </div>
        </div>
    );
};

export default ShortcutsModal;
