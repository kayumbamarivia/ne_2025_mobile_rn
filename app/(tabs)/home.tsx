import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
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
  const [transactions, setTransactions] = useState<Expense[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const data = await expenseService.getAllExpenses(user.id);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      let message = 'Failed to load transactions';
      if (error instanceof Error) {
        message = error.message;
      }
      Toast.show({
        type: 'error',
        text1: 'Loading Error',
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  }, [fetchTransactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Calculate financial summary
  const calculateFinancialSummary = () => {
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return {
        totalSpending: 0,
        currentMonth: 0,
        previousMonth: 0,
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const totalSpending = transactions.reduce((sum, transaction) => {
      const amount = parseFloat(transaction.amount as any);
      return isNaN(amount) ? sum : sum + amount;
    }, 0);

    const currentMonthSpending = transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .reduce((sum, transaction) => {
        const amount = parseFloat(transaction.amount as any);
        return isNaN(amount) ? sum : sum + amount;
      }, 0);

    const previousMonthSpending = transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === previousMonth && 
               transactionDate.getFullYear() === previousMonthYear;
      })
      .reduce((sum, transaction) => {
        const amount = parseFloat(transaction.amount as any);
        return isNaN(amount) ? sum : sum + amount;
      }, 0);

    return {
      totalSpending: totalSpending || 0,
      currentMonth: currentMonthSpending || 0,
      previousMonth: previousMonthSpending || 0,
    };
  };

  const financialSummary = calculateFinancialSummary();

  // Recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Recent activity content
  let recentActivityContent;
  if (loading) {
    recentActivityContent = (
      <View className="items-center justify-center py-8">
        <ActivityIndicator size="large" color="#8cb173" />
        <Text className="mt-2 text-gray-500">Loading transactions...</Text>
      </View>
    );
  } else if (recentTransactions.length === 0) {
    recentActivityContent = (
      <View className="items-center justify-center py-8">
        <MaterialIcons name="receipt" size={48} color="#a0aec0" />
        <Text className="mt-4 text-center text-gray-600">No transactions yet</Text>
        <Text className="mt-2 text-center text-sm text-gray-500">
          Record your first transaction to get started
        </Text>
      </View>
    );
  } else {
    recentActivityContent = recentTransactions.map((transaction) => {
      type IconName = 'restaurant' | 'directions-bus' | 'shopping-cart' | 'payment';
      let iconName: IconName;
      if (transaction.category === 'Food') {
        iconName = 'restaurant';
      } else if (transaction.category === 'Transport') {
        iconName = 'directions-bus';
      } else if (transaction.category === 'Shopping') {
        iconName = 'shopping-cart';
      } else {
        iconName = 'payment';
      }

      return (
        <TouchableOpacity
          key={transaction.id}
          onPress={() => router.push(`/expense/${transaction.id}`)}
          className="mb-4 border-b border-gray-200 pb-4 last:mb-0 last:border-0 last:pb-0">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#e8f0e3]">
                <MaterialIcons 
                  name={iconName}
                  size={18} 
                  color="#8cb173" 
                />
              </View>
              <View>
                <Text className="font-semibold text-gray-800">{transaction.name}</Text>
                <Text className="text-sm text-gray-500 capitalize">{transaction.category.toLowerCase()}</Text>
              </View>
            </View>
            <View className="items-end">
              <Text className="font-semibold text-gray-800">
                ${Number(transaction.amount).toFixed(2)}
              </Text>
              <Text className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f8faf7]">
        <MaterialIcons name="account-circle" size={48} color="#a0aec0" />
        <Text className="mt-4 text-lg text-gray-600">Sign in to access your dashboard</Text>
        <TouchableOpacity 
          onPress={() => router.replace('/auth/login')}
          className="mt-4 rounded-lg bg-[#8cb173] px-6 py-2"
        >
          <Text className="text-white">Sign In</Text>
        </TouchableOpacity>
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
          <Ionicons name="wallet" size={28} color="white" />
          <View className="ml-2">
            <Text className="text-2xl font-bold text-white">Financial Overview</Text>
            <Text className="text-xl text-white/90">Hello, {user.username}!</Text>
          </View>
        </View>
      </View>

      {/* Quick Access */}
      <View className="px-6 py-6">
        <Text className="mb-4 text-lg font-semibold text-gray-800">Quick Access</Text>
        <View className="flex-row flex-wrap gap-4">
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            className="min-w-[150px] flex-1 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-[#e8f0e3]">
              <MaterialIcons name="add" size={24} color="#8cb173" />
            </View>
            <Text className="font-semibold text-gray-800">New Transaction</Text>
            <Text className="text-sm text-gray-500">Add spending or income</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/expenses')}
            className="min-w-[150px] flex-1 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
            <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-[#e8f0e3]">
              <MaterialCommunityIcons name="text-box-search" size={24} color="#8cb173" />
            </View>
            <Text className="font-semibold text-gray-800">Transaction History</Text>
            <Text className="text-sm text-gray-500">View all records</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Spending Summary */}
      <View className="px-6 py-6">
        <Text className="mb-4 text-lg font-semibold text-gray-800">Spending Summary</Text>
        <View className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          {loading ? (
            <View className="items-center justify-center py-8">
              <ActivityIndicator size="large" color="#8cb173" />
            </View>
          ) : (
            <>
              <View className="mb-6">
                <View className="flex-row items-center">
                  <MaterialIcons name="show-chart" size={20} color="#8cb173" />
                  <Text className="ml-2 text-sm text-gray-500">Total Spending</Text>
                </View>
                <Text className="text-3xl font-bold text-gray-800 mt-2">
                  ${Number(financialSummary.totalSpending).toFixed(2)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <View>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="calendar-month" size={18} color="#8cb173" />
                    <Text className="ml-2 text-sm text-gray-500">Current Month</Text>
                  </View>
                  <Text className="text-xl font-semibold text-gray-800 mt-2">
                    ${Number(financialSummary.currentMonth).toFixed(2)}
                  </Text>
                </View>
                <View>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons name="calendar-blank" size={18} color="#8cb173" />
                    <Text className="ml-2 text-sm text-gray-500">Previous Month</Text>
                  </View>
                  <Text className="text-xl font-semibold text-gray-800 mt-2">
                    ${Number(financialSummary.previousMonth).toFixed(2)}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Recent Transactions */}
      <View className="px-6 py-6 pb-10">
        <Text className="mb-4 text-lg font-semibold text-gray-800">Recent Transactions</Text>
        <View className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-4">
            <MaterialIcons name="receipt" size={24} color="#8cb173" />
            <Text className="ml-2 text-gray-600">Your latest activity</Text>
          </View>
          {recentActivityContent}
          {recentTransactions.length > 0 && (
            <TouchableOpacity 
              onPress={() => router.push('/expenses')}
              className="mt-4 flex-row items-center justify-center"
            >
              <Text className="text-[#8cb173] font-medium">View Complete History</Text>
              <MaterialIcons name="chevron-right" size={20} color="#8cb173" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Transaction Form Modal */}
      <ExpenseFormModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false);
          fetchTransactions();
        }}
      />
    </ScrollView>
  );
}