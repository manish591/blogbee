'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  slug: z.string().optional(),
  subTitle: z.string().optional(),
});

export type TPostSettingFormSchema = z.infer<typeof formSchema>;

export function PostSettingsForm() {
  const form = useForm<TPostSettingFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slug: '',
      subTitle: '',
    },
  });

  function onSubmit(values: TPostSettingFormSchema) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
        <div className="h-[calc(100%-48px)] overflow-auto space-y-6">
          <div className="px-4 grid gap-3">
            <p className="font-medium text-sm">Cover Image</p>
            <div className="flex flex-col items-center rounded-md p-2 py-4 border-dashed border-2">
              <div className="text-center">
                <p className="text-base font-medium text-gray-700 mb-1">
                  Drop your post cover image here
                </p>
                <p className="text-sm text-gray-500">
                  Recommended size 500x500px
                </p>
              </div>
            </div>
          </div>
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
          <div className="px-4">
            <FormField
              control={form.control}
              name="subTitle"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel className="text-sm">Subtitle</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="shadow-none"
                      placeholder="Subtitle"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="h-12 border-t flex items-center justify-end px-4">
          <Button className="h-7 text-[0.8rem]">Publish</Button>
        </div>
      </form>
    </Form>
  );
}
