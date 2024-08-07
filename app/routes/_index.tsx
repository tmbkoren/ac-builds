import { HStack, VStack, Text, IconButton, Divider } from '@chakra-ui/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { LoadedPost, SearchParams } from '~/utils/types';
import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import PostCardDisplay from '~/components/PostCardDisplay';
import { authenticator } from '~/services/auth.server';
import { getPosts } from '~/services/post.server';
import { getUserById } from '~/services/user.server';
import { useEffect, useState } from 'react';
import SearchForm from '~/components/SearchForm';

export const meta: MetaFunction = () => {
  return [
    { title: 'AC6Builds' },
    {
      name: 'description',
      content: 'App for sharing your AC6 builds and emblems',
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  //console.log('loader triggered');
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get('search') || '';
  const platform = url.searchParams.get('platform') || 'ALL';
  const type = url.searchParams.get('type') || 'ALL';
  const page = url.searchParams.get('page') || '1';
  const sortBy = url.searchParams.get('sortBy') || 'Publish Date';
  const sortDirection = url.searchParams.get('sortDirection') || 'ASC';
  const { pageCount, posts } = await getPosts(
    parseInt(page),
    searchQuery,
    platform,
    type,
    sortBy,
    sortDirection
  );
  const cookieUser = await authenticator.isAuthenticated(request);
  let user = null;

  if (cookieUser) {
    user = await getUserById(cookieUser.id);
  } else {
    return { pageCount, posts };
  }

  if (!user?.onBoarded) {
    return redirect('/register');
  }
  //console.log('loader fun posts', posts);
  return { pageCount, posts };
}

export default function Index() {
  const { pageCount, posts: loaderPosts } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayPosts, setDisplayPosts] = useState<LoadedPost[] | null>(null);
  const [searchState, setSearchState] = useState<SearchParams>({
    platform: 'ALL',
    type: 'ALL',
    search: '',
    sortBy: 'Publish Date',
    sortDirection: 'ASC',
  });
  const [currentPage, setCurrentPage] = useState(1);

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
    const paramsSearchText = searchParams.get('search');
    setSearchState((prev) => ({
      ...prev,
      search: paramsSearchText || '',
    }));
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('search', searchState.search);
    params.set('platform', searchState.platform);
    params.set('type', searchState.type);
    params.set('page', currentPage.toString());
    params.set('sortBy', searchState.sortBy);
    params.set('sortDirection', searchState.sortDirection);
    setSearchParams(params);
  }, [searchState, currentPage, setSearchParams]);

  return (
    <VStack
      p={{
        base: 1,
        md: 10,
      }}
    >
      <SearchForm
        searchParams={searchState}
        setSearchParams={setSearchState}
      />
      <Divider mt={3} />
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
            deleteable={false}
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
}
