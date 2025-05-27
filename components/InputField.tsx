import { useState } from 'react';
import { TextInput, View, Text, Pressable } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  iconName: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
  error?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  iconName,
  isPassword = false,
  error,
}) => {
  const [secureText, setSecureText] = useState(isPassword);

  return (
    <View className="mb-4">
      <Text className="mb-2 text-text">{label}</Text>
      <View
        className={`flex-row items-center rounded-xl border px-4 py-3 ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-background`}>
        <Feather name={iconName} size={20} color="#6366F1" />
        <TextInput
          className="ml-2 flex-1 text-text"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureText}
          placeholderTextColor="#9CA3AF"
        />
        {isPassword && (
          <Pressable onPress={() => setSecureText(!secureText)}>
            <Ionicons name={secureText ? 'eye-off' : 'eye'} size={20} color="#6366F1" />
          </Pressable>
        )}
      </View>
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};

export default InputField;
