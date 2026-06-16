import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { api } from './api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alerts', {
      name: 'Alertes urgentes',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      // Dans une version compilée (EAS Build), on peut forcer le son ici si besoin
      // sound: "incendie.wav" 
    });
  }

  if (!Device.isDevice) {
    console.log('Les notifications Push nécessitent un appareil physique');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Permission refusée pour les notifications');
    return null;
  }

  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      console.warn("Aucun projectId EAS trouvé. Assurez-vous d'avoir exécuté 'eas init' dans le projet Expo.");
      return null;
    }
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log("Push token:", token);
    
    // On envoie le token au backend
    await api.put("/users/me/push_token", { push_token: token });
    return token;
  } catch (e) {
    console.error("Erreur lors de l'enregistrement du token push :", e);
    return null;
  }
}
