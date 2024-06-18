import { Button, Input, Text, VStack } from '@chakra-ui/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { authenticator } from '~/services/auth.server';
import {
  getUserById,
  getUserByUsername,
  registerUsername,
} from '~/services/user.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const cookieUser = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  });

  if (!cookieUser) {
    return redirect('/login');
  }

  const user = await getUserById(cookieUser.id);
  console.log(user);

  if (user?.onBoarded) {
    //return redirect('/profile');
  } else if (!user) {
    console.log('no user found');
    return redirect('/login');
  }

  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const username = formData.get('username') as string;
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return json(
      { error: 'Username already taken', status: 409 },
      { status: 409 }
    );
  }

  try {
    console.log('registering username', username, user.email);
    await registerUsername(username, user.email);
  } catch (error) {
    console.error(error);
    return json({ error: 'Error creating user', status: 500 }, { status: 500 });
  }
  return redirect('/');
};

export default function RegisterForm() {
  const actionData = useActionData<typeof action>();
  console.log('actionData', actionData);
  return (
    <VStack p={7} my={'auto'}>
      <Form method='post'>
        <VStack
          spacing={4}
          my={'auto'}
        >
          <Text
            as={'h1'}
            fontSize={'xl'}
          >
            Please choose a username
          </Text>
          <Input
            name='username'
            placeholder='Choose a username'
            borderColor={actionData?.error ? 'red.500' : 'gray.200'}
          />
          {actionData?.error && <Text color='red.500'>{actionData.error}</Text>}
          <Button type='submit'>Register</Button>
        </VStack>
      </Form>
    </VStack>
  );
}
