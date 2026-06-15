# Campus Cart

Campus marketplace app for CUST Islamabad — built with React Native (Expo) + Supabase.

## Tech Stack
- **Frontend**: React Native (Expo)
- **Backend**: Supabase (Auth, Database, Realtime, Storage)
- **Navigation**: React Navigation v6

## Project Structure
```
campus-cart/
├── App.js                        # Root entry point
├── .env.example                  # Environment variables template
├── supabase-schema.sql           # Run this in Supabase SQL editor
└── src/
    ├── constants/
    │   └── theme.js              # Colors, spacing, typography
    ├── hooks/
    │   ├── useAuth.js            # Auth context + helpers
    │   ├── useListings.js        # Listings CRUD + queries
    │   └── useMessages.js        # Realtime chat
    ├── lib/
    │   └── supabase.js           # Supabase client
    ├── navigation/
    │   └── index.js              # Auth stack + Tab navigator
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.js
    │   │   └── SignupScreen.js
    │   ├── main/
    │   │   ├── HomeScreen.js
    │   │   ├── BrowseScreen.js
    │   │   ├── SellScreen.js
    │   │   ├── ChatScreen.js
    │   │   ├── ChatsListScreen.js
    │   │   ├── ProfileScreen.js
    │   │   └── NoticesScreen.js
    │   └── listing/
    │       └── ListingDetailScreen.js
    ├── components/
    │   ├── listing/
    │   │   └── ListingCard.js
    │   └── home/
    │       ├── NoticeStrip.js
    │       └── AdBanner.js
    └── types/
        └── index.js              # JSDoc type definitions
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open the SQL editor and run the entire contents of `supabase-schema.sql`
3. Copy your project URL and anon key from Settings → API

### 3. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and add your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the app
```bash
npx expo start
```
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR code with Expo Go app on your phone

## Features Built
- [x] Auth (signup with @cust.edu.pk email only, login, signout)
- [x] Home feed with listings, category filter, search
- [x] University notice strip + ad banner
- [x] Product listing detail
- [x] Create/post a listing (sell screen)
- [x] Real-time chat between buyer and seller
- [x] Chats list screen
- [x] Profile with stats
- [x] Notices screen
- [x] Row-level security on all tables
- [x] Auto-updating conversation timestamps

## Next Steps
- [ ] Browse screen with advanced filters
- [ ] Image upload (Supabase Storage)
- [ ] Push notifications (Expo + FCM)
- [ ] Digital goods — PDF upload + download
- [ ] Seller rating system after transaction
- [ ] Admin panel for notices + ad management
