import { LoaderFunctionArgs } from '@remix-run/node';
import { authenticator } from '~/services/auth.server';

export const loader = ({ request, params }: LoaderFunctionArgs) => {
  const provider = params.provider as string;
  return authenticator.authenticate(provider, request, {
    successRedirect: '/',
    failureRedirect: '/aboba',
  });
};
