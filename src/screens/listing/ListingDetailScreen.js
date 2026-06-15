import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useListing } from '../../hooks/useListings'
import { getOrCreateConversation } from '../../hooks/useMessages'
import { useAuth } from '../../hooks/useAuth'
import { colors, typography, spacing, radius } from '../../constants/theme'
import { CATEGORY_META } from '../../components/listing/ListingCard'

export default function ListingDetailScreen({ route, navigation }) {
  const { id } = route.params
  const { listing, loading } = useListing(id)
  const { user } = useAuth()

  const isOwner = user?.id === listing?.seller_id

  async function handleMessage() {
    const convId = await getOrCreateConversation(listing.id, user.id, listing.seller_id)
    navigation.navigate('Chat', { conversationId: convId, listing, otherUser: listing.seller })
  }

  if (loading || !listing) {
    return (
      <SafeAreaView style={s.safe}><View style={s.center}><Text style={s.loadText}>Loading...</Text></View></SafeAreaView>
    )
  }

  const meta = CATEGORY_META[listing.category] || CATEGORY_META.other

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      {/* Nav */}
      <View style={s.nav}>
        <TouchableOpacity style={s.navBtn} onPress={() => navigation.goBack()}>
          <Text style={s.navIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.navTitle}>Listing detail</Text>
        <TouchableOpacity style={s.navBtn}>
          <Text style={s.navIcon}>♡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={[s.imgArea, { backgroundColor: meta.bg }]}>
          {listing.images?.length > 0
            ? <Image source={{ uri: listing.images[0] }} style={s.img} resizeMode="cover" />
            : <Text style={s.imgIcon}>{meta.icon}</Text>
          }
        </View>

        <View style={s.body}>
          <Text style={s.title}>{listing.title}</Text>
          <Text style={s.price}>Rs {listing.price?.toLocaleString()}</Text>

          {/* Tags */}
          <View style={s.tagsRow}>
            <View style={[s.tag, { backgroundColor: meta.bg }]}>
              <Text style={[s.tagText, { color: meta.color }]}>{listing.category}</Text>
            </View>
            <View style={s.tag}>
              <Text style={s.tagText}>{listing.condition}</Text>
            </View>
            {listing.tags?.map(t => (
              <View key={t} style={s.tag}><Text style={s.tagText}>{t}</Text></View>
            ))}
          </View>

          {/* Seller */}
          <View style={s.sellerCard}>
            <View style={s.sellerAv}>
              <Text style={s.sellerAvText}>{listing.seller?.full_name?.slice(0, 2).toUpperCase()}</Text>
            </View>
            <View>
              <Text style={s.sellerName}>{listing.seller?.full_name}</Text>
              <Text style={s.sellerMeta}>⭐ {listing.seller?.rating?.toFixed(1)} · {listing.seller?.total_sales} sales {listing.seller?.is_verified ? '✓' : ''}</Text>
            </View>
            <TouchableOpacity style={s.viewProfile} onPress={() => navigation.navigate('SellerProfile', { userId: listing.seller_id })}>
              <Text style={s.viewProfileText}>View profile</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={s.descCard}>
            <Text style={s.descText}>{listing.description}</Text>
          </View>

          {/* Availability */}
          <View style={s.availRow}>
            <View style={[s.dot, { backgroundColor: listing.status === 'available' ? colors.success : colors.danger }]} />
            <Text style={[s.availText, { color: listing.status === 'available' ? colors.success : colors.danger }]}>
              {listing.status === 'available' ? 'Available' : 'Sold'}
            </Text>
            {listing.meetup_spot ? <Text style={s.meetup}>  ·  {listing.meetup_spot}</Text> : null}
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      {!isOwner && listing.status === 'available' && (
        <View style={s.actions}>
          <TouchableOpacity style={s.msgBtn} onPress={handleMessage}>
            <Text style={s.msgBtnText}>💬  Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.buyBtn} onPress={handleMessage}>
            <Text style={s.buyBtnText}>🛒  Buy now</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadText: { color: colors.textMuted },
  nav: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  navBtn: { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  navIcon: { color: colors.white, fontSize: typography.lg },
  navTitle: { fontSize: typography.sm, fontWeight: '600', color: colors.white },
  imgArea: { height: 220, alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: '100%' },
  imgIcon: { fontSize: 80 },
  body: { padding: spacing.md },
  title: { fontSize: typography.lg, fontWeight: '600', color: colors.textDark },
  price: { fontSize: typography.xxl, fontWeight: '700', color: colors.primary, marginTop: spacing.xs },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.sm },
  tag: { paddingVertical: 3, paddingHorizontal: spacing.sm, borderRadius: radius.sm, backgroundColor: colors.bgCard, borderWidth: 1.5, borderColor: colors.border },
  tagText: { fontSize: 10, color: colors.textMuted, fontWeight: '500' },
  sellerCard: { backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.md },
  sellerAv: { width: 36, height: 36, borderRadius: radius.full, backgroundColor: colors.primaryBg, alignItems: 'center', justifyContent: 'center' },
  sellerAvText: { fontSize: typography.xs, fontWeight: '600', color: colors.primary },
  sellerName: { fontSize: typography.sm, fontWeight: '600', color: colors.textDark },
  sellerMeta: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  viewProfile: { marginLeft: 'auto', backgroundColor: colors.primaryBg, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radius.sm },
  viewProfileText: { fontSize: 10, color: colors.primaryDark, fontWeight: '600' },
  descCard: { backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, padding: spacing.sm, marginTop: spacing.sm },
  descText: { fontSize: typography.sm, color: colors.textBody, lineHeight: 20 },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: radius.full },
  availText: { fontSize: typography.sm, fontWeight: '600' },
  meetup: { fontSize: typography.sm, color: colors.textMuted },
  actions: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.bgCard, borderTopWidth: 1.5, borderColor: colors.border },
  msgBtn: { flex: 1, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.primaryBg, alignItems: 'center' },
  msgBtnText: { fontSize: typography.sm, fontWeight: '600', color: colors.primaryDark },
  buyBtn: { flex: 1, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center' },
  buyBtnText: { fontSize: typography.sm, fontWeight: '600', color: colors.white },
})
