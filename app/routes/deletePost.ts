import { ActionFunctionArgs, redirect } from '@remix-run/node';
import { deletePostById } from '~/services/post.server';

export async function action({ request }: ActionFunctionArgs) {
  const { id } = await request.json();
  //console.log('id', id);
  //const id = formData.get('id') as string;
  await deletePostById(id);
  return redirect('/');
}
