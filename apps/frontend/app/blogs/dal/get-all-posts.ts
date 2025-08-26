import 'server-only';

export type PostData = {
  _id: string;
  title: string;
  subTitle?: string;
  slug?: string;
};

export async function getAllPosts() {
  return [];
}
