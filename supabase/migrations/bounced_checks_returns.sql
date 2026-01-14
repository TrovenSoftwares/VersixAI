-- ===========================================
-- MIGRAÇÃO: Cheques Devolvidos e Devoluções
-- Execute este SQL no Supabase SQL Editor
-- ===========================================

-- Tabela de Motivos de Devolução
CREATE TABLE IF NOT EXISTS return_reasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para return_reasons
ALTER TABLE return_reasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own return reasons" ON return_reasons
    FOR ALL USING (auth.uid() = user_id);

-- Tabela de Cheques Devolvidos
CREATE TABLE IF NOT EXISTS bounced_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    value DECIMAL(15,2) NOT NULL,
    check_number TEXT NOT NULL,
    check_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para bounced_checks
ALTER TABLE bounced_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own bounced checks" ON bounced_checks
    FOR ALL USING (auth.uid() = user_id);

-- Tabela de Devoluções
CREATE TABLE IF NOT EXISTS returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    weight DECIMAL(10,3),
    gram_value DECIMAL(15,2),
    total_value DECIMAL(15,2) NOT NULL,
    reason_id UUID REFERENCES return_reasons(id) ON DELETE SET NULL,
    return_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para returns
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own returns" ON returns
    FOR ALL USING (auth.uid() = user_id);
