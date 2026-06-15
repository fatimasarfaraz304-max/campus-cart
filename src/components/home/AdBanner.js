import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, typography, spacing, radius } from '../../constants/theme'

export default function AdBanner() {
  return (
    <View style={s.banner}>
      <View style={s.ico}>
        <Text style={s.icoText}>🍽️</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.title}>Campus Canteen</Text>
        <Text style={s.sub}>Eid special — 20% off today only</Text>
      </View>
      <TouchableOpacity style={s.btn}>
        <Text style={s.btnText}>View</Text>
      </TouchableOpacity>
    </View>
  )
}

const s = StyleSheet.create({
  banner: { backgroundColor: colors.primaryDark, marginHorizontal: spacing.md, marginBottom: spacing.sm, borderRadius: radius.md, padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ico: { width: 42, height: 42, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  icoText: { fontSize: 20 },
  title: { fontSize: typography.sm, fontWeight: '600', color: colors.white },
  sub: { fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 2 },
  btn: { backgroundColor: colors.primaryLight, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radius.sm },
  btnText: { fontSize: 10, fontWeight: '600', color: colors.white },
})
