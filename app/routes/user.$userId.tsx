import { LoadedPost } from '~/utils/types';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import PostCardDisplay from '~/components/PostCardDisplay';
import { getPostsByUserId } from '~/services/post.server';
import { authenticator } from '~/services/auth.server';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = params.userId as string;
  const cookieUser = await authenticator.isAuthenticated(request);
  if (cookieUser?.id == userId) {
    return redirect('/profile');
  }
  console.log('params', params, 'userId', userId);
  const posts = await getPostsByUserId(userId);
  console.log('userId posts', posts);
  return posts;
};

const UserProfilePage = () => {
  const loaderPosts = useLoaderData<LoadedPost[]>();
  console.log('loaderPosts', loaderPosts);
  const posts: LoadedPost[] = loaderPosts?.map((post) => ({
    ...post,
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
  }));
  return (
    <PostCardDisplay
      posts={posts}
      deleteable={false}
    />
  );
};

export default UserProfilePage;
