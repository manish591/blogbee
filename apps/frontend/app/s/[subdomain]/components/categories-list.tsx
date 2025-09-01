import Link from 'next/dist/client/link';
import type { CategoriesData } from '@/app/blogs/dal/get-all-categories';

export function CategoriesList({
  categoriesData,
}: Readonly<{ categoriesData: CategoriesData[] }>) {
  return (
    <ul className="space-y-2">
      <li>
        <Link
          href="/"
          className="text-sm text-foreground/70 hover:text-foreground"
        >
          All
        </Link>
      </li>
      {categoriesData.map((category) => {
        return (
          <li key={category._id}>
            <Link
              href={`/categories/${category.name}`}
              className="text-sm text-foreground/70 hover:text-foreground capitalize"
            >
              {category.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
