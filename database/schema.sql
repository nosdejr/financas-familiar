-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Families table
CREATE TABLE public.families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    admin_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Family members table
CREATE TABLE public.family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'spouse', 'child', 'guest')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(family_id, user_id)
);

-- Accounts table
CREATE TABLE public.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'cash', 'wallet', 'digital')),
    balance DECIMAL(15, 2) DEFAULT 0,
    color TEXT DEFAULT '#3B82F6',
    icon TEXT DEFAULT 'wallet',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    icon TEXT DEFAULT 'circle',
    color TEXT DEFAULT '#6B7280',
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    notes TEXT,
    attachment_url TEXT,
    is_recurring BOOLEAN DEFAULT false,
    recurring_frequency TEXT CHECK (recurring_frequency IN ('weekly', 'biweekly', 'monthly', 'yearly')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit cards table
CREATE TABLE public.credit_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    "limit" DECIMAL(15, 2) NOT NULL,
    best_day_to_buy INTEGER CHECK (best_day_to_buy BETWEEN 1 AND 31),
    due_day INTEGER CHECK (due_day BETWEEN 1 AND 31),
    color TEXT DEFAULT '#8B5CF6',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit card transactions table
CREATE TABLE public.credit_card_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    credit_card_id UUID REFERENCES public.credit_cards(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
    installment_number INTEGER DEFAULT 1,
    total_installments INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Budgets table
CREATE TABLE public.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(family_id, category_id, month, year)
);

-- Goals table
CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) DEFAULT 0,
    target_date DATE,
    icon TEXT DEFAULT 'target',
    color TEXT DEFAULT '#10B981',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investments table
CREATE TABLE public.investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('treasury', 'cdb', 'stocks', 'funds', 'crypto')),
    amount DECIMAL(15, 2) NOT NULL,
    current_value DECIMAL(15, 2),
    purchase_date DATE NOT NULL,
    institution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_family_members_family_id ON public.family_members(family_id);
CREATE INDEX idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX idx_accounts_family_id ON public.accounts(family_id);
CREATE INDEX idx_categories_family_id ON public.categories(family_id);
CREATE INDEX idx_transactions_family_id ON public.transactions(family_id);
CREATE INDEX idx_transactions_account_id ON public.transactions(account_id);
CREATE INDEX idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_credit_cards_family_id ON public.credit_cards(family_id);
CREATE INDEX idx_budgets_family_id ON public.budgets(family_id);
CREATE INDEX idx_goals_family_id ON public.goals(family_id);
CREATE INDEX idx_investments_family_id ON public.investments(family_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);

-- Row Level Security Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_card_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Families policies
CREATE POLICY "Users can insert own family" ON public.families
    FOR INSERT WITH CHECK (auth.uid() = admin_id);

CREATE POLICY "Family members can view family" ON public.families
    FOR SELECT USING (
        id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Admin can update family" ON public.families
    FOR UPDATE USING (
        id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Family members policies
CREATE POLICY "Users can insert own family membership" ON public.family_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own family membership" ON public.family_members
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage members" ON public.family_members
    FOR ALL USING (
        family_id IN (SELECT id FROM public.families WHERE admin_id = auth.uid())
    );

-- Accounts policies
CREATE POLICY "Family members can view accounts" ON public.accounts
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Admin can manage accounts" ON public.accounts
    FOR ALL USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Categories policies
CREATE POLICY "Family members can view categories" ON public.categories
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Admin can manage categories" ON public.categories
    FOR ALL USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Transactions policies
CREATE POLICY "Family members can view transactions" ON public.transactions
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Family members can create transactions" ON public.transactions
    FOR INSERT WITH CHECK (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Admin can update transactions" ON public.transactions
    FOR UPDATE USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admin can delete transactions" ON public.transactions
    FOR DELETE USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Credit cards policies
CREATE POLICY "Family members can view credit cards" ON public.credit_cards
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Admin can manage credit cards" ON public.credit_cards
    FOR ALL USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Budgets policies
CREATE POLICY "Family members can view budgets" ON public.budgets
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Admin can manage budgets" ON public.budgets
    FOR ALL USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Goals policies
CREATE POLICY "Family members can view goals" ON public.goals
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Admin can manage goals" ON public.goals
    FOR ALL USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Investments policies
CREATE POLICY "Family members can view investments" ON public.investments
    FOR SELECT USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Admin can manage investments" ON public.investments
    FOR ALL USING (
        family_id IN (SELECT family_id FROM public.family_members WHERE user_id = auth.uid() AND role = 'admin')
    );

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON public.families
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON public.accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON public.investments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_cards_updated_at BEFORE UPDATE ON public.credit_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
