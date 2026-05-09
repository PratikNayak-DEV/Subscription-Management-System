import { Tabs } from 'expo-router';
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TABS = [
  { name: 'index', label: 'Home', icon: 'home', iconOut: 'home-outline' },
  { name: 'subscriptions', label: 'Subs', icon: 'grid', iconOut: 'grid-outline' },
  { name: 'analytics', label: 'Insights', icon: 'bar-chart', iconOut: 'bar-chart-outline' },
  { name: 'profile', label: 'You', icon: 'person-circle', iconOut: 'person-circle-outline' },
];

function TabIcon({ focused, icon, iconOut, label }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.85, useNativeDriver: true, friction: 8 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }),
    ]).start();
  };

  return (
    <Animated.View style={[styles.tabInner, { transform: [{ scale }] }]}>
      {focused && <View style={styles.blob} />}
      <Ionicons
        name={focused ? icon : iconOut}
        size={21}
        color={focused ? '#818CF8' : '#52525B'}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </Animated.View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.bar,
        tabBarIcon: ({ focused }) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;
          return <TabIcon focused={focused} icon={tab.icon} iconOut={tab.iconOut} label={tab.label} />;
        },
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="subscriptions" />
      <Tabs.Screen name="analytics" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#111113',
    borderTopWidth: 1,
    borderTopColor: '#27272A',
    height: Platform.OS === 'ios' ? 82 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    paddingHorizontal: 4,
    elevation: 0,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    position: 'relative',
    minWidth: 60,
  },
  blob: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E1B4B',
    borderRadius: 12,
  },
  tabLabel: {
    fontSize: 10,
    color: '#52525B',
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    color: '#818CF8',
    fontWeight: '700',
  },
});
