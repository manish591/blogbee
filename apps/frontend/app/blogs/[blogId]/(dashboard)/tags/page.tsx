import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';

const categories = [
  {
    id: 1,
    name: 'Technology',
    description: 'Latest tech trends and innovations',
    postCount: 12,
    color: 'bg-blue-100 text-blue-800',
  },
  {
    id: 2,
    name: 'Design',
    description: 'UI/UX design principles and inspiration',
    postCount: 8,
    color: 'bg-purple-100 text-purple-800',
  },
  {
    id: 3,
    name: 'Business',
    description: 'Entrepreneurship and business strategies',
    postCount: 15,
    color: 'bg-green-100 text-green-800',
  },
  {
    id: 4,
    name: 'Lifestyle',
    description: 'Personal development and wellness',
    postCount: 6,
    color: 'bg-orange-100 text-orange-800',
  },
  {
    id: 5,
    name: 'Travel',
    description: 'Travel guides and experiences',
    postCount: 4,
    color: 'bg-teal-100 text-teal-800',
  },
  {
    id: 6,
    name: 'Food',
    description: 'Recipes and culinary adventures',
    postCount: 9,
    color: 'bg-red-100 text-red-800',
  },
];

export default async function BlogDashboardTagsPage({
  params,
}: Readonly<{
  params: Promise<{ blogId: string }>;
}>) {
  const blogId = (await params).blogId;

  return (
    <main className="py-3 px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/blogs/${blogId}`}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tags</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-4xl px-16 mx-auto">
        <div>
          <div className="py-8">
            <div className="border-b pb-6">
              <h1 className="text-3xl font-semibold">Tags</h1>
              <p className="text-foreground/70 mt-2">
                Your posts Tags listed here
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-transparent shadow-none border-2 border-dashed h-full hover:border-neutral-400">
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col gap-2 items-center text-foreground/70">
                  <Plus className="w-6 h-6" />
                  New Category
                </div>
              </div>
            </Card>
            {categories.map((category) => (
              <Card
                key={category.id}
                className="p-4 border rounded-md shadow-none cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    {category.name}
                  </h3>
                  <Badge variant="secondary" className="rounded-md">
                    {category.postCount} posts
                  </Badge>
                </div>
                <p className="text-sm text-foreground/70">
                  {category.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
