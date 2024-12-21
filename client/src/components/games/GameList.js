import React, { useState, useEffect } from 'react';
import { gameService } from '../../services/gameService';
import './GameList.css';

function GameList() {
  const [games, setGames] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const data = await gameService.getGames();
      console.log('Loaded games:', data);
      setGames(data);
    } catch (err) {
      console.error('Error loading games:', err);
      setError('Failed to load games');
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    console.log('Selected file:', file?.name);
    if (file && file.name.endsWith('.pgn')) {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Please select a valid PGN file');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    console.log('Dropped file:', file?.name);
    if (file && file.name.endsWith('.pgn')) {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Please select a valid PGN file');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.log('No file selected');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      console.log('Starting upload of:', selectedFile.name);
      const result = await gameService.uploadPgn(selectedFile);
      console.log('Upload result:', result);
      await loadGames();
      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (gameId) => {
    try {
      console.log('Deleting game:', gameId);
      await gameService.deleteGame(gameId);
      await loadGames();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete game');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="game-list">
      <div className="game-list-header">
        <h2>My Games</h2>
        <button className="upload-button" onClick={() => setShowUploadModal(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload PGN
        </button>
      </div>

      {error && (
        <div className="error-message" onClick={() => setError('')}>
          {error}
          <button className="close-error">×</button>
        </div>
      )}

      {games.length > 0 ? (
        <table className="games-table">
          <thead>
            <tr>
              <th>Players</th>
              <th>Result</th>
              <th>Opening</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game._id} className="game-row">
                <td>
                  <div className="game-players">
                    <div className="game-player">
                      <span className="player-color white"></span>
                      <span>{game.white}</span>
                    </div>
                    <div className="game-player">
                      <span className="player-color black"></span>
                      <span>{game.black}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`game-result ${game.result.toLowerCase()}`}>
                    {game.result}
                  </span>
                </td>
                <td>
                  <span className="game-opening">{game.opening}</span>
                </td>
                <td>
                  <span className="game-date">{formatDate(game.date)}</span>
                </td>
                <td>
                  <button
                    className="delete-game"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(game._id);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 10h-4V6" />
            <path d="M14 10l7-7" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <h3>No games yet</h3>
          <p>Upload your PGN files to see your games here</p>
        </div>
      )}

      {showUploadModal && (
        <div className="upload-modal" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload PGN</h2>
              <button className="close-modal" onClick={() => setShowUploadModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div
              className={`file-drop-zone ${selectedFile ? 'has-file' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('pgn-file').click()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p>Drag and drop your PGN file here, or click to select</p>
              <input
                type="file"
                id="pgn-file"
                accept=".pgn"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>

            {selectedFile && (
              <div className="selected-file">
                <span>{selectedFile.name}</span>
                <button
                  className="upload-button"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GameList;
