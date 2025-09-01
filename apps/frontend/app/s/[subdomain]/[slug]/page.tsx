import Image from 'next/image';
import Link from 'next/link';
import { convertDateToReadableFormat } from '@/lib/date';
import { Layout } from '../components/blog-layout';
import { getBlogBySlug } from '../dal/get-blog-by-slug';
import { getPostBySlug } from '../dal/get-post-by-slug';

export default async function PostPage({
  params,
}: Readonly<{ params: Promise<{ subdomain: string; slug: string }> }>) {
  const subdomain = (await params).subdomain;
  const postSlug = (await params).slug;
  const blogData = await getBlogBySlug(subdomain);
  const postData = await getPostBySlug(subdomain, postSlug);

  return (
    <Layout blogData={blogData}>
      <div className="py-24 max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src="/placeholder.png"
              width={1080}
              height={800}
              alt="Nova Benefits and ICICI Lombard partnership illustration showing handshake with company logos"
              className="w-full h-auto rounded-2xl"
            />
          </div>
          <div>
            <h1 className="text-3xl lg:text-5xl font-bold text-foreground leading-[1.1] capitalize">
              {postData.title}
            </h1>
            <div className="mt-6 flex flex-col gap-1">
              <span className="hidden text-foreground/80 font-medium">
                By Sakshi Maheshwari{' '}
                <span className="text-foreground/70">in</span>{' '}
                <Link href="" className="underline">
                  Interviews
                </Link>
              </span>
              <time className="text-foreground/60">
                {convertDateToReadableFormat(new Date(postData.updatedAt))}
              </time>
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-[260px_minmax(0,1fr)] gap-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Table of contents</h3>
            <ul className="space-y-2 hidden">
              <li>
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-foreground"
                >
                  Inroduction
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-foreground"
                >
                  What is software?
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-foreground/70 hover:text-foreground"
                >
                  Why people fail?
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-xl leading-normal">{postData.content}</div>
        </div>
      </div>
    </Layout>
  );
}
