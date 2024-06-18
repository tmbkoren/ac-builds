import { Text, VStack } from '@chakra-ui/react';
import { Link } from '@remix-run/react';

const AboutPage = () => {
  return (
    <VStack as='main'>
      <Text>
        This is an open-source fan-made web application for sharing your Armored
        Core 6 builds and emblems. ac6builds is not affiliated with Bandai Namco
        or FromSoftware.
      </Text>
      <Text>
        The website is completely functional, but I still have some features in
        mind I want to implement. If you have any suggestions or feedback, feel
        free to{' '}
        <Link to={'/contact'}>
          {' '}
          <Text as={'u'}>contact</Text>
        </Link>{' '}
        me.
      </Text>
    </VStack>
  );
};

export default AboutPage;
