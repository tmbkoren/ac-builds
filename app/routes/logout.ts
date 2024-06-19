import { ActionFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';

export const loader = async ({ request }: ActionFunctionArgs) => {
  //console.log('logout.ts');
  return await authenticator.logout(request, { redirectTo: '/' });
};
