# Environment Variables Setup

Create a `.env.local` file in the root of your project with the following variables:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key_here_min_32_chars

# Google OAuth Provider
# Get these from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Facebook OAuth Provider
# Get these from: https://developers.facebook.com/apps
FACEBOOK_CLIENT_ID=your_facebook_app_id_here
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret_here

# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Setup Instructions

### 1. Generate NEXTAUTH_SECRET
```bash
npx auth secret
# or use:
openssl rand -base64 32
```

### 2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

### 3. Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/apps)
2. Create a new app
3. Add Facebook Login product
4. Configure Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/callback/facebook`
5. Copy App ID and App Secret to `.env.local`

### 4. Start Development Server
```bash
npm run dev
```

## Features Implemented

- **Google Sign-In**: Click Google button on login page
- **Facebook Sign-In**: Click Facebook button on login page
- **User Icon in Navbar**: Shows when logged in, links to `/profile`
- **Welcome Toast**: Displays "أهلاً بك {username}!" after login
- **Profile Page**: Shows user info from backend
- **Route Protection**: `/profile` requires auth, `/auth/login` redirects if already logged in
