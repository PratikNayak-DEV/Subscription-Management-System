import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return null;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export async function scheduleRenewalReminder(subName: string, daysBefore: number, date: Date) {
  const triggerDate = new Date(date);
  triggerDate.setDate(triggerDate.getDate() - daysBefore);

  if (triggerDate > new Date()) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Subscription Renewal 📅',
        body: `Your ${subName} subscription will renew in ${daysBefore} days.`,
      },
      trigger: triggerDate,
    });
  }
}
