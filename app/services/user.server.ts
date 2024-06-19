import { prisma } from '~/utils/prisma.server';

export async function registerUsername(username: string, email: string) {
  const user = await prisma.user.update({
    where: {
      email,
    },
    data: {
      username,
      onBoarded: true,
    },
  });
  // console.log('prisma user', user);
  return user;
}

export async function getUserByUsername(username: string) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  return user;
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return user;
}

export async function deleteUserByUsername(username: string) {
  const user = await prisma.user.delete({
    where: {
      username,
    },
  });
  return user;
}
