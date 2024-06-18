import { Tag } from '@chakra-ui/react';
import { Link } from '@remix-run/react';
import React from 'react';

interface PostTagProps {
  tag: string;
}

const PostTag: React.FC<PostTagProps> = ({ tag }) => {
  return (
    <Link to={`/?search=${tag}`}>
      <Tag>{tag}</Tag>
    </Link>
  );
};

export default PostTag;
