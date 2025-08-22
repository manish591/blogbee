import { Footer } from '@/app/s/[subdomain]/_components/footer';
import { Header } from '@/app/s/[subdomain]/_components/header';

export default function BlogRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
