import { Edit, FileText } from 'lucide-react';
import Link from 'next/link';
import type { PostData } from '@/app/blogs/dal/get-all-posts';
import { Button } from '@/components/ui/button';
import { convertDateToReadableFormat } from '@/lib/date';
import { PostsOptionsDropdown } from './post-options-dropdown';
import { RestorePostButton } from './restore-post-button';

export function PostsGrid({ postData }: Readonly<{ postData: PostData[] }>) {
  return (
    <>
      {postData.length < 1 ? (
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
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/30">
            <div className="col-span-6 font-medium text-foreground">Title</div>
            <div className="col-span-4 font-medium text-foreground">Slug</div>
            <div className="col-span-2 font-medium text-foreground text-right">
              Actions
            </div>
          </div>
          {postData.map((post, index) => (
            <div
              key={post._id}
              className={`grid grid-cols-12 gap-4 p-4 ${index !== postData.length - 1 ? 'border-b' : ''}`}
            >
              <div className="col-span-6">
                <h3 className="font-medium text-foreground mb-2 hover:text-primary cursor-pointer">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-foreground/60 text-sm">Updated On</span>
                  <span className="text-foreground/60 text-sm">•</span>
                  <span className="text-foreground/60 text-sm">
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
                {(post.postStatus === 0 || post.postStatus === 1) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 cursor-pointer"
                    asChild
                  >
                    <Link href={`/posts/${post._id}/edit`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
                {post.postStatus === 2 ? (
                  <RestorePostButton postId={post._id} />
                ) : (
                  <PostsOptionsDropdown postId={post._id} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
