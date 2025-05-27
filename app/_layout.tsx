import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { UserProvider } from '../contexts/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
            headerShown: false,
        }}
      />
      <Toast />
    </SafeAreaProvider>
    </UserProvider>
  );
}
