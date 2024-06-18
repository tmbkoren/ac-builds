export interface User {
  id: string;
  role: 'USER' | 'ADMIN';
  username: string;
  email: string;
  onBoarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Platform = 'STEAM' | 'PLAYSTATION' | 'XBOX';
export type PostType = 'AC' | 'EMBLEM';

export interface SearchParams {
  platform: 'STEAM' | 'PLAYSTATION' | 'XBOX' | 'ALL';
  type: 'AC' | 'EMBLEM' | 'ALL';
  search: string;
}

export interface CreatedPost {
  type: PostType;
  platform: Platform;
  title: string;
  shareCode: string;
  description: string | null;
  images: string[];
  tags: string[];
  userId: string;
}

export interface Post extends CreatedPost {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoadedPost extends Post {
  user: {
    username: string;
  };
}
