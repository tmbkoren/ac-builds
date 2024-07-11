import { VStack, Text, HStack, IconButton } from '@chakra-ui/react';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import PostCardDisplay from '~/components/PostCardDisplay';
import { authenticator } from '~/services/auth.server';
import { getPosts } from '~/services/post.server';
import { isAdmin } from '~/services/user.server';
import { LoadedPost } from '~/utils/types';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieUser = await authenticator.isAuthenticated(request);
  console.log('cookieUser', cookieUser);
  let admin = false;
  if (cookieUser) {
    admin = await isAdmin(cookieUser?.id);
  }
  console.log('admin', admin);
  if (!admin) {
    return redirect('/');
  }
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '1';
  const { pageCount, posts } = await getPosts(parseInt(page));

  return { pageCount, posts };
};

const AdminPanelPage = () => {
  const { pageCount, posts: loaderPosts } = useLoaderData<typeof loader>();
  const [displayPosts, setDisplayPosts] = useState<LoadedPost[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // converting the string dates to Date objects
    const posts = loaderPosts?.map((post) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    }));
    setDisplayPosts(posts);
  }, [loaderPosts]);
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    setSearchParams(params);
  }, [searchParams, currentPage, setSearchParams]);
  return (
    <VStack>
      <Text>Admin Panel</Text>
      <Text>Page count: {pageCount}</Text>
      {displayPosts && displayPosts.length > 0 ? (
        <>
          {pageCount > 1 && (
            <HStack>
              <IconButton
                isDisabled={currentPage === 1}
                aria-label='Previous page'
                icon={<FaArrowLeft />}
                onClick={() => {
                  setCurrentPage((prev) => {
                    if (prev && prev > 1) {
                      return prev - 1;
                    } else {
                      return 1;
                    }
                  });
                }}
              />
              <Text>{`Page ${currentPage}/${pageCount}`}</Text>
              <IconButton
                isDisabled={currentPage === pageCount}
                aria-label='Next page'
                icon={<FaArrowRight />}
                onClick={() => {
                  setCurrentPage((prev) => {
                    if (prev) {
                      return prev + 1;
                    } else {
                      return 1;
                    }
                  });
                }}
              />
            </HStack>
          )}
          <PostCardDisplay
            posts={displayPosts || []}
            deleteable={true}
          />
          {pageCount > 1 && (
            <HStack>
              <IconButton
                isDisabled={currentPage === 1}
                aria-label='Previous page'
                icon={<FaArrowLeft />}
                onClick={() => {
                  setCurrentPage((prev) => {
                    if (prev && prev > 1) {
                      return prev - 1;
                    } else {
                      return 1;
                    }
                  });
                }}
              />
              <Text>{`Page ${currentPage}/${pageCount}`}</Text>
              <IconButton
                isDisabled={currentPage === pageCount}
                aria-label='Next page'
                icon={<FaArrowRight />}
                onClick={() => {
                  setCurrentPage((prev) => {
                    if (prev) {
                      return prev + 1;
                    } else {
                      return 1;
                    }
                  });
                }}
              />
            </HStack>
          )}
        </>
      ) : (
        <Text
          as={'h1'}
          mt={5}
        >
          No posts found
        </Text>
      )}
    </VStack>
  );
};

export default AdminPanelPage;
