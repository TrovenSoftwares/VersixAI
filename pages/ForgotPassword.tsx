import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PhyrLogo } from '../components/BrandedIcons';
import Input from '../components/Input';
import Button from '../components/Button';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/#/reset-password`,
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'E-mail de recuperação enviado! Verifique sua caixa de entrada.' });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 font-display">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col items-center mb-8 text-center">
                    <PhyrLogo className="h-[40px] w-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recuperar Senha</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-center mt-2">
                        Digite seu e-mail para receber as instruções de recuperação.
                    </p>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Input
                            label="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                            type="email"
                            disabled={loading}
                            leftIcon={<span className="material-symbols-outlined text-[20px]">mail</span>}
                        />
                    </div>

                    <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full h-[48px]"
                        leftIcon={<span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                    >
                        Enviar Instruções
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-sm font-semibold text-primary hover:text-blue-700 transition-colors">
                        Voltar para o login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
