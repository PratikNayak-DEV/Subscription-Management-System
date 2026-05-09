import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, View } from 'react-native';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = 'primary',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary border-primary';
      case 'secondary':
        return 'bg-secondary border-secondary';
      case 'danger':
        return 'bg-danger border-danger';
      case 'outline':
        return 'bg-transparent border border-border';
      default:
        return 'bg-primary border-primary';
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return 'text-text';
    return 'text-white';
  };

  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center rounded-xl py-4 px-6 border ${getVariantStyles()} ${
        isDisabled ? 'opacity-50' : 'opacity-100'
      } ${className}`}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? '#0F172A' : '#FFFFFF'} />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`font-semibold text-lg ${getTextColor()}`}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
