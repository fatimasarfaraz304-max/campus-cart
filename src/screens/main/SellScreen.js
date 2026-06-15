import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/useAuth'
import { createListing } from '../../hooks/useListings'
import { colors, typography, spacing, radius } from '../../constants/theme'

const CATEGORIES = ['books', 'digital', 'electronics', 'clothing', 'accessories', 'other']
const CONDITIONS = ['new', 'good', 'fair', 'poor']

export default function SellScreen({ navigation }) {
  const { user } = useAuth()
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'books',
    condition: 'good', meetup_spot: '', tags: ''
  })
  const [loading, setLoading] = useState(false)

  function update(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handlePost() {
    if (!form.title || !form.price || !form.description) {
      return Alert.alert('Missing fields', 'Please fill title, price and description')
    }
    setLoading(true)
    const { error } = await createListing({
      seller_id: user.id,
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      condition: form.condition,
      meetup_spot: form.meetup_spot,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      status: 'available',
      images: [],
    })
    setLoading(false)
    if (error) Alert.alert('Error', error.message)
    else {
      Alert.alert('Posted!', 'Your listing is now live.')
      navigation.goBack()
    }
  }

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <View style={s.nav}>
        <TouchableOpacity style={s.navBtn} onPress={() => navigation.goBack()}>
          <Text style={s.navIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={s.navTitle}>New listing</Text>
        <View style={{ width: 32 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">

          {/* Photo upload */}
          <TouchableOpacity style={s.imgUpload}>
            <Text style={s.imgIcon}>📷</Text>
            <Text style={s.imgText}>Add photos</Text>
            <Text style={s.imgSub}>Up to 4 photos</Text>
          </TouchableOpacity>

          <View style={s.form}>
            <View>
              <Text style={s.label}>Title *</Text>
              <TextInput style={s.input} placeholder="What are you selling?" placeholderTextColor={colors.textLight} value={form.title} onChangeText={v => update('title', v)} />
            </View>

            <View>
              <Text style={s.label}>Category *</Text>
              <View style={s.chipRow}>
                {CATEGORIES.map(c => (
                  <TouchableOpacity key={c} style={[s.chip, form.category === c && s.chipOn]} onPress={() => update('category', c)}>
                    <Text style={[s.chipText, form.category === c && s.chipTextOn]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={s.row2}>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Price (Rs) *</Text>
                <TextInput style={s.input} placeholder="0" placeholderTextColor={colors.textLight} value={form.price} onChangeText={v => update('price', v)} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Condition</Text>
                <View style={s.chipRow}>
                  {CONDITIONS.map(c => (
                    <TouchableOpacity key={c} style={[s.chip, form.condition === c && s.chipOn]} onPress={() => update('condition', c)}>
                      <Text style={[s.chipText, form.condition === c && s.chipTextOn]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View>
              <Text style={s.label}>Description *</Text>
              <TextInput style={[s.input, s.textarea]} placeholder="Describe your item — condition, usage, any defects..." placeholderTextColor={colors.textLight} value={form.description} onChangeText={v => update('description', v)} multiline numberOfLines={4} textAlignVertical="top" />
            </View>

            <View>
              <Text style={s.label}>Meetup spot</Text>
              <TextInput style={s.input} placeholder="e.g. CS Block lobby, Library entrance" placeholderTextColor={colors.textLight} value={form.meetup_spot} onChangeText={v => update('meetup_spot', v)} />
            </View>

            <View>
              <Text style={s.label}>Tags (comma separated)</Text>
              <TextInput style={s.input} placeholder="semester 2, OOP, no marks" placeholderTextColor={colors.textLight} value={form.tags} onChangeText={v => update('tags', v)} />
            </View>

            <TouchableOpacity style={[s.postBtn, loading && s.postBtnDisabled]} onPress={handlePost} disabled={loading}>
              <Text style={s.postBtnText}>{loading ? 'Posting...' : '📤  Post listing'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  nav: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  navBtn: { width: 32, height: 32, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  navIcon: { color: colors.white, fontSize: typography.md },
  navTitle: { fontSize: typography.md, fontWeight: '600', color: colors.white },
  scroll: { padding: spacing.md, gap: spacing.md },
  imgUpload: { backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed', height: 100, alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  imgIcon: { fontSize: 28 },
  imgText: { fontSize: typography.sm, fontWeight: '500', color: colors.textMuted },
  imgSub: { fontSize: 10, color: colors.textLight },
  form: { gap: spacing.md },
  label: { fontSize: typography.sm, fontWeight: '500', color: colors.textDark, marginBottom: 4 },
  input: { backgroundColor: colors.bgCard, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.sm, fontSize: typography.sm, color: colors.textDark },
  textarea: { height: 90, paddingTop: spacing.sm },
  row2: { flexDirection: 'row', gap: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radius.full, backgroundColor: colors.bgCard, borderWidth: 1.5, borderColor: colors.border },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 10, color: colors.textMuted, fontWeight: '500' },
  chipTextOn: { color: colors.white },
  postBtn: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  postBtnDisabled: { opacity: 0.6 },
  postBtnText: { color: colors.white, fontSize: typography.md, fontWeight: '600' },
})
