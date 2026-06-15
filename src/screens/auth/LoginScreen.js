import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/useAuth'
import { colors, typography, spacing, radius } from '../../constants/theme'

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!email || !password) return Alert.alert('Error', 'Please fill all fields')
    setLoading(true)
    const { error } = await signIn({ email, password })
    if (error) Alert.alert('Login failed', error.message)
    setLoading(false)
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <View style={s.header}>
            <View style={s.logoBox}>
              <Text style={s.logoIcon}>🛒</Text>
            </View>
            <Text style={s.title}>Campus Cart</Text>
            <Text style={s.subtitle}>CUST Islamabad marketplace</Text>
          </View>

          <View style={s.form}>
            <Text style={s.label}>University email</Text>
            <TextInput
              style={s.input}
              placeholder="yourname@cust.edu.pk"
              placeholderTextColor={colors.textLight}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={s.label}>Password</Text>
            <TextInput
              style={s.input}
              placeholder="Enter your password"
              placeholderTextColor={colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleLogin} disabled={loading}>
              <Text style={s.btnText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.linkRow} onPress={() => navigation.navigate('Signup')}>
              <Text style={s.linkText}>Don't have an account? <Text style={s.link}>Sign up</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, padding: spacing.lg, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: spacing.xxl },
  logoBox: { width: 72, height: 72, borderRadius: radius.xl, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  logoIcon: { fontSize: 36 },
  title: { fontSize: typography.xxxl, fontWeight: '600', color: colors.textDark },
  subtitle: { fontSize: typography.sm, color: colors.textMuted, marginTop: spacing.xs },
  form: { gap: spacing.sm },
  label: { fontSize: typography.sm, fontWeight: '500', color: colors.textDark, marginBottom: 2 },
  input: { backgroundColor: colors.bgCard, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, fontSize: typography.md, color: colors.textDark },
  btn: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: colors.white, fontSize: typography.md, fontWeight: '600' },
  linkRow: { alignItems: 'center', marginTop: spacing.md },
  linkText: { fontSize: typography.sm, color: colors.textMuted },
  link: { color: colors.primary, fontWeight: '600' },
})
