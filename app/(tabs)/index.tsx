import React, { useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, StatusBar, StyleSheet,
  TouchableOpacity, Animated, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/useAuthStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { StatCard, SubCard, CategoryBar } from '@/components/FinanceWidgets';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { subscriptions, getTotalMonthly, getUpcoming, getCategoryBreakdown } = useSubscriptionStore();

  const totalMonthly = getTotalMonthly();
  const upcoming = getUpcoming(14);
  const categories = getCategoryBreakdown();
  const catTotal = categories.reduce((a, b) => a + b.amount, 0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, friction: 10 }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const firstName = user?.email?.split('@')[0] || 'there';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366F1" />}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.name}>{firstName} 👋</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={22} color="#A1A1AA" />
            </TouchableOpacity>
          </View>

          {/* Hero spending card */}
          <LinearGradient
            colors={['#00E5FF', '#5E5CE6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroGlass}>
              <Text style={styles.heroLabel}>Monthly Spend</Text>
              <Text style={styles.heroAmount}>${totalMonthly.toFixed(2)}</Text>
              <View style={styles.heroSub}>
                <View style={styles.heroBadge}>
                  <Ionicons name="pulse" size={12} color="#00E5FF" />
                  <Text style={styles.heroBadgeText}>Tracked live</Text>
                </View>
                <Text style={styles.heroMeta}>{subscriptions.length} active</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Stat row */}
          <View style={styles.statRow}>
            <StatCard
              label="Yearly"
              value={`$${(totalMonthly * 12).toFixed(0)}`}
              sub="Projected"
              icon="calendar-outline"
              accentColor="#8B5CF6"
            />
            <View style={{ width: 10 }} />
            <StatCard
              label="Upcoming"
              value={upcoming.length}
              sub="Next 14 days"
              icon="time-outline"
              accentColor="#F59E0B"
            />
          </View>

          {/* Upcoming renewals */}
          {upcoming.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Renewals</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/subscriptions')}>
                  <Text style={styles.sectionLink}>See all</Text>
                </TouchableOpacity>
              </View>
              {upcoming.slice(0, 3).map((item) => (
                <SubCard key={item.id} item={item} onPress={() => {}} />
              ))}
            </View>
          )}

          {/* Category breakdown */}
          {categories.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Spending by Category</Text>
              </View>
              <View style={styles.catCard}>
                <CategoryBar data={categories} total={catTotal} />
              </View>
            </View>
          )}

          {/* Quick add */}
          <TouchableOpacity style={styles.quickAdd} onPress={() => router.push('/add-subscription')}>
            <View style={styles.quickAddIcon}>
              <Ionicons name="add" size={20} color="#6366F1" />
            </View>
            <Text style={styles.quickAddText}>Add new subscription</Text>
            <Ionicons name="chevron-forward" size={18} color="#3F3F46" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  scroll: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  greeting: { fontSize: 14, color: '#A1A1AA', fontWeight: '500', letterSpacing: 0.2 },
  name: { fontSize: 26, fontWeight: '800', color: '#FAFAFA', letterSpacing: -0.8, marginTop: 4 },
  notifBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#111111', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#2A2A2A',
  },

  // Hero card
  heroCard: {
    borderRadius: 28,
    marginBottom: 24,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  heroGlass: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroLabel: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  heroAmount: { fontSize: 48, fontWeight: '800', color: '#FFFFFF', letterSpacing: -2, marginBottom: 12 },
  heroSub: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.25)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  heroBadgeText: { fontSize: 11, color: '#00E5FF', fontWeight: '700', letterSpacing: 0.3 },
  heroMeta: { fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },

  // Stat row
  statRow: { flexDirection: 'row', marginBottom: 32 },

  // Sections
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FAFAFA', letterSpacing: -0.4 },
  sectionLink: { fontSize: 13, color: '#00E5FF', fontWeight: '600' },
  catCard: {
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },

  // Quick add
  quickAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 8,
  },
  quickAddIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(0, 229, 255, 0.1)', alignItems: 'center', justifyContent: 'center',
  },
  quickAddText: { flex: 1, fontSize: 15, color: '#FAFAFA', fontWeight: '600', letterSpacing: -0.2 },
});
