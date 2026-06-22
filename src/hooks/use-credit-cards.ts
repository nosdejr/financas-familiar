import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export interface CreditCard {
  id: string
  family_id: string
  name: string
  limit: number
  best_day_to_buy: number | null
  due_day: number
  color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export function useCreditCards(familyId?: string) {
  const supabase = createClientComponentClient()
  const [creditCards, setCreditCards] = useState<CreditCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (familyId) {
      fetchCreditCards()
    }
  }, [familyId])

  const fetchCreditCards = async () => {
    try {
      setLoading(true)
      if (!familyId) {
        setCreditCards([])
        return
      }

      const { data, error } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('family_id', familyId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      setCreditCards(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching credit cards')
    } finally {
      setLoading(false)
    }
  }

  const createCreditCard = async (card: Omit<CreditCard, 'id' | 'family_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!familyId) throw new Error('Family ID is required')

      const { data, error } = await supabase
        .from('credit_cards')
        .insert({ ...card, family_id: familyId })
        .select()
        .single()

      if (error) throw error

      await fetchCreditCards()
      return data
    } catch (err) {
      throw err
    }
  }

  const updateCreditCard = async (id: string, updates: Partial<CreditCard>) => {
    try {
      const { data, error } = await supabase
        .from('credit_cards')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      await fetchCreditCards()
      return data
    } catch (err) {
      throw err
    }
  }

  const deleteCreditCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('credit_cards')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error

      await fetchCreditCards()
    } catch (err) {
      throw err
    }
  }

  const getTotalLimit = () => {
    return creditCards.reduce((sum, card) => sum + Number(card.limit), 0)
  }

  return {
    creditCards,
    loading,
    error,
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
    getTotalLimit,
    refetch: fetchCreditCards,
  }
}
