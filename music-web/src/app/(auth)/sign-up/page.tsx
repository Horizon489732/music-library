'use client';

import AuthForm from '@/components/AuthForm';
import { signUpSchema } from '@/lib/validation';

export default function Page() {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{ username: '', email: '', password: '', confirmPassword: '' }}
      onSubmit={() => {}}
    />
  );
}
