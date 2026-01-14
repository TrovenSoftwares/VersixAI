import React from 'react';
import HelpLayout from '../../components/HelpLayout';

const GettingStarted: React.FC = () => {
    return (
        <HelpLayout title="Primeiros Passos no Phyr" category="Geral">
            <section className="space-y-6">
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Bem-vindo ao Phyr! Este guia ajudará você a configurar sua conta e entender os conceitos fundamentais para começar a gerir suas finanças com inteligência.
                </p>

                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 my-8">
                    <h3 className="font-bold text-primary flex items-center gap-2 mb-2 italic">
                        <span className="material-symbols-outlined">lightbulb</span>
                        Dica Rápida
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                        O Phyr foi desenhado para ser intuitivo. Quase tudo pode ser feito via WhatsApp, mas o painel web é onde você tem a visão estratégica completa.
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">1. Configuração do Perfil</h2>
                <p>
                    O primeiro passo é garantir que seus dados estejam corretos. Vá em <strong>Ajustes &gt; Perfil</strong> para:
                </p>
                <ul>
                    <li>Escolher seu nome de exibição.</li>
                    <li>Adicionar um avatar (foto de perfil).</li>
                    <li>Definir seu Cargo/Função dentro da empresa.</li>
                </ul>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">2. Conhecendo o Dashboard</h2>
                <p>
                    O Dashboard é sua central de comando. Nele você verá:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h4 className="font-bold text-sm mb-2 text-primary uppercase tracking-wider">Saldo Total</h4>
                        <p className="text-xs text-slate-500">A soma de todas as suas contas bancárias registradas.</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h4 className="font-bold text-sm mb-2 text-primary uppercase tracking-wider">Receitas vs Despesas</h4>
                        <p className="text-xs text-slate-500">Indicador mensal do desempenho financeiro.</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h4 className="font-bold text-sm mb-2 text-primary uppercase tracking-wider">Pendências IA</h4>
                        <p className="text-xs text-slate-500">Mensagens do WhatsApp aguardando sua aprovação.</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h4 className="font-bold text-sm mb-2 text-primary uppercase tracking-wider">Contatos Monitorados</h4>
                        <p className="text-xs text-slate-500">Clientes com débitos ativos em aberto.</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">3. Seu Fluxo Diário</h2>
                <p>
                    Para extrair o melhor da plataforma, recomendamos o seguinte fluxo de trabalho:
                </p>
                <ol className="list-decimal pl-6 space-y-4">
                    <li>
                        <strong>Registrar Vendas:</strong> Use o PDV ou a aba Vendas para registrar cada negociação.
                    </li>
                    <li>
                        <strong>Integrar WhatsApp:</strong> Conecte seu número para que a IA ajude a classificar seus gastos.
                    </li>
                    <li>
                        <strong>Revisão Inteligente:</strong> Uma vez por dia, acesse a aba <strong>Revisão IA</strong> para confirmar os lançamentos automáticos.
                    </li>
                </ol>
            </section>
        </HelpLayout>
    );
};

export default GettingStarted;
