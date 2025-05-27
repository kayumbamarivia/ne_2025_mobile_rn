import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { expenseService } from '../../services/expenseService';
import { Expense } from '../../types/expense';
import { useUser } from '../../contexts/UserContext';
import ExpenseFormModal from '../../components/ExpenseFormModal';
import { EXPENSE_CATEGORIES, ExpenseCategory } from '../../utils/constants';

export default function ExpensesScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');

  const fetchExpenses = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const data = await expenseService.getAllExpenses(user.id);
      setExpenses(data);
    } catch (error: any) {
      // Log the error for debugging
      console.error('Failed to fetch expenses:', error);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message ? `Failed to fetch expenses: ${error.message}` : 'Failed to fetch expenses',
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  }, [fetchExpenses]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = () => {
    setIsModalVisible(true);
  };

  const handleExpensePress = (expenseId: string) => {
    router.push(`/expense/${expenseId}`);
  };

  const filteredExpenses =
    selectedCategory === 'all'
      ? expenses
      : expenses.filter((expense) => expense.category === selectedCategory);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f8faf7]">
        <Text className="text-lg text-gray-600">Please log in to view your expenses</Text>
      </View>
    );
  }

  // Extracted empty state message
  const emptyStateMessage =
    selectedCategory === 'all'
      ? 'Tap the + button to add your first expense'
      : `No expenses in ${EXPENSE_CATEGORIES.find((c) => c.id === selectedCategory)?.label} category`;

  return (
    <View className="h-full bg-[#f8faf7]">
      {/* Header */}
      <View className="flex flex-row items-center justify-between bg-[#8cb173] px-6 pb-6 pt-12">
        <View className="flex-row items-center">
          {/* <Ionicons name="ios-list" size={28} color="white" /> */}
          <View className="ml-3">
            <Text className="text-2xl font-bold text-white">My Expenses</Text>
            <Text className="text-white/90">Track your daily expenses</Text>
          </View>
        </View>
        {/* Add Expense Button */}
        <TouchableOpacity
          onPress={handleAddExpense}
          className="h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
          <MaterialIcons name="add" size={24} color="#8cb173" />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View className="bg-white border-b border-gray-200">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="py-3 px-2"
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategory('all')}
            className={`mx-1 rounded-full px-4 py-2 ${selectedCategory === 'all' ? 'bg-[#8cb173]' : 'bg-gray-100'}`}
            style={{ height: 36 }}>
            <Text
              className={`font-medium ${
                selectedCategory === 'all' ? 'text-white' : 'text-gray-600'
              }`}>
              All
            </Text>
          </TouchableOpacity>
          {EXPENSE_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              className={`mx-1 flex-row items-center rounded-full px-4 py-2 ${selectedCategory === category.id ? 'bg-[#8cb173]' : 'bg-gray-100'}`}
              style={{ height: 36 }}>
              {/* <MaterialCommunityIcons
                name={category.icon}
                size={16}
                color={selectedCategory === category.id ? 'white' : '#8cb173'}
                className="mr-2"
              /> */}
              <Text
                className={`font-medium ${
                  selectedCategory === category.id ? 'text-white' : 'text-gray-600'
                }`}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Expenses List */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {loading ? (
          <View className="mt-8 items-center justify-center">
            <Text className="mt-2 text-center text-gray-500">
              {emptyStateMessage}
            </Text>
            <Text className="mt-4 text-center text-lg text-gray-600">No expenses found</Text>
            <Text className="mt-2 text-center text-gray-500">
              {selectedCategory === 'all'
                ? 'Tap the + button to add your first expense'
                : `No expenses in ${EXPENSE_CATEGORIES.find((c) => c.id === selectedCategory)?.label} category`}
            </Text>
            {selectedCategory !== 'all' && (
              <TouchableOpacity
                onPress={() => setSelectedCategory('all')}
                className="mt-4 rounded-full bg-[#e8f0e3] px-6 py-2"
              >
                <Text className="text-[#8cb173] font-medium">View All Expenses</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredExpenses.map((expense) => (
            <TouchableOpacity
              key={expense.id}
              onPress={() => handleExpensePress(expense.id)}
              className="mb-4 rounded-xl bg-white p-5 shadow-sm border border-gray-100">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-[#e8f0e3]">
                    <MaterialCommunityIcons
                      // name={EXPENSE_CATEGORIES.find((c) => c.id === expense.category)?.icon || 'cash'}
                      size={20}
                      color="#8cb173"
                    />
                  </View>
                  <View>
                    <Text className="text-lg font-semibold text-gray-800">{expense.name}</Text>
                    {(() => {
                      const categoryLabel =
                        EXPENSE_CATEGORIES.find((c) => c.id === expense.category)?.label?.toLowerCase() ??
                        expense.category.toLowerCase();
                      return (
                        <Text className="text-sm text-gray-500 capitalize">
                          {categoryLabel}
                        </Text>
                      );
                    })()}
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-lg font-bold text-[#8cb173]">
                    ${Number(expense.amount).toFixed(2)}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Expense Form Modal */}
      <ExpenseFormModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={fetchExpenses}
      />
    </View>
  );
}