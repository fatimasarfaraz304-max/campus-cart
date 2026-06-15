import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/useAuth'
import { useListings } from '../../hooks/useListings'
import { colors, typography, spacing, radius } from '../../constants/theme'

const MENU = [
  { icon: '🏷️', label: 'My listings', sub: key => `${key} active`, screen: 'MyListings', color: colors.primaryBg, tint: colors.primary },
  { icon: '🛍️', label: 'My purchases', sub: () => 'View order history', screen: 'Purchases', color: colors.successBg, tint: colors.success },
  { icon: '📥', label: 'Digital downloads', sub: () => 'Files you bought', screen: 'Downloads', color: colors.infoBg, tint: colors.info },
  { icon: '🔔', label: 'Notifications', sub: () => 'University + marketplace', screen: 'Notices', color: colors.warningBg, tint: colors.warning },
  { icon: '⚙️', label: 'Settings', sub: () => 'Account & preferences', screen: 'Settings', color: colors.bgMuted, tint: colors.textMuted },
]

export default function ProfileScreen({ navigation }) {
  const { profile, signOut } = useAuth()
  const { listings } = useListings({ seller_id: profile?.id })
  const activeCount = listings.filter(l => l.status === 'available').length

  async function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ])
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.av}>
            <Text style={s.avText}>{profile?.full_name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}</Text>
          </View>
          <Text style={s.name}>{profile?.full_name}</Text>
          <Text style={s.email}>{profile?.email}</Text>
          {profile?.is_verified && (
            <View style={s.badge}>
              <Text style={s.badgeText}>✓ Verified CUST student</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={s.stats}>
          {[
            { label: 'Listings', val: activeCount },
            { label: 'Rating', val: profile?.rating ? profile.rating.toFixed(1) : '—' },
            { label: 'Sales', val: profile?.total_sales ?? 0 },
          ].map((st, i) => (
            <View key={st.label} style={[s.stat, i < 2 && s.statBorder]}>
              <Text style={s.statVal}>{st.val}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={s.menu}>
          {MENU.map(item => (
            <TouchableOpacity key={item.label} style={s.menuItem} onPress={() => navigation.navigate(item.screen)}>
              <View style={[s.menuIco, { backgroundColor: item.color }]}>
                <Text style={s.menuIcoIcon}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.menuLabel}>{item.label}</Text>
                <Text style={s.menuSub}>{item.sub(activeCount)}</Text>
              </View>
              <Text style={s.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={s.menuItem} onPress={handleSignOut}>
            <View style={[s.menuIco, { backgroundColor: '#FCE4EC' }]}>
              <Text style={s.menuIcoIcon}>🚪</Text>
            </View>
            <Text style={[s.menuLabel, { color: colors.danger }]}>Sign out</Text>
            <Text style={s.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.version}>Campus Cart v1.0 · CUST Islamabad</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.xxl, alignItems: 'center' },
  av: { width: 60, height: 60, borderRadius: radius.full, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  avText: { fontSize: typography.xl, fontWeight: '600', color: colors.white },
  name: { fontSize: typography.lg, fontWeight: '600', color: colors.white },
  email: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  badge: { marginTop: spacing.sm, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.full, paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  badgeText: { fontSize: 10, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  stats: { flexDirection: 'row', backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, marginHorizontal: spacing.md, marginTop: -spacing.md },
  stat: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statBorder: { borderRightWidth: 1.5, borderColor: colors.border },
  statVal: { fontSize: typography.xl, fontWeight: '600', color: colors.primary },
  statLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  menu: { marginTop: spacing.md, marginHorizontal: spacing.md },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, borderBottomWidth: 1.5, borderColor: '#FFF3E0' },
  menuIco: { width: 34, height: 34, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  menuIcoIcon: { fontSize: 16 },
  menuLabel: { fontSize: typography.sm, fontWeight: '500', color: colors.textDark },
  menuSub: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  menuArrow: { marginLeft: 'auto', fontSize: typography.xl, color: colors.primaryBorder },
  version: { textAlign: 'center', fontSize: 10, color: colors.textLight, padding: spacing.xl },
})
