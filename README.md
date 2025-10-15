# CTF Challenge Platform

A full-stack web application for sharing and solving CTF (Capture The Flag) challenges with a Batman-themed UI.

## Features

- Create and manage CTF competitions
- Add challenges with categories (Crypto, Rev, OSINT, PWN, etc.)
- File upload support (up to 50MB)
- Flag submission system with right/wrong marking
- Color-coded challenge cards by category
- Responsive design with Batman theme

## Tech Stack

- **Frontend**: Next.js 14+, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Database**: MongoDB (Atlas)
- **File Storage**: MongoDB GridFS

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ctf-challenge-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with:
   ```env
   MONGODB_URI=mongodb+srv://kirthisai251_db_user:Reytorio%40_10@cluster0.jflnfhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/             # API routes
│   ├── ctfs/            # CTF pages
│   ├── challenges/      # Challenge pages
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
├── lib/                 # Utility functions
└── models/              # Mongoose models
```

## API Endpoints

### CTFs
- `GET /api/ctfs` - Get all CTFs
- `POST /api/ctfs` - Create a new CTF
- `DELETE /api/ctfs/:id` - Delete a CTF

### Challenges
- `GET /api/challenges?ctfId=:ctfId` - Get all challenges for a CTF
- `GET /api/challenges/:id` - Get a specific challenge
- `POST /api/challenges` - Create a new challenge
- `DELETE /api/challenges/:id` - Delete a challenge

### Flags
- `GET /api/flags?challengeId=:challengeId` - Get all flag submissions for a challenge
- `POST /api/flags` - Submit a new flag
- `PUT /api/flags/:id` - Update flag submission (mark as correct/incorrect)
- `DELETE /api/flags/:id` - Delete a flag submission

### File Handling
- `POST /api/upload` - Upload a file
- `GET /api/download?fileId=:fileId` - Download a file

## Database Schema

### CTF
```javascript
{
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Challenge
```javascript
{
  ctfId: String (reference to CTF),
  title: String,
  description: String,
  category: String (Crypto, Rev, OSINT, PWN, Binary Exploitation, Forensics, Web, Misc),
  fileUrl: String (GridFS file ID),
  createdAt: Date,
  updatedAt: Date
}
```

### FlagSubmission
```javascript
{
  challengeId: String (reference to Challenge),
  userId: String,
  flagText: String,
  note: String,
  isCorrect: Boolean,
  createdAt: Date
}
```

## Deployment

To deploy this application, you can use Vercel, Netlify, or any other platform that supports Next.js deployments.

1. Push your code to a Git repository
2. Connect your repository to your deployment platform
3. Set the environment variables