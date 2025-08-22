import { Footer } from '@/app/s/[subdomain]/_components/footer';
import { Header } from '@/app/s/[subdomain]/_components/header';

export default function BlogRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>{children}</main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
