import {
  HStack,
  Text,
  Link as ChakraLink,
  useColorMode,
} from '@chakra-ui/react';
import { Link } from '@remix-run/react';

const Footer = () => {
  const { colorMode } = useColorMode();
  return (
    <HStack
      as={'footer'}
      position={'fixed'}
      bottom={0}
      p={3}
      w={'100%'}
      justifyContent={'space-between'}
      bg={colorMode === 'light' ? 'gray.100' : 'gray.700'}
    >
      <Text>
        Built by{' '}
        <ChakraLink href='https://github.com/tmbkoren'>
          <Text as={'u'}>@tmbkoren</Text>
        </ChakraLink>
      </Text>
      <ChakraLink
        as={Link}
        to={'/contact'}
        mr={20}
      >
        <Text as={'u'}>Contact/Report a bug</Text>
      </ChakraLink>
    </HStack>
  );
};

export default Footer;
