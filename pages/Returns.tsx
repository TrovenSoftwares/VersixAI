import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import CustomSelect from '../components/CustomSelect';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'react-hot-toast';
import { WeightIcon } from '../components/BrandedIcons';
import StatCard from '../components/StatCard';
import Input from '../components/Input';
import Button from '../components/Button';
import {
    Table,
    TableHeader,
    TableHeadCell,
    TableBody,
    TableRow,
    TableCell,
    TableLoadingState,
    TableEmptyState,
    TablePagination
} from '../components/Table';
import Card from '../components/Card';

interface Return {
    id: string;
    weight: number;
    gram_value: number;
    total_value: number;
    return_date: string;
    contact_id: string;
    account_id: string;
    reason_id: string;
    created_at: string;
    contact?: { name: string };
    account?: { name: string };
    reason?: { name: string };
}

const Returns: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [returns, setReturns] = useState<Return[]>([]);
    const [stats, setStats] = useState({ total: 0, totalValue: 0, totalWeight: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [periodFilter, setPeriodFilter] = useState('Todos');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('returns')
                .select(`
                    *,
                    contact:contacts(name),
                    account:accounts(name),
                    reason:return_reasons(name)
                `)
                .order('return_date', { ascending: false });

            if (error) throw error;

            setReturns(data || []);
            setStats({
                total: data?.length || 0,
                totalValue: data?.reduce((sum, r) => sum + Number(r.total_value), 0) || 0,
                totalWeight: data?.reduce((sum, r) => sum + Number(r.weight || 0), 0) || 0
            });
        } catch (error) {
            console.error('Error fetching returns:', error);
            toast.error('Erro ao carregar devoluções.');
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
                .from('returns')
                .delete()
                .eq('id', deleteModal.id);

            if (error) throw error;

            toast.success('Devolução excluída!');
            fetchData();
        } catch (error) {
            toast.error('Erro ao excluir devolução.');
        }
        setDeleteModal({ isOpen: false, id: null });
    };

    const filteredReturns = returns.filter(ret => {
        const matchesSearch =
            ret.contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ret.reason?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('pt-BR');
    };

    const formatWeight = (weight: number) => {
        return `${weight.toFixed(3)}g`;
    };

    return (
        <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-500">
            <PageHeader
                title="Devoluções"
                description="Gerencie as devoluções de produtos e acompanhe os valores."
                actions={
                    <div className="flex gap-3">
                        <Button
                            onClick={() => navigate('/returns/reasons')}
                            variant="outline"
                            className="bg-white dark:bg-slate-850 h-10 px-4 text-sm font-bold"
                            leftIcon={<span className="material-symbols-outlined text-[20px]">category</span>}
                        >
                            Motivos
                        </Button>
                        <Button
                            onClick={() => navigate('/returns/new')}
                            leftIcon={<span className="material-symbols-outlined text-[20px]">add_circle</span>}
                            className="h-10 px-4 md:px-6 shadow-lg shadow-primary/20"
                        >
                            <span className="hidden md:inline">Nova Devolução</span>
                        </Button>
                    </div>
                }
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    label="Total de Devoluções"
                    value={stats.total.toString()}
                    trend="Produtos devolvidos"
                    icon="assignment_return"
                    iconColor="text-purple-500 bg-purple-500/10"
                    trendColor="text-purple-600"
                />
                <StatCard
                    label="Peso Total"
                    value={formatWeight(stats.totalWeight)}
                    trend="Em gramas"
                    icon={<WeightIcon className="size-6 text-blue-500" />}
                    iconColor="text-blue-500 bg-blue-500/10"
                    trendColor="text-blue-600"
                />
                <StatCard
                    label="Valor Total"
                    value={formatCurrency(stats.totalValue)}
                    trend="Débito do cliente"
                    icon="payments"
                    iconColor="text-amber-500 bg-amber-500/10"
                    trendColor="text-amber-600"
                />
            </div>

            {/* Search & Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex-1 max-w-xl">
                        <Input
                            placeholder="Buscar por cliente ou motivo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={<span className="material-symbols-outlined text-[20px] text-gray-400">search</span>}
                            className="bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-primary/50"
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
            </Card>

            {/* Table */}
            <Card noPadding>
                <Table>
                    <TableHeader>
                        <TableHeadCell>Cliente</TableHeadCell>
                        <TableHeadCell>Motivo</TableHeadCell>
                        <TableHeadCell>Data</TableHeadCell>
                        <TableHeadCell align="right">Peso</TableHeadCell>
                        <TableHeadCell align="right">Valor/g</TableHeadCell>
                        <TableHeadCell align="right">Valor Total</TableHeadCell>
                        <TableHeadCell align="right">Ações</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableLoadingState colSpan={7} message="Carregando devoluções..." />
                        ) : filteredReturns.length === 0 ? (
                            <TableEmptyState colSpan={7} message="Nenhuma devolução encontrada." icon="assignment_return" />
                        ) : (
                            filteredReturns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((ret) => (
                                <ReturnRow
                                    key={ret.id}
                                    ret={ret}
                                    onEdit={() => navigate(`/returns/edit/${ret.id}`)}
                                    onDelete={() => setDeleteModal({ isOpen: true, id: ret.id })}
                                    formatDate={formatDate}
                                    formatWeight={formatWeight}
                                    formatCurrency={formatCurrency}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredReturns.length / itemsPerPage)}
                    onPageChange={setCurrentPage}
                    totalItems={filteredReturns.length}
                    itemsPerPage={itemsPerPage}
                    startIndex={(currentPage - 1) * itemsPerPage}
                />
            </Card>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Excluir Devolução?"
                message="Tem certeza que deseja excluir esta devolução? Esta ação não pode ser desfeita."
                confirmLabel="Sim, Excluir"
                type="danger"
            />
        </div>
    );
};

// ReturnRow Component
const ReturnRow = ({ ret, onEdit, onDelete, formatDate, formatWeight, formatCurrency }: any) => {
    return (
        <TableRow>
            <TableCell>
                <span className="font-bold text-slate-900 dark:text-white">{ret.contact?.name || '-'}</span>
            </TableCell>
            <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    {ret.reason?.name || '-'}
                </span>
            </TableCell>
            <TableCell>
                <span className="text-slate-500">{formatDate(ret.return_date)}</span>
            </TableCell>
            <TableCell align="right">
                <span className="text-slate-700 dark:text-slate-300">{ret.weight ? formatWeight(ret.weight) : '-'}</span>
            </TableCell>
            <TableCell align="right">
                <span className="text-slate-700 dark:text-slate-300">{ret.gram_value ? formatCurrency(ret.gram_value) : '-'}</span>
            </TableCell>
            <TableCell align="right">
                <span className="font-bold text-rose-600">{formatCurrency(ret.total_value)}</span>
            </TableCell>
            <TableCell align="right">
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={onEdit}
                        className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Editar"
                    >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Excluir"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            </TableCell>
        </TableRow>
    );
};

export default Returns;
