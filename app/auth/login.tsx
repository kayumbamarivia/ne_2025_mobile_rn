/* eslint-disable @typescript-eslint/no-unused-vars */
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from 'utils/loginSchema';
import InputField from 'components/InputField';
import Button from 'components/Button';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { UserResponse, userService } from '../../services/userService';
import { useUser } from '../../contexts/UserContext';
import { useState } from 'react';

const LoginScreen = () => {
  const router = useRouter();
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const user = await userService.login(data.username, data.password);
      
      // Save user data to context (which will also save to AsyncStorage)
      setUser(user as UserResponse);

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: `Welcome back, ${user.firstName}!`,
        position: 'top',
        visibilityTime: 2000,
      });

      router.replace('/home');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error instanceof Error ? error.message : 'Please try again',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-teal-50 px-6 py-8">
      <Text className="mb-8 text-center text-3xl font-extrabold text-teal-900">
        Login to VaultWise
      </Text>

      <View className="space-y-5">
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Email"
              placeholder="Enter your email"
              value={value}
              onChangeText={onChange}
              iconName="mail"
              error={errors.username?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <InputField
              label="Password"
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              iconName="lock"
              isPassword
              error={errors.password?.message}
            />
          )}
        />

        <Button
          title="Log In"
          onPress={handleSubmit(onSubmit)}
          className="bg-teal-600 rounded-lg py-4 shadow-md"
          textClassName="font-bold text-white text-lg"
          loading={isLoading}
          disabled={isLoading}
        />

        <Text className="mt-4 text-center text-base text-teal-700 font-medium">
          New to VaultWise?{' '}
          <Text
            className="font-bold text-teal-900 underline"
            onPress={() => router.replace('/auth/login')}
          >
            Sign Up
          </Text>
        </Text>

        <View className="mt-6 flex-row justify-center gap-4">
          <TouchableOpacity className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-teal-200">
            <FontAwesome name="google" size={24} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-teal-200">
            <FontAwesome name="facebook" size={24} color="#4267B2" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;