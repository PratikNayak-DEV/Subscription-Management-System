import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '@/store/useSubscriptionStore';

export const StatCard = ({ label, value, sub, icon, accentColor = '#6366F1' }) => (
  <View style={[styles.statCard, { borderColor: accentColor + '35' }]}>
    <View style={[styles.statIcon, { backgroundColor: accentColor + '18' }]}>
      <Ionicons name={icon} size={18} color={accentColor} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
  </View>
);

export const SubCard = ({ item, onPress }) => {
  const cat = CATEGORIES[item.category] || CATEGORIES.other;
  const daysLeft = Math.ceil((new Date(item.nextBill) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={styles.subCard}>
      <View style={[styles.subIcon, { backgroundColor: (item.color || '#6366F1') + '22' }]}>
        <Text style={styles.subEmoji}>{item.icon}</Text>
      </View>
      <View style={styles.subInfo}>
        <Text style={styles.subName}>{item.name}</Text>
        <View style={styles.subMeta}>
          <View style={[styles.tag, { backgroundColor: cat.color + '18' }]}>
            <Text style={[styles.tagText, { color: cat.color }]}>{cat.label}</Text>
          </View>
          <Text style={styles.subDays}>
            {daysLeft <= 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `in ${daysLeft}d`}
          </Text>
        </View>
      </View>
      <View style={styles.subRight}>
        <Text style={styles.subPrice}>${item.price.toFixed(2)}</Text>
        <Text style={styles.subCycle}>{item.cycle === 'Monthly' ? '/mo' : '/yr'}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const CategoryBar = ({ data, total }) => (
  <View style={styles.catWrap}>
    <View style={styles.catBar}>
      {data.map((d, i) => (
        <View
          key={i}
          style={{
            flex: total > 0 ? d.amount / total : 0,
            backgroundColor: d.color,
            height: '100%',
          }}
        />
      ))}
    </View>
    <View style={styles.catLegend}>
      {data.map((d, i) => (
        <View key={i} style={styles.catRow}>
          <View style={[styles.catDot, { backgroundColor: d.color }]} />
          <Text style={styles.catLabel}>{d.label}</Text>
          <Text style={styles.catAmount}>${d.amount.toFixed(0)}<Text style={styles.catAmountSub}>/mo</Text></Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  // StatCard
  statCard: {
    flex: 1,
    backgroundColor: '#18181B',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    gap: 3,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: { fontSize: 24, fontWeight: '800', color: '#FAFAFA', letterSpacing: -0.5 },
  statLabel: { fontSize: 11, color: '#71717A', fontWeight: '600', letterSpacing: 0.2 },
  statSub: { fontSize: 10, color: '#52525B', marginTop: 1 },

  // SubCard
  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#27272A',
    gap: 12,
  },
  subIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subEmoji: { fontSize: 22 },
  subInfo: { flex: 1, gap: 5 },
  subName: { fontSize: 15, fontWeight: '600', color: '#FAFAFA', letterSpacing: -0.2 },
  subMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tag: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 10, fontWeight: '700' },
  subDays: { fontSize: 11, color: '#71717A', fontWeight: '500' },
  subRight: { alignItems: 'flex-end' },
  subPrice: { fontSize: 16, fontWeight: '700', color: '#FAFAFA', letterSpacing: -0.3 },
  subCycle: { fontSize: 11, color: '#52525B', marginTop: 2 },

  // CategoryBar
  catWrap: { gap: 14 },
  catBar: {
    height: 6,
    borderRadius: 6,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: '#27272A',
  },
  catLegend: { gap: 10 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  catLabel: { flex: 1, fontSize: 13, color: '#A1A1AA', fontWeight: '500' },
  catAmount: { fontSize: 13, color: '#FAFAFA', fontWeight: '700' },
  catAmountSub: { fontSize: 11, color: '#52525B', fontWeight: '400' },
});
