import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export interface Budget {
  id: string
  family_id: string
  category_id: string
  amount: number
  month: number
  year: number
  created_at: string
  updated_at: string
}

export interface BudgetWithCategory extends Budget {
  categories: {
    name: string
    type: string
    icon: string
    color: string
  }
}

export function useBudgets(familyId?: string) {
  const supabase = createClientComponentClient()
  const [budgets, setBudgets] = useState<BudgetWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (familyId) {
      fetchBudgets()
    }
  }, [familyId])

  const fetchBudgets = async (month?: number, year?: number) => {
    try {
      setLoading(true)
      if (!familyId) {
        setBudgets([])
        return
      }

      const now = new Date()
      const currentMonth = month || now.getMonth() + 1
      const currentYear = year || now.getFullYear()

      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          categories (
            name,
            type,
            icon,
            color
          )
        `)
        .eq('family_id', familyId)
        .eq('month', currentMonth)
        .eq('year', currentYear)

      if (error) throw error

      setBudgets(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching budgets')
    } finally {
      setLoading(false)
    }
  }

  const createBudget = async (budget: Omit<Budget, 'id' | 'family_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!familyId) throw new Error('Family ID is required')

      const { data, error } = await supabase
        .from('budgets')
        .insert({ ...budget, family_id })
        .select()
        .single()

      if (error) throw error

      await fetchBudgets(budget.month, budget.year)
      return data
    } catch (err) {
      throw err
    }
  }

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      await fetchBudgets()
      return data
    } catch (err) {
      throw err
    }
  }

  const deleteBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchBudgets()
    } catch (err) {
      throw err
    }
  }

  const getTotalBudget = () => {
    return budgets.reduce((sum, budget) => sum + Number(budget.amount), 0)
  }

  return {
    budgets,
    loading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    getTotalBudget,
    refetch: fetchBudgets,
  }
}
