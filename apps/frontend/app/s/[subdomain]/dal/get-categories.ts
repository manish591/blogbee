import { CategoriesData } from "@/app/blogs/dal/get-all-categories";
import { API_URL } from "@/constants";

export async function getCategories(blogSlug: string): Promise<CategoriesData[]> {
  const res = await fetch(`${API_URL}/v1/public/categories?blog=${blogSlug}`, {
    method: 'GET',
  });

  if (!res.ok) {
    throw new Error('CATEGORIES_FETCH_FAILED: Failed to fetch categories data');
  }

  const data = await res.json();
  return data.data;
}