import { Box, Link, Text } from '@chakra-ui/react';

const ContactPage = () => {
  return (
    <Box as='main'>
      <Text>
        If you have a suggestion, feedback or would like to report a bug, please
        open up an issue at
        <Link href='https://github.com/tmbkoren/ac-builds/issues'>
          {' '}
          <Text as='u'>the GitHub repository</Text>
        </Link>
        . I will add more contact options in the future if needed.
      </Text>
    </Box>
  );
};

export default ContactPage;
