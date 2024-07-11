import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { deletePostById } from '~/services/post.server';

export async function action({ request }: ActionFunctionArgs) {
  const { id, userId } = await request.json();
  if (userId) {
    await deletePostById(id, userId);
  }
  return redirect('/');
}
