import type { BlogData } from '@/app/blogs/dal/get-all-blogs';
import { Footer } from './footer';
import { Header } from './header';

export function Layout({
  children,
  blogData,
}: Readonly<{ children: React.ReactNode; blogData: BlogData }>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header blogData={blogData} />
      <main>{children}</main>
      <div className="mt-auto">
        <Footer blogData={blogData} />
      </div>
    </div>
  );
}
