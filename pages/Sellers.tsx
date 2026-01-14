import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import ConfirmModal from '../components/ConfirmModal';
import CustomSelect from '../components/CustomSelect';
import { toast } from 'react-hot-toast';
import { formatPhone } from '../utils/utils';
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

const Sellers: React.FC = () => {
    const navigate = useNavigate();
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        period: 'Todo o período'
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
    const [stats, setStats] = useState({
        totalSellers: 0,
        totalSales: 0,
        totalValue: 0,
        avgPerSeller: 0
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchSellers = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch sellers (Vendedor category)
            const { data: sellersData, error: sellersError } = await supabase
                .from('contacts')
                .select('*')
                .eq('category', 'Vendedor')
                .order('name');

            if (sellersError) throw sellersError;

            // Fetch all sales to calculate per-seller stats
            const { data: salesData, error: salesError } = await supabase
                .from('sales')
                .select('seller, value, weight, shipping');

            if (salesError) throw salesError;

            // Calculate stats per seller (by seller name)
            const sellerStats: Record<string, { salesCount: number; totalValue: number; totalWeight: number }> = {};

            (salesData || []).forEach((sale: any) => {
                const sellerName = sale.seller || 'Desconhecido';
                if (!sellerStats[sellerName]) {
                    sellerStats[sellerName] = { salesCount: 0, totalValue: 0, totalWeight: 0 };
                }
                sellerStats[sellerName].salesCount += 1;
                sellerStats[sellerName].totalValue += Number(sale.value || 0);
                sellerStats[sellerName].totalWeight += Number(sale.weight || 0);
            });

            // Merge seller data with stats - match by name
            const enrichedSellers = (sellersData || []).map(seller => {
                const stats = sellerStats[seller.name] || { salesCount: 0, totalValue: 0, totalWeight: 0 };
                return {
                    ...seller,
                    salesCount: stats.salesCount,
                    totalValue: stats.totalValue,
                    totalWeight: stats.totalWeight
                };
            });

            setSellers(enrichedSellers);

            // Calculate global stats
            const totalSellersCount = enrichedSellers.length;
            const totalSalesCount = enrichedSellers.reduce((acc, s) => acc + s.salesCount, 0);
            const totalValueSum = enrichedSellers.reduce((acc, s) => acc + s.totalValue, 0);
            const avgPerSeller = totalSellersCount > 0 ? totalValueSum / totalSellersCount : 0;

            setStats({
                totalSellers: totalSellersCount,
                totalSales: totalSalesCount,
                totalValue: totalValueSum,
                avgPerSeller
            });

        } catch (error: any) {
            console.error('Error fetching sellers:', error);
            toast.error('Erro ao carregar vendedores.');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchSellers();
    }, [fetchSellers]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters]);

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('contacts').delete().eq('id', id);
        if (error) {
            toast.error('Erro ao excluir vendedor.');
        } else {
            setSellers(prev => prev.filter(s => s.id !== id));
            toast.success('Vendedor excluído!');
            fetchSellers();
        }
        setDeleteModal({ isOpen: false, id: null });
    };

    const filteredSellers = sellers.filter(s => {
        const cleanSearch = searchTerm.replace(/\D/g, '');
        return (
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cleanSearch && s.phone?.includes(cleanSearch)) ||
            s.phone?.includes(searchTerm)
        );
    });

    const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSellers = filteredSellers.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="flex-1 flex flex-col gap-6 animate-in fade-in duration-500">
            <PageHeader
                title="Vendedores"
                description="Gerencie seus vendedores e acompanhe os indicadores de vendas."
                actions={
                    <div className="flex gap-3">
                        <Button
                            onClick={fetchSellers}
                            variant="outline"
                            className="bg-white dark:bg-slate-850 h-10 px-4 text-sm font-bold"
                            leftIcon={<span className="material-symbols-outlined text-[20px]">refresh</span>}
                        />
                        <Button
                            onClick={() => navigate('/sellers/new')}
                            leftIcon={<span className="material-symbols-outlined text-[20px]">add</span>}
                            className="h-10 px-4 md:px-6 shadow-lg shadow-primary/20"
                        >
                            <span className="hidden md:inline">Novo Vendedor</span>
                        </Button>
                    </div>
                }
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total de Vendedores"
                    value={stats.totalSellers.toString()}
                    trend="Cadastrados"
                    icon="groups"
                    iconColor="text-primary bg-primary/10"
                />
                <StatCard
                    label="Vendas Realizadas"
                    value={stats.totalSales.toString()}
                    trend="Total de vendas"
                    icon="receipt_long"
                    iconColor="text-blue-500 bg-blue-500/10"
                />
                <StatCard
                    label="Faturamento Total"
                    value={`R$ ${stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    trend="Valor bruto"
                    icon="payments"
                    iconColor="text-emerald-500 bg-emerald-500/10"
                    valueColor="text-emerald-600"
                />
                <StatCard
                    label="Média por Vendedor"
                    value={`R$ ${stats.avgPerSeller.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    trend="Faturamento / Vendedores"
                    icon="insert_chart"
                    iconColor="text-amber-500 bg-amber-500/10"
                    valueColor="text-amber-600"
                />
            </div>



            {/* Filters Area */}
            <Card className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <Input
                        placeholder="Buscar por nome ou telefone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<span className="material-symbols-outlined text-[20px] text-gray-400">search</span>}
                        className="bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-700 focus:ring-primary/50"
                    />
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                        <CustomSelect
                            className="w-full sm:w-48"
                            icon="calendar_today"
                            value={filters.period}
                            onChange={(val) => setFilters({ ...filters, period: val })}
                            options={[
                                { value: 'Todo o período', label: 'Todo o período' },
                                { value: 'Este Mês', label: 'Este Mês' },
                                { value: 'Mês Passado', label: 'Mês Passado' },
                                { value: 'Últimos 7 dias', label: 'Últimos 7 dias' }
                            ]}
                        />
                    </div>
                </div>
            </Card>

            {/* Table Area */}
            <Card noPadding>
                <Table>
                    <TableHeader>
                        <TableHeadCell width="48px" className="text-center">
                            <input className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-primary focus:ring-primary/50 size-4" type="checkbox" />
                        </TableHeadCell>
                        <TableHeadCell>Vendedor</TableHeadCell>
                        <TableHeadCell>Contato</TableHeadCell>
                        <TableHeadCell align="center">Nº Vendas</TableHeadCell>
                        <TableHeadCell align="right">Total Faturado</TableHeadCell>
                        <TableHeadCell align="center">Peso Total</TableHeadCell>
                        <TableHeadCell align="right">Ações</TableHeadCell>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableLoadingState colSpan={7} message="Carregando vendedores..." />
                        ) : paginatedSellers.length === 0 ? (
                            <TableEmptyState colSpan={7} message="Nenhum vendedor encontrado." icon="person_off" />
                        ) : (
                            paginatedSellers.map(seller => (
                                <SellerRow
                                    key={seller.id}
                                    seller={seller}
                                    onEdit={() => navigate(`/sellers/edit/${seller.id}`)}
                                    onDelete={() => setDeleteModal({ isOpen: true, id: seller.id })}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredSellers.length}
                    itemsPerPage={itemsPerPage}
                    startIndex={startIndex}
                />
            </Card>


            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
                title="Excluir Vendedor"
                message="Tem certeza que deseja remover este vendedor?"
                confirmLabel="Excluir"
                type="danger"
            />
        </div>
    );
};

// Stat Card Component - Premium style
const StatCard = ({ label, value, trend, icon, iconColor, valueColor }: any) => (
    <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-slate-850 border border-gray-200 dark:border-slate-700 shadow-sm group hover:border-primary/30 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
            <span className={`material-symbols-outlined ${iconColor} p-2 rounded-lg`}>{icon}</span>
        </div>
        <p className={`text-2xl sm:text-3xl font-bold ${valueColor || 'text-slate-900 dark:text-white'}`}>{value}</p>
        <p className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">info</span> {trend}
        </p>
    </div>
);

// SellerRow Component
const SellerRow = ({ seller, onEdit, onDelete }: any) => {
    return (
        <TableRow>
            <TableCell align="center">
                <input className="rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-primary focus:ring-primary/50 size-4" type="checkbox" />
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-3">
                    {seller.photo_url ? (
                        <img src={seller.photo_url} alt={seller.name} className="size-10 rounded-xl object-cover border border-white/20 shadow-sm" />
                    ) : (
                        <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0 border border-white/20 shadow-sm">
                            <span className="text-white font-bold text-sm">{seller.name.substring(0, 2).toUpperCase()}</span>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{seller.name}</span>
                        <span className="text-xs text-slate-400">Vendedor</span>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">phone</span>
                        {formatPhone(seller.phone) || '---'}
                    </span>
                    <span className="text-xs text-slate-400">{seller.email || '---'}</span>
                </div>
            </TableCell>
            <TableCell align="center">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {seller.salesCount}
                </span>
            </TableCell>
            <TableCell align="right" className="font-bold text-emerald-600">
                R$ {seller.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </TableCell>
            <TableCell align="center" className="text-slate-500 font-bold">
                {seller.totalWeight > 0 ? `${seller.totalWeight.toLocaleString('pt-BR')}g` : '---'}
            </TableCell>
            <TableCell align="right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            </TableCell>
        </TableRow>
    );
};

export default Sellers;
