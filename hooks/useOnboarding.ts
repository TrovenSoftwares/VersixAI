import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface OnboardingState {
    completed: boolean;
    currentStep: number;
}

export const useOnboarding = () => {
    const { user } = useAuth();
    const [onboarding, setOnboarding] = useState<OnboardingState>({ completed: true, currentStep: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOnboardingStatus();
        }
    }, [user]);

    const fetchOnboardingStatus = async () => {
        try {
            const { data, error } = await supabase
                .from('user_settings')
                .select('onboarding')
                .eq('user_id', user?.id)
                .maybeSingle();

            if (error) throw error;

            if (data?.onboarding) {
                setOnboarding(data.onboarding);
            } else {
                // Se não houver settings, assume que é novo e precisa de onboarding
                setOnboarding({ completed: false, currentStep: 0 });
            }
        } catch (err) {
            console.error('Error fetching onboarding:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateOnboarding = async (newState: Partial<OnboardingState>) => {
        const updated = { ...onboarding, ...newState };
        setOnboarding(updated);

        if (user) {
            try {
                await supabase
                    .from('user_settings')
                    .upsert({
                        user_id: user.id,
                        onboarding: updated,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' });
            } catch (err) {
                console.error('Error updating onboarding:', err);
            }
        }
    };

    const completeOnboarding = () => updateOnboarding({ completed: true });

    return { onboarding, loading, updateOnboarding, completeOnboarding };
};
