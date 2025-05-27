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
    } catch (error: unknown) {
      let errorMessage = 'Unknown error';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      console.error('Failed to load expense:', errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Loading Failed',
        text2: 'Could not retrieve expense details',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Confirm Deletion', 
      'This action will permanently remove this expense record. Continue?', 
      [
        {
          text: 'Keep It',
          style: 'cancel',
        },
        {
          text: 'Delete Permanently',
          style: 'destructive',
          onPress: () => { void deleteExpense(); },
        },
      ]
    );
  };

  const deleteExpense = async () => {
    try {
      await expenseService.deleteExpense(id as string);
      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: 'Expense record removed successfully',
      });
      router.back();
    } catch (error) {
      console.error('Failed to delete expense:', error);
      Toast.show({
        type: 'error',
        text1: 'Deletion Failed',
        text2: 'Could not remove expense',
      });
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9F9FF]">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-4 text-gray-600">Loading expense details...</Text>
      </View>
    );
  }

  if (!expense) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9F9FF]">
        <FontAwesome name="exclamation-circle" size={40} color="#6B7280" />
        <Text className="mt-4 text-lg text-gray-600">No expense found</Text>
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="mt-4 rounded-lg bg-primary-dark px-6 py-2"
        >
          <Text className="text-white">Return to Expenses</Text>
        </TouchableOpacity>
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
          <Text className="text-2xl font-bold text-white">Transaction Details</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-6 py-6">
        <View className="space-y-6">
          {/* Amount Card */}
          <View className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Transaction Amount</Text>
            <Text className="text-3xl font-bold text-primary-dark">
              ${expense.amount.toFixed(2)}
            </Text>
          </View>

          {/* Details Card */}
          <View className="rounded-xl bg-white p-6 shadow-sm">
            <Text className="mb-4 text-lg font-semibold text-gray-800">Transaction Information</Text>

            <View className="space-y-4">
              <View>
                <Text className="text-sm text-gray-500">Transaction Name</Text>
                <Text className="text-base text-gray-800">{expense.name}</Text>
              </View>

              <View>
                <Text className="text-sm text-gray-500">Expense Category</Text>
                <Text className="text-base text-gray-800 capitalize">{expense.category}</Text>
              </View>

              <View>
                <Text className="text-sm text-gray-500">Transaction Date</Text>
                <Text className="text-base text-gray-800">
                  {new Date(expense.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>

              <View>
                <Text className="text-sm text-gray-500">Additional Notes</Text>
                <Text className="text-base text-gray-800">
                  {expense.description || 'No additional notes provided'}
                </Text>
              </View>
            </View>
          </View>

          {/* Delete Button */}
          <TouchableOpacity 
            onPress={confirmDelete} 
            className="mt-4 rounded-xl bg-red-500 p-4"
          >
            <View className="flex-row items-center justify-center">
              <FontAwesome name="trash-o" size={20} color="white" />
              <Text className="ml-2 text-center text-lg font-semibold text-white">
                Remove Transaction
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}