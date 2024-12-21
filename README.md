# Chess Manager

A web application to store, analyze, and review chess games from various sources including chess.com, lichess.org, and over-the-board games.

## Features

- Secure login and user authentication
- Upload and manage PGN files
- Analyze and review chess games
- Search and filter games
- Interactive chess board for game review
- Game database with search functionality
- Modern, responsive UI
- Opening repertoire management

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT

## Project Structure

```
chess-manager/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── styles/        # CSS files
│   └── package.json       # Frontend dependencies
│
└── server/                # Backend Node.js application
    ├── src/
    │   ├── config/       # Configuration files
    │   ├── controllers/  # Route controllers
    │   ├── middleware/   # Custom middleware
    │   ├── models/       # Database models
    │   ├── routes/       # Express routes
    │   └── utils/        # Utility functions
    ├── .env              # Environment variables
    └── package.json      # Backend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chess-manager.git
   cd chess-manager
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the server directory with the following content:
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/chess-manager
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

### Running the Application

1. Start the server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the client (in a new terminal):
   ```bash
   cd client
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
