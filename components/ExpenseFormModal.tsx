import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import InputField from './InputField';
import Button from './Button';
import { useState } from 'react';
import { expenseService } from '../services/expenseService';
import { useUser } from '../contexts/UserContext';
import Toast from 'react-native-toast-message';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import { FontAwesome } from '@expo/vector-icons';

// Enhanced validation schema with date validation
const expenseSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  description: Yup.string().default(''),
  category: Yup.string().required('Category is required'),
  date: Yup.date()
    .required('Date is required')
    .max(new Date(), 'Date cannot be in the future')
    .typeError('Please enter a valid date'),
});

type ExpenseFormData = {
  name: string;
  amount: number;
  description: string;
  category: string;
  date: string;
};

type ExpenseFormModalProps = {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
};

export default function ExpenseFormModal({ visible, onClose, onSuccess }: ExpenseFormModalProps) {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: yupResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: '',
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User not authenticated',
      });
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      const expenseData = {
        ...data,
        userId: user.id,
        amount: Number(data.amount),
        date: new Date(data.date).toISOString(),
      };

      await expenseService.createExpense(expenseData);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Expense added successfully',
      });
      
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to add expense:', error);
      
      const errorMessage = error?.message || 'Failed to add expense';
      setApiError(errorMessage);
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="h-[80%] rounded-t-3xl bg-[#F9F9FF] p-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-text">Add New Expense</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-lg text-gray-500">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1">
            {apiError && (
              <Text className="mb-4 text-center text-red-500">{apiError}</Text>
            )}

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <InputField
                  label="Name"
                  placeholder="Enter expense name"
                  value={value}
                  onChangeText={onChange}
                  error={errors.name?.message}
                  iconName="edit"
                />
              )}
            />

            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value } }) => (
                <InputField
                  label="Amount"
                  placeholder="Enter amount"
                  value={value?.toString()}
                  onChangeText={(text) => onChange(text ? parseFloat(text) : 0)}
                  keyboardType="numeric"
                  error={errors.amount?.message}
                  iconName="dollar-sign"
                />
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <InputField
                  label="Description (Optional)"
                  placeholder="Enter description"
                  value={value}
                  onChangeText={onChange}
                  error={errors.description?.message}
                  iconName="file-text"
                />
              )}
            />

            <View className="mb-4">
              <Text className="mb-2 text-text">Category</Text>
              <TouchableOpacity
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                className={`flex-row items-center rounded-xl border px-4 py-3 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                } bg-background`}
              >
                <Controller
                  control={control}
                  name="category"
                  render={({ field: { value } }) => (
                    <>
                      {value ? (
                        <View className="flex-row items-center">
                          <FontAwesome
                            name={
                              EXPENSE_CATEGORIES.find((c) => c.id === value)?.icon ?? 'money'
                            }
                            size={20}
                            color="#6366F1"
                          />
                          <Text className="ml-2 text-text">
                            {EXPENSE_CATEGORIES.find((c) => c.id === value)?.label ?? 'Select Category'}
                          </Text>
                        </View>
                      ) : (
                        <Text className="text-gray-400">Select Category</Text>
                      )}
                    </>
                  )}
                />
              </TouchableOpacity>
              {errors.category && (
                <Text className="mt-1 text-sm text-red-500">{errors.category.message}</Text>
              )}
            </View>

            {showCategoryPicker && (
              <View className="mb-4 rounded-xl border border-gray-300 bg-white p-2">
                {EXPENSE_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => {
                      setValue('category', category.id);
                      setShowCategoryPicker(false);
                    }}
                    className="flex-row items-center rounded-lg px-4 py-3 active:bg-gray-100"
                  >
                    <FontAwesome name={category.icon as any} size={20} color="#6366F1" />
                    <Text className="ml-2 text-text">{category.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, value } }) => (
                <InputField
                  label="Date"
                  placeholder="YYYY-MM-DD"
                  value={value}
                  onChangeText={onChange}
                  error={errors.date?.message}
                  iconName="calendar"
                />
              )}
            />

            <Button
              title="Add Expense"
              onPress={handleSubmit(onSubmit)}
              className="mt-4 rounded-lg bg-[#8cb173] py-4"
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}