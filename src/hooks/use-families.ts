import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export interface Family {
  id: string
  name: string
  admin_id: string
  created_at: string
  updated_at: string
}

export interface FamilyMember {
  id: string
  family_id: string
  user_id: string
  role: 'admin' | 'spouse' | 'child' | 'guest'
  created_at: string
}

export function useFamilies() {
  const supabase = createClientComponentClient()
  const [families, setFamilies] = useState<Family[]>([])
  const [currentFamily, setCurrentFamily] = useState<Family | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFamilies()
  }, [])

  const fetchFamilies = async () => {
    try {
      console.log('fetchFamilies: Starting')
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      console.log('fetchFamilies: User:', user)

      if (!user) {
        console.log('fetchFamilies: No user found')
        setCurrentFamily(null)
        setFamilies([])
        setLoading(false)
        return
      }

      // Try to get families where user is admin first (simpler query)
      console.log('fetchFamilies: Fetching admin families')
      const { data: adminFamilies, error: adminError } = await supabase
        .from('families')
        .select('*')
        .eq('admin_id', user.id)

      console.log('fetchFamilies: Admin families:', adminFamilies, 'Error:', adminError)

      if (adminError) {
        console.error('Error fetching admin families:', adminError)
      }

      if (adminFamilies && adminFamilies.length > 0) {
        console.log('fetchFamilies: Found admin families')
        setFamilies(adminFamilies)
        setCurrentFamily(adminFamilies[0])
        setLoading(false)
        return
      }

      // If no admin families, try to get families where user is a member
      console.log('fetchFamilies: Fetching family members')
      const { data: memberData, error: memberError } = await supabase
        .from('family_members')
        .select('family_id')
        .eq('user_id', user.id)

      console.log('fetchFamilies: Member data:', memberData, 'Error:', memberError)

      if (memberError) {
        console.error('Error fetching family_members:', memberError)
        setCurrentFamily(null)
        setFamilies([])
        setLoading(false)
        return
      }

      if (!memberData || memberData.length === 0) {
        console.log('fetchFamilies: No family members found')
        setCurrentFamily(null)
        setFamilies([])
        setLoading(false)
        return
      }

      const familyIds = memberData.map(m => m.family_id)

      console.log('fetchFamilies: Fetching families by IDs:', familyIds)
      const { data: familiesData, error: familiesError } = await supabase
        .from('families')
        .select('*')
        .in('id', familyIds)

      console.log('fetchFamilies: Families data:', familiesData, 'Error:', familiesError)

      if (familiesError) {
        console.error('Error fetching families:', familiesError)
        setCurrentFamily(null)
        setFamilies([])
        setLoading(false)
        return
      }

      setFamilies(familiesData || [])
      setCurrentFamily(familiesData?.[0] || null)
      console.log('fetchFamilies: Completed successfully')
    } catch (err) {
      console.error('Error in fetchFamilies:', err)
      setError(err instanceof Error ? err.message : 'Error fetching families')
      setCurrentFamily(null)
      setFamilies([])
    } finally {
      console.log('fetchFamilies: Setting loading to false')
      setLoading(false)
    }
  }

  const createFamily = async (name: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .insert({ name, admin_id: user.id })
        .select()
        .single()

      if (familyError) throw familyError

      // Add user as admin
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: familyData.id,
          user_id: user.id,
          role: 'admin',
        })

      if (memberError) throw memberError

      await fetchFamilies()
      return familyData
    } catch (err) {
      throw err
    }
  }

  const addFamilyMember = async (familyId: string, email: string, role: 'spouse' | 'child' | 'guest') => {
    try {
      // Find user by email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (userError) throw userError

      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_id: familyId,
          user_id: userData.id,
          role,
        })

      if (memberError) throw memberError

      await fetchFamilies()
    } catch (err) {
      throw err
    }
  }

  return {
    families,
    currentFamily,
    loading,
    error,
    createFamily,
    addFamilyMember,
    refetch: fetchFamilies,
  }
}
