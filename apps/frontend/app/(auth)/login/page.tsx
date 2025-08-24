import { ArrowLeft } from 'lucide-react';
import { redirect } from 'next/navigation';
import { BackButton } from '@/components/back-button';
import { LoginForm } from '@/components/login-form';
import { verifySession } from '@/lib/dal';

export default async function LoginPage() {
  const session = await verifySession();

  if (session) {
    redirect('/blogs/all');
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
      <BackButton className="border absolute top-[5%] left-[3%] px-4 shadow-none cursor-pointer">
        <span>
          <ArrowLeft className="w-4 h-4" />
        </span>{' '}
        Back
      </BackButton>
    </div>
  );
}
