import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Textarea,
  VStack,
  Image,
  Text,
  Link,
} from '@chakra-ui/react';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, redirect, useActionData } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { authenticator } from '~/services/auth.server';
import { createPost } from '~/services/post.server';
import { getUserById } from '~/services/user.server';
import { getRecaptchaScore } from '~/utils/getRecaptchaScore';
import { CreatedPost } from '~/utils/types';

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieUser = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const user = await getUserById(cookieUser.id);

  if (user?.onBoarded == false) {
    return redirect('/register');
  }
  return user;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const tags = formData.get('tags') as string;
  const token = formData.get('_captcha') as string;
  const key = process.env.RECAPTCHA_SECRET_KEY as string;
  const recaptchaResult = await getRecaptchaScore(token, key);

  if (!recaptchaResult) {
    return new Response('reCAPTCHA verification failed', { status: 400 });
  }
  console.log('recaptchaResult,', recaptchaResult); // result of our recaptcha validation
  const tagsArray = tags.split(',').filter((tag) => tag.trim() !== '');
  if (tagsArray.length < 1) {
    return new Response('Please provide at least one tag', { status: 400 });
  }

  const category = formData.get('category');
  const platform = formData.get('platform');
  const title = formData.get('title');
  const shareCode = formData.get('code');
  const description = formData.get('description');
  const imgUrl = formData.get('image') as string;

  const cookieUser = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const newPost: CreatedPost = {
    type: category as 'AC' | 'EMBLEM',
    platform: platform as 'STEAM' | 'PLAYSTATION' | 'XBOX',
    title: title as string,
    shareCode: shareCode as string,
    description: description as string,
    images: [imgUrl],
    userId: cookieUser.id,
    tags: tagsArray,
  };
  await createPost(newPost);

  return redirect('/');
};

const SharePage = () => {
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imgError, setImgError] = useState<boolean>(false);
  const actionData = useActionData<typeof action>();

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // custom hook from reCaptcha library
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = useCallback(async () => {
    if (!executeRecaptcha) {
      return;
    }

    const token = await executeRecaptcha('yourAction');
    setCaptchaToken(token);
  }, [executeRecaptcha]);

  useEffect(() => {
    handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);

  const handleTagInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ',' || event.key === 'Enter') {
      event.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      setTagInput('');
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUrlChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setImageUrl(event.target.value);
    setImgError(false);
  };

  return (
    <Form method='post'>
      {captchaToken ? (
        <input
          type='hidden'
          name='_captcha'
          value={captchaToken}
        ></input>
      ) : null}
      <FormLabel as='h1'>Category: </FormLabel>
      <RadioGroup
        name='category'
        defaultValue='AC'
      >
        <Stack direction='row'>
          <Radio value='AC'>AC</Radio>
          <Radio value='EMBLEM'>Emblem</Radio>
        </Stack>
      </RadioGroup>

      <FormLabel as='h1'>Platform: </FormLabel>
      <RadioGroup
        name='platform'
        defaultValue='STEAM'
      >
        <Stack direction='row'>
          <Radio value='STEAM'>STEAM</Radio>
          <Radio value='PLAYSTATION'>PLAYSTATION</Radio>
          <Radio value='XBOX'>XBOX</Radio>
        </Stack>
      </RadioGroup>

      <FormControl isRequired={true}>
        <FormLabel as='h1'>Title: </FormLabel>
        <Input
          name='title'
          maxLength={20}
          placeholder='Type the title here, maximum of 20 characters.'
        />
      </FormControl>

      <FormControl isRequired={true}>
        <FormLabel as='h1'>Share code: </FormLabel>
        <Input
          name='code'
          minLength={12}
          maxLength={12}
          placeholder='Type the share code here, exactly 12 characters.'
        />
      </FormControl>

      <FormLabel as='h1'>Description: </FormLabel>
      <Textarea
        name='description'
        resize={'none'}
        maxLength={300}
        placeholder='(Optional) Type the description here, maximum of 300 characters.'
      />

      <FormControl
        id='image'
        mb={4}
        isRequired={true}
      >
        <FormLabel>Image URL</FormLabel>
        <Input
          name='image'
          value={imageUrl}
          onChange={handleImageUrlChange}
          placeholder='Enter image URL'
        />

        <Box mt={4}>
          <Image
            src={imageUrl}
            alt='Image Preview'
            maxW='20%'
            onError={() => setImgError(true)}
          />
        </Box>

        {imgError && (
          <Text>
            Invalid image link. Try to right-click on the image and click
            &quot;Copy image address&quot;.
          </Text>
        )}
        <Text>
          Please use{' '}
          <Link
            href='https://imgur.com/'
            isExternal
            color={'teal.500'}
          >
            Imgur
          </Link>{' '}
          or another image hosting service. Provide a direct URL to the image,
          must end in .png, .jpg, or .jpeg.
        </Text>
      </FormControl>

      <FormControl
        id='tags'
        mb={4}
      >
        <FormLabel>Tags</FormLabel>
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInput}
          placeholder='Type at least one tag and press comma or Enter'
        />
        {actionData && <Text color='red'>{actionData}</Text>}
        <VStack
          align='start'
          mt={2}
        >
          <HStack
            align='start'
            mt={2}
            wrap='wrap'
            spacing={2}
          >
            {tags.map((tag, index) => (
              <Tag key={index}>
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton onClick={() => handleRemoveTag(tag)} />
              </Tag>
            ))}
          </HStack>
        </VStack>
      </FormControl>
      <Button
        type='submit'
        isDisabled={imgError}
        onSubmit={() => handleReCaptchaVerify()}
      >
        Submit
      </Button>
      <input
        type='hidden'
        name='tags'
        value={tags.join(',')}
      />
    </Form>
  );
};

export default SharePage;
