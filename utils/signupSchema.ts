// validations/signupSchema.ts
import * as Yup from 'yup';

export const signupSchema = Yup.object({
  firstName: Yup.string()
    .min(4, 'First name must be at least 4 characters')
    .required('First name is required'),

  lastName: Yup.string()
    .min(4, 'Last name must be at least 4 characters')
    .required('Last name is required'),

  username: Yup.string().email('Invalid email format').required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
