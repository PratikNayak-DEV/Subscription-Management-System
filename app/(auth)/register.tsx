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

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    if (isDummySupabase) {
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Account created', 'You can now sign in with your credentials.');
        router.replace('/(auth)/login');
      }, 900);
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) Alert.alert('Registration Failed', error.message);
    else {
      Alert.alert('Check your email', 'We sent a confirmation link to ' + email);
      router.replace('/(auth)/login');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#A1A1AA" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.sub}>Track every subscription you have, effortlessly.</Text>
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
          placeholder="Min. 6 characters"
          isPassword
          value={password}
          onChangeText={setPassword}
          icon={<Ionicons name="lock-closed-outline" size={18} color="#71717A" />}
        />

        <View style={styles.hint}>
          <Ionicons name="shield-checkmark-outline" size={14} color="#3F3F46" />
          <Text style={styles.hintText}>Your data is encrypted and never shared</Text>
        </View>

        <PressableButton
          title={loading ? '' : 'Create Account'}
          loading={loading}
          onPress={handleRegister}
          style={styles.btn}
        />

        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already have an account? </Text>
          <Link href="/(auth)/login">
            <Text style={styles.loginLink}>Sign in</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 64, paddingBottom: 48 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 40 },
  backText: { fontSize: 14, color: '#A1A1AA', fontWeight: '500' },
  header: { marginBottom: 36 },
  title: { fontSize: 30, fontWeight: '700', color: '#FAFAFA', letterSpacing: -0.8, marginBottom: 6 },
  sub: { fontSize: 14, color: '#71717A', lineHeight: 20 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24, marginTop: 4 },
  hintText: { fontSize: 12, color: '#3F3F46', fontWeight: '500' },
  btn: { marginTop: 4 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  loginPrompt: { fontSize: 14, color: '#71717A' },
  loginLink: { fontSize: 14, color: '#6366F1', fontWeight: '600' },
});
