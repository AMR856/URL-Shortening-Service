import toast from 'react-hot-toast';
import { authService } from './authService';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

export interface UrlPayload {
  id: number;
  url: string;
  shortCode: string;
  clicks: number;
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string | null;
}

const getErrorMessage = async (response: Response, fallback: string) => {
  try {
    const payload = await response.json();
    if (typeof payload?.message === 'string') {
      return payload.message;
    }
  } catch {
    // Ignore non-JSON error responses.
  }

  return fallback;
};

const withAuthHeaders = (): HeadersInit => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const urlService = {
  async createShortUrl(url: string): Promise<UrlPayload> {
    const response = await fetch(`${API_BASE_URL}/shorten`, {
      method: 'POST',
      headers: withAuthHeaders(),
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to create short URL'));
    }

    return response.json();
  },

  async resolveShortUrl(shortCode: string): Promise<UrlPayload> {
    const response = await fetch(`${API_BASE_URL}/shorten/${encodeURIComponent(shortCode)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to fetch URL'));
    }

    return response.json();
  },

  async getStats(shortCode: string): Promise<UrlPayload> {
    const response = await fetch(`${API_BASE_URL}/shorten/${encodeURIComponent(shortCode)}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to fetch URL stats'));
    }

    return response.json();
  },

  async updateShortUrl(shortCode: string, url: string): Promise<UrlPayload> {
    const response = await fetch(`${API_BASE_URL}/shorten/${encodeURIComponent(shortCode)}`, {
      method: 'PUT',
      headers: withAuthHeaders(),
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessage(response, 'Failed to update short URL'));
    }

    return response.json();
  },

  async deleteShortUrl(shortCode: string): Promise<void> {
    const loadingToast = toast.loading('Deleting URL...');

    try {
      const response = await fetch(`${API_BASE_URL}/shorten/${encodeURIComponent(shortCode)}`, {
        method: 'DELETE',
        headers: withAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response, 'Failed to delete short URL'));
      }

      toast.success('Short URL deleted successfully');
    } finally {
      toast.dismiss(loadingToast);
    }
  },
};

export default urlService;
