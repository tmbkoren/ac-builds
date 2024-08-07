import { Grid } from '@chakra-ui/react';
import PostCard from './PostCard';
import React, { useContext, useEffect, useState } from 'react';
import { LoadedPost } from '~/utils/types';
import UserContext from '~/utils/UserContext';

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

  const user = useContext(UserContext);
  //console.log('user', user);

  const deletePost = async (id: string) => {
    if (!user) {
      return alert('You must be logged in to delete a post');
    }
    const newPosts = displayPosts.filter((post) => post.id !== id);
    setDisplayPosts(newPosts);
    await fetch('/deletePost', {
      method: 'POST',
      body: JSON.stringify({ id, userId: user.id }),
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
