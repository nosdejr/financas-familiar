import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export interface Investment {
  id: string
  family_id: string
  name: string
  type: 'treasury' | 'cdb' | 'stocks' | 'funds' | 'crypto'
  amount: number
  current_value: number | null
  purchase_date: string
  institution: string | null
  created_at: string
  updated_at: string
}

export function useInvestments(familyId?: string) {
  const supabase = createClientComponentClient()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (familyId) {
      fetchInvestments()
    }
  }, [familyId])

  const fetchInvestments = async () => {
    try {
      setLoading(true)
      if (!familyId) {
        setInvestments([])
        return
      }

      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setInvestments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching investments')
    } finally {
      setLoading(false)
    }
  }

  const createInvestment = async (investment: Omit<Investment, 'id' | 'family_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!familyId) throw new Error('Family ID is required')

      const { data, error } = await supabase
        .from('investments')
        .insert({ ...investment, family_id: familyId })
        .select()
        .single()

      if (error) throw error

      await fetchInvestments()
      return data
    } catch (err) {
      throw err
    }
  }

  const updateInvestment = async (id: string, updates: Partial<Investment>) => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      await fetchInvestments()
      return data
    } catch (err) {
      throw err
    }
  }

  const deleteInvestment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchInvestments()
    } catch (err) {
      throw err
    }
  }

  const getTotalInvested = () => {
    return investments.reduce((sum, inv) => sum + Number(inv.amount), 0)
  }

  const getTotalCurrentValue = () => {
    return investments.reduce((sum, inv) => sum + Number(inv.current_value || inv.amount), 0)
  }

  const getTotalProfitLoss = () => {
    return getTotalCurrentValue() - getTotalInvested()
  }

  const getProfitLossPercentage = () => {
    const invested = getTotalInvested()
    if (invested === 0) return 0
    return (getTotalProfitLoss() / invested) * 100
  }

  return {
    investments,
    loading,
    error,
    createInvestment,
    updateInvestment,
    deleteInvestment,
    getTotalInvested,
    getTotalCurrentValue,
    getTotalProfitLoss,
    getProfitLossPercentage,
    refetch: fetchInvestments,
  }
}
