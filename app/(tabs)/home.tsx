import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { useState, useCallback, useEffect } from 'react';
import ExpenseFormModal from '../../components/ExpenseFormModal';
import { expenseService } from '../../services/expenseService';
import { Expense } from '../../types/expense';
import Toast from 'react-native-toast-message';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const data = await expenseService.getAllExpenses(user.id);
      setExpenses(Array.isArray(data) ? data : []);
    } catch (error) {
      let message = 'Failed to fetch expenses';
      if (error instanceof Error) {
        message = error.message;
      }
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: message,
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

  // Calculate financial overview
  const calculateFinancialOverview = () => {
    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const totalExpenses = expenses.reduce((sum, expense) => {
      const amount = parseFloat(expense.amount as any);
      return isNaN(amount) ? sum : sum + amount;
    }, 0);

    const thisMonthExpenses = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      })
      .reduce((sum, expense) => {
        const amount = parseFloat(expense.amount as any);
        return isNaN(amount) ? sum : sum + amount;
      }, 0);

    const lastMonthExpenses = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
      })
      .reduce((sum, expense) => {
        const amount = parseFloat(expense.amount as any);
        return isNaN(amount) ? sum : sum + amount;
      }, 0);

    return {
      total: totalExpenses || 0,
      thisMonth: thisMonthExpenses || 0,
      lastMonth: lastMonthExpenses || 0,
    };
  };

  const financialOverview = calculateFinancialOverview();

  // Recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Extracted recent activity content
  let recentActivityContent;
  if (loading) {
    recentActivityContent = (
      <View className="items-center justify-center py-8">
        <ActivityIndicator size="large" color="#8cb173" />
      </View>
    );
  } else if (recentExpenses.length === 0) {
    recentActivityContent = (
      <View className="items-center justify-center py-8">
        <MaterialIcons name="history" size={48} color="#a0aec0" />
        <Text className="mt-4 text-center text-gray-600">No recent activity</Text>
        <Text className="mt-2 text-center text-sm text-gray-500">
          Your recent transactions will appear here
        </Text>
      </View>
    );
  } else {
    recentActivityContent = recentExpenses.map((expense) => (
      <TouchableOpacity
        key={expense.id}
        onPress={() => router.push(`/expense/${expense.id}`)}
        className="mb-4 border-b border-gray-200 pb-4 last:mb-0 last:border-0 last:pb-0">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#e8f0e3]">
              <MaterialCommunityIcons 
                name={expense.category === 'Food' ? 'food' : 
                      expense.category === 'Transport' ? 'bus' : 
                      expense.category === 'Shopping' ? 'shopping' : 
                      'currency-usd'} 
                size={18} 
                color="#8cb173" 
              />
            </View>
            <View>
              <Text className="font-semibold text-gray-800">{expense.name}</Text>
              <Text className="text-sm text-gray-500 capitalize">{expense.category.toLowerCase()}</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="font-semibold text-gray-800">
              ${Number(expense.amount).toFixed(2)}
            </Text>
            <Text className="text-sm text-gray-500">
              {new Date(expense.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f8faf7]">
        <Text className="text-lg text-gray-600">Please log in to view your dashboard</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-[#f8faf7]"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {/* Header */}
      <View className="bg-[#8cb173] px-6 pb-6 pt-12">
        <View className="flex-row items-center">
          <Ionicons name="leaf" size={28} color="white" />
          <View className="ml-2">
            <Text className="text-2xl font-bold text-white">Welcome back,</Text>
            <Text className="text-xl text-white/90">{user.username}!</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 py-6">
        <Text className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</Text>
        <View className="flex-row flex-wrap gap-4">
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            className="min-w-[150px] flex-1 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-[#e8f0e3]">
              <MaterialIcons name="add-circle-outline" size={24} color="#8cb173" />
            </View>
            <Text className="font-semibold text-gray-800">Add Expense</Text>
            <Text className="text-sm text-gray-500">Record new spending</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/expenses')}
            className="min-w-[150px] flex-1 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-[#e8f0e3]">
              <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#8cb173" />
            </View>
            <Text className="font-semibold text-gray-800">View Expenses</Text>
            <Text className="text-sm text-gray-500">See all transactions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Financial Overview */}
      <View className="px-6 py-6">
        <Text className="mb-4 text-lg font-semibold text-gray-800">Financial Overview</Text>
        <View className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          {loading ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#8cb173" />
            </View>
          ) : (
            <>
              <View className="mb-6">
                <View className="flex-row items-center">
                  <MaterialIcons name="attach-money" size={20} color="#8cb173" />
                  <Text className="ml-2 text-sm text-gray-500">Total Expenses</Text>
                </View>
                <Text className="text-3xl font-bold text-gray-800 mt-2">
                  ${Number(financialOverview.total).toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <View>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="calendar-month" size={18} color="#8cb173" />
                    <Text className="ml-2 text-sm text-gray-500">This Month</Text>
                  </View>
                  <Text className="text-xl font-semibold text-gray-800 mt-2">
                    ${Number(financialOverview.thisMonth).toFixed(2)}
                  </Text>
                </View>
                <View>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="calendar-blank" size={18} color="#8cb173" />
                    <Text className="ml-2 text-sm text-gray-500">Last Month</Text>
                  </View>
                  <Text className="text-xl font-semibold text-gray-800 mt-2">
                    ${Number(financialOverview.lastMonth).toFixed(2)}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Recent Activity */}
      <View className="px-6 py-6 pb-10">
        <Text className="mb-4 text-lg font-semibold text-gray-800">Recent Activity</Text>
        <View className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-4">
            <MaterialIcons name="history" size={24} color="#8cb173" />
            <Text className="ml-2 text-gray-600">Latest transactions</Text>
          </View>
          {recentActivityContent}
          {recentExpenses.length > 0 && (
            <TouchableOpacity 
              onPress={() => router.push('/expenses')}
              className="mt-4 flex-row items-center justify-center"
            >
              <Text className="text-[#8cb173] font-medium">View All Expenses</Text>
              <MaterialIcons name="chevron-right" size={20} color="#8cb173" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Expense Form Modal */}
      <ExpenseFormModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          fetchExpenses();
        }}
      />
    </ScrollView>
  );
}