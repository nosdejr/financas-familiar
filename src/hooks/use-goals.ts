import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export interface Goal {
  id: string
  family_id: string
  name: string
  target_amount: number
  current_amount: number
  target_date: string | null
  icon: string
  color: string
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export function useGoals(familyId?: string) {
  const supabase = createClientComponentClient()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (familyId) {
      fetchGoals()
    }
  }, [familyId])

  const fetchGoals = async () => {
    try {
      setLoading(true)
      if (!familyId) {
        setGoals([])
        return
      }

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setGoals(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching goals')
    } finally {
      setLoading(false)
    }
  }

  const createGoal = async (goal: Omit<Goal, 'id' | 'family_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!familyId) throw new Error('Family ID is required')

      const { data, error } = await supabase
        .from('goals')
        .insert({ ...goal, family_id })
        .select()
        .single()

      if (error) throw error

      await fetchGoals()
      return data
    } catch (err) {
      throw err
    }
  }

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      await fetchGoals()
      return data
    } catch (err) {
      throw err
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchGoals()
    } catch (err) {
      throw err
    }
  }

  const updateGoalProgress = async (id: string, amount: number) => {
    try {
      const goal = goals.find(g => g.id === id)
      if (!goal) throw new Error('Goal not found')

      const newAmount = Number(goal.current_amount) + amount
      const status = newAmount >= Number(goal.target_amount) ? 'completed' : goal.status

      const { data, error } = await supabase
        .from('goals')
        .update({ current_amount: newAmount, status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      await fetchGoals()
      return data
    } catch (err) {
      throw err
    }
  }

  const getProgress = (goal: Goal) => {
    return (Number(goal.current_amount) / Number(goal.target_amount)) * 100
  }

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
    getProgress,
    refetch: fetchGoals,
  }
}
