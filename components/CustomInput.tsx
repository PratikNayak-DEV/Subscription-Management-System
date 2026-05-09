import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  icon,
  isPassword,
  className = '',
  ...props
}) => {
  const [isSecure, setIsSecure] = useState(true);

  return (
    <View className={`mb-4 ${className}`}>
      {label && <Text className="text-text-muted text-sm font-medium mb-1.5">{label}</Text>}
      <View
        className={`flex-row items-center bg-card border rounded-xl px-4 h-14 ${
          error ? 'border-danger' : 'border-border'
        }`}
      >
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput
          className="flex-1 text-text text-base"
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword ? isSecure : props.secureTextEntry}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)} className="ml-2">
            <Ionicons name={isSecure ? 'eye-off' : 'eye'} size={24} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-danger text-xs mt-1.5 ml-1">{error}</Text>}
    </View>
  );
};
