import React from 'react';
import HelpLayout from '../../components/HelpLayout';

const SecurityHelp: React.FC = () => {
    return (
        <HelpLayout title="Segurança e Proteção de Dados" category="Tecnologia">
            <section className="space-y-6">
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    A segurança dos seus dados financeiros é nossa prioridade número um. O Flowy utiliza tecnologias de ponta para garantir que suas informações estejam sempre protegidas, isoladas e acessíveis apenas por você.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">🔐 Infraestrutura e Autenticação</h2>
                <p>
                    Utilizamos o <strong>Supabase</strong>, uma plataforma de infraestrutura baseada em nuvem líder de mercado, para gerir toda a camada de dados e autenticação:
                </p>
                <ul>
                    <li><strong>Criptografia em Repouso:</strong> Seus dados são salvos em discos criptografados (AES-256).</li>
                    <li><strong>Criptografia em Trânsito:</strong> Toda comunicação entre seu navegador/celular e nossos servidores é feita via TLS (SSL de alto nível).</li>
                    <li><strong>MFA (Autenticação de Dois Fatores):</strong> Suportamos camadas extras de segurança para garantir que sua senha sozinha não seja suficiente para acessar sua conta.</li>
                </ul>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">🛡️ Isolamento de Dados (Multi-tenancy)</h2>
                <p>
                    Diferente de sistemas simplistas, o Flowy foi construído com arquitetura de <strong>Isolamento Lógico Estrito</strong>. Isso significa que as informações de uma empresa nunca "vazam" para outra, mesmo estando no mesmo banco de dados.
                </p>
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">policy</span>
                        Políticas de RLS
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Utilizamos <em>Row Level Security</em> diretamente no banco de dados Postgres. Mesmo um erro no código do site não permitiria que um usuário visse dados de outra empresa, pois o banco de dados bloqueia o acesso na raiz.
                    </p>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">🤖 Privacidade na IA</h2>
                <p>
                    Sabemos que dados financeiros são sensíveis. Por isso, nossa integração com IA segue regras rígidas:
                </p>
                <ol className="list-decimal pl-6 space-y-4">
                    <li>
                        <strong>Processamento Temporário:</strong> A IA recebe apenas o necessário para extrair os dados. As informações não são usadas para "treinar" modelos públicos.
                    </li>
                    <li>
                        <strong>Sem Armazenamento de Mensagens Pessoais:</strong> O sistema ignora conversas que não contenham anexos financeiros ou comandos específicos.
                    </li>
                    <li>
                        <strong>Retenção Controlada:</strong> Você pode solicitar a exclusão total dos seus dados a qualquer momento via Ajustes.
                    </li>
                </ol>

                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mt-12">
                    <h3 className="font-bold text-primary flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined">verified_user</span>
                        Compromisso Flowy
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                        Não vendemos seus dados para terceiros. Nosso modelo de negócio é baseado na sua assinatura de software, não na exploração de suas informações.
                    </p>
                </div>
            </section>
        </HelpLayout>
    );
};

export default SecurityHelp;
