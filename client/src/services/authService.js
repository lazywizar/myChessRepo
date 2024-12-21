const API_URL = 'http://localhost:3000/api/auth';

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

export const authService = {
  async login(credentials) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to login');
    }
    
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      headers.Authorization = `Bearer ${data.token}`;
    }
    return data;
  },

  async signup(credentials) {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create account');
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      headers.Authorization = `Bearer ${data.token}`;
    }
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    delete headers.Authorization;
  },

  getCurrentToken() {
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return token;
  },

  isAuthenticated() {
    return !!this.getCurrentToken();
  },

  getAuthHeaders() {
    const token = this.getCurrentToken();
    return {
      ...headers,
      Authorization: token ? `Bearer ${token}` : undefined
    };
  }
};
