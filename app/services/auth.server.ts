import { Authenticator } from 'remix-auth';
import { sessionStorage } from '~/services/session.server';
import {
  DiscordStrategy,
  GoogleStrategy,
  GitHubStrategy,
} from 'remix-auth-socials';

import { prisma } from '~/utils/prisma.server';

interface CookieUser {
  id: string;
  email: string;
}

export const authenticator = new Authenticator<CookieUser>(sessionStorage);

let callbackUrl = 'http://localhost:5173/auth/';

if (process.env.NODE_ENV === 'production') {
  callbackUrl = 'https://ac-builds.vercel.app/auth/';
}

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
    callbackURL: callbackUrl + 'google/callback',
  },
  async ({ profile }) => {
    const email = profile.emails[0].value;
    let user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
        },
      });
    }

    return {
      id: user.id,
      email: user.email,
    };
  }
);

const discordStrategy = new DiscordStrategy(
  {
    clientID: process.env.DISCORD_AUTH_CLIENT_ID!,
    clientSecret: process.env.DISCORD_AUTH_CLIENT_SECRET!,
    callbackURL: callbackUrl + 'discord/callback',
    // Provide all the scopes you want as an array
    scope: ['identify', 'email'],
  },
  async ({ profile }) => {
    //console.log('discord profile', profile.__json);
    const email = profile.__json.email as string;
    let user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
        },
      });
    }

    return {
      id: user.id,
      email: user.email,
    };
  }
);

const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_AUTH_CLIENT_ID!,
    clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET!,
    callbackURL: callbackUrl + 'github/callback',
  },
  async ({ profile }) => {
    const email = profile.emails[0].value;
    let user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
        },
      });
    }

    return {
      id: user.id,
      email: user.email,
    };
  }
);

authenticator.use(googleStrategy);
authenticator.use(discordStrategy);
authenticator.use(githubStrategy);
