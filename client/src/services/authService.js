const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/auth';

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
  }

  async handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        this.logout();
      }
      throw new Error(data.message || 'An error occurred');
    }
    return data;
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(credentials)
      });
      
      const data = await this.handleResponse(response);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username || data.user.email);
        headers['Authorization'] = `Bearer ${data.token}`;
      }
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to login');
    }
  }

  async signup(userData) {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      const data = await this.handleResponse(response);
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', userData.username);
        headers['Authorization'] = `Bearer ${data.token}`;
      }
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create account');
    }
  }

  async verifyEmail(token) {
    try {
      const response = await fetch(`${API_URL}/verify-email/${token}`, {
        method: 'GET',
        headers
      });
      return this.handleResponse(response);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to verify email');
    }
  }

  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email })
      });
      return this.handleResponse(response);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to request password reset');
    }
  }

  async resetPassword(token, password) {
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ token, password })
      });
      return this.handleResponse(response);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to reset password');
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    delete headers['Authorization'];
  }

  getCurrentToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    const token = this.getCurrentToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  }

  getAuthHeaders() {
    const token = this.getCurrentToken();
    return token ? { ...headers, 'Authorization': `Bearer ${token}` } : headers;
  }
}

export const authService = new AuthService();
