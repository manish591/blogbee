import { getAllTags } from '@/app/blogs/dal/get-all-tags';
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
import { AddNewTag } from './add-new-tag';

export default async function BlogDashboardTagsPage({
  params,
}: Readonly<{
  params: Promise<{ blogId: string }>;
}>) {
  const blogId = (await params).blogId;
  const tagData = await getAllTags(blogId);

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
          <div className="pt-8 pb-4">
            <div className="pb-6">
              <h1 className="text-3xl font-semibold">Tags</h1>
              <p className="text-foreground/70 mt-2">
                Your posts Tags listed here
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AddNewTag blogId={blogId} />
            {tagData.map((tag) => (
              <Card
                key={tag._id}
                className="p-4 border rounded-md shadow-none cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{tag.name}</h3>
                  <Badge variant="secondary" className="rounded-md">
                    {tag.posts.length} posts
                  </Badge>
                </div>
                <p className="text-sm text-foreground/70">{tag.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
