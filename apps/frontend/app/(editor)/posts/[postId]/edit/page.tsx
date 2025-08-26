import { ArrowLeft, CloudCheck, ExternalLink } from 'lucide-react';
import { PostSettingsForm } from '@/app/(editor)/post-settings-form';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function DraftPostEditor() {
  return (
    <div className="min-h-screen">
      <header className="bg-background">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button size="sm" variant="outline" className="text-[0.8rem] h-7">
              <ArrowLeft />
              Back
            </Button>
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
            <Button variant="outline" className="h-7">
              <ExternalLink className="w-4 h-4" />
              Preview
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="px-4 h-7">Publish</Button>
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
        <div className="max-w-3xl mx-auto px-6 py-8">
          <textarea
            placeholder="Article Title..."
            rows={1}
            maxLength={150}
            className="resize-none font-semibold text-4xl w-full overflow-hidden mb-8 outline-none border-none focus:outline-none"
          ></textarea>
          <div
            className="text-gray-400 text-lg outline-none border-none focus:outline-none"
            contentEditable
            suppressContentEditableWarning={true}
          >
            {'Type "/" for commands...'}
          </div>
        </div>
      </main>
    </div>
  );
}
