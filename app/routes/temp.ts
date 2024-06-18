// import { ActionFunctionArgs } from '@remix-run/node';
// import { authenticator } from '~/services/auth.server';
// import { deleteAllPosts } from '~/services/post.server';
// import { deleteUserByUsername } from '~/services/user.server';

// export const action = async ({ request }: ActionFunctionArgs) => {
//   const data = await request.json();
//   console.log('temp action', data);
//   const res = await deleteUserByUsername(data.username);
//   console.log('deleted user', res);
//   await authenticator.logout(request, { redirectTo: '/' });
//   //await deleteAllPosts();
//   return null;
// };
