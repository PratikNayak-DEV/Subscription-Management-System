import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ElegantInput } from '@/components/ElegantInput';
import { PressableButton } from '@/components/PressableButton';
import { useSubscriptionStore, CATEGORIES } from '@/store/useSubscriptionStore';

const EMOJIS = ['🎬', '🎵', '📦', '☁️', '📝', '🎮', '💊', '📰', '🔧', '📱', '🌐', '🎓'];
const CYCLES = ['Monthly', 'Yearly'];

export default function AddSubscriptionScreen() {
  const router = useRouter();
  const { addSubscription } = useSubscriptionStore();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [cycle, setCycle] = useState('Monthly');
  const [category, setCategory] = useState('entertainment');
  const [icon, setIcon] = useState('📱');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) e.price = 'Enter a valid price';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    addSubscription({
      name: name.trim(),
      price: parseFloat(price),
      cycle,
      category,
      icon,
      nextBill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#A1A1AA" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>New Subscription</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Icon picker */}
          <Text style={styles.label}>Choose icon</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiScroll}>
            {EMOJIS.map((e) => (
              <TouchableOpacity
                key={e}
                onPress={() => setIcon(e)}
                style={[styles.emojiBtn, icon === e && styles.emojiBtnActive]}
              >
                <Text style={styles.emoji}>{e}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ElegantInput
            label="Service name"
            placeholder="e.g. Netflix, Spotify"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoCorrect={false}
          />

          <ElegantInput
            label="Price"
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={price}
            onChangeText={setPrice}
            error={errors.price}
            icon={<Text style={styles.dollarSign}>$</Text>}
          />

          {/* Billing cycle */}
          <Text style={styles.label}>Billing cycle</Text>
          <View style={styles.segRow}>
            {CYCLES.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setCycle(c)}
                style={[styles.seg, cycle === c && styles.segActive]}
              >
                <Text style={[styles.segText, cycle === c && styles.segTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Category */}
          <Text style={[styles.label, { marginTop: 20 }]}>Category</Text>
          <View style={styles.catGrid}>
            {Object.entries(CATEGORIES).map(([key, val]) => (
              <TouchableOpacity
                key={key}
                onPress={() => setCategory(key)}
                style={[
                  styles.catBtn,
                  { borderColor: category === key ? val.color : '#27272A' },
                  category === key && { backgroundColor: val.color + '18' },
                ]}
              >
                <Text style={[styles.catText, category === key && { color: val.color }]}>{val.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <PressableButton
            title="Save Subscription"
            onPress={handleSave}
            style={styles.saveBtn}
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  safe: { flex: 1 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#111111', alignItems: 'center', justifyContent: 'center' },
  navTitle: { fontSize: 16, fontWeight: '700', color: '#FAFAFA', letterSpacing: -0.3 },
  scroll: { paddingHorizontal: 20, paddingBottom: 80 },
  label: { fontSize: 11, fontWeight: '700', color: '#71717A', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  emojiScroll: { marginBottom: 24 },
  emojiBtn: { width: 48, height: 48, borderRadius: 13, backgroundColor: '#111111', alignItems: 'center', justifyContent: 'center', marginRight: 8, borderWidth: 1.5, borderColor: 'transparent' },
  emojiBtnActive: { borderColor: '#6366F1', backgroundColor: '#1E1B4B' },
  emoji: { fontSize: 24 },
  dollarSign: { fontSize: 16, color: '#71717A', fontWeight: '600' },

  segRow: { flexDirection: 'row', backgroundColor: '#111111', borderRadius: 12, padding: 4, gap: 4, borderWidth: 1, borderColor: '#2A2A2A' },
  seg: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  segActive: { backgroundColor: '#6366F1' },
  segText: { fontSize: 13, fontWeight: '600', color: '#52525B' },
  segTextActive: { color: '#FFFFFF' },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  catBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: '#27272A' },
  catText: { fontSize: 12, fontWeight: '600', color: '#71717A' },

  saveBtn: { marginTop: 4 },
});
