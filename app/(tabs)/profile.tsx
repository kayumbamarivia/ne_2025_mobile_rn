import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { userService } from '../../services/userService';

export default function ProfileScreen() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await userService.logout();
      setUser(null);
      Toast.show({
        type: 'success',
        text1: 'Signed Out',
        text2: 'Your session has been securely ended',
      });
      router.replace('/auth/login');
    } catch (error) {
      console.error('Sign out failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Sign Out Failed',
        text2: 'Could not end your session. Please try again.',
      });
    }
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9F9FF]">
        <FontAwesome name="user-circle" size={40} color="#6B7280" />
        <Text className="mt-4 text-lg text-gray-600">Please sign in to access your profile</Text>
        <TouchableOpacity 
          onPress={() => router.replace('/auth/login')}
          className="mt-4 rounded-lg bg-primary-dark px-6 py-2"
        >
          <Text className="text-white">Go to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#F9F9FF]">
      {/* Header Section */}
      <View className="bg-[#8cb173] px-6 pb-6 pt-12">
        <Text className="text-2xl font-bold text-white">My Account</Text>
        <Text className="text-white/80">Manage your personal settings</Text>
      </View>

      {/* Profile Content */}
      <View className="px-6 py-6">
        {/* Profile Identity */}
        <View className="items-center">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-primary-light">
            <FontAwesome name="user-circle" size={40} color="#4F46E5" />
          </View>
          <Text className="mt-2 text-lg font-medium text-gray-800">{user.username}</Text>
        </View>

        {/* Personal Information Section */}
        <View className="mt-8 space-y-6">
          <View className="rounded-xl bg-white p-6 shadow-sm">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Personal Information</Text>
            <View className="space-y-4">
              <View>
                <Text className="text-sm text-gray-500">Registered Email</Text>
                <Text className="text-base text-gray-800">{user.username}</Text>
              </View>
              {/* Add more personal info fields here if available */}
            </View>
          </View>

          {/* Preferences Section */}
          <View className="rounded-xl bg-white p-6 shadow-sm">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Preferences</Text>

            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <FontAwesome name="bell" size={20} color="#4F46E5" />
                <Text className="ml-3 text-gray-800">Notification Settings</Text>
              </View>
              <FontAwesome name="angle-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View className="border-b border-gray-100 my-2"></View>

            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <FontAwesome name="shield" size={20} color="#4F46E5" />
                <Text className="ml-3 text-gray-800">Security & Privacy</Text>
              </View>
              <FontAwesome name="angle-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View className="border-b border-gray-100 my-2"></View>

            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <FontAwesome name="life-ring" size={20} color="#4F46E5" />
                <Text className="ml-3 text-gray-800">Help Center</Text>
              </View>
              <FontAwesome name="angle-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Account Actions Section */}
          <TouchableOpacity 
            onPress={handleSignOut} 
            className="mt-6 rounded-xl bg-red-500 p-4"
          >
            <View className="flex-row items-center justify-center">
              <FontAwesome name="sign-out" size={20} color="white" />
              <Text className="ml-2 text-center text-lg font-semibold text-white">
                Sign Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}