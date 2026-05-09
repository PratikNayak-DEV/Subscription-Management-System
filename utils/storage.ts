import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') window.localStorage.setItem(key, jsonValue);
      return;
    }
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error saving data', e);
  }
};

export const getData = async (key: string) => {
  try {
    let jsonValue = null;
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') jsonValue = window.localStorage.getItem(key);
    } else {
      jsonValue = await AsyncStorage.getItem(key);
    }
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error reading data', e);
  }
};
