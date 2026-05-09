import React, { useRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Animated, StyleSheet, View } from 'react-native';

export const PressableButton = ({ title, onPress, variant = 'primary', loading = false, icon, style, textStyle, disabled }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, friction: 8 }),
      Animated.timing(opacity, { toValue: 0.85, duration: 60, useNativeDriver: true }),
    ]).start();
  };
  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 6 }),
      Animated.timing(opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const variantStyles = {
    primary: styles.primary,
    outline: styles.outline,
    ghost: styles.ghost,
    danger: styles.danger,
  };
  const variantText = {
    primary: styles.primaryText,
    outline: styles.outlineText,
    ghost: styles.ghostText,
    danger: styles.dangerText,
  };

  return (
    <Animated.View style={[{ transform: [{ scale }], opacity }, style]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        style={[styles.base, variantStyles[variant], (disabled || loading) && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? '#fff' : '#6366F1'} size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <View style={styles.iconWrap}>{icon}</View>}
            <Text style={[styles.text, variantText[variant], textStyle]}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: '#6366F1',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#3F3F46',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: '#1F1111',
    borderWidth: 1.5,
    borderColor: '#7F1D1D',
  },
  disabled: {
    opacity: 0.45,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {},
  text: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  primaryText: { color: '#FFFFFF' },
  outlineText: { color: '#FAFAFA' },
  ghostText: { color: '#A1A1AA' },
  dangerText: { color: '#FCA5A5' },
});
