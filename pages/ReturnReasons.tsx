import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import ConfirmModal from '../components/ConfirmModal';
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

interface ReturnReason {
    id: string;
    name: string;
    created_at: string;
}

const ReturnReasons: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [reasons, setReasons] = useState<ReturnReason[]>([]);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
    const [editModal, setEditModal] = useState<{ isOpen: boolean; id: string | null; name: string }>({ isOpen: false, id: null, name: '' });
    const [saving, setSaving] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('return_reasons')
                .select('*')
                .order('name');

            if (error) throw error;
            setReasons(data || []);
        } catch (error) {
            console.error('Error fetching return reasons:', error);
            toast.error('Erro ao carregar motivos.');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async () => {
        if (!editModal.name.trim()) {
            toast.error('Digite o nome do motivo.');
            return;
        }

        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            if (editModal.id) {
                // Update
                const { error } = await supabase
                    .from('return_reasons')
                    .update({ name: editModal.name })
                    .eq('id', editModal.id);
                if (error) throw error;
                toast.success('Motivo atualizado!');
            } else {
                // Insert
                const { error } = await supabase
                    .from('return_reasons')
                    .insert({ user_id: user.id, name: editModal.name });
                if (error) throw error;
                toast.success('Motivo cadastrado!');
            }

            setEditModal({ isOpen: false, id: null, name: '' });
            fetchData();
        } catch (error) {
            toast.error('Erro ao salvar motivo.');
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            const { error } = await supabase
                .from('return_reasons')
                .delete()
                .eq('id', deleteModal.id);

            if (error) throw error;
            toast.success('Motivo excluído!');
            fetchData();
        } catch (error) {
            toast.error('Erro ao excluir motivo.');
        }
        setDeleteModal({ isOpen: false, id: null });
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="w-full px-8 py-6 border-b border-[#e7edf3] dark:border-slate-800">
                <div className="max-w-[800px] mx-auto">
                    <PageHeader
                        title="Motivos de Devolução"
                        description="Cadastre os motivos que podem ser usados nas devoluções."
                        actions={
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/returns')}
                                    className="flex items-center gap-2 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    Voltar
                                </button>
                                <button
                                    onClick={() => setEditModal({ isOpen: true, id: null, name: '' })}
                                    className="group flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-5 rounded-lg transition-all shadow-lg shadow-primary/30 min-w-max active:scale-95"
                                >
                                    <span className="material-symbols-outlined">add_circle</span>
                                    <span>Novo Motivo</span>
                                </button>
                            </div>
                        }
                    />
                </div>
            </div>

            <div className="flex-1 w-full max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-slate-850 rounded-xl border border-[#e7edf3] dark:border-slate-800 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : reasons.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-slate-500 text-center">
                            <span className="material-symbols-outlined text-4xl mb-2">category</span>
                            <p>Nenhum motivo cadastrado.</p>
                            <button
                                onClick={() => setEditModal({ isOpen: true, id: null, name: '' })}
                                className="mt-4 text-primary font-bold hover:underline"
                            >
                                Cadastrar primeiro motivo
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                            {reasons.map((reason) => (
                                <div key={reason.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-purple-500">label</span>
                                        </div>
                                        <span className="font-bold text-slate-900 dark:text-white">{reason.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setEditModal({ isOpen: true, id: reason.id, name: reason.name })}
                                            className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                            title="Editar"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => setDeleteModal({ isOpen: true, id: reason.id })}
                                            className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                                            title="Excluir"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, id: null, name: '' })}
                title={editModal.id ? 'Editar Motivo' : 'Novo Motivo'}
                footer={
                    <div className="flex gap-3">
                        <button
                            onClick={() => setEditModal({ isOpen: false, id: null, name: '' })}
                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                        >
                            {saving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                }
            >
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        Nome do Motivo
                    </label>
                    <input
                        type="text"
                        value={editModal.name}
                        onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary dark:text-white transition-all"
                        placeholder="Ex: Produto com defeito"
                        autoFocus
                    />
                </div>
            </Modal>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={handleDelete}
                title="Excluir Motivo?"
                message="Tem certeza que deseja excluir este motivo de devolução? Esta ação não pode ser desfeita."
                confirmLabel="Sim, Excluir"
                type="danger"
            />
        </div>
    );
};

export default ReturnReasons;
