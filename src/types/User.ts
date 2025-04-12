export interface User {
  id?: number ;
  firstName: string;
  lastName: string;
  mail: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}
