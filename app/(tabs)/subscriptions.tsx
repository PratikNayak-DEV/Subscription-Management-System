import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Animated,
  Alert, StyleSheet, TextInput, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSubscriptionStore, CATEGORIES } from '@/store/useSubscriptionStore';

function AnimatedSubRow({ item, index, onDelete }) {
  const anim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      delay: index * 50,
      useNativeDriver: true,
      friction: 10,
    }).start();
  }, []);

  const cat = CATEGORIES[item.category] || CATEGORIES.other;
  const daysLeft = Math.ceil((new Date(item.nextBill) - new Date()) / (1000 * 60 * 60 * 24));

  const confirmDelete = () => {
    Alert.alert('Remove subscription', `Remove ${item.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => onDelete(item.id) },
    ]);
  };

  const onPressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, friction: 8 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }).start();

  return (
    <Animated.View style={{
      opacity: anim,
      transform: [{ scale }, { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
    }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onLongPress={confirmDelete}
        style={styles.row}
      >
        <View style={[styles.icon, { backgroundColor: item.color + '20' }]}>
          <Text style={styles.emoji}>{item.icon}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.tag, { backgroundColor: cat.color + '18' }]}>
              <Text style={[styles.tagText, { color: cat.color }]}>{cat.label}</Text>
            </View>
            <Text style={styles.cycle}>{item.cycle}</Text>
            <Text style={styles.separator}>·</Text>
            <Text style={[styles.days, daysLeft <= 3 && styles.daysUrgent]}>
              {daysLeft <= 0 ? 'Due today' : daysLeft === 1 ? 'Due tomorrow' : `${daysLeft}d left`}
            </Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Text style={styles.priceSub}>{item.cycle === 'Monthly' ? '/mo' : '/yr'}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function SubscriptionsScreen() {
  const router = useRouter();
  const { subscriptions, deleteSubscription, getTotalMonthly } = useSubscriptionStore();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Monthly', 'Yearly'];
  const filtered = subscriptions
    .filter((s) => {
      const matchQuery = s.name.toLowerCase().includes(query.toLowerCase());
      const matchFilter = activeFilter === 'All' || s.cycle === activeFilter;
      return matchQuery && matchFilter;
    });

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Subscriptions</Text>
          <Text style={styles.subtitle}>${getTotalMonthly().toFixed(2)}/month total</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-subscription')}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={16} color="#52525B" />
        <TextInput
          style={styles.search}
          placeholder="Search subscriptions..."
          placeholderTextColor="#3F3F46"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={16} color="#52525B" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.filter, activeFilter === f && styles.filterActive]}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.count}>{filtered.length} items</Text>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <AnimatedSubRow item={item} index={index} onDelete={deleteSubscription} />
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="receipt-outline" size={32} color="#3F3F46" />
            </View>
            <Text style={styles.emptyTitle}>No subscriptions yet</Text>
            <Text style={styles.emptySub}>Tap the + button to add your first one</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#09090B' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 4, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#FAFAFA', letterSpacing: -0.8 },
  subtitle: { fontSize: 13, color: '#6366F1', fontWeight: '600', marginTop: 2 },
  addBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#6366F1', alignItems: 'center', justifyContent: 'center',
  },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#18181B', borderRadius: 12, borderWidth: 1, borderColor: '#27272A',
    paddingHorizontal: 14, height: 44, marginHorizontal: 20, marginBottom: 14,
  },
  search: { flex: 1, fontSize: 14, color: '#FAFAFA', fontWeight: '400' },

  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, marginBottom: 16 },
  filter: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#18181B', borderWidth: 1, borderColor: '#27272A' },
  filterActive: { backgroundColor: '#1E1B4B', borderColor: '#4F46E5' },
  filterText: { fontSize: 12, color: '#71717A', fontWeight: '600' },
  filterTextActive: { color: '#818CF8' },
  count: { marginLeft: 'auto', fontSize: 12, color: '#52525B', fontWeight: '500' },

  list: { paddingHorizontal: 20, paddingBottom: 120 },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#18181B', borderRadius: 16, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#27272A',
  },
  icon: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 22 },
  info: { flex: 1, gap: 5 },
  name: { fontSize: 15, fontWeight: '600', color: '#FAFAFA', letterSpacing: -0.2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  tagText: { fontSize: 10, fontWeight: '700' },
  cycle: { fontSize: 11, color: '#52525B', fontWeight: '500' },
  separator: { color: '#3F3F46', fontSize: 11 },
  days: { fontSize: 11, color: '#71717A', fontWeight: '500' },
  daysUrgent: { color: '#F59E0B' },
  right: { alignItems: 'flex-end' },
  price: { fontSize: 16, fontWeight: '700', color: '#FAFAFA', letterSpacing: -0.4 },
  priceSub: { fontSize: 11, color: '#52525B', marginTop: 1 },

  empty: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyIcon: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#18181B', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#FAFAFA' },
  emptySub: { fontSize: 13, color: '#52525B' },
});
