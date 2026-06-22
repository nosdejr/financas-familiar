import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export interface Account {
  id: string
  family_id: string
  name: string
  type: 'checking' | 'savings' | 'cash' | 'wallet' | 'digital'
  balance: number
  color: string
  icon: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export function useAccounts(familyId?: string) {
  const supabase = createClientComponentClient()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (familyId) {
      fetchAccounts()
    }
  }, [familyId])

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      if (!familyId) {
        setAccounts([])
        return
      }

      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('family_id', familyId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      setAccounts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching accounts')
    } finally {
      setLoading(false)
    }
  }

  const createAccount = async (account: Omit<Account, 'id' | 'family_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!familyId) throw new Error('Family ID is required')

      const { data, error } = await supabase
        .from('accounts')
        .insert({ ...account, family_id: familyId })
        .select()
        .single()

      if (error) throw error

      await fetchAccounts()
      return data
    } catch (err) {
      throw err
    }
  }

  const updateAccount = async (id: string, updates: Partial<Account>) => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      await fetchAccounts()
      return data
    } catch (err) {
      throw err
    }
  }

  const deleteAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('accounts')
        .update({ is_active: false })
        .eq('id', id)

      if (error) throw error

      await fetchAccounts()
    } catch (err) {
      throw err
    }
  }

  const getTotalBalance = () => {
    return accounts.reduce((sum, account) => sum + Number(account.balance), 0)
  }

  return {
    accounts,
    loading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    getTotalBalance,
    refetch: fetchAccounts,
  }
}
