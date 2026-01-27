export interface User{
  username: string,
  email: string,
  rol: 'user' | 'admin',
  favorites: string[] | null
};
