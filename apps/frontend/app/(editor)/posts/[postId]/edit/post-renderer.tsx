'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PostEditor } from './postEditor';
import { PostSettingsForm } from '@/app/(editor)/post-settings-form';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CloudCheck, ExternalLink } from 'lucide-react';
import type { PostData } from '@/app/(editor)/dal/get-post-data';

export async function PostRenderer({
  postData,
}: Readonly<{ postData: PostData }>) {
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
            <div className="flex items-center gap-2 text-green-500 mr-4">
              <CloudCheck /> <span>Saved</span>
            </div>
            {/* <div className="flex items-center gap-2 text-foreground/60 mr-4">
            <output
              className="animate-spin inline-block size-4 border-2 border-current border-t-transparent text-foreground/60 rounded-full dark:text-blue-500"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </output>
            <span>Saving..</span>
          </div> */}
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
              Preview
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" className="px-4">
                  Publish
                </Button>
              </SheetTrigger>
              <SheetContent className="gap-0">
                <SheetHeader className="h-28 py-0 flex justify-center">
                  <SheetTitle className="text-xl">Draft Settings</SheetTitle>
                  <SheetDescription>
                    These settings will be published immediately and
                    automatically override your current post configuration.
                  </SheetDescription>
                </SheetHeader>
                <div className="h-[calc(100svh-112px)]">
                  <PostSettingsForm />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main>
        <PostEditor />
      </main>
    </>
  );
}
