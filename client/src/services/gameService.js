const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3005/api';

class GameService {
  async uploadPgn(pgnFile) {
    try {
      console.log('Uploading file:', pgnFile.name);
      
      const formData = new FormData();
      formData.append('pgn', pgnFile);

      const token = localStorage.getItem('token');
      console.log('Using token:', token ? 'Present' : 'Missing');

      const response = await fetch(`${API_URL}/games/upload`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'include',
        body: formData
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // If response is not JSON, log the text
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to upload PGN');
      }

      return response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  async getGames() {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching games with token:', token ? 'Present' : 'Missing');

      const response = await fetch(`${API_URL}/games`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });

      console.log('Get games response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch games');
      }

      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  async deleteGame(gameId) {
    try {
      const token = localStorage.getItem('token');
      console.log('Deleting game with token:', token ? 'Present' : 'Missing');

      const response = await fetch(`${API_URL}/games/${gameId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'include'
      });

      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete game');
      }

      return response.json();
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
}

export const gameService = new GameService();
