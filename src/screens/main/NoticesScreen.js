import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { colors, typography, spacing, radius } from '../../constants/theme'

const TYPE_META = {
  urgent:  { icon: '⚠️', bg: colors.dangerBg,  tint: colors.danger },
  exam:    { icon: '📅', bg: colors.infoBg,     tint: colors.info },
  fee:     { icon: '💳', bg: colors.warningBg,  tint: colors.warning },
  event:   { icon: '🏆', bg: colors.successBg,  tint: colors.success },
  general: { icon: '📢', bg: colors.primaryBg,  tint: colors.primary },
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date)
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function NoticesScreen({ navigation }) {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('notices').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setNotices(data || []); setLoading(false) })
  }, [])

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.nav}>
        <TouchableOpacity style={s.navBtn} onPress={() => navigation.goBack()}>
          <Text style={s.navIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.navTitle}>University notices</Text>
        <View style={{ width: 32 }} />
      </View>

      <FlatList
        data={notices}
        keyExtractor={n => n.id}
        contentContainerStyle={s.list}
        renderItem={({ item }) => {
          const meta = TYPE_META[item.type] || TYPE_META.general
          return (
            <View style={s.item}>
              <View style={[s.ico, { backgroundColor: meta.bg }]}>
                <Text style={s.icoIcon}>{meta.icon}</Text>
              </View>
              <View style={s.content}>
                <Text style={s.itemTitle}>{item.title}</Text>
                <Text style={s.itemBody}>{item.body}</Text>
                <Text style={s.itemTime}>{timeAgo(item.created_at)}</Text>
              </View>
              {!item.is_read && <View style={s.unreadDot} />}
            </View>
          )
        }}
        ListEmptyComponent={
          !loading && (
            <View style={s.empty}>
              <Text style={s.emptyText}>No notices yet</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  nav: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  navBtn: { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  navIcon: { color: colors.white, fontSize: typography.lg },
  navTitle: { fontSize: typography.md, fontWeight: '600', color: colors.white },
  list: { padding: spacing.md, gap: spacing.xs },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1.5, borderColor: '#FFF3E0' },
  ico: { width: 38, height: 38, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  icoIcon: { fontSize: 18 },
  content: { flex: 1 },
  itemTitle: { fontSize: typography.sm, fontWeight: '600', color: colors.textDark },
  itemBody: { fontSize: typography.sm - 1, color: colors.textMuted, marginTop: 2, lineHeight: 18 },
  itemTime: { fontSize: 10, color: colors.textLight, marginTop: 3 },
  unreadDot: { width: 8, height: 8, borderRadius: radius.full, backgroundColor: colors.primary, marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: spacing.xxl },
  emptyText: { color: colors.textMuted, fontSize: typography.md },
})
