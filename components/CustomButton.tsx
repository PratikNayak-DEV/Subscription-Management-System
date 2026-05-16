import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  style,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  const content = (
    <View style={styles.content}>
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? '#A1A1AA' : '#FFFFFF'} />
      ) : (
        <>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[styles.text, variant === 'outline' && styles.textOutline]}>
            {title}
          </Text>
        </>
      )}
    </View>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[styles.touchable, { opacity: isDisabled ? 0.5 : 1 }, style]}
        {...props}
      >
        <LinearGradient
          colors={['#00E5FF', '#5E5CE6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary': return { backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', borderWidth: 1 };
      case 'danger': return { backgroundColor: '#FF2A55', borderColor: '#FF2A55', borderWidth: 1 };
      case 'outline': return { backgroundColor: 'transparent', borderColor: '#2A2A2A', borderWidth: 1 };
      default: return {};
    }
  };

  return (
    <TouchableOpacity
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[styles.touchable, getVariantStyles(), { opacity: isDisabled ? 0.5 : 1 }, style]}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 56,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  textOutline: {
    color: '#FAFAFA',
  },
});
