import { API_CONFIG } from './api/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'types/user';
import axios from 'axios';

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  createdAt: string;
}

interface StoredUser extends UserResponse {
  password: string;
}

class UserService {
  private baseUrl: string;
  private readonly USER_KEY = '@user';
  private api;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: API_CONFIG.HEADERS,
    });
  }

  async register(userData: UserRegistrationData): Promise<User> {
    try {
      const { data } = await this.api.post('/users', userData);
      const { password, ...userWithoutPassword } = data;
      await this.saveUser(userWithoutPassword);
      return userWithoutPassword;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<User> {
    try {
      const { data: users } = await this.api.get('/users', {
        params: { username }
      });
      
      const user = users[0] as StoredUser;

      if (!user) {
        throw new Error('User not found');
      }

      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      const { password: _, ...userWithoutPassword } = user;
      await this.saveUser(userWithoutPassword);
      return userWithoutPassword;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(this.USER_KEY);
  }

  private async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}

export const userService = new UserService();
