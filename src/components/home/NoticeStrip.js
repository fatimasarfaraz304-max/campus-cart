import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { colors, typography, spacing, radius } from '../../constants/theme'

export default function NoticeStrip({ onPress }) {
  return (
    <TouchableOpacity style={s.strip} onPress={onPress} activeOpacity={0.85}>
      <Text style={s.icon}>📢</Text>
      <View style={{ flex: 1 }}>
        <Text style={s.title}>Mid-exam schedule released</Text>
        <Text style={s.sub}>Tap to view timetable</Text>
      </View>
      <Text style={s.arrow}>›</Text>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  strip: { backgroundColor: '#FFF8E1', marginHorizontal: spacing.md, marginBottom: spacing.sm, borderRadius: radius.md, padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1.5, borderColor: '#FFE082' },
  icon: { fontSize: 18 },
  title: { fontSize: typography.sm - 1, fontWeight: '600', color: '#BF360C' },
  sub: { fontSize: 10, color: colors.warning, marginTop: 1 },
  arrow: { fontSize: typography.xl, color: colors.warning },
})
