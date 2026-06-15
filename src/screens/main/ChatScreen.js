import { useState, useRef, useEffect } from 'react'
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMessages } from '../../hooks/useMessages'
import { useAuth } from '../../hooks/useAuth'
import { colors, typography, spacing, radius } from '../../constants/theme'

export default function ChatScreen({ route, navigation }) {
  const { conversationId, listing, otherUser } = route.params
  const { user } = useAuth()
  const { messages, loading, sendMessage } = useMessages(conversationId)
  const [text, setText] = useState('')
  const flatRef = useRef()

  useEffect(() => {
    if (messages.length > 0) flatRef.current?.scrollToEnd({ animated: true })
  }, [messages.length])

  async function handleSend() {
    const content = text.trim()
    if (!content) return
    setText('')
    await sendMessage(user.id, content)
  }

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      {/* Nav */}
      <View style={s.nav}>
        <TouchableOpacity style={s.navBtn} onPress={() => navigation.goBack()}>
          <Text style={s.navIcon}>←</Text>
        </TouchableOpacity>
        <View style={s.navAv}>
          <Text style={s.navAvText}>{otherUser?.full_name?.slice(0, 2).toUpperCase()}</Text>
        </View>
        <View style={s.navInfo}>
          <Text style={s.navName}>{otherUser?.full_name}</Text>
          <Text style={s.navStatus}><Text style={{ color: '#CFFF04' }}>●</Text> Online</Text>
        </View>
        <TouchableOpacity style={s.navBtn}>
          <Text style={s.navIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Listing pill */}
      <TouchableOpacity style={s.listingPill} onPress={() => navigation.navigate('ListingDetail', { id: listing?.id })}>
        <Text style={s.pillIcon}>📦</Text>
        <View>
          <Text style={s.pillTitle}>{listing?.title}</Text>
          <Text style={s.pillPrice}>Rs {listing?.price?.toLocaleString()} · {listing?.status}</Text>
        </View>
        <Text style={s.pillArrow}>›</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={0}>
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={m => m.id}
          contentContainerStyle={s.msgList}
          renderItem={({ item }) => {
            const isMine = item.sender_id === user.id
            return (
              <View style={[s.msgWrap, isMine && s.msgWrapMine]}>
                <View style={[s.msg, isMine ? s.msgOut : s.msgIn]}>
                  <Text style={[s.msgText, isMine && s.msgTextOut]}>{item.content}</Text>
                  <Text style={[s.msgTime, isMine && s.msgTimeOut]}>
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              </View>
            )
          }}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyText}>No messages yet</Text>
              <Text style={s.emptySub}>Say hi and ask about the listing</Text>
            </View>
          }
        />

        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.textLight}
            value={text}
            onChangeText={setText}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={[s.sendBtn, !text.trim() && s.sendBtnOff]} onPress={handleSend} disabled={!text.trim()}>
            <Text style={s.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  nav: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  navBtn: { width: 30, height: 30, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  navIcon: { color: colors.white, fontSize: typography.md },
  navAv: { width: 32, height: 32, borderRadius: radius.full, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  navAvText: { fontSize: 11, fontWeight: '600', color: colors.white },
  navInfo: { flex: 1 },
  navName: { fontSize: typography.sm, fontWeight: '600', color: colors.white },
  navStatus: { fontSize: 9, color: 'rgba(255,255,255,0.6)', marginTop: 1 },
  listingPill: { backgroundColor: colors.primaryBg, marginHorizontal: spacing.md, marginVertical: spacing.sm, borderRadius: radius.md, padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1.5, borderColor: colors.primaryBorder },
  pillIcon: { fontSize: 20 },
  pillTitle: { fontSize: typography.sm, fontWeight: '600', color: colors.primaryDark },
  pillPrice: { fontSize: 10, color: colors.primary, marginTop: 1 },
  pillArrow: { marginLeft: 'auto', fontSize: typography.lg, color: colors.primary },
  msgList: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.lg },
  msgWrap: { alignSelf: 'flex-start', maxWidth: '80%' },
  msgWrapMine: { alignSelf: 'flex-end' },
  msg: { padding: spacing.sm, borderRadius: 4 },
  msgIn: { backgroundColor: colors.bgCard, borderWidth: 1.5, borderColor: colors.border, borderRadius: 4, borderTopLeftRadius: radius.md, borderBottomLeftRadius: radius.md, borderBottomRightRadius: radius.md },
  msgOut: { backgroundColor: colors.primary, borderRadius: radius.md, borderBottomRightRadius: 4 },
  msgText: { fontSize: typography.sm, color: colors.textDark, lineHeight: 19 },
  msgTextOut: { color: colors.white },
  msgTime: { fontSize: 9, color: colors.textLight, marginTop: 3 },
  msgTimeOut: { color: 'rgba(255,255,255,0.6)', textAlign: 'right' },
  empty: { alignItems: 'center', paddingTop: spacing.xxl },
  emptyText: { fontSize: typography.md, fontWeight: '500', color: colors.textMuted },
  emptySub: { fontSize: typography.sm, color: colors.textLight, marginTop: spacing.xs },
  inputRow: { flexDirection: 'row', gap: spacing.sm, padding: spacing.sm, backgroundColor: colors.bgCard, borderTopWidth: 1.5, borderColor: colors.border, alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: colors.bg, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: typography.sm, color: colors.textDark, maxHeight: 100 },
  sendBtn: { width: 36, height: 36, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnOff: { backgroundColor: colors.border },
  sendIcon: { color: colors.white, fontSize: typography.sm },
})
