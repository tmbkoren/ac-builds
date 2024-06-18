import { LoadedPost } from '~/utils/types';
import { LoaderFunctionArgs } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getPostById } from '~/services/post.server';
import {
  Text,
  Image,
  Flex,
  VStack,
  Divider,
  Card,
  Tag,
  HStack,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import { useEffect } from 'react';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const postId = params.postId as string;
  const post = await getPostById(postId);
  return post;
};

const PostPage = () => {
  const loadedPost = useLoaderData<LoadedPost>();
  const { onCopy, value, setValue } = useClipboard('');
  const toast = useToast();

  useEffect(() => {
    if (loadedPost) {
      setValue(loadedPost.shareCode);
    }
  }, [loadedPost, setValue]);

  if (!loadedPost) {
    return (
      <Text>
        This post doesn&apos;t exist.{' '}
        <Text
          as={Link}
          to={'/'}
          textDecor={'underline'}
        >
          Go back to the home page
        </Text>
      </Text>
    );
  }
  const handleCopy = () => {
    onCopy();
    toast({
      title: `Copied ${value} to clipboard`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Flex
      as='article'
      p={5}
      direction={{
        base: 'column',
        xl: 'row',
      }}
      gap={5}
      align={'center'}
    >
      <VStack
        w={{ xl: '60%' }}
        p={2}
        as={'section'}
      >
        <Text fontSize={'3xl'}>{loadedPost.title}</Text>
        <Image
          src={loadedPost.images[0]}
          alt={loadedPost.title}
          maxH={'500'}
        />
        {loadedPost.description && (
          <>
            <Divider my={5} />
            <Text>{loadedPost.description}</Text>
          </>
        )}
      </VStack>
      <Divider
        orientation={'horizontal'}
        hideFrom={'lg'}
      />
      <Card
        p={2}
        align={'center'}
        as={'section'}
        border={'1px solid'}
        borderRadius={'10'}
        m={'auto'}
      >
        <VStack gap={5}>
          <Link to={`/user/${loadedPost.userId}`}>
            <Text _hover={{ textDecoration: 'underline' }}>
              Posted by {loadedPost.user.username}
            </Text>
          </Link>
          <Text
            onClick={handleCopy}
            _hover={{ textDecor: 'underline', cursor: 'pointer' }}
          >
            Share code: {loadedPost.shareCode}
          </Text>
          <Text>Platform: {loadedPost.platform}</Text>
          <HStack>
            <Text>Tags: </Text>
            {loadedPost.tags.map((tag) => (
              <Tag
                key={tag}
                colorScheme={'blue'}
                variant={'solid'}
                p={2}
              >
                {tag}
              </Tag>
            ))}
          </HStack>
        </VStack>
      </Card>
    </Flex>
  );
};

export default PostPage;
