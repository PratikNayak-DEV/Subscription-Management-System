import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/useAuthStore';
import { useSubscriptionStore } from '@/store/useSubscriptionStore';
import { PressableButton } from '@/components/PressableButton';

const MenuItem = ({ icon, label, value, color = '#52525B', onPress, danger = false }) => (
  <TouchableOpacity onPress={onPress} style={styles.menuItem} activeOpacity={0.7}>
    <View style={[styles.menuIcon, { backgroundColor: (danger ? '#DC2626' : color) + '18' }]}>
      <Ionicons name={icon} size={18} color={danger ? '#EF4444' : color} />
    </View>
    <Text style={[styles.menuLabel, danger && styles.menuDanger]}>{label}</Text>
    {value ? <Text style={styles.menuValue}>{value}</Text> : null}
    {!danger && <Ionicons name="chevron-forward" size={16} color="#3F3F46" />}
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const { subscriptions, getTotalMonthly } = useSubscriptionStore();

  const email = user?.email || 'user@example.com';
  const initials = email.slice(0, 2).toUpperCase();

  const confirmSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#09090B" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.email}>{email}</Text>
          <View style={styles.planBadge}>
            <Ionicons name="flash" size={12} color="#F59E0B" />
            <Text style={styles.planText}>Free Plan</Text>
          </View>
        </View>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{subscriptions.length}</Text>
            <Text style={styles.statLabel}>Subscriptions</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxMid]}>
            <Text style={styles.statValue}>${getTotalMonthly().toFixed(0)}</Text>
            <Text style={styles.statLabel}>Monthly</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>${(getTotalMonthly() * 12).toFixed(0)}</Text>
            <Text style={styles.statLabel}>Yearly</Text>
          </View>
        </View>

        {/* Settings sections */}
        <Text style={styles.groupLabel}>Preferences</Text>
        <View style={styles.group}>
          <MenuItem icon="notifications-outline" label="Notifications" color="#6366F1" onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon="moon-outline" label="Dark Mode" color="#8B5CF6" value="On" onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon="globe-outline" label="Currency" color="#0EA5E9" value="USD" onPress={() => {}} />
        </View>

        <Text style={styles.groupLabel}>Account</Text>
        <View style={styles.group}>
          <MenuItem icon="shield-checkmark-outline" label="Security" color="#10B981" onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon="cloud-upload-outline" label="Export Data" color="#F59E0B" onPress={() => {}} />
          <View style={styles.divider} />
          <MenuItem icon="help-circle-outline" label="Help & Support" color="#52525B" onPress={() => {}} />
        </View>

        <PressableButton
          title="Sign Out"
          variant="danger"
          onPress={confirmSignOut}
          icon={<Ionicons name="log-out-outline" size={18} color="#FCA5A5" />}
          style={styles.signOutBtn}
        />

        <Text style={styles.version}>SubTrack v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#09090B' },
  scroll: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 4 },

  profileCard: { alignItems: 'center', paddingVertical: 32, gap: 8, marginBottom: 8 },
  avatar: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: '#1E1B4B', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
    borderWidth: 2, borderColor: '#4F46E5',
  },
  avatarText: { fontSize: 26, fontWeight: '800', color: '#818CF8' },
  email: { fontSize: 16, fontWeight: '600', color: '#FAFAFA', letterSpacing: -0.2 },
  planBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#78350F20', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#78350F' },
  planText: { fontSize: 12, color: '#F59E0B', fontWeight: '700' },

  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 28 },
  statBox: { flex: 1, backgroundColor: '#18181B', borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#27272A', gap: 4 },
  statBoxMid: { borderColor: '#4F46E5', backgroundColor: '#1E1B4B' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#FAFAFA', letterSpacing: -0.5 },
  statLabel: { fontSize: 10, color: '#71717A', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3 },

  groupLabel: { fontSize: 11, fontWeight: '700', color: '#71717A', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8, marginTop: 4 },
  group: { backgroundColor: '#18181B', borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#27272A', overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  menuIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: '#FAFAFA', letterSpacing: -0.1 },
  menuDanger: { color: '#EF4444' },
  menuValue: { fontSize: 13, color: '#52525B', fontWeight: '600', marginRight: 4 },
  divider: { height: 1, backgroundColor: '#27272A', marginLeft: 62 },

  signOutBtn: { marginBottom: 20 },
  version: { textAlign: 'center', fontSize: 12, color: '#3F3F46', fontWeight: '500' },
});
