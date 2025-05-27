import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { userService } from '../../services/userService';

export default function ProfileScreen() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await userService.logout();
      setUser(null);
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'You have been successfully logged out',
      });
      router.replace('/auth/login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to logout. Please try again.',
      });
    }
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9F9FF]">
        <Text className="text-lg text-gray-600">Please log in to view your profile</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#F9F9FF]">
      {/* Header */}
      <View className="bg-primary-dark px-6 pb-6 pt-12">
        <Text className="text-2xl font-bold text-white">Profile</Text>
        <Text className="text-white/80">Manage your account</Text>
      </View>

      {/* Profile Content */}
      <View className="px-6 py-6">
        {/* Profile Picture */}
        <View className="items-center">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-primary-light">
            <FontAwesome name="user" size={40} color="#4F46E5" />
          </View>
          <Text className="mt-4 text-xl font-bold text-gray-800">
            {user.firstName} {user.lastName}
          </Text>
          <Text className="text-gray-500">{user.username}</Text>
        </View>

        {/* User Details */}
        <View className=" mt-8 space-y-6">
          <View className="rounded-xl bg-white p-6 shadow-sm">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Account Details</Text>

            <View className="space-y-4">
              <View>
                <Text className="text-sm text-gray-500">First Name</Text>
                <Text className="text-base text-gray-800">{user.firstName}</Text>
              </View>

              <View>
                <Text className="text-sm text-gray-500">Last Name</Text>
                <Text className="text-base text-gray-800">{user.lastName}</Text>
              </View>

              <View>
                <Text className="text-sm text-gray-500">Email</Text>
                <Text className="text-base text-gray-800">{user.username}</Text>
              </View>
            </View>
          </View>

          {/* App Settings */}
          <View className="mt-4 rounded-xl bg-white p-6 shadow-sm">
            <Text className="mb-4 text-lg font-semibold text-gray-800">App Settings</Text>

            <TouchableOpacity className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <FontAwesome name="bell" size={20} color="#4F46E5" />
                <Text className="ml-3 text-gray-800">Notifications</Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <FontAwesome name="lock" size={20} color="#4F46E5" />
                <Text className="ml-3 text-gray-800">Privacy</Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <FontAwesome name="question-circle" size={20} color="#4F46E5" />
                <Text className="ml-3 text-gray-800">Help & Support</Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity onPress={handleLogout} className="mt-4 rounded-xl bg-red-500 p-4">
            <View className="flex-row items-center justify-center">
              <FontAwesome name="sign-out" size={20} color="white" />
              <Text className="ml-2 text-center text-lg font-semibold text-white">Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
