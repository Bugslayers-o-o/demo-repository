# MindSathi - Mental Health Community Platform

A full-stack mental health web application built with React (Vite), TypeScript, Tailwind CSS, and FastAPI. Features a community feed similar to Facebook, role-based access control, reactions system, and professional comment functionality.

## 🚀 Features

### User Features
- **Firebase Authentication** - Secure email/password authentication
- **Role-Based Signup** - Users can register as: User, Doctor, Therapist, or Psychiatrist
- **Community Feed** - View and create anonymous posts
- **Reaction System** - React to posts with Support, Relate, or Care
- **Professional Comments** - Only healthcare professionals can comment on posts
- **Real-time Updates** - Firestore integration for live data

### Security
- **Token-Based Auth** - Firebase ID tokens for all API requests
- **Backend Validation** - Role verification on every request
- **Firestore Rules** - Database-level security rules
- **CORS Protection** - Restricted cross-origin requests

## 📋 Tech Stack

### Frontend
- React 19 with Vite
- TypeScript
- Tailwind CSS
- Axios for API calls
- React Router for navigation
- Firebase SDK for authentication and Firestore
- Lucide React for icons

### Backend
- Python FastAPI
- Uvicorn ASGI server
- Firebase Admin SDK
- Pydantic for data validation
- Firestore for database

## 📁 Project Structure

```
mindsathiV2/
├── src/
│   ├── pages/
│   │   ├── LoginPage.tsx          # Login page
│   │   ├── LoginSignupPage.tsx    # Signup page with role selection
│   │   ├── FeedPage.tsx           # Main community feed
│   │   ├── Home.tsx               # Legacy home page
│   │   ├── Therapy.tsx            # Legacy therapy page
│   │   ├── Chat.tsx               # Legacy chat page
│   │   ├── Professionals.tsx      # Legacy professionals page
│   │   └── Wellness.tsx           # Legacy wellness page
│   ├── components/
│   │   ├── Navbar.tsx             # Navigation bar
│   │   ├── CreatePost.tsx         # Post creation component
│   │   ├── PostCard.tsx           # Individual post component
│   │   ├── ReactionBar.tsx        # Reactions UI
│   │   └── CommentSection.tsx     # Comments UI
│   ├── services/
│   │   └── api.ts                 # Axios API client
│   ├── context/
│   │   └── AuthContext.tsx        # Firebase auth context
│   ├── config/
│   │   └── firebase.ts            # Firebase configuration
│   ├── types.ts                   # TypeScript types
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── backend/
│   ├── main.py                    # FastAPI app
│   ├── firebase_config.py         # Firebase setup
│   ├── models.py                  # Pydantic models
│   ├── requirements.txt           # Python dependencies
│   ├── routes/
│   │   ├── posts.py              # Posts endpoints
│   │   ├── reactions.py          # Reactions endpoints
│   │   └── comments.py           # Comments endpoints
│   └── README.md                 # Backend documentation
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── README.md
```

## 🔧 Prerequisites

