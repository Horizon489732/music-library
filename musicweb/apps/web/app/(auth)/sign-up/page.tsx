'use client';

import { signUpSchema } from 'libs/validations';
import AuthForm from '@components/ui/AuthForm';

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
