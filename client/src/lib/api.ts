import { apiRequest } from "./queryClient";

export interface ApiConfession {
  id: string;
  text: string;
  category: string;
  status: string;
  reactions: string;
  createdAt: string;
  displayId: number;
}

export interface ApiStats {
  totalConfessions: number;
  totalReactions: number;
  pendingCount: number;
}

export interface ReactionData {
  love: number;
  laugh: number;
  fire: number;
}

export const api = {
  // Public endpoints
  getConfessions: async (search?: string, category?: string): Promise<ApiConfession[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    
    const url = `/api/confessions${params.toString() ? '?' + params.toString() : ''}`;
    const response = await apiRequest('GET', url);
    return response.json();
  },

  getStats: async (): Promise<ApiStats> => {
    const response = await apiRequest('GET', '/api/confessions/stats');
    return response.json();
  },

  submitConfession: async (data: { text: string; category: string }): Promise<{ message: string; id: string }> => {
    const response = await apiRequest('POST', '/api/confessions', data);
    return response.json();
  },

  updateReactions: async (confessionId: string, reactions: ReactionData): Promise<ApiConfession> => {
    const response = await apiRequest('PATCH', `/api/confessions/${confessionId}/reactions`, { reactions });
    return response.json();
  },

  // Admin endpoints
  adminLogin: async (credentials: { username: string; password: string }): Promise<{ token: string; message: string }> => {
    const response = await apiRequest('POST', '/api/admin/login', credentials);
    return response.json();
  },

  getPendingConfessions: async (token: string): Promise<ApiConfession[]> => {
    const response = await fetch('/api/admin/confessions', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.text()}`);
    }
    
    return response.json();
  },

  approveConfession: async (confessionId: string, token: string): Promise<{ message: string }> => {
    const response = await fetch(`/api/admin/confessions/${confessionId}/approve`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.text()}`);
    }
    
    return response.json();
  },

  deleteConfession: async (confessionId: string, token: string): Promise<{ message: string }> => {
    const response = await fetch(`/api/admin/confessions/${confessionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`${response.status}: ${await response.text()}`);
    }
    
    return response.json();
  },
};
