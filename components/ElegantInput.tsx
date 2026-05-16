import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ElegantInput = ({
  label,
  error,
  icon,
  isPassword,
  style,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(true);

  const borderColor = error ? '#FF2A55' : focused ? '#00E5FF' : '#2A2A2A';
  const labelColor = error ? '#FF2A55' : focused ? '#00E5FF' : '#A1A1AA';
  const bgColor = focused ? 'rgba(0, 229, 255, 0.05)' : '#111111';

  return (
    <View style={[styles.wrap, style]}>
      {label && (
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      )}
      <View style={[styles.row, { borderColor, backgroundColor: bgColor }]}>
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <TextInput
          style={styles.input}
          placeholderTextColor="#71717A"
          onFocus={() => {
            setFocused(true);
            props.onFocus?.();
          }}
          onBlur={() => {
            setFocused(false);
            props.onBlur?.();
          }}
          secureTextEntry={isPassword ? secure : props.secureTextEntry}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeBtn}>
            <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} size={20} color="#71717A" />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  iconWrap: { marginRight: 12 },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FAFAFA',
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  eyeBtn: { padding: 4 },
  error: {
    fontSize: 12,
    color: '#FF2A55',
    marginTop: 6,
    marginLeft: 2,
    fontWeight: '500',
  },
});
