import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, typography, spacing, radius } from '../../constants/theme'

export const CATEGORY_META = {
  books:       { icon: '📚', bg: '#FFF8E1', color: '#BF360C', label: 'Book' },
  digital:     { icon: '📄', bg: '#E8F5E9', color: '#1B5E20', label: 'Digital' },
  electronics: { icon: '💻', bg: '#E3F2FD', color: '#0D47A1', label: 'Gadget' },
  clothing:    { icon: '👕', bg: '#F3E5F5', color: '#6A1B9A', label: 'Clothing' },
  accessories: { icon: '🎒', bg: '#FCE4EC', color: '#880E4F', label: 'Accessory' },
  other:       { icon: '📦', bg: '#F1F8E9', color: '#33691E', label: 'Other' },
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date)
  const hrs = Math.floor(diff / 3600000)
  if (hrs < 1) return 'Just now'
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function ListingCard({ listing, onPress }) {
  const meta = CATEGORY_META[listing.category] || CATEGORY_META.other

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[s.img, { backgroundColor: meta.bg }]}>
        <Text style={s.imgIcon}>{meta.icon}</Text>
      </View>
      <View style={s.body}>
        <Text style={s.name} numberOfLines={2}>{listing.title}</Text>
        <Text style={s.meta}>{listing.seller?.full_name?.split(' ')[0]} · {timeAgo(listing.created_at)}</Text>
        <View style={s.bottom}>
          <Text style={s.price}>Rs {listing.price?.toLocaleString()}</Text>
          <View style={[s.tag, { backgroundColor: meta.bg }]}>
            <Text style={[s.tagText, { color: meta.color }]}>{meta.label}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  card: { flex: 1, backgroundColor: colors.bgCard, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1.5, borderColor: colors.border },
  img: { height: 82, alignItems: 'center', justifyContent: 'center' },
  imgIcon: { fontSize: 36 },
  body: { padding: spacing.sm },
  name: { fontSize: typography.sm - 1, fontWeight: '600', color: colors.textDark, lineHeight: 17 },
  meta: { fontSize: 9, color: colors.textMuted, marginTop: 3 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  price: { fontSize: typography.sm, fontWeight: '700', color: colors.primary },
  tag: { paddingVertical: 2, paddingHorizontal: spacing.xs + 2, borderRadius: radius.sm },
  tagText: { fontSize: 9, fontWeight: '600' },
})
