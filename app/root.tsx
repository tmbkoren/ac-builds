import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from '@remix-run/react';
import { withEmotionCache } from '@emotion/react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

import type {
  MetaFunction,
  LinksFunction,
  LoaderFunctionArgs,
} from '@remix-run/node';
import { authenticator } from './services/auth.server';
import Navbar from './components/Navbar';
import { ServerStyleContext, ClientStyleContext } from './context';
import { useContext, useEffect } from 'react';
import UserContext from './utils/UserContext';
import Footer from './components/Footer';

export const meta: MetaFunction = () => {
  return [
    { title: 'AC6Builds' },
    {
      property: 'og:title',
      content: 'AC6Builds',
    },
    {
      name: 'description',
      content: 'App for sharing your AC6 builds and emblems',
    },
    //{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ];
};

export const links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  const recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY as string;
  return { user, recaptchaSiteKey };
}

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- code is copied from chakra docs
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps -- need to run once
    }, []);

    return (
      <html lang='en'>
        <head>
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1'
          />
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }
);

export default function App() {
  //@ts-expect-error -- everything works as intended
  const { user, recaptchaSiteKey } = useRouteLoaderData<typeof loader>('root');

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaSiteKey}
      scriptProps={{
        async: false,
        defer: true,
        appendTo: 'head',
        nonce: undefined,
      }}
    >
      <Document>
        <ChakraProvider>
          <UserContext.Provider value={user}>
            <Navbar />
            <Box
              p={3}
              as='main'
            >
              <Outlet />
            </Box>
            <Footer />
          </UserContext.Provider>
        </ChakraProvider>
      </Document>
    </GoogleReCaptchaProvider>
  );
}
