import { Link, useLocation } from '@remix-run/react';
import { User } from '~/utils/types';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Hide,
  IconButton,
  List,
  ListItem,
  useColorMode,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import React, { useContext, useRef } from 'react';
import { RiMenuFold4Fill } from 'react-icons/ri';
import { MdDarkMode, MdOutlineWbSunny } from 'react-icons/md';
import UserContext from '~/utils/UserContext';

interface NavbarProps {
  data?: User;
}

interface ProfileLinkProps {
  location: string;
}

const ProfileLink: React.FC<ProfileLinkProps> = ({ location }) => {
  switch (location) {
    case '/profile':
      return <Link to={'/logout'}>Logout</Link>;
    default:
      return <Link to={'/profile'}>Profile</Link>;
  }
};

const Navbar = () => {
  const user = useContext(UserContext);
  const location = useLocation().pathname;
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      as='nav'
      p={3}
      w={'100%'}
      //bg={colorMode === 'light' ? 'gray.500' : 'gray.700'}
      borderBottom={'1px solid'}
      borderColor={colorMode === 'light' ? 'gray.200' : 'blue.900'}
    >
      <List>
        <Flex
          align={'center'}
          direction={'row'}
        >
          <Hide below='lg'>
            <Flex
              gap={30}
              direction={'row'}
            >
              <ListItem>
                <Link to='/'>
                  {location === '/' ? <Text as='ins'>Home</Text> : 'Home'}
                </Link>
              </ListItem>
              <ListItem>
                <Link to='/about'>
                  {location === '/about' ? (
                    <Text as='ins'>About</Text>
                  ) : (
                    'About'
                  )}
                </Link>
              </ListItem>
            </Flex>
          </Hide>
          <Hide above='lg'>
            <DrawerMenu data={user} />
          </Hide>

          {user && location != '/share' && (
            <ListItem
              ml={'auto'}
              p={2}
              borderRadius={5}
              bg={colorMode === 'light' ? 'black' : 'white'}
              color={colorMode === 'light' ? 'white' : 'black'}
            >
              <Link to='/share'>Share an AC/Emblem</Link>
            </ListItem>
          )}

          <ListItem ml={!user || location == '/share' ? 'auto' : 5}>
            {user ? (
              <ProfileLink location={location} />
            ) : (
              <Link to='/login'>
                <Text as={location === '/login' ? 'ins' : 'span'}>Login</Text>
              </Link>
            )}
          </ListItem>
          <ListItem ml={3}>
            <IconButton
              icon={
                colorMode === 'light' ? <MdDarkMode /> : <MdOutlineWbSunny />
              }
              bg={'transparent'}
              aria-label='Toggle Dark Mode'
              onClick={toggleColorMode}
            />
          </ListItem>
        </Flex>
      </List>
    </Box>
  );
};

const DrawerMenu: React.FC<NavbarProps> = ({ data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const user = data;

  return (
    <>
      <IconButton
        // @ts-expect-error code taken from documentation
        ref={btnRef}
        onClick={onOpen}
        colorScheme='teal'
        icon={<RiMenuFold4Fill />}
      />

      <Drawer
        isOpen={isOpen}
        placement='top'
        onClose={onClose}
        // @ts-expect-error code taken from documentation
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Link
              to='/'
              onClick={onClose}
            >
              AC-Builds
            </Link>
          </DrawerHeader>

          <DrawerBody p={5}>
            <List spacing={5}>
              <ListItem>
                <Link
                  to='/'
                  onClick={onClose}
                >
                  Home
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  to='/about'
                  onClick={onClose}
                >
                  About
                </Link>
              </ListItem>
              <ListItem>
                {user ? (
                  <Link
                    to='/profile'
                    onClick={onClose}
                  >
                    Profile
                  </Link>
                ) : (
                  <Link
                    to='/login'
                    onClick={onClose}
                  >
                    Login
                  </Link>
                )}
              </ListItem>
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
