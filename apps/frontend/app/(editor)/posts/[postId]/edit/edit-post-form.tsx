'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { type EditPostData, editPost } from '@/app/(editor)/actions/edit-post';
import type { PostData } from '@/app/(editor)/dal/get-post';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  slug: z.string().max(30),
});

export type TPostSettingFormSchema = z.infer<typeof formSchema>;

export function PostSettingsForm({
  postData,
}: Readonly<{ postData: PostData }>) {
  const router = useRouter();

  const form = useForm<TPostSettingFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: postData.slug,
    },
  });

  async function onSubmit(values: TPostSettingFormSchema) {
    try {
      const postdata: EditPostData = {
        slug: values.slug,
        ...(postData.postStatus === 'draft' && { postStatus: 'published' }),
      };
      await editPost(postData._id, postdata);
      router.refresh();
    } catch (err) {
      console.log('EDIT_POST_FAILED: Failed to edit the post', err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <div className="h-[calc(100%-64px)] overflow-auto space-y-6">
          <div className="px-4">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel className="text-sm">Post slug</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="shadow-none"
                      placeholder="Post slug"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="border-t flex items-center justify-end px-4 h-[64px]">
          {postData.postStatus === 'draft' ? (
            <Button size="sm">Publish</Button>
          ) : (
            <Button size="sm">Update</Button>
          )}
        </div>
      </form>
    </Form>
  );
}
