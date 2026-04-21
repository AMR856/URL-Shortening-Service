import toast from 'react-hot-toast';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

interface AuthUser {
  id: number;
  email: string;
}

interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

interface RegisterResponse {
  message: string;
  user: AuthUser;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const loadingToast = toast.loading('Logging in...');

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });


      toast.dismiss(loadingToast);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const result: LoginResponse = await response.json();

      if (result.accessToken) {
        localStorage.setItem('token', result.accessToken);
      }

      if (result.refreshToken) {
        localStorage.setItem('refreshToken', result.refreshToken);
      }

      toast.success('Logged in successfully!');
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      toast.success('Logged out successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Logout failed';
      toast.error(message);
      throw error;
    }
  },

  async register(email: string, password: string): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return await response.json();
    } catch (error: unknown) {
      throw error;
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default authService;
