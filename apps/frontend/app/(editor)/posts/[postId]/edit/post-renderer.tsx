'use client';

import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { PostData } from '@/app/(editor)/dal/get-post';
import { PostSettingsForm } from '@/app/(editor)/posts/[postId]/edit/edit-post-form';
import type { BlogData } from '@/app/blogs/dal/get-all-blogs';
import { BackButton } from '@/components/web/back-button';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PostEditIndicator } from './post-edit-indicator';
import { PostEditor } from './postEditor';

export function PostRenderer({
  postData,
  blogData,
}: Readonly<{ postData: PostData; blogData: BlogData }>) {
  const [isSavingPost, setIsSavingPost] = useState<boolean | null>(null);

  return (
    <>
      <header className="bg-background">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <BackButton className="h-8">
              <ArrowLeft />
              Back
            </BackButton>
          </div>
          <div className="flex gap-4">
            <PostEditIndicator isSavingPost={isSavingPost} />
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              asChild
            >
              <Link
                href={`http://${blogData.slug}.localhost:3000/preview/${postData._id}`}
              >
                <ExternalLink className="w-4 h-4" />
                Preview
              </Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                {postData.postStatus === 'draft' ? (
                  <Button size="sm" className="px-4">
                    Publish
                  </Button>
                ) : (
                  <Button size="sm" className="px-4">
                    Update
                  </Button>
                )}
              </SheetTrigger>
              <SheetContent className="gap-0">
                <SheetHeader className="h-28 py-0 flex justify-center">
                  <SheetTitle className="text-xl">Post Settings</SheetTitle>
                  <SheetDescription>
                    Update the post settings here
                  </SheetDescription>
                </SheetHeader>
                <div className="h-[calc(100svh-112px)]">
                  <PostSettingsForm postData={postData} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main>
        <PostEditor
          setIsSavingPost={setIsSavingPost}
          title={postData.title}
          content={postData.content}
          postId={postData._id}
        />
      </main>
    </>
  );
}
