import { create } from 'zustand';

type UserRole = 'standard' | 'developer' | 'guest';

interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  avatar?: string;
}

interface UserState {
  user: User;
  isAuthenticated: boolean;
  userRole: UserRole;
  
  // Methods
  setUser: (user: User) => void;
  clearUser: () => void;
  initializeUser: () => void;
}

// Default guest user
const defaultUser: User = {
  id: 'guest',
  name: 'Guest User',
  role: 'guest'
};

// For demo purposes - a developer user to showcase all features
const developerUser: User = {
  id: 'dev-1',
  name: 'Alex Developer',
  role: 'developer',
  email: 'alex@example.com'
};

export const useUserStore = create<UserState>((set, get) => ({
  user: defaultUser,
  isAuthenticated: false,
  userRole: 'guest',
  
  setUser: (user: User) => set({ 
    user,
    isAuthenticated: user.id !== 'guest',
    userRole: user.role
  }),
  
  clearUser: () => set({ 
    user: defaultUser,
    isAuthenticated: false,
    userRole: 'guest'
  }),
  
  initializeUser: () => {
    // In a real app, we would check for an existing session
    // For demo purposes, initialize with a developer user to showcase all features
    set({
      user: developerUser,
      isAuthenticated: true,
      userRole: developerUser.role
    });
  }
}));
