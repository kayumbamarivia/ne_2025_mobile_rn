// validations/loginSchema.ts
import * as Yup from 'yup';

export const loginSchema = Yup.object({
  username: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
