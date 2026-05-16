import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { CATEGORIES } from '@/store/useSubscriptionStore';

export const StatCard = ({ label, value, sub, icon, accentColor = '#00E5FF' }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconWrap, { backgroundColor: accentColor + '15' }]}>
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
      <View style={[styles.subIcon, { backgroundColor: (item.color || '#00E5FF') + '15' }]}>
        <Text style={styles.subEmoji}>{item.icon}</Text>
      </View>
      <View style={styles.subInfo}>
        <Text style={styles.subName}>{item.name}</Text>
        <View style={styles.subMeta}>
          <View style={[styles.tag, { backgroundColor: cat.color + '15' }]}>
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
            borderRadius: 6,
            marginLeft: i > 0 ? 2 : 0,
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
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    gap: 4,
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 26, fontWeight: '800', color: '#FAFAFA', letterSpacing: -0.6 },
  statLabel: { fontSize: 12, color: '#A1A1AA', fontWeight: '600', letterSpacing: 0.3, textTransform: 'uppercase' },
  statSub: { fontSize: 11, color: '#71717A', marginTop: 1 },

  // SubCard
  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    gap: 14,
  },
  subIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subEmoji: { fontSize: 24 },
  subInfo: { flex: 1, gap: 6 },
  subName: { fontSize: 16, fontWeight: '700', color: '#FAFAFA', letterSpacing: -0.2 },
  subMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
  subDays: { fontSize: 12, color: '#A1A1AA', fontWeight: '500' },
  subRight: { alignItems: 'flex-end' },
  subPrice: { fontSize: 17, fontWeight: '800', color: '#FAFAFA', letterSpacing: -0.4 },
  subCycle: { fontSize: 12, color: '#71717A', marginTop: 2, fontWeight: '500' },

  // CategoryBar
  catWrap: { gap: 18 },
  catBar: {
    height: 8,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  catLegend: { gap: 12 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catLabel: { flex: 1, fontSize: 14, color: '#A1A1AA', fontWeight: '600' },
  catAmount: { fontSize: 14, color: '#FAFAFA', fontWeight: '800' },
  catAmountSub: { fontSize: 12, color: '#71717A', fontWeight: '500' },
});
