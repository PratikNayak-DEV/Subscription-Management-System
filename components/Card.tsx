import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <View
      className={`bg-card rounded-2xl p-5 border border-border shadow-sm shadow-black/5 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
