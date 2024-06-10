import { Image, StyleSheet, Platform, TextInput } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import messaging from "@react-native-firebase/messaging";
import { useEffect, useState } from 'react';

const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  }
};

export default function HomeScreen() {
  const [token, setToken] = useState('');
  const [remoteMessage, setRemoteMessage] = useState({
    title: '',
    body: ''
  });
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (message) => {
      setRemoteMessage({
        title: message.notification?.title || '',
        body: message.notification?.body || ''
      })
      console.log("Received a push notification:", message);
      // Handle the incoming push notification
      // For example, display a local notification
    });
    requestUserPermission()
    messaging()
    .getToken()
    .then(
      token => setToken(token)
    );

    return unsubscribe;
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.stepContainer}>
        <ThemedText
          style={{
            color: '#ff474c'
          }}
        >
          Message from the server{' '}
          { remoteMessage.title }
          { remoteMessage.body }
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Token:</ThemedText>
        
        <TextInput
          value={token}
          multiline
          style={{
            color: '#ff474c',
          }}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
