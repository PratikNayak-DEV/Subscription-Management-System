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

  const borderColor = error ? '#7F1D1D' : focused ? '#6366F1' : '#3F3F46';
  const labelColor = error ? '#EF4444' : focused ? '#818CF8' : '#71717A';

  return (
    <View style={[styles.wrap, style]}>
      {label && (
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      )}
      <View style={[styles.row, { borderColor }]}>
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <TextInput
          style={styles.input}
          placeholderTextColor="#3F3F46"
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
  wrap: { marginBottom: 18 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181B',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  iconWrap: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FAFAFA',
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  eyeBtn: { padding: 4 },
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 2,
    fontWeight: '500',
  },
});
