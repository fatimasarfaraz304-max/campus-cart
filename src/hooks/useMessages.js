import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useConversations(userId) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    fetchConversations()
    const sub = supabase
      .channel('conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, fetchConversations)
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [userId])

  async function fetchConversations() {
    const { data } = await supabase
      .from('conversations')
      .select(`
        *,
        listing:listings(id, title, price, images, status),
        buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
        seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url),
        messages(content, created_at, sender_id, is_read)
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('updated_at', { ascending: false })
    setConversations(data || [])
    setLoading(false)
  }

  return { conversations, loading, refetch: fetchConversations }
}

export function useMessages(conversationId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!conversationId) return
    fetchMessages()
    const sub = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => setMessages(prev => [...prev, payload.new]))
      .subscribe()
    return () => supabase.removeChannel(sub)
  }, [conversationId])

  async function fetchMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
    setMessages(data || [])
    setLoading(false)
  }

  async function sendMessage(senderId, content) {
    return supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      is_read: false,
    })
  }

  return { messages, loading, sendMessage }
}

export async function getOrCreateConversation(listingId, buyerId, sellerId) {
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('listing_id', listingId)
    .eq('buyer_id', buyerId)
    .single()
  if (existing) return existing.id
  const { data } = await supabase
    .from('conversations')
    .insert({ listing_id: listingId, buyer_id: buyerId, seller_id: sellerId })
    .select('id')
    .single()
  return data?.id
}
