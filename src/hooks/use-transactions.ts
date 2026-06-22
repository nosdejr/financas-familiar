import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export interface Transaction {
  id: string
  family_id: string
  account_id: string
  category_id: string | null
  user_id: string | null
  type: 'income' | 'expense' | 'transfer'
  amount: number
  description: string | null
  date: string
  notes: string | null
  attachment_url: string | null
  is_recurring: boolean
  recurring_frequency: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  family_id: string
  name: string
  type: 'income' | 'expense'
  icon: string
  color: string
  parent_id: string | null
  created_at: string
}

export function useTransactions(familyId?: string) {
  const supabase = createClientComponentClient()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (familyId) {
      fetchTransactions()
      fetchCategories()
    }
  }, [familyId])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      if (!familyId) {
        setTransactions([])
        return
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('family_id', familyId)
        .order('date', { ascending: false })
        .limit(50)

      if (error) throw error

      setTransactions(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching transactions')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      if (!familyId) {
        setCategories([])
        return
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('family_id', familyId)
        .order('name')

      if (error) throw error

      setCategories(data || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const createTransaction = async (transaction: Omit<Transaction, 'id' | 'family_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!familyId) throw new Error('Family ID is required')

      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...transaction, family_id: familyId })
        .select()
        .single()

      if (error) throw error

      await fetchTransactions()
      return data
    } catch (err) {
      throw err
    }
  }

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      await fetchTransactions()
      return data
    } catch (err) {
      throw err
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchTransactions()
    } catch (err) {
      throw err
    }
  }

  const createCategory = async (category: Omit<Category, 'id' | 'family_id' | 'created_at'>) => {
    try {
      if (!familyId) throw new Error('Family ID is required')

      const { data, error } = await supabase
        .from('categories')
        .insert({ ...category, family_id: familyId })
        .select()
        .single()

      if (error) throw error

      await fetchCategories()
      return data
    } catch (err) {
      throw err
    }
  }

  const getTotalIncome = (month?: number, year?: number) => {
    return transactions
      .filter(t => t.type === 'income' && (!month || new Date(t.date).getMonth() + 1 === month) && (!year || new Date(t.date).getFullYear() === year))
      .reduce((sum, t) => sum + Number(t.amount), 0)
  }

  const getTotalExpenses = (month?: number, year?: number) => {
    return transactions
      .filter(t => t.type === 'expense' && (!month || new Date(t.date).getMonth() + 1 === month) && (!year || new Date(t.date).getFullYear() === year))
      .reduce((sum, t) => sum + Number(t.amount), 0)
  }

  return {
    transactions,
    categories,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createCategory,
    getTotalIncome,
    getTotalExpenses,
    refetch: fetchTransactions,
  }
}
