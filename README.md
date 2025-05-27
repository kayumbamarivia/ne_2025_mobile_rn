# VaultWise - Personal Finance Tracker

A mobile application for tracking personal finances, built with React Native and Expo.

## Pages

### Authentication
- `/auth/login` - User login page

### Main Navigation (Tabs)
- `/` - Home page with dashboard and summary
- `/expenses` - Expenses list and management
- `/profile` - User profile management

### Expense Management
- `/expense/[id]` - Individual expense details page

## API Endpoints

- `GET /users` - Get user by username
  - Query Parameters:
    - `username: string`
  - Response: Array of users matching the username

### Authentication
- Login is handled through the `/users` endpoint by filtering username and password
- User data is persisted using AsyncStorage with the key `@user`

## Features

### Authentication
- User login with username and password
- Persistent login state using AsyncStorage

### Home Page
- Dashboard view with financial summary
- Recent transactions display
- Quick access to main features

### Expenses
- List of all expenses
- Add new expenses
- Filter expenses by category
- View individual expense details
- Edit expense details
- Delete expenses

### Profile
- View user information
- Edit profile details
- Logout functionality

## Technical Stack
- React Native
- Expo
- AsyncStorage for local data persistence
- Axios for API requests
