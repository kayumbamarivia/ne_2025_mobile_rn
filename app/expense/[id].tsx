import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { expenseService } from '../../services/expenseService';
import { Expense } from '../../types/expense';
import Toast from 'react-native-toast-message';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const fetchExpense = async () => {
    try {
      const data = await expenseService.getExpenseById(id as string);
      setExpense(data);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch expense details',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await expenseService.deleteExpense(id as string);
            Toast.show({
              type: 'success',
              text1: 'Success',
              text2: 'Expense deleted successfully',
            });
            router.back();
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Failed to delete expense',
            });
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9F9FF]">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!expense) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9F9FF]">
        <Text className="text-lg text-gray-600">Expense not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9F9FF]">
      {/* Header */}
      <View className="bg-primary-dark px-6 pb-6 pt-12">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <FontAwesome name="arrow-left" size={16} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">Expense Details</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 py-6">
        <View className="space-y-6">
          {/* Amount Card */}
          <View className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Amount</Text>
            <Text className="text-3xl font-bold text-primary-dark">
              ${expense.amount.toFixed(2)}
            </Text>
          </View>

          {/* Details Card */}
          <View className="rounded-xl bg-white p-6 shadow-sm">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Details</Text>

            <View className="space-y-4">
              <View>
                <Text className="text-sm text-gray-500">Name</Text>
                <Text className="text-base text-gray-800">{expense.name}</Text>
              </View>

              <View>
                <Text className="text-sm text-gray-500">Category</Text>
                <Text className="text-base text-gray-800">{expense.category}</Text>
              </View>

              <View>
                <Text className="text-sm text-gray-500">Date</Text>
                <Text className="text-base text-gray-800">
                  {new Date(expense.date).toLocaleDateString()}
                </Text>
              </View>

              <View>
                <Text className="text-sm text-gray-500">Description</Text>
                <Text className="text-base text-gray-800">{expense.description}</Text>
              </View>
            </View>
          </View>

          {/* Delete Button */}
          <TouchableOpacity onPress={handleDelete} className="mt-4 rounded-xl bg-red-500 p-4">
            <View className="flex-row items-center justify-center">
              <FontAwesome name="trash" size={20} color="white" />
              <Text className="ml-2 text-center text-lg font-semibold text-white">
                Delete Expense
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
