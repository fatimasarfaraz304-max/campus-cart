import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/useAuth'
import { useConversations } from '../../hooks/useMessages'
import { colors, typography, spacing, radius } from '../../constants/theme'
import { useNavigation } from '@react-navigation/native'

export default function ChatsListScreen() {
  const { user } = useAuth()
  const { conversations, loading } = useConversations(user?.id)
  const navigation = useNavigation()

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Chats</Text>
      </View>
      <FlatList
        data={conversations}
        keyExtractor={c => c.id}
        contentContainerStyle={s.list}
        renderItem={({ item }) => {
          const other = item.buyer_id === user.id ? item.seller : item.buyer
          const lastMsg = item.messages?.[item.messages.length - 1]
          return (
            <TouchableOpacity style={s.item} onPress={() => navigation.navigate('Chat', {
              conversationId: item.id,
              listing: item.listing,
              otherUser: other,
            })}>
              <View style={s.av}>
                <Text style={s.avText}>{other?.full_name?.slice(0,2).toUpperCase()}</Text>
              </View>
              <View style={s.info}>
                <Text style={s.name}>{other?.full_name}</Text>
                <Text style={s.preview} numberOfLines={1}>{item.listing?.title}</Text>
                <Text style={s.lastMsg} numberOfLines={1}>{lastMsg?.content || 'No messages yet'}</Text>
              </View>
              <View style={s.right}>
                <Text style={s.price}>Rs {item.listing?.price?.toLocaleString()}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
        ListEmptyComponent={
          !loading && (
            <View style={s.empty}>
              <Text style={s.emptyEmoji}>💬</Text>
              <Text style={s.emptyText}>No chats yet</Text>
              <Text style={s.emptySub}>Message a seller to start negotiating</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.primary, padding: spacing.md, paddingBottom: spacing.md },
  headerTitle: { fontSize: typography.lg, fontWeight: '600', color: colors.white },
  list: { padding: spacing.md, gap: spacing.xs },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1.5, borderColor: '#FFF3E0' },
  av: { width: 44, height: 44, borderRadius: radius.full, backgroundColor: colors.primaryBg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avText: { fontSize: typography.sm, fontWeight: '600', color: colors.primary },
  info: { flex: 1 },
  name: { fontSize: typography.sm, fontWeight: '600', color: colors.textDark },
  preview: { fontSize: 10, color: colors.primary, marginTop: 1 },
  lastMsg: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  price: { fontSize: typography.sm, fontWeight: '600', color: colors.primary },
  empty: { alignItems: 'center', paddingTop: spacing.xxxl, gap: spacing.sm },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: typography.lg, fontWeight: '500', color: colors.textMuted },
  emptySub: { fontSize: typography.sm, color: colors.textLight, textAlign: 'center' },
})
