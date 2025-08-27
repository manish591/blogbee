import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BackButton } from '@/components/back-button';
import { LoginForm } from '@/components/login-form';
import { verifySession } from '../dal/verify-session';

export default async function LoginPage() {
  const session = await verifySession();

  if (session) {
    redirect('/blogs/all');
  }

  return (
    <div className="h-screen grid grid-cols-2">
      <div className="w-full h-full flex justify-center items-center">
        <BackButton className="border absolute top-[30px] left-[30px] px-4 shadow-none cursor-pointer">
          <span>
            <ArrowLeft className="w-4 h-4" />
          </span>{' '}
          Back
        </BackButton>
        <div className="w-full">
          <div className="max-w-sm mx-auto">
            <section className="mb-6">
              <h1 className="text-2xl font-medium">Welcome to Blogbee</h1>
              <p className="text-muted-foreground text-balance">
                Enter your details to access your account
              </p>
            </section>
            <LoginForm />
            <div className="text-center text-sm mt-4">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="underline underline-offset-4 hover:text-primary"
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-2">
        <div className="relative w-full h-full rounded-md bg-black/90">
          <Image
            src="https://res.cloudinary.com/dcugqfvvg/image/upload/v1755607989/krisjanis-kazaks-bRB_9zllVN4-unsplash_fov1wv.jpg"
            alt="auth-placeholder"
            className="rounded-md brightness-50 w-full h-full saturate-0 absolute inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
            width={960}
            height={1080}
            loading="lazy"
          />
          <div className="absolute inset-0 blur-3xl opacity-30 bg-primary/80"></div>
        </div>
      </div>
    </div>
  );
}
