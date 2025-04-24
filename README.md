# Project Structure

## Frontend
The `frontend` folder is for the user-facing application. It contains the following subfolders:
- `pages`: Contains all HTML files.
- `css`: Contains all CSS files.
- `js`: Contains all JavaScript files.
- `images`: Contains all image files.

## Backend
The backend is built using express js

# Project Setup

## Backend Setup

### Prerequisites

- Node.js and npm installed
- MongoDB Atlas account or local MongoDB server

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/ghimire007/PearlJet.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the `backend` directory with the following content:
   ```plaintext
   MONGODB_URI=your_mongodb_uri
   JWT_SEED=your_jwt_secret
   ```

4. **Run the server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3000` and will automatically restart on file changes.

### API Endpoints

- `POST /api/signup` - Register a new user
- `POST /api/login` - Authenticate a user and receive a token
- `GET /api/user` - Retrieve user details (requires authentication)
- `PUT /api/user` - Update user details (requires authentication)

### Notes

- Ensure your MongoDB URI and JWT secret are correctly set in the `.env` file.
- Use a tool like Postman to test the API endpoints.