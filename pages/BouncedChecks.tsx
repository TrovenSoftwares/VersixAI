import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import CustomSelect from '../components/CustomSelect';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'react-hot-toast';

interface BouncedCheck {
    id: string;
    value: number;
    check_number: string;
    check_date: string;
    contact_id: string;
    account_id: string;
    created_at: string;
    contact?: { name: string };
    account?: { name: string };
}

const BouncedChecks: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [checks, setChecks] = useState<BouncedCheck[]>([]);
    const [stats, setStats] = useState({ total: 0, totalValue: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [periodFilter, setPeriodFilter] = useState('Todos');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('bounced_checks')
                .select(`
                    *,
                    contact:contacts(name),
                    account:accounts(name)
                `)
                .order('check_date', { ascending: false });

            if (error) throw error;

            setChecks(data || []);
            setStats({
                total: data?.length || 0,
                totalValue: data?.reduce((sum, c) => sum + Number(c.value), 0) || 0
            });
        } catch (error) {
            console.error('Error fetching bounced checks:', error);
            toast.error('Erro ao carregar cheques devolvidos.');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            const { error } = await supabase
                .from('bounced_checks')
                .delete()
                .eq('id', deleteModal.id);

            if (error) throw error;

            toast.success('Cheque devolvido excluído!');
            fetchData();
        } catch (error) {
            toast.error('Erro ao excluir cheque.');
        }
        setDeleteModal({ isOpen: false, id: null });
    };

    const filteredChecks = checks.filter(check => {
        const matchesSearch =
            check.check_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            check.contact?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="w-full px-8 py-6 border-b border-[#e7edf3] dark:border-slate-800">
                <div className="max-w-[1200px] mx-auto">
                    <PageHeader
                        title="Cheques Devolvidos"
                        description="Gerencie os cheques devolvidos e acompanhe os valores pendentes."
                        actions={
                            <button
                                onClick={() => navigate('/bounced-checks/new')}
                                className="group flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-lg transition-all shadow-lg shadow-primary/30 min-w-max active:scale-95"
                            >
                                <span className="material-symbols-outlined">add_circle</span>
                                <span>Novo Cheque</span>
                            </button>
                        }
                    />
                </div>
            </div>

            <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-850 border border-[#e7edf3] dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total de Cheques</p>
                            <span className="material-symbols-outlined text-rose-500 bg-rose-500/10 p-2 rounded-lg">money_off</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                        <p className="text-rose-600 text-xs font-bold flex items-center gap-1.5 mt-1">
                            <span className="material-symbols-outlined text-base">info</span>
                            Cheques devolvidos
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-850 border border-[#e7edf3] dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Valor Total</p>
                            <span className="material-symbols-outlined text-amber-500 bg-amber-500/10 p-2 rounded-lg">payments</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(stats.totalValue)}</p>
                        <p className="text-amber-600 text-xs font-bold flex items-center gap-1.5 mt-1">
                            <span className="material-symbols-outlined text-base">trending_up</span>
                            Pendente de regularização
                        </p>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-white dark:bg-slate-850 rounded-xl border border-[#e7edf3] dark:border-slate-800 shadow-sm p-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative flex-1 max-w-xl">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                                <span className="material-symbols-outlined">search</span>
                            </div>
                            <input
                                className="block w-full rounded-lg border-transparent bg-[#f8fafc] dark:bg-slate-900 border focus:border-primary focus:ring-4 focus:ring-primary/10 py-2.5 pl-10 pr-3 text-sm placeholder:text-slate-400 dark:text-white transition-all"
                                placeholder="Buscar por número do cheque ou cliente..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <CustomSelect
                                value={periodFilter}
                                onChange={setPeriodFilter}
                                icon="calendar_month"
                                options={[
                                    { value: 'Todos', label: 'Todos os Períodos' },
                                    { value: 'Hoje', label: 'Hoje' },
                                    { value: 'Semana', label: 'Esta Semana' },
                                    { value: 'Mês', label: 'Este Mês' },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-850 rounded-xl border border-[#e7edf3] dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                    {loading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredChecks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-slate-500 text-center">
                            <span className="material-symbols-outlined text-4xl mb-2">money_off</span>
                            <p>Nenhum cheque devolvido encontrado.</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                                    <thead className="bg-[#fcfdfd] dark:bg-slate-900/50 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-[#e7edf3] dark:border-slate-800">
                                        <tr>
                                            <th className="px-6 py-4">Nº Cheque</th>
                                            <th className="px-6 py-4">Cliente</th>
                                            <th className="px-6 py-4">Data</th>
                                            <th className="px-6 py-4">Conta</th>
                                            <th className="px-6 py-4 text-right">Valor</th>
                                            <th className="px-6 py-4 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {filteredChecks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((check) => (
                                            <tr key={check.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-slate-900 dark:text-white">{check.check_number}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-slate-700 dark:text-slate-300">{check.contact?.name || '-'}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-slate-500">{formatDate(check.check_date)}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                        {check.account?.name || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-bold text-rose-600">- {formatCurrency(check.value)}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => navigate(`/bounced-checks/edit/${check.id}`)}
                                                            className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                                            title="Editar"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteModal({ isOpen: true, id: check.id })}
                                                            className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                                            title="Excluir"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination Footer */}
                            <div className="border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 px-6 py-4 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    <span className="hidden sm:inline">Mostrando </span>
                                    <span className="font-bold text-gray-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredChecks.length)}</span> de <span className="font-bold text-gray-900 dark:text-white">{filteredChecks.length}</span>
                                    <span className="hidden sm:inline"> resultados</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                                    </button>
                                    <span className="text-sm font-bold text-primary px-2">{currentPage} / {Math.ceil(filteredChecks.length / itemsPerPage) || 1}</span>
                                    <button
                                        disabled={currentPage === Math.ceil(filteredChecks.length / itemsPerPage) || filteredChecks.length === 0}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Excluir Cheque Devolvido?"
                message="Tem certeza que deseja excluir este cheque devolvido? Esta ação não pode ser desfeita."
                confirmLabel="Sim, Excluir"
                type="danger"
            />
        </div>
    );
};

export default BouncedChecks;
