import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/useAuth'
import { useListings } from '../../hooks/useListings'
import ListingCard from '../../components/listing/ListingCard'
import NoticeStrip from '../../components/home/NoticeStrip'
import AdBanner from '../../components/home/AdBanner'
import { colors, typography, spacing, radius } from '../../constants/theme'

const CATEGORIES = [
  { key: null, label: 'All' },
  { key: 'books', label: 'Books' },
  { key: 'digital', label: 'Digital' },
  { key: 'electronics', label: 'Electronics' },
  { key: 'clothing', label: 'Clothing' },
  { key: 'other', label: 'Other' },
]

export default function HomeScreen({ navigation }) {
  const { profile } = useAuth()
  const [category, setCategory] = useState(null)
  const [search, setSearch] = useState('')
  const { listings, loading, refetch } = useListings({ category, search })

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.logoBox}>
            <Text style={s.logoIcon}>🛒</Text>
          </View>
          <View>
            <Text style={s.headerTitle}>Campus Cart</Text>
            <Text style={s.headerSub}>CUST Islamabad</Text>
          </View>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.hico} onPress={() => navigation.navigate('Notices')}>
            <Text style={s.hicoIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.hico} onPress={() => navigation.navigate('Chats')}>
            <Text style={s.hicoIcon}>💬</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search bar */}
      <View style={s.searchWrap}>
        <View style={s.search}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Books, notes, gadgets..."
            placeholderTextColor={colors.textLight}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: colors.textMuted, fontSize: typography.lg }}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={listings}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={s.grid}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <ListingCard listing={item} onPress={() => navigation.navigate('ListingDetail', { id: item.id })} />
        )}
        ListHeaderComponent={
          <>
            {/* Category pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.cats} contentContainerStyle={s.catsContent}>
              {CATEGORIES.map(c => (
                <TouchableOpacity key={String(c.key)} style={[s.pill, category === c.key && s.pillOn]} onPress={() => setCategory(c.key)}>
                  <Text style={[s.pillText, category === c.key && s.pillTextOn]}>{c.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <NoticeStrip onPress={() => navigation.navigate('Notices')} />
            <AdBanner />

            <View style={s.sectionHead}>
              <Text style={s.sectionTitle}>Fresh listings</Text>
              <TouchableOpacity><Text style={s.sectionLink}>See all</Text></TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          !loading && (
            <View style={s.empty}>
              <Text style={s.emptyText}>No listings found</Text>
              <Text style={s.emptySubText}>Be the first to post something!</Text>
            </View>
          )
        }
        contentContainerStyle={s.listContent}
      />
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, paddingBottom: spacing.md },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoBox: { width: 34, height: 34, backgroundColor: colors.white, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  logoIcon: { fontSize: 18 },
  headerTitle: { fontSize: typography.md, fontWeight: '600', color: colors.white },
  headerSub: { fontSize: 9, color: 'rgba(255,255,255,0.6)', marginTop: 1 },
  headerRight: { flexDirection: 'row', gap: spacing.sm },
  hico: { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  hicoIcon: { fontSize: 16 },
  searchWrap: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  search: { backgroundColor: colors.white, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderWidth: 1.5, borderColor: colors.border },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: typography.sm, color: colors.textDark },
  cats: { backgroundColor: colors.bg },
  catsContent: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm },
  pill: { paddingVertical: spacing.xs + 1, paddingHorizontal: spacing.md, borderRadius: radius.full, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.primaryBorder },
  pillOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { fontSize: typography.xs, fontWeight: '500', color: colors.primary },
  pillTextOn: { color: colors.white },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingBottom: spacing.sm, paddingTop: spacing.xs },
  sectionTitle: { fontSize: typography.sm, fontWeight: '600', color: colors.textDark },
  sectionLink: { fontSize: typography.xs, color: colors.primary, fontWeight: '500' },
  grid: { paddingHorizontal: spacing.md, gap: spacing.sm },
  listContent: { paddingBottom: spacing.xxxl },
  empty: { alignItems: 'center', paddingTop: spacing.xxl },
  emptyText: { fontSize: typography.md, fontWeight: '500', color: colors.textMuted },
  emptySubText: { fontSize: typography.sm, color: colors.textLight, marginTop: spacing.xs },
})
