import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';
import { BackButton } from '@/components/web/back-button';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="h-16 border-b">
        <div className="border-r border-l max-w-[1080px] mx-auto h-full"></div>
      </div>
      <div className="border-r border-l w-full flex-1 max-w-[1080px] mx-auto">
        <div className="h-full overflow-hidden flex items-center justify-center p-4">
          <div className="mx-auto text-center space-y-8">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-full shadow-md">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Oops! Page not found
                </h1>
                <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
                  The page you're looking for seems to have wandered off into
                  the digital void. Don't worry, it happens to the best of us!
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg">
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  Take me home
                </Link>
              </Button>
              <BackButton>
                <ArrowLeft className="w-5 h-5 mr-2" />
                Go back
              </BackButton>
            </div>
          </div>
        </div>
      </div>
      <div className="h-16 border-t">
        <div className="border-r border-l max-w-[1080px] mx-auto h-full"></div>
      </div>
    </div>
  );
}
