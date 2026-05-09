import React, { useState } from 'react';
import {
  View, Text, Alert, KeyboardAvoidingView,
  Platform, ScrollView, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ElegantInput } from '@/components/ElegantInput';
import { PressableButton } from '@/components/PressableButton';
import { supabase, isDummySupabase } from '@/services/supabase';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please fill in both fields to continue.');
      return;
    }
    setLoading(true);
    if (isDummySupabase) {
      setTimeout(() => {
        setSession({ user: { email, id: 'demo-user' } } as any);
        setLoading(false);
        router.replace('/(tabs)');
      }, 900);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Login Failed', error.message);
    else router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Logo mark */}
        <View style={styles.logoArea}>
          <View style={styles.logo}>
            <Ionicons name="wallet" size={28} color="#6366F1" />
          </View>
          <Text style={styles.logoText}>SubTrack</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.sub}>Sign in to your account to continue</Text>
        </View>

        <ElegantInput
          label="Email"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
          icon={<Ionicons name="mail-outline" size={18} color="#71717A" />}
        />
        <ElegantInput
          label="Password"
          placeholder="Enter your password"
          isPassword
          value={password}
          onChangeText={setPassword}
          icon={<Ionicons name="lock-closed-outline" size={18} color="#71717A" />}
        />

        <View style={styles.forgotRow}>
          <Link href="/(auth)/login">
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Link>
        </View>

        <PressableButton
          title={loading ? '' : 'Sign In'}
          loading={loading}
          onPress={handleLogin}
          style={styles.btn}
        />

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.signupRow}>
          <Text style={styles.signupPrompt}>Don't have an account? </Text>
          <Link href="/(auth)/register">
            <Text style={styles.signupLink}>Create one</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#09090B' },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 72, paddingBottom: 48 },
  logoArea: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 48 },
  logo: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#1E1B4B', alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 20, fontWeight: '700', color: '#FAFAFA', letterSpacing: -0.4 },
  header: { marginBottom: 36 },
  title: { fontSize: 30, fontWeight: '700', color: '#FAFAFA', letterSpacing: -0.8, marginBottom: 6 },
  sub: { fontSize: 14, color: '#71717A', fontWeight: '400' },
  forgotRow: { alignItems: 'flex-end', marginBottom: 24 },
  forgotText: { fontSize: 13, color: '#6366F1', fontWeight: '500' },
  btn: { marginTop: 4 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 28 },
  divider: { flex: 1, height: 1, backgroundColor: '#27272A' },
  dividerText: { fontSize: 13, color: '#3F3F46', fontWeight: '500' },
  signupRow: { flexDirection: 'row', justifyContent: 'center' },
  signupPrompt: { fontSize: 14, color: '#71717A' },
  signupLink: { fontSize: 14, color: '#6366F1', fontWeight: '600' },
});
