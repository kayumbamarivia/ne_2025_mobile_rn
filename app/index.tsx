import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Button from 'components/Button';
import '../global.css'

export default function LandingPage() {
  return (
    <SafeAreaView className="flex-1 bg-teal-50">
      <View className="flex-1 px-5 justify-between">
        <View className="items-center mt-12 mb-8">
          <Text className="text-4xl font-extrabold text-teal-900 mb-3">VaultWise</Text>
          <Text className="text-lg text-teal-700 text-center font-medium">
            Smart Money Management Made Simple
          </Text>
        </View>

        <View className="mb-8 space-y-4">
          <View className="p-5 bg-white rounded-xl shadow-sm mb-1">
            <Text className="text-xl font-bold text-teal-900 mb-2">
              Spending Tracker
            </Text>
            <Text className="text-sm text-teal-600 leading-6">
              Effortlessly log and categorize every transaction
            </Text>
          </View>

          <View className="p-5 bg-white rounded-xl shadow-sm mb-1">
            <Text className="text-xl font-bold text-teal-900 mb-2">
              Financial Insights
            </Text>
            <Text className="text-sm text-teal-600 leading-6">
              Visual reports to understand your money flow
            </Text>
          </View>

          <View className="p-5 bg-white rounded-xl shadow-sm">
            <Text className="text-xl font-bold text-teal-900 mb-2">
              Bank-Grade Security
            </Text>
            <Text className="text-sm text-teal-600 leading-6">
              Military-grade encryption keeps your data safe
            </Text>
          </View>
        </View>

        <View className="gap-4 mb-8">
          <Button
            title="Get Started"
            onPress={() => {router.replace('/auth/login')}}
            className="bg-teal-600 rounded-lg py-3"
            textClassName="font-bold text-white text-base"
          />

          <Button
            title="Sign In"
            onPress={() => {router.replace('/auth/login')}}
            className="bg-white border border-teal-200 rounded-lg py-3"
            textClassName="font-bold text-teal-700 text-base"
          />
        </View>
      </View>
    </SafeAreaView>
  );
} 