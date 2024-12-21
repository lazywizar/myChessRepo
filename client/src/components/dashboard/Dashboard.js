import React from 'react';
import Navbar from '../nav/Navbar';
import GameList from '../games/GameList';
import './Dashboard.css';

function Dashboard() {
  const username = localStorage.getItem('username');

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {username}!</h1>
          <p>Manage and analyze your chess games</p>
        </div>
        <GameList />
      </div>
    </div>
  );
}

export default Dashboard;
