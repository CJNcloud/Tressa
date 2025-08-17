import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_URL } from '@/config';

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  logout: () => void;
  updateUserInfo: (username: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.id);
          updateUserInfo(data.username);
          localStorage.setItem('userId', data.id);
        })
        .catch(() => logout());
    }
  }, []);
  const updateUserInfo = (username: string) => {
    setIsLoggedIn(true);
    setUsername(username);
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUsername('');
  };
  return (
    <AuthContext.Provider value={{ isLoggedIn, username, logout , updateUserInfo}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};