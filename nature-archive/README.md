# Nature Archive

A mobile app for discovering and archiving nature. Take photos of plants, animals, and insects, get AI-powered identification suggestions, and build your personal collection of discoveries.

## Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Navigation**: Expo Router (file-based routing)

## Project Structure

```
nature-archive/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   ├── (main)/            # Main app (tabs)
│   └── onboarding/        # Onboarding flow
├── src/
│   ├── components/        # Reusable UI components
│   ├── config/            # Firebase configuration
│   ├── contexts/          # React contexts (Auth)
│   ├── hooks/             # Custom hooks
│   ├── services/          # Business logic
│   ├── theme/             # Colors, typography, spacing
│   └── types/             # TypeScript definitions
└── assets/                # Images, fonts
```

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Expo Go app on your phone (for testing)
- Firebase project created

### 1. Clone and Install

```bash
cd nature-archive
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** > Email/Password
4. Enable **Firestore Database**
5. Enable **Storage**
6. Add a Web app to get config values
7. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

8. Fill in your Firebase values in `.env`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
```

### 3. Set Up Firestore Security Rules

In Firebase Console > Firestore > Rules, add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Observations belong to the user who created them
    match /observations/{observationId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }

    // Species data is readable by all authenticated users
    match /species/{speciesId} {
      allow read: if request.auth != null;
    }
  }
}
```

### 4. Run the App

```bash
npm start
```

This opens Expo DevTools. Then:
- **iOS**: Scan QR code with Camera app
- **Android**: Scan QR code with Expo Go app

## Testing Checklist (Sprint 1)

After setup, verify these work:

1. **Registration**
   - [ ] Can create a new account with email/password
   - [ ] Error shown for invalid email
   - [ ] Error shown for short password (<6 chars)
   - [ ] Error shown for mismatched passwords

2. **Login**
   - [ ] Can sign in with valid credentials
   - [ ] Error shown for wrong email/password

3. **Onboarding**
   - [ ] Shows 3 slides on first login
   - [ ] Can navigate with Next button
   - [ ] Can skip onboarding
   - [ ] Doesn't show again after completing

4. **Home Screen**
   - [ ] Shows stats (0 species, 0 observations)
   - [ ] "New Scan" button visible
   - [ ] Empty state message shown
   - [ ] Navigation to Collection/Settings works

5. **Settings**
   - [ ] Email displayed correctly
   - [ ] Location toggle works
   - [ ] Sign out works

## Next Steps (Future Sprints)

- Sprint 2: Camera integration, photo capture
- Sprint 3: AI recognition, suggestion display
- Sprint 4: Discovery detail page, saving
- Sprint 5: Collection grid, filtering, search

## Troubleshooting

### "Firebase not configured" error
Make sure your `.env` file exists and has valid values.

### App crashes on startup
Clear Metro cache: `npx expo start --clear`

### Authentication not working
Check Firebase Console > Authentication > Sign-in method > Email/Password is enabled.
