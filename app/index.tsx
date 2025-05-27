import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Button from 'components/Button';
import '../global.css'

export default function LandingPage() {
  return (
    <SafeAreaView className="flex-1 bg-teal-50">
      <View className="flex-1 p-6 justify-between">
        <View className="items-center mt-12">
          <Text className="text-5xl font-extrabold text-teal-900 mb-3">VaultWise</Text>
          <Text className="text-xl text-teal-700 text-center font-medium">
            Your Personal Finance Companion
          </Text>
        </View>

        <View className="my-10 space-y-4">
          <View className="p-6 bg-white rounded-2xl shadow-md">
            <Text className="text-2xl font-bold text-teal-900 mb-3">
              Track Expenses
            </Text>
            <Text className="text-base text-teal-600 leading-7">
              Monitor your spending habits and stay within budget
            </Text>
          </View>

          <View className="p-6 bg-white rounded-2xl shadow-md">
            <Text className="text-2xl font-bold text-teal-900 mb-3">
              Smart Analytics
            </Text>
            <Text className="text-base text-teal-600 leading-7">
              Get insights into your financial patterns
            </Text>
          </View>

          <View className="p-6 bg-white rounded-2xl shadow-md">
            <Text className="text-2xl font-bold text-teal-900 mb-3">
              Secure & Private
            </Text>
            <Text className="text-base text-teal-600 leading-7">
              Your data is encrypted and protected
            </Text>
          </View>
        </View>

        <View className="gap-4 mb-6">
          <Button
            title="Get Started"
            onPress={() => {router.replace('/auth/signup')}}
            className="bg-teal-600 rounded-lg py-4"
            textClassName="font-bold text-white text-lg"
          />

          <Button
            title="Login"
            onPress={() => {router.replace('/auth/login')}}
            className="bg-white border border-teal-200 rounded-lg py-4"
            textClassName="font-bold text-teal-700 text-lg"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}