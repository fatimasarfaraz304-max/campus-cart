import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useListings(filters = {}) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('listings')
      .select(`*, seller:profiles(id, full_name, rating, avatar_url, is_verified)`)
      .eq('status', 'available')
      .order('created_at', { ascending: false })

    if (filters.category) query = query.eq('category', filters.category)
    if (filters.search) query = query.ilike('title', `%${filters.search}%`)
    if (filters.seller_id) query = query.eq('seller_id', filters.seller_id)
    if (filters.limit) query = query.limit(filters.limit)

    const { data, error } = await query
    if (error) setError(error)
    else setListings(data || [])
    setLoading(false)
  }, [filters.category, filters.search, filters.seller_id])

  useEffect(() => { fetch() }, [fetch])

  return { listings, loading, error, refetch: fetch }
}

export function useListing(id) {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    supabase
      .from('listings')
      .select(`*, seller:profiles(id, full_name, rating, avatar_url, total_sales, is_verified)`)
      .eq('id', id)
      .single()
      .then(({ data }) => { setListing(data); setLoading(false) })
  }, [id])

  return { listing, loading }
}

export async function createListing(listingData) {
  return supabase.from('listings').insert(listingData).select().single()
}

export async function updateListingStatus(id, status) {
  return supabase.from('listings').update({ status }).eq('id', id)
}
