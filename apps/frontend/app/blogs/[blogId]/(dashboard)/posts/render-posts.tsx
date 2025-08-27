import { FileText, Edit, MoreHorizontal } from 'lucide-react';
import { getAllPosts } from '@/app/blogs/dal/get-all-posts';
import { Button } from '@/components/ui/button';
import { convertDateToReadableFormat } from '@/lib/date';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AddNewPostButton } from './add-new-post-button';

export async function RenderPosts({
  blogId,
  query,
}: Readonly<{ blogId: string; query: string }>) {
  const postData = await getAllPosts(blogId, {
    query,
  });

  return (
    <>
      {postData.items.length < 1 ? (
        <div className="flex py-10 justify-center p-8">
          <div className="border-0 w-full max-w-md shadow-none">
            <div className="flex flex-col items-center text-center p-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Posts not found</h2>
              <p className="text-foreground/70 mb-6 leading-[1.5] max-w-[70%] mx-auto">
                You haven't created any blog posts yet. Create your first site
                below.
              </p>
              <span className="loading loading-ring loading-md"></span>
              <AddNewPostButton blogId={blogId}>
                Create First Draft Post
              </AddNewPostButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg border">
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/30">
            <div className="col-span-6 font-medium text-foreground">Title</div>
            <div className="col-span-4 font-medium text-foreground">Slug</div>
            <div className="col-span-2 font-medium text-foreground text-right">
              Actions
            </div>
          </div>
          {postData.items.map((post, index) => (
            <div
              key={post._id}
              className={`grid grid-cols-12 gap-4 p-4 ${index !== postData.items.length - 1 ? 'border-b' : ''}`}
            >
              <div className="col-span-6">
                <h3 className="font-medium text-foreground mb-2 hover:text-primary cursor-pointer">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-teal-500 text-white text-xs font-medium">
                      M
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground text-sm">
                    Manish Devrani
                  </span>
                  <span className="text-muted-foreground text-sm">•</span>
                  <span className="text-muted-foreground text-sm">
                    {convertDateToReadableFormat(new Date(post.updatedAt))}
                  </span>
                </div>
              </div>
              <div className="col-span-4 flex items-center">
                <span className="text-muted-foreground text-sm">
                  {post.slug}
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
      )}
    </>
  );
}
