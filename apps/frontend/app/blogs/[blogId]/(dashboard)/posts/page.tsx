import { Edit, Filter, MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const articles = [
  {
    id: 1,
    title: "Let's Understand the Functions In JavaScript",
    author: 'Manish Devrani',
    date: '10 Jun, 2022',
    slug: '/lets-understand-the...',
  },
  {
    id: 2,
    title: 'Styling Native HTML elements [PART 1: Creating custo...',
    author: 'Manish Devrani',
    date: '14 May, 2022',
    slug: '/styling-native-html-...',
  },
  {
    id: 3,
    title: 'Importance of key Props',
    author: 'Manish Devrani',
    date: '14 May, 2022',
    slug: '/importance-of-key-...',
  },
];

export default async function ArticlesPage({
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
            <BreadcrumbPage>Posts</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-4xl px-16 mx-auto">
        <div>
          <div className="py-8">
            <div className="border-b pb-6">
              <h1 className="text-3xl font-semibold">Posts & Drafts</h1>
              <p className="text-foreground/70 mt-2">
                Your posts status will show here
              </p>
            </div>
          </div>
          <div className="">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search articles"
                  className="pl-10 bg-background border-border rounded-md"
                />
              </div>
              <Button
                variant="outline"
                className="rounded-md px-6 bg-transparent"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="ml-auto">
                <PlusCircle />
                New Draft
              </Button>
            </div>
            <div className="bg-card rounded-lg border">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/30">
                <div className="col-span-6 font-medium text-foreground">
                  Title
                </div>
                <div className="col-span-4 font-medium text-foreground">
                  Slug
                </div>
                <div className="col-span-2 font-medium text-foreground text-right">
                  Actions
                </div>
              </div>
              {articles.map((article, index) => (
                <div
                  key={article.id}
                  className={`grid grid-cols-12 gap-4 p-4 ${index !== articles.length - 1 ? 'border-b' : ''}`}
                >
                  <div className="col-span-6">
                    <h3 className="font-medium text-foreground mb-2 hover:text-primary cursor-pointer">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-teal-500 text-white text-xs font-medium">
                          M
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground text-sm">
                        {article.author}
                      </span>
                      <span className="text-muted-foreground text-sm">•</span>
                      <span className="text-muted-foreground text-sm">
                        {article.date}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-4 flex items-center">
                    <span className="text-muted-foreground text-sm">
                      {article.slug}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
