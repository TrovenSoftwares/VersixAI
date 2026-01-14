import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/PageHeader';
import CustomSelect from '../components/CustomSelect';
import InputMask from '../components/InputMask';
import { MASKS, formatCpfCnpj } from '../utils/utils';
import { toast } from 'react-hot-toast';
import Input from '../components/Input';
import Button from '../components/Button';

const NewBouncedCheck: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [contacts, setContacts] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [searchContact, setSearchContact] = useState('');
    const [showContactList, setShowContactList] = useState(false);

    const [formData, setFormData] = useState({
        check_number: '',
        value: '',
        check_date: new Date().toISOString().split('T')[0],
        contact_id: '',
        client_name: '',
        account_id: ''
    });

    const fetchBaseData = useCallback(async () => {
        try {
            const [clientsRes, accountsRes] = await Promise.all([
                supabase.from('contacts').select('id, name, phone, email, id_number').order('name'),
                supabase.from('accounts').select('id, name').order('name')
            ]);

            setContacts(clientsRes.data || []);
            setAccounts(accountsRes.data || []);
        } catch (error) {
            console.error('Error fetching base data:', error);
        }
    }, []);

    const fetchCheck = useCallback(async () => {
        if (!id) return;
        setFetching(true);
        try {
            const { data, error } = await supabase
                .from('bounced_checks')
                .select('*, contact:contacts(name)')
                .eq('id', id)
                .single();

            if (error) throw error;

            if (data) {
                setFormData({
                    check_number: data.check_number,
                    value: data.value.toString(),
                    check_date: data.check_date,
                    contact_id: data.contact_id || '',
                    client_name: data.contact?.name || '',
                    account_id: data.account_id || ''
                });
            }
        } catch (error) {
            toast.error('Erro ao carregar cheque.');
            navigate('/bounced-checks');
        }
        setFetching(false);
    }, [id, navigate]);

    useEffect(() => {
        fetchBaseData();
        if (isEdit) fetchCheck();
    }, [fetchBaseData, fetchCheck, isEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.check_number || !formData.value || !formData.check_date || !formData.contact_id || !formData.account_id) {
            toast.error('Preencha todos os campos obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            const checkData = {
                user_id: user.id,
                check_number: formData.check_number,
                value: parseFloat(formData.value.replace(/[^\d,.-]/g, '').replace(',', '.')),
                check_date: formData.check_date,
                contact_id: formData.contact_id,
                account_id: formData.account_id
            };

            let checkId = id;

            if (isEdit) {
                const { error } = await supabase
                    .from('bounced_checks')
                    .update(checkData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('bounced_checks')
                    .insert(checkData)
                    .select()
                    .single();
                if (error) throw error;
                checkId = data.id;
            }

            // Criar transação vinculada (despesa)
            if (!isEdit) {
                const transactionData = {
                    user_id: user.id,
                    type: 'expense',
                    value: checkData.value,
                    date: checkData.check_date,
                    description: `Cheque Devolvido #${checkData.check_number}`,
                    account_id: checkData.account_id,
                    contact_id: checkData.contact_id,
                    status: 'confirmed'
                };

                const { data: txData, error: txError } = await supabase
                    .from('transactions')
                    .insert(transactionData)
                    .select()
                    .single();

                if (txError) throw txError;

                // Atualizar cheque com transaction_id
                await supabase
                    .from('bounced_checks')
                    .update({ transaction_id: txData.id })
                    .eq('id', checkId);

                // Atualizar saldo do cliente (adicionar ao débito)
                const { data: client } = await supabase
                    .from('contacts')
                    .select('balance')
                    .eq('id', checkData.contact_id)
                    .single();

                const currentBalance = client?.balance || 0;
                await supabase
                    .from('contacts')
                    .update({ balance: currentBalance - checkData.value })
                    .eq('id', checkData.contact_id);
            }

            toast.success(isEdit ? 'Cheque atualizado!' : 'Cheque registrado com sucesso!');
            navigate('/bounced-checks');
        } catch (error: any) {
            console.error('Error saving bounced check:', error);
            toast.error('Erro ao salvar cheque devolvido.');
        }
        setLoading(false);
    };

    const selectContact = (contact: any) => {
        setFormData({ ...formData, contact_id: contact.id, client_name: contact.name });
        setSearchContact('');
        setShowContactList(false);
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center h-full text-slate-500">
                Carregando dados do cheque...
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            {/* Header Area */}
            <div className="w-full px-8 py-6 border-b border-[#e7edf3] dark:border-slate-800">
                <div className="max-w-[1000px] mx-auto">
                    <PageHeader
                        title={isEdit ? 'Editar Cheque Devolvido' : 'Novo Cheque Devolvido'}
                        description={isEdit ? 'Atualize os dados do cheque abaixo.' : 'Preencha os dados abaixo para registrar um novo cheque devolvido.'}
                        actions={
                            <Button
                                variant="outline"
                                onClick={() => navigate('/bounced-checks')}
                                leftIcon={<span className="material-symbols-outlined text-[20px]">arrow_back</span>}
                            >
                                Voltar
                            </Button>
                        }
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full p-8">
                <div className="max-w-[1000px] mx-auto h-full flex flex-col gap-6 items-start">
                    <div className="w-full flex flex-col gap-4">
                        <div className="flex justify-between items-center px-1">
                            <h2 className="text-slate-900 dark:text-white tracking-tight text-[20px] font-bold leading-tight flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">money_off</span>
                                Dados do Cheque
                            </h2>
                        </div>

                        <div className="bg-white dark:bg-slate-850 rounded-xl border border-[#e7edf3] dark:border-slate-800 shadow-sm p-6 flex flex-col gap-8 w-full">
                            {/* Client Selection */}
                            <div className="flex flex-col gap-2 relative">
                                <label className="text-slate-900 dark:text-white text-sm font-medium flex gap-1">
                                    Cliente <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center bg-[#f1f5f9] dark:bg-slate-900 rounded-lg h-12 px-4 focus-within:ring-2 focus-within:ring-primary/30 focus-within:bg-white dark:focus-within:bg-slate-950 transition-all border border-transparent group">
                                    <span className="material-symbols-outlined text-slate-400 mr-2 group-focus-within:text-primary transition-colors">person_search</span>
                                    <input
                                        className="bg-transparent border-none w-full text-slate-900 dark:text-white font-medium text-base focus:ring-0 p-0 placeholder:text-slate-400"
                                        placeholder={formData.client_name || "Buscar cliente por nome..."}
                                        type="text"
                                        value={searchContact}
                                        onChange={(e) => {
                                            setSearchContact(e.target.value);
                                            setShowContactList(true);
                                        }}
                                        onFocus={() => setShowContactList(true)}
                                    />
                                    <Link to="/contacts/new" className="text-primary text-sm font-bold hover:underline whitespace-nowrap ml-2">Novo Cliente</Link>
                                </div>

                                {showContactList && searchContact.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                        {contacts.filter(c => c.name.toLowerCase().includes(searchContact.toLowerCase())).map(contact => (
                                            <div
                                                key={contact.id}
                                                className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-sm"
                                                onClick={() => selectContact(contact)}
                                            >
                                                <p className="font-bold text-slate-900 dark:text-white">{contact.name}</p>
                                                <p className="text-xs text-slate-500">{contact.phone || contact.email || formatCpfCnpj(contact.id_number)}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

                            {/* Form Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Número do Cheque */}
                                <div className="flex flex-col gap-2">
                                    <Input
                                        label={
                                            <span className="flex gap-1">
                                                Número do Cheque <span className="text-red-500">*</span>
                                            </span>
                                        }
                                        placeholder="Ex: 123456"
                                        type="text"
                                        value={formData.check_number}
                                        onChange={(e) => setFormData({ ...formData, check_number: e.target.value })}
                                        leftIcon={<span className="material-symbols-outlined text-slate-400 text-[20px]">tag</span>}
                                    />
                                </div>

                                {/* Data do Cheque */}
                                <div className="flex flex-col gap-2">
                                    <Input
                                        label={
                                            <span className="flex gap-1">
                                                Data da Movimentação <span className="text-red-500">*</span>
                                            </span>
                                        }
                                        type="date"
                                        required
                                        value={formData.check_date}
                                        onChange={(e) => setFormData({ ...formData, check_date: e.target.value })}
                                    />
                                </div>

                                {/* Valor */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-900 dark:text-white text-sm font-medium flex gap-1">
                                        Valor (R$) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold z-10">R$</span>
                                        <InputMask
                                            mask={MASKS.CURRENCY}
                                            value={formData.value}
                                            onAccept={(val) => setFormData({ ...formData, value: val })}
                                            placeholder="0,00"
                                            className="pl-12 font-bold text-lg"
                                        />
                                    </div>
                                </div>

                                {/* Conta Bancária */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-900 dark:text-white text-sm font-medium flex gap-1">
                                        Conta Bancária <span className="text-red-500">*</span>
                                    </label>
                                    <CustomSelect
                                        value={formData.account_id}
                                        onChange={(val) => setFormData({ ...formData, account_id: val })}
                                        placeholder="Selecione a conta"
                                        icon="account_balance"
                                        options={accounts.map(acc => ({ value: acc.id, label: acc.name }))}
                                    />
                                </div>
                            </div>

                            {/* Form Footer Actions */}
                            <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-end items-center">
                                <Button
                                    type="button"
                                    onClick={() => navigate('/bounced-checks')}
                                    variant="ghost"
                                    className="h-12 px-6"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={loading}
                                    className="h-12 px-8"
                                    leftIcon={<span className="material-symbols-outlined group-hover:scale-110 transition-transform">save</span>}
                                >
                                    {isEdit ? 'Salvar Alterações' : 'Cadastrar Cheque'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form >
    );
};

export default NewBouncedCheck;
