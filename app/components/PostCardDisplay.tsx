import { Grid } from '@chakra-ui/react';
import PostCard from './PostCard';
import React, { useEffect, useState } from 'react';
import { LoadedPost } from '~/utils/types';

interface PostCardDisplayProps {
  posts: LoadedPost[];
  deleteable: boolean;
}

const PostCardDisplay: React.FC<PostCardDisplayProps> = ({
  posts,
  deleteable,
}) => {
  const [displayPosts, setDisplayPosts] = useState(posts);

  useEffect(() => {
    setDisplayPosts(posts);
  }, [posts]);

  const deletePost = async (id: string) => {
    const newPosts = displayPosts.filter((post) => post.id !== id);
    setDisplayPosts(newPosts);
    await fetch('/deletePost', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  };

  return (
    <Grid
      templateColumns={{
        sm: 'repeat(1, minmax(100px, 1fr))',
        md: 'repeat(3, minmax(200px, 1fr))',
        xl: 'repeat(4, minmax(300px, 1fr))',
      }}
      p={{
        base: 1,
        md: 10,
      }}
      gap={7}
    >
      {displayPosts.map((post) => {
        return (
          <PostCard
            key={post.id}
            post={post}
            deletePost={deletePost}
            deleteable={deleteable}
          />
        );
      })}
    </Grid>
  );
};

export default PostCardDisplay;
