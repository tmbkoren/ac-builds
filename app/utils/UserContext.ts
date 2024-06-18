import { createContext } from 'react';
import { User } from './types';

const UserContext = createContext<User | undefined>(undefined);

export default UserContext;
