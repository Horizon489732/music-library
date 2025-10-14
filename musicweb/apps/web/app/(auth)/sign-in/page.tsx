'use client';

import AuthForm from '@components/ui/AuthForm';
import { signInSchema } from 'libs/validations';

export default function Page() {
  return (
    <AuthForm
      type="SIGN_IN"
      schema={signInSchema}
      defaultValues={{ email: '', password: '' }}
      onSubmit={() => {}}
    />
  );
}
