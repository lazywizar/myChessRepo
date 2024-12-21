const API_URL = process.env.REACT_APP_AUTH_URL || 'http://localhost:3005/api/auth';

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

class AuthService {
  constructor() {
    this.token = localStorage.getItem('token');
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
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

  async login({ email, password, rememberMe = false }) {
    try {
      console.log('Attempting login for:', email);
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe })
      });

      console.log('Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login error response:', errorData);
        throw new Error(errorData.message || 'Failed to login');
      }

      const data = await response.json();
      console.log('Login successful');
      
      localStorage.setItem('token', data.token);
      headers.Authorization = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(userData) {
    try {
      console.log('Attempting registration for:', userData.email);
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      console.log('Registration response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration error response:', errorData);
        throw new Error(errorData.message || 'Failed to register');
      }

      const data = await response.json();
      console.log('Registration successful');
      
      localStorage.setItem('token', data.token);
      headers.Authorization = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
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
      console.error('Verify email error:', error);
      throw error;
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
      console.error('Forgot password error:', error);
      throw error;
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
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async getProfile() {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching profile with token:', token ? 'Present' : 'Missing');

      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          ...headers,
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      console.log('Profile response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Profile error response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      return response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    delete headers.Authorization;
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
