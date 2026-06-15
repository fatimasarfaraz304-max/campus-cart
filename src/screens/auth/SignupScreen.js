import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../../hooks/useAuth'
import { colors, typography, spacing, radius } from '../../constants/theme'

const DEPARTMENTS = ['CS', 'SE', 'EE', 'ME', 'BBA', 'MBA', 'Other']
const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8']

export default function SignupScreen({ navigation }) {
  const { signUp } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', fullName: '', studentId: '', department: 'CS', semester: '1' })
  const [loading, setLoading] = useState(false)

  function update(key, val) { setForm(f => ({ ...f, [key]: val })) }

  async function handleSignup() {
    if (!form.email || !form.password || !form.fullName || !form.studentId) {
      return Alert.alert('Error', 'Please fill all required fields')
    }
    setLoading(true)
    const { error } = await signUp(form)
    if (error) Alert.alert('Signup failed', error.message)
    else Alert.alert('Check your email', 'We sent a verification link to your university email.')
    setLoading(false)
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.back}>
            <Text style={s.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={s.title}>Create account</Text>
          <Text style={s.subtitle}>Only CUST students can join</Text>

          <View style={s.form}>
            {[
              { label: 'Full name *', key: 'fullName', placeholder: 'Muhammad Ali' },
              { label: 'University email *', key: 'email', placeholder: 'ali@cust.edu.pk', keyboard: 'email-address' },
              { label: 'Student ID *', key: 'studentId', placeholder: 'F2024-012' },
              { label: 'Password *', key: 'password', placeholder: 'Min 6 characters', secure: true },
            ].map(f => (
              <View key={f.key}>
                <Text style={s.label}>{f.label}</Text>
                <TextInput
                  style={s.input}
                  placeholder={f.placeholder}
                  placeholderTextColor={colors.textLight}
                  value={form[f.key]}
                  onChangeText={v => update(f.key, v)}
                  keyboardType={f.keyboard || 'default'}
                  secureTextEntry={!!f.secure}
                  autoCapitalize={f.key === 'email' ? 'none' : 'words'}
                />
              </View>
            ))}

            <View style={s.row}>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Department</Text>
                <View style={s.select}>
                  {DEPARTMENTS.map(d => (
                    <TouchableOpacity key={d} style={[s.chip, form.department === d && s.chipOn]} onPress={() => update('department', d)}>
                      <Text style={[s.chipText, form.department === d && s.chipTextOn]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={handleSignup} disabled={loading}>
              <Text style={s.btnText}>{loading ? 'Creating account...' : 'Create account'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.linkRow} onPress={() => navigation.navigate('Login')}>
              <Text style={s.linkText}>Already have an account? <Text style={s.link}>Sign in</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, padding: spacing.lg },
  back: { marginBottom: spacing.lg },
  backText: { color: colors.primary, fontSize: typography.md, fontWeight: '500' },
  title: { fontSize: typography.xxl, fontWeight: '600', color: colors.textDark },
  subtitle: { fontSize: typography.sm, color: colors.textMuted, marginBottom: spacing.lg, marginTop: spacing.xs },
  form: { gap: spacing.md },
  label: { fontSize: typography.sm, fontWeight: '500', color: colors.textDark, marginBottom: 4 },
  input: { backgroundColor: colors.bgCard, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, fontSize: typography.md, color: colors.textDark },
  row: { gap: spacing.sm },
  select: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radius.full, backgroundColor: colors.bgCard, borderWidth: 1.5, borderColor: colors.border },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: typography.sm, color: colors.textMuted },
  chipTextOn: { color: colors.white, fontWeight: '500' },
  btn: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: colors.white, fontSize: typography.md, fontWeight: '600' },
  linkRow: { alignItems: 'center' },
  linkText: { fontSize: typography.sm, color: colors.textMuted },
  link: { color: colors.primary, fontWeight: '600' },
})
