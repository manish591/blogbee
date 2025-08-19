import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { SignupForm } from '@/components/signup-form';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignupForm />
      </div>
      <Link href="/">
        <Button
          size="sm"
          variant="outline"
          className="border absolute top-[5%] left-[3%] px-4 shadow-none cursor-pointer"
        >
          <span>
            <ArrowLeft className="w-4 h-4" />
          </span>{' '}
          Back
        </Button>
      </Link>
    </div>
  );
}
