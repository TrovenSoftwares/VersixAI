import React from 'react';
import HelpLayout from '../../components/HelpLayout';

const WhatsAppAIHelp: React.FC = () => {
    return (
        <HelpLayout title="WhatsApp e Inteligência Artificial" category="Tecnologia">
            <section className="space-y-6">
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    A maior inovação do Phyr é a capacidade de entender conversas e documentos via WhatsApp. Aprenda como configurar e tirar o máximo proveito da nossa IA.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">🟢 Conectando seu WhatsApp</h2>
                <p>
                    O sistema utiliza uma API segura para se comunicar com seu celular.
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                    <li>Vá em <strong>Ajustes &gt; WhatsApp</strong>.</li>
                    <li>Clique em <strong>Criar Instância</strong> (isso criará um canal de comunicação exclusivo).</li>
                    <li>O sistema gerará um **QR Code**. Escaneie usando a opção "Aparelhos Conectados" no seu WhatsApp oficial.</li>
                </ol>

                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-6 rounded-2xl">
                    <h4 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-2 italic">
                        <span className="material-symbols-outlined">warning</span>
                        Importante
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                        O Phyr é passivo. Ele não lê todas as suas conversas pessoais. Ele processa apenas arquivos (fotos de comprovantes) ou mensagens enviadas especificamente para fins de registro financeiro.
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">🤖 Como a Revisão Inteligente funciona?</h2>
                <p>
                    Nossa IA (processada via modelos como Claude 3.5 e GPT-4o) atua como um assistente administrativo que nunca dorme.
                </p>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mt-4">
                    <p className="font-bold text-primary mb-4 uppercase tracking-tighter">O Fluxo de Processamento:</p>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <span className="material-symbols-outlined text-slate-400">image</span>
                            <div>
                                <h5 className="font-bold text-sm">1. Captura</h5>
                                <p className="text-xs text-slate-500">Você tira uma foto de um recibo ou envia um PDF de nota fiscal no WhatsApp.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="material-symbols-outlined text-slate-400">psychology</span>
                            <div>
                                <h5 className="font-bold text-sm">2. Interpretação</h5>
                                <p className="text-xs text-slate-500">A IA identifica o valor, a data da transação e sugere uma categoria (Aluguel, Mercadoria, etc).</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="material-symbols-outlined text-slate-400">approval</span>
                            <div>
                                <h5 className="font-bold text-sm">3. Validação</h5>
                                <p className="text-xs text-slate-500">O registro aparece na aba **Revisão IA** no painel esperando seu "OK" final.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">❓ FAQ Tecnologia</h2>
                <div className="space-y-4">
                    <details className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <summary className="font-bold text-sm cursor-pointer outline-none">O que acontece se eu desconectar o celular?</summary>
                        <p className="text-xs text-slate-500 mt-2">O sistema parará de receber novas mensagens instantaneamente. Basta escanear o QR Code novamente para reativar.</p>
                    </details>
                    <details className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <summary className="font-bold text-sm cursor-pointer outline-none">Quais modelos de IA o Phyr utiliza?</summary>
                        <p className="text-xs text-slate-500 mt-2">Utilizamos um sistema de "fallback" inteligente. Tentamos primeiro o Claude 3.5 Sonnet pela sua precisão, seguido pelo Gemini 1.5 e GPT-4o, garantindo que você nunca fique sem resposta.</p>
                    </details>
                </div>
            </section>
        </HelpLayout>
    );
};

export default WhatsAppAIHelp;
