import type { LoaderFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';
import { SocialsProvider } from 'remix-auth-socials';
import { Button, VStack } from '@chakra-ui/react';

interface SocialButtonProps {
  provider: SocialsProvider;
  label: string;
}

// eslint-disable-next-line react/prop-types
const SocialButton: React.FC<SocialButtonProps> = ({ provider, label }) => {
  return (
    <Form
      action={`/auth/${provider}`}
      method='post'
    >
      <Button type='submit'>{label}</Button>
    </Form>
  );
};

// First we create our UI with the form doing a POST and the inputs with the
// names we are going to use in the strategy
export default function Screen() {
  return (
    <VStack
      gap={5}
      mt={5}
    >
      <SocialButton
        provider='google'
        label='Login with Google'
      />
      <SocialButton
        provider='discord'
        label='Login with Discord'
      />
      <SocialButton
        provider='github'
        label='Login with Github'
      />
    </VStack>
  );
}

// Finally, we can export a loader function where we check if the user is
// authenticated with `authenticator.isAuthenticated` and redirect to the
// dashboard if it is or return null if it's not
export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/profile',
  });
}
