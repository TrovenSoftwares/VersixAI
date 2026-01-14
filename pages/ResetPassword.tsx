import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { PhyrLogo } from '../components/BrandedIcons';
import Input from '../components/Input';
import Button from '../components/Button';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if we have a recovery session
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event !== 'PASSWORD_RECOVERY') {
                // If not in recovery mode, maybe they shouldn't be here
                // but we let them try if session exists
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        if (password.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres.');
            return;
        }

        setLoading(true);
        setError(null);

        const { error: resetError } = await supabase.auth.updateUser({
            password: password
        });

        if (resetError) {
            setError(resetError.message);
            setLoading(false);
        } else {
            // Success!
            alert('Senha atualizada com sucesso!');
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-4 font-display">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col items-center mb-8 text-center">
                    <PhyrLogo className="h-[40px] w-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Nova Senha</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-center mt-2">
                        Digite sua nova senha abaixo.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-100 border border-red-200 text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <Input
                            label="Nova Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            required
                            type="password"
                            disabled={loading}
                            leftIcon={<span className="material-symbols-outlined text-[20px]">lock</span>}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Input
                            label="Confirmar Senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="********"
                            required
                            type="password"
                            disabled={loading}
                            leftIcon={<span className="material-symbols-outlined text-[20px]">lock_reset</span>}
                        />
                    </div>

                    <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full h-[48px]"
                        leftIcon={<span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">check</span>}
                    >
                        Redefinir Senha
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
