import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, typography } from '../../constants/theme'

export default function BrowseScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.center}>
        <Text style={s.emoji}>🔍</Text>
        <Text style={s.title}>Browse</Text>
        <Text style={s.sub}>Coming next — search with filters</Text>
      </View>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emoji: { fontSize: 48 },
  title: { fontSize: typography.xl, fontWeight: '600', color: colors.textDark },
  sub: { fontSize: typography.sm, color: colors.textMuted },
})
