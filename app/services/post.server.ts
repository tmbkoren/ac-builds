import { prisma } from '~/utils/prisma.server';
import { CreatedPost } from '~/utils/types';
import { isAdmin } from './user.server';

export async function createPost(post: CreatedPost) {
  const {
    type,
    platform,
    title,
    shareCode,
    description,
    images,
    userId,
    tags,
  } = post;
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return new Error('User not found');
  }

  const newPost = await prisma.post.create({
    data: {
      type,
      platform,
      title,
      shareCode,
      description,
      images,
      user: {
        connect: { id: userId },
      },
      tags: { set: tags },
    },
  });

  return newPost;
}

export async function getPosts(
  page: number = 1,
  search: string = '',
  platform: string = 'ALL',
  type: string = 'ALL'
) {
  const pageSize = 40;
  const skip = (page - 1) * pageSize;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma filters are dynamic
  const filters: any = {};

  if (search) {
    filters.OR = [
      {
        title: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        tags: {
          hasSome: [search],
        },
      },
    ];
  }

  if (platform !== 'ALL') {
    const platforms = ['STEAM', 'PLAYSTATION', 'XBOX'];
    if (platforms.includes(platform)) {
      filters.platform = platform;
    }
  }

  if (type !== 'ALL') {
    const types = ['AC', 'EMBLEM'];
    if (types.includes(type)) {
      filters.type = type;
    }
  }

  // console.log('filters', filters);

  let pageCount = await prisma.post.count({
    where: filters,
  });

  pageCount = Math.ceil(pageCount / pageSize);

  const posts = await prisma.post.findMany({
    where: filters,
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
    skip,
    take: pageSize,
  });

  return { pageCount, posts };
}

export async function getPostById(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
  if (!post) {
    return null;
  }
  return {
    ...post,
    username: post.user.username,
  };
}

export async function getPostsByUserId(userId: string) {
  const posts = await prisma.post.findMany({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
  return posts.map((post) => ({
    ...post,
    username: post.user.username,
  }));
}

export async function deletePostById(id: string, userId: string) {
  const admin = await isAdmin(userId);

  if (admin) {
    console.log('admin delete');
    return await prisma.post.delete({
      where: { id },
    });
  }
  console.log('attempting non admin delete,', id, userId);
  return await prisma.post.delete({
    where: { id, userId },
  });
}

export async function deleteAllPosts() {
  await prisma.post.deleteMany({});
}
