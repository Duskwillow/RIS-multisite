import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: { userId: number; username: string; role: string; siteId_origine: string, reference_id:number, nom_prenom:string } | null;
  isAuthenticated: boolean;
  login: (token: string, user: { userId: number; username: string; role: string; siteId_origine: string, reference_id:number, nom_prenom:string}) => void;
  logout: () => void;
  validateToken: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('jwt_token'),
  user: JSON.parse(localStorage.getItem('user_data') || 'null'),
  isAuthenticated: !!localStorage.getItem('jwt_token') && validateStoredToken(),

  login: (token, user) => {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('token_timestamp', Date.now().toString());
    
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('token_timestamp');
    set({ token: null, user: null, isAuthenticated: false });
  },

  validateToken: () => {
    const token = get().token;
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        get().logout();
        return false;
      }
      return true;
    } catch (error) {
      get().logout();
      return false;
    }
  },
}));

// Helper function to validate stored token on app load
function validateStoredToken(): boolean {
  const token = localStorage.getItem('jwt_token');
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}