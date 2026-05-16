import { Tabs } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const TABS = [
  { name: 'index', label: 'Home', icon: 'home', iconOut: 'home-outline' },
  { name: 'subscriptions', label: 'Subs', icon: 'grid', iconOut: 'grid-outline' },
  { name: 'analytics', label: 'Insights', icon: 'bar-chart', iconOut: 'bar-chart-outline' },
  { name: 'profile', label: 'You', icon: 'person-circle', iconOut: 'person-circle-outline' },
];

function TabIcon({ focused, icon, iconOut, label }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: focused ? 1.1 : 1, useNativeDriver: true, friction: 5 }),
      Animated.timing(opacity, { toValue: focused ? 1 : 0, duration: 200, useNativeDriver: true })
    ]).start();
  }, [focused]);

  return (
    <Animated.View style={[styles.tabInner, { transform: [{ scale }] }]}>
      <Animated.View style={[styles.blob, { opacity }]} />
      <Ionicons
        name={focused ? icon : iconOut}
        size={22}
        color={focused ? '#00E5FF' : '#A1A1AA'}
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
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={60}
            style={StyleSheet.absoluteFill}
          />
        ),
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
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 30,
    height: 70,
    paddingBottom: 0,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: '100%',
    width: 60,
    position: 'relative',
  },
  blob: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderRadius: 20,
    marginVertical: 8,
  },
  tabLabel: {
    fontSize: 10,
    color: '#A1A1AA',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: '#00E5FF',
    fontWeight: '700',
  },
});
