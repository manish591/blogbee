import Image from 'next/image';
import { cn } from '@/lib/utils';

export function PostCard({ isFeatured }: Readonly<{ isFeatured?: boolean }>) {
  return (
    <article
      className={cn(
        'grid grid-cols-[200px_minmax(0,1fr)] gap-6',
        isFeatured && 'grid-cols-1',
      )}
    >
      {!isFeatured && (
        <div className="mb-4">
          <Image
            src="/placeholder.png"
            width={800}
            height={600}
            alt="blog"
            className="aspect-square w-full object-cover rounded-lg"
          />
        </div>
      )}
      <div>
        <div className="mb-1">
          <time
            className={cn(
              'text-foreground/40 font-medium uppercase tracking-wide text-sm',
              isFeatured && 'text-base',
            )}
          >
            JUL 29, 2025
          </time>
        </div>
        <h2
          className={cn(
            'text-2xl font-medium mb-4 flex items-center gap-2',
            isFeatured && 'text-4xl',
          )}
        >
          Work In Progress, Part 12
        </h2>
        {isFeatured && (
          <div className="mb-4">
            <Image
              src="/placeholder.png"
              width={800}
              height={600}
              alt="blog"
              className="w-full object-cover rounded-lg"
            />
          </div>
        )}
        <div>
          <p
            className={cn(
              'text-xl text-foreground/60',
              isFeatured && 'text-foreground/80',
            )}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum nulla
            earum placeat doloremque tenetur, quam nobis. Consequuntur,
            deserunt. Omnis, quis!
          </p>
        </div>
      </div>
    </article>
  );
}
