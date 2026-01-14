import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import CustomSelect from '../components/CustomSelect';
import ConfirmModal from '../components/ConfirmModal';
import { toast } from 'react-hot-toast';
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
import StatCard from '../components/StatCard';

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
        <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-500">
            <PageHeader
                title="Cheques Devolvidos"
                description="Gerencie os cheques devolvidos e acompanhe os valores pendentes."
                actions={
                    <Button
                        onClick={() => navigate('/bounced-checks/new')}
                        leftIcon={<span className="material-symbols-outlined text-[20px]">add_circle</span>}
                        className="h-10 px-4 md:px-6 shadow-lg shadow-primary/20"
                    >
                        <span className="hidden md:inline">Novo Cheque</span>
                    </Button>
                }
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                    label="Total de Cheques"
                    value={stats.total.toString()}
                    trend="Cheques devolvidos"
                    icon="money_off"
                    iconColor="text-rose-500 bg-rose-500/10"
                    trendColor="text-rose-600"
                />
                <StatCard
                    label="Valor Total"
                    value={formatCurrency(stats.totalValue)}
                    trend="Pendente de regularização"
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
                            placeholder="Buscar por número do cheque ou cliente..."
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
                        <TableHeadCell>Nº Cheque</TableHeadCell>
                        <TableHeadCell>Cliente</TableHeadCell>
                        <TableHeadCell>Data</TableHeadCell>
                        <TableHeadCell>Conta</TableHeadCell>
                        <TableHeadCell align="right">Valor</TableHeadCell>
                        <TableHeadCell align="right">Ações</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableLoadingState colSpan={6} message="Carregando cheques devolvidos..." />
                        ) : filteredChecks.length === 0 ? (
                            <TableEmptyState colSpan={6} message="Nenhum cheque devolvido encontrado." icon="money_off" />
                        ) : (
                            filteredChecks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((check) => (
                                <CheckRow
                                    key={check.id}
                                    check={check}
                                    onEdit={() => navigate(`/bounced-checks/edit/${check.id}`)}
                                    onDelete={() => setDeleteModal({ isOpen: true, id: check.id })}
                                    formatDate={formatDate}
                                    formatCurrency={formatCurrency}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredChecks.length / itemsPerPage)}
                    onPageChange={setCurrentPage}
                    totalItems={filteredChecks.length}
                    itemsPerPage={itemsPerPage}
                    startIndex={(currentPage - 1) * itemsPerPage}
                />
            </Card>

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

// CheckRow Component
const CheckRow = ({ check, onEdit, onDelete, formatDate, formatCurrency }: any) => {
    return (
        <TableRow>
            <TableCell>
                <span className="font-bold text-slate-900 dark:text-white">{check.check_number}</span>
            </TableCell>
            <TableCell>
                <span className="text-slate-700 dark:text-slate-300">{check.contact?.name || '-'}</span>
            </TableCell>
            <TableCell>
                <span className="text-slate-500">{formatDate(check.check_date)}</span>
            </TableCell>
            <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {check.account?.name || '-'}
                </span>
            </TableCell>
            <TableCell align="right">
                <span className="font-bold text-rose-600">- {formatCurrency(check.value)}</span>
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

export default BouncedChecks;
