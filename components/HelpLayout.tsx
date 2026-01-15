import React from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

const HelpLayout: React.FC<{ children: React.ReactNode; title: string; category: string }> = ({ children, title, category }) => {
    const [feedbackSent, setFeedbackSent] = React.useState(false);
    const [feedbackType, setFeedbackType] = React.useState<'positive' | 'negative' | null>(null);
    const [confetti, setConfetti] = React.useState<{ id: number; left: number; delay: number; color: string }[]>([]);

    const handlePositiveFeedback = () => {
        // Create confetti
        const colors = ['#266663', '#BFFB87', '#22c55e', '#3b82f6', '#f59e0b', '#ec4899'];
        const newConfetti = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 0.5,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));
        setConfetti(newConfetti);
        setFeedbackType('positive');
        setFeedbackSent(true);

        // Clear confetti after animation
        setTimeout(() => setConfetti([]), 3000);
    };

    const handleNegativeFeedback = () => {
        setFeedbackType('negative');
        setFeedbackSent(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-display transition-all duration-500 relative overflow-hidden">
            {/* Confetti */}
            {confetti.map((c) => (
                <div
                    key={c.id}
                    className="fixed w-3 h-3 rounded-full pointer-events-none z-50 animate-bounce"
                    style={{
                        left: `${c.left}%`,
                        top: '-20px',
                        backgroundColor: c.color,
                        animation: `confetti-fall 2.5s ease-out ${c.delay}s forwards`,
                    }}
                />
            ))}
            <style>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
            `}</style>

            <PublicHeader
                showBackButton={true}
                backLink="/help"
                backLabel=""
                pageName={title}
            />

            <main className="max-w-4xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">{title}</h1>
                    <div className="h-1.5 w-20 bg-primary rounded-full animate-all duration-1000"></div>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                    {children}
                </div>

                <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    {!feedbackSent ? (
                        <>
                            <p className="text-sm font-medium text-slate-500">Este artigo foi útil?</p>
                            <div className="flex gap-4">
                                <button
                                    onClick={handlePositiveFeedback}
                                    className="flex items-center gap-2 px-8 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5 transition-all text-sm font-bold active:scale-90 group"
                                >
                                    <span className="material-symbols-outlined text-green-500 transition-transform group-hover:scale-125 group-hover:rotate-12">thumb_up</span> Sim
                                </button>
                                <button
                                    onClick={handleNegativeFeedback}
                                    className="flex items-center gap-2 px-8 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5 transition-all text-sm font-bold active:scale-90 group"
                                >
                                    <span className="material-symbols-outlined text-red-500 transition-transform group-hover:scale-125 group-hover:-rotate-12">thumb_down</span> Não
                                </button>
                            </div>
                        </>
                    ) : feedbackType === 'positive' ? (
                        <div className="flex items-center gap-3 py-3 px-6 bg-green-500/10 rounded-2xl border border-green-500/20 animate-in zoom-in duration-300">
                            <span className="material-symbols-outlined text-green-500 text-2xl animate-bounce">celebration</span>
                            <p className="text-sm font-bold text-green-600 dark:text-green-400">Que bom que ajudamos! 🎉 Obrigado pelo feedback!</p>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 py-3 px-6 bg-amber-500/10 rounded-2xl border border-amber-500/20 animate-in zoom-in duration-300">
                            <span className="material-symbols-outlined text-amber-500 text-2xl">sentiment_sad</span>
                            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">Sentimos muito! Vamos melhorar este conteúdo. 💪</p>
                        </div>
                    )}
                </footer>
            </main>

            <PublicFooter />
        </div>
    );
};

export default HelpLayout;
