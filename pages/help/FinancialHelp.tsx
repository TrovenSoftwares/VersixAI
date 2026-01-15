import React from 'react';
import HelpLayout from '../../components/HelpLayout';

const FinancialHelp: React.FC = () => {
    return (
        <HelpLayout title="Gestão Financeira e PDV" category="Tecnologia">
            <section className="space-y-6">
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    O coração do Flowy é a gestão financeira simplificada. Aprenda a dominar o fluxo de caixa, o Ponto de Venda e as ferramentas de controle de débitos.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">🕹️ Ponto de Venda (PDV)</h2>
                <p>
                    Nosso PDV foi desenhado para ser rápido. Ele permite que você registre vendas em segundos:
                </p>
                <ul>
                    <li><strong>Seleção de Cliente:</strong> Escolha um cliente cadastrado ou venda para um "Consumidor Final".</li>
                    <li><strong>Meio de Pagamento:</strong> Defina se é Dinheiro, Pix, Cartão ou a Prazo.</li>
                    <li><strong>Vínculo com Vendedor:</strong> Atribua a venda a um membro da equipe para cálculo de comissões.</li>
                </ul>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">📉 Fluxo de Caixa e Transações</h2>
                <p>
                    Cada venda ou gasto gera uma <strong>Transação</strong>. Você pode acompanhar todas elas na aba <strong>Transações</strong>.
                </p>
                <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold mb-2">Compreendendo os ícones:</h4>
                    <div className="space-y-2 text-sm">
                        <p><span className="text-red-500 font-bold">SALE:</span> Venda realizada (Entrada de recurso prevista/efetivada).</p>
                        <p><span className="text-primary font-bold">EXPENSE:</span> Despesa ou Gasto (Saída de recurso).</p>
                        <p><span className="text-green-500 font-bold">RETURN:</span> Devolução de Mercadoria (Ajuste de estoque/crédito).</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">🏦 Cheques Devolvidos</h2>
                <p>
                    Se um cheque for devolvido, você deve lançá-lo via <strong>Financeiro &gt; Cheques Devolvidos</strong>.
                </p>
                <p>
                    <strong>O que acontece ao salvar:</strong>
                </p>
                <ol>
                    <li>Uma transação de débito é criada automaticamente no extrato do cliente.</li>
                    <li>O saldo devedor do cliente é atualizado na hora.</li>
                    <li>O cheque fica listado para acompanhamento de cobrança.</li>
                </ol>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-10 mb-4">📊 Relatórios de Desempenho</h2>
                <p>
                    Na aba <strong>Relatórios</strong>, você pode gerar documentos profissionais em PDF e Excel:
                </p>
                <ul>
                    <li><strong>DRE (Demonstrativo de Resultado):</strong> Veja se sua empresa está dando lucro ou prejuízo.</li>
                    <li><strong>Extrato de Cliente:</strong> Gere um PDF detalhado para cobrança ou conferência.</li>
                    <li><strong>Relatório de Vendas:</strong> Analise o desempenho por período ou vendedor.</li>
                </ul>
            </section>
        </HelpLayout>
    );
};

export default FinancialHelp;
