import React, { createContext, useState, useContext, ReactNode } from 'react';

type UserRole = 'member' | 'committee' | 'admin';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  universityId: string;
  permissions?: string[]; // Optional: For committee member permissions
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isCommittee: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Load user from localStorage on initial render
    const savedUser = localStorage.getItem('unicycle_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Mock login - will be replaced with real Solent OAuth2.0
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with real Solent University OAuth2.0 authentication
      // For now, using mock authentication
      
      // Mock user detection based on email
      // In real implementation, this will come from Solent's auth system
      let userData: User;
      
      if (email === 'admin@solent.ac.uk') {
        // Hidden admin login (not shown in UI)
        userData = {
          id: 999,
          name: 'System Administrator',
          email: email,
          role: 'admin',
          universityId: 'S999999'
        };
      } else if (email.includes('committee') || email === 'alex.chen@solent.ac.uk') {
        // Committee member - in real system, role would come from Solent API
        userData = {
          id: 2,
          name: email.includes('committee') ? 'Committee Member' : 'Alex Chen',
          email: email,
          role: 'committee',
          universityId: 'S654321',
          permissions: ['manage_events', 'manage_posts', 'view_analytics'] // Admin sets these
        };
      } else {
        // Regular member
        userData = {
          id: 1,
          name: 'Student Member',
          email: email,
          role: 'member',
          universityId: 'S123456'
        };
      }
      
      setUser(userData);
      localStorage.setItem('unicycle_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('unicycle_user');
  };

  const isCommittee = user?.role === 'committee' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      isCommittee,
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};