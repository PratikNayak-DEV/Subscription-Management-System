import React from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSubscriptionStore, CATEGORIES } from '@/store/useSubscriptionStore';
import { CategoryBar } from '@/components/FinanceWidgets';

const W = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const { getTotalMonthly, getCategoryBreakdown, subscriptions } = useSubscriptionStore();
  const totalMonthly = getTotalMonthly();
  const categories = getCategoryBreakdown();
  const catTotal = categories.reduce((a, b) => a + b.amount, 0);

  // Generate last 6 months of simulated data based on current total
  const base = totalMonthly;
  const monthLabels = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const monthData = [
    parseFloat((base * 0.78).toFixed(2)),
    parseFloat((base * 0.85).toFixed(2)),
    parseFloat((base * 0.88).toFixed(2)),
    parseFloat((base * 0.93).toFixed(2)),
    parseFloat((base * 0.97).toFixed(2)),
    parseFloat(base.toFixed(2)),
  ];

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: '#18181B',
    backgroundGradientTo: '#18181B',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(113, 113, 122, ${opacity})`,
    strokeWidth: 2,
    propsForDots: { r: '4', strokeWidth: '2', stroke: '#6366F1' },
    propsForBackgroundLines: { stroke: '#27272A', strokeWidth: 1 },
  };

  const topSubs = [...subscriptions].sort((a, b) => {
    const aMonthly = a.cycle === 'Yearly' ? a.price / 12 : a.price;
    const bMonthly = b.cycle === 'Yearly' ? b.price / 12 : b.price;
    return bMonthly - aMonthly;
  }).slice(0, 5);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Insights</Text>
        <Text style={styles.sub}>How your money moves every month</Text>

        {/* Summary row */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Monthly</Text>
            <Text style={styles.summaryValue}>${totalMonthly.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryCard, styles.summaryMid]}>
            <Text style={styles.summaryLabel}>Yearly</Text>
            <Text style={styles.summaryValue}>${(totalMonthly * 12).toFixed(0)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Avg/day</Text>
            <Text style={styles.summaryValue}>${(totalMonthly / 30).toFixed(2)}</Text>
          </View>
        </View>

        {/* Spending trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Trend</Text>
          <Text style={styles.sectionSub}>Last 6 months</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={{ labels: monthLabels, datasets: [{ data: monthData }] }}
              width={W - 40 - 32}
              height={180}
              chartConfig={chartConfig}
              bezier
              withInnerLines
              withOuterLines={false}
              style={{ borderRadius: 12, marginLeft: -12 }}
            />
          </View>
        </View>

        {/* Category breakdown */}
        {categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>By Category</Text>
            <Text style={styles.sectionSub}>Monthly allocation</Text>
            <View style={styles.card}>
              <CategoryBar data={categories} total={catTotal} />
            </View>
          </View>
        )}

        {/* Top spending */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Subscriptions</Text>
          <Text style={styles.sectionSub}>Biggest monthly costs</Text>
          <View style={styles.card}>
            {topSubs.map((s, i) => {
              const monthly = s.cycle === 'Yearly' ? s.price / 12 : s.price;
              const pct = totalMonthly > 0 ? (monthly / totalMonthly) * 100 : 0;
              return (
                <View key={s.id} style={styles.topRow}>
                  <Text style={styles.topEmoji}>{s.icon}</Text>
                  <View style={styles.topInfo}>
                    <View style={styles.topHeader}>
                      <Text style={styles.topName}>{s.name}</Text>
                      <Text style={styles.topAmount}>${monthly.toFixed(2)}/mo</Text>
                    </View>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: s.color || '#6366F1' }]} />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#09090B' },
  scroll: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 4 },
  title: { fontSize: 28, fontWeight: '800', color: '#FAFAFA', letterSpacing: -0.8, marginBottom: 4 },
  sub: { fontSize: 13, color: '#71717A', marginBottom: 24 },

  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  summaryCard: { flex: 1, backgroundColor: '#18181B', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#27272A', gap: 4 },
  summaryMid: { borderColor: '#4F46E5', backgroundColor: '#1E1B4B' },
  summaryLabel: { fontSize: 11, color: '#71717A', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  summaryValue: { fontSize: 18, fontWeight: '700', color: '#FAFAFA', letterSpacing: -0.5 },

  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FAFAFA', letterSpacing: -0.3 },
  sectionSub: { fontSize: 12, color: '#52525B', marginBottom: 14, marginTop: 2 },
  chartCard: { backgroundColor: '#18181B', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#27272A', overflow: 'hidden' },
  card: { backgroundColor: '#18181B', borderRadius: 20, padding: 18, borderWidth: 1, borderColor: '#27272A', gap: 16 },

  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  topEmoji: { fontSize: 24, width: 36 },
  topInfo: { flex: 1, gap: 6 },
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topName: { fontSize: 14, fontWeight: '600', color: '#FAFAFA' },
  topAmount: { fontSize: 13, fontWeight: '700', color: '#A1A1AA' },
  barTrack: { height: 4, backgroundColor: '#27272A', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
});
