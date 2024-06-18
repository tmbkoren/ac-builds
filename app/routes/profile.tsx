import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';
import { getUserById } from '~/services/user.server';
import { redirect } from '@remix-run/node';
import { Box, Button, Divider } from '@chakra-ui/react';
import PostCardDisplay from '~/components/PostCardDisplay';
import { getPostsByUserId } from '~/services/post.server';
import { LoadedPost } from '~/utils/types';

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieUser = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const user = await getUserById(cookieUser.id);

  if (user?.onBoarded == false) {
    return redirect('/register');
  }

  let loadedPosts: LoadedPost[] = [];
  if (user) {
    loadedPosts = await getPostsByUserId(user.id);
  }
  return { user, loadedPosts };
}

export default function Screen() {
  const { user, loadedPosts } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  console.log('user', user);

  const posts: LoadedPost[] = loadedPosts?.map((post) => ({
    ...post,
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
  }));

  if (!user) {
    return <Box>How did you even get here?</Box>;
  }

  const deleteUser = async () => {
    console.log('delete user clicked');
    await fetch('/temp', {
      method: 'POST',
      body: JSON.stringify({ username: user.username }),
    });
    navigate('/');
  };

  return (
    <Box>
      {posts.length > 0 ? (
        <>
          <Button onClick={deleteUser}>Delete User</Button>
          <Divider mt={5} />
          <PostCardDisplay
            posts={posts}
            deleteable={true}
          />
        </>
      ) : (
        <Box>
          <Button onClick={deleteUser}>Delete User</Button>
        </Box>
      )}
    </Box>
  );
}