- Node.js 18+
- Python 3.10+
- Firebase project (create at https://firebase.google.com)
- npm or yarn

## 📦 Installation

### 1. Clone and Setup Frontend

```bash
cd mindsathiV2
npm install
```

### 2. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
4. Enable Firestore:
   - Go to Firestore Database
   - Create database (start in production mode)
   - Update security rules (see below)
5. Get your Firebase config:
   - Go to Project Settings → Your apps → Web app
   - Copy the config object

### 3. Create `.env` file

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
# Frontend Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Gemini API (optional)
GEMINI_API_KEY=your_gemini_key
```

### 4. Setup Backend

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 5. Firebase Admin SDK Setup

1. Download service account key:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `backend/firebase-key.json`

2. Create `.env` in root directory (for backend):
```
FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./backend/firebase-key.json
```

### 6. Setup Firestore Security Rules

Go to Firestore → Rules and replace with:

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Posts collection
    match /posts/{postId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.userId;
    }
    
    // Reactions collection
    match /reactions/{reactionId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.userId;
    }
    
    // Comments collection
    match /comments/{commentId} {
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['doctor', 'therapist', 'psychiatrist'];
      allow read: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.authorId;
    }
  }
}
```

## 🚀 Running the Application

### Terminal 1: Start Frontend

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### Terminal 2: Start Backend

```bash
cd backend

# Activate virtual environment
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

python -m uvicorn main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

## 🧪 Testing

### Create a Test Account

1. Go to `http://localhost:5173/signup`
2. Create an account with:
   - Email: `test@example.com`
   - Password: `password123`
   - Role: Select one (User, Doctor, Therapist, or Psychiatrist)
3. Login with your credentials

### Test Features

**As a User:**
- Create posts anonymously
- React to posts (Support, Relate, Care)
- View all posts and reactions
- Cannot comment (restricted to professionals)

**As a Professional (Doctor/Therapist/Psychiatrist):**
- All user features above
- Comment on posts
- Reply to user concerns
- See your professional badge

## 📡 API Endpoints

### Posts
```
POST   /api/posts              Create post
GET    /api/posts              Get all posts
GET    /api/posts/{id}         Get specific post
```

### Reactions
```
POST   /api/posts/{id}/react   Add/remove reaction
GET    /api/posts/{id}/reactions  Get all reactions
```

### Comments
```
POST   /api/posts/{id}/comment          Add comment (professionals only)
GET    /api/posts/{id}/comments         Get comments
DELETE /api/posts/{id}/comments/{cid}   Delete comment
```

### Auth / Feed / Chat (added)
```
GET    /api/auth/me               Get current user profile (role + alias)
GET    /api/feed                  AI-ranked feed
POST   /api/chat                  Chat with Sathi (chatbot)
GET    /api/users/me/mood         Mood history (last 30)
POST   /api/users/me/mood         Log a daily mood (1-5)
```

All endpoints require Firebase ID token in Authorization header:
```
Authorization: Bearer {firebase_id_token}
```

## 📊 Database Schema

### users
```json
{
  "email": "string",
  "role": "user | doctor | therapist | psychiatrist",
  "createdAt": "timestamp"
}
```

### posts
```json
{
  "id": "string",
  "content": "string",
  "userId": "string",
  "userRole": "string",
  "createdAt": "string (ISO)",
  "reactionCounts": {
    "support": 0,
    "relate": 0,
    "care": 0
  },
  "commentCount": 0
}
```

### reactions
```json
{
  "id": "string",
  "postId": "string",
  "userId": "string",
  "type": "support | relate | care",
  "createdAt": "string (ISO)"
}
```

### comments
```json
{
  "id": "string",
  "postId": "string",
  "content": "string",
  "authorId": "string",
  "authorRole": "string",
  "createdAt": "string (ISO)"
}
```

## 🔒 Security Features

✅ **Frontend:**
- Firebase SDK token refreshing
- Protected routes
- Automatic token inclusion in API calls

✅ **Backend:**
- Token verification on every request
- Role-based access control
- Input validation with Pydantic
- Error handling and logging

✅ **Database:**
- Firestore security rules
- User-level data isolation
- Role verification for comments

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify `.env` values match Firebase Console
- Check internet connection
- Clear browser cache

### Backend Not Running
```bash
# Check Python version
python --version  # Should be 3.10+

# Reinstall dependencies
pip install -r requirements.txt

# Run with detailed output
uvicorn main:app --reload --log-level debug
```

### API Calls Failing
- Check if backend is running on port 8000
- Verify `VITE_API_BASE_URL` in `.env`
- Check browser Network tab for request details
- Ensure Firebase token is being sent

### Comments Not Visible
- Verify your account role in Firebase Console
- Only doctors, therapists, psychiatrists can comment
- Hard refresh the page (Ctrl+F5)

## 📝 Future Enhancements

- [ ] Sentiment analysis for stress detection
- [ ] One-on-one professional consultations
- [ ] Post editing and deletion
- [ ] User profiles and messaging
- [ ] Advanced feed filtering
- [ ] Notification system
- [ ] Mobile app
- [ ] AI chatbot for immediate support

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for mental health awareness**
