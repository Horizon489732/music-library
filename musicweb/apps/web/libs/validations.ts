import z, { email } from 'zod';

export const signUpSchema = z
  .object({
    username: z.string().min(3),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
