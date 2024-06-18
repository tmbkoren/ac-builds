import {
  Card,
  Heading,
  Image,
  VStack,
  Text,
  CardBody,
  HStack,
  Button,
  useClipboard,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import { LoadedPost } from '~/utils/types';
import React, { useContext, useRef } from 'react';
import PostTag from './PostTag';
import UserContext from '~/utils/UserContext';

interface PostCardProps {
  post: LoadedPost;
  deleteable: boolean;
  deletePost: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  deleteable,
  deletePost,
}) => {
  const user = useContext(UserContext);
  console.log('user', user);
  const { onCopy, value } = useClipboard(post.shareCode);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const handleCopy = () => {
    onCopy();
    toast({
      title: `Copied ${value} to clipboard`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDelete = () => {
    deletePost(post.id);
  };

  return (
    <Card
      align={'center'}
      gap={3}
      paddingY={5}
      as={'section'}
    >
      <Heading size={'md'}>{post.title}</Heading>

      <Text>
        Posted by{' '}
        <Link to={`/user/${post.userId}`}>
          <Text
            display={'inline'}
            _hover={{ textDecoration: 'underline' }}
            as={'span'}
          >
            {post.user.username}
          </Text>
        </Link>
      </Text>
      <CardBody
        p={0}
        w={'80%'}
        display={'flex'}
        justifyContent={'center'}
      >
        <Link to={`/post/${post.id}`}>
          <Image
            src={post.images[0]}
            alt={post.title}
          />
        </Link>
      </CardBody>
      <VStack>
        <Text
          onClick={handleCopy}
          _hover={{ textDecor: 'underline', cursor: 'pointer' }}
        >
          Share code: {post.shareCode}
        </Text>
        <Text>Platform: {post.platform}</Text>
        <HStack>
          {post.tags.map((tag) => (
            <PostTag
              key={tag}
              tag={tag}
            />
          ))}
        </HStack>
      </VStack>
      {deleteable && (
        <Button onClick={onOpen}>
          Delete your {post.type == 'AC' ? 'AC' : 'emblem'}
        </Button>
      )}
      {/* {user && (
        <>
          <Button>Like</Button>
          <Button>Dislike</Button>
        </>
      )} */}
      <AlertDialog
        isOpen={isOpen}
        // @ts-expect-error -- code comes from Chakra documentation
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader
              fontSize='lg'
              fontWeight='bold'
            >
              Delete your {post.type == 'AC' ? 'AC' : 'emblem'}?
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                // @ts-expect-error -- code comes from Chakra documentation
                ref={cancelRef}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                colorScheme='red'
                onClick={() => {
                  handleDelete();
                  onClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Card>
  );
};

export default PostCard;
