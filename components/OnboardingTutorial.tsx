import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOnboarding } from '../hooks/useOnboarding';

interface Step {
    id: string;
    title: string;
    content: string;
    selector: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
    path?: string;
}

const steps: Step[] = [
    {
        id: 'welcome',
        title: 'Bem-vindo ao Flowy!',
        content: 'Este é o seu novo assistente financeiro inteligente. Vamos fazer um tour rápido pelas funções principais para você começar com o pé direito.',
        selector: 'body',
        position: 'center'
    },
    {
        id: 'dashboard',
        title: 'Dashboard Estratégico',
        content: 'Aqui você tem a visão geral do seu negócio: saldo, receitas, despesas e pendências detectadas pela IA.',
        selector: '[data-tour="dashboard-stats"]',
        position: 'bottom',
        path: '/dashboard'
    },
    {
        id: 'sidebar-financial',
        title: 'Controle Financeiro',
        content: 'Gerencie suas contas, transações, cheques devolvidos e devoluções de forma centralizada.',
        selector: '[data-tour="sidebar-financial"]',
        position: 'right',
        path: '/dashboard'
    },
    {
        id: 'whatsapp-ia',
        title: 'WhatsApp & IA',
        content: 'Conecte seu WhatsApp para que o Flowy monitore conversas e identifique transações financeiras automaticamente.',
        selector: '[data-tour="settings-whatsapp-connection"]',
        position: 'top',
        path: '/settings?tab=whatsapp'
    },
    {
        id: 'review-ia',
        title: 'Revisão Inteligente',
        content: 'Tudo o que a IA detecta no WhatsApp vem para cá. Você só precisa conferir e aprovar com um clique.',
        selector: '[data-tour="review-content"]',
        position: 'top',
        path: '/review'
    },
    {
        id: 'command-palette',
        title: 'Comandos Rápidos',
        content: 'Precisa de algo rápido? Pressione Ctrl + K para abrir a paleta de comandos e navegar em segundos.',
        selector: 'body',
        position: 'center'
    },
    {
        id: 'help-center',
        title: 'Central de Ajuda',
        content: 'Dúvidas? Nossa central de ajuda tem guias detalhados sobre cada função do sistema.',
        selector: '[data-tour="sidebar-help"]',
        position: 'right'
    }
];

export const OnboardingTutorial: React.FC = () => {
    const { onboarding, updateOnboarding, completeOnboarding } = useOnboarding();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(-1);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!onboarding.completed && onboarding.currentStep < steps.length) {
            setTimeout(() => {
                setActiveStep(onboarding.currentStep);
                setIsVisible(true);
            }, 1000);
        }
    }, [onboarding.completed]);

    const location = useLocation();

    useEffect(() => {
        if (isVisible) {
            updateSpotlight();
        }
    }, [location.pathname, location.search]);

    useEffect(() => {
        if (activeStep >= 0 && activeStep < steps.length) {
            const step = steps[activeStep];

            // Navigate if needed
            if (step.path) {
                const [pathName, queryStr] = step.path.split('?');
                const hasQuery = !!queryStr;
                const currentPath = location.pathname;
                const currentSearch = location.search;

                const isSamePath = currentPath === pathName && (!hasQuery || currentSearch.includes(queryStr));

                if (!isSamePath) {
                    navigate(step.path);
                } else {
                    updateSpotlight();
                }
            } else {
                updateSpotlight();
            }

            // Update persisted step
            updateOnboarding({ currentStep: activeStep });
        }
    }, [activeStep]);

    const updateSpotlight = () => {
        const selector = steps[activeStep]?.selector;
        if (selector === 'body' || !selector) {
            setTargetRect(null);
            return;
        }

        // Use a loop to try finding the element as it might take time to render (especially tabs)
        let attempts = 0;
        const maxAttempts = 15; // Increased to be safer

        const tryFindElement = () => {
            const element = document.querySelector(selector) as HTMLElement;
            if (element && (element.offsetWidth > 0 || element.offsetHeight > 0)) {
                setTargetRect(element.getBoundingClientRect());
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(tryFindElement, 200);
            } else {
                setTargetRect(null);
            }
        };

        tryFindElement();
    };

    // Update spotlight on resize
    useEffect(() => {
        window.addEventListener('resize', updateSpotlight);
        return () => window.removeEventListener('resize', updateSpotlight);
    }, [activeStep]);

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (activeStep > 0) {
            setActiveStep(prev => prev - 1);
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = () => {
        setIsVisible(false);
        setTimeout(completeOnboarding, 300);
    };

    if (!isVisible || activeStep === -1) return null;

    const currentStepData = steps[activeStep];
    const isLastStep = activeStep === steps.length - 1;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none overflow-hidden">
            {/* Dimmed Background with Hole */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] pointer-events-auto transition-opacity duration-500" />

            {/* SVG Mask for Hole */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <mask id="spotlight-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {targetRect && (
                            <rect
                                x={targetRect.left - 8}
                                y={targetRect.top - 8}
                                width={targetRect.width + 16}
                                height={targetRect.height + 16}
                                rx="12"
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="rgba(15, 23, 42, 0.6)" mask="url(#spotlight-mask)" />
            </svg>

            {/* Card Wrapper */}
            <div
                className={`absolute pointer-events-auto transition-all duration-500 ease-out transform
          ${currentStepData.position === 'center' ? 'scale-100 opacity-100' : ''}
        `}
                style={targetRect ? getCardPosition(targetRect, currentStepData.position) : {}}
            >
                <div className="w-[320px] sm:w-[400px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-start justify-between">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-2xl">
                                {activeStep === 0 ? 'auto_awesome' : isLastStep ? 'emoji_events' : 'info'}
                            </span>
                        </div>
                        <button
                            onClick={handleSkip}
                            className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 uppercase tracking-widest transition-colors"
                        >
                            Pular
                        </button>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {currentStepData.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            {currentStepData.content}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-1 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        {steps.map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 transition-all duration-300 ${i <= activeStep ? 'bg-primary' : 'bg-transparent'}`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <div className="text-xs font-bold text-slate-400">
                            {activeStep + 1} de {steps.length}
                        </div>
                        <div className="flex gap-2">
                            <button
                                disabled={activeStep === 0}
                                onClick={handlePrev}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeStep === 0
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                            >
                                {isLastStep ? 'Começar agora' : 'Próximo'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper function to calculate card position relative to target
const getCardPosition = (rect: DOMRect, position: 'top' | 'bottom' | 'left' | 'right' | 'center'): React.CSSProperties => {
    const margin = 20;
    const cardWidth = 400;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (position === 'center') return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    let top = 0;
    let left = 0;

    switch (position) {
        case 'bottom':
            top = rect.bottom + margin;
            left = rect.left + (rect.width / 2) - (cardWidth / 2);
            break;
        case 'top':
            top = rect.top - margin - 200; // estimated
            left = rect.left + (rect.width / 2) - (cardWidth / 2);
            break;
        case 'right':
            top = rect.top + (rect.height / 2) - 100;
            left = rect.right + margin;
            break;
        case 'left':
            top = rect.top + (rect.height / 2) - 100;
            left = rect.left - margin - cardWidth;
            break;
    }

    // Bound checks
    left = Math.max(margin, Math.min(left, viewportWidth - cardWidth - margin));
    top = Math.max(margin, Math.min(top, viewportHeight - 250 - margin));

    return { top: `${top}px`, left: `${left}px` };
};
