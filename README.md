# PokéSearch - Pokemon Discovery App

A modern Pokemon search and collection application built with React, TypeScript, and Supabase.

## Features

- 🔍 **Smart Search** - Fuzzy search with typo tolerance
- 📚 **Personal Library** - Save your favorite Pokemon
- ❤️ **Favorites System** - Mark Pokemon as favorites
- 👤 **User Profiles** - Customizable user profiles with avatars
- 🔐 **Authentication** - Secure login with email/password and Google OAuth
- 📱 **Responsive Design** - Works on all devices
- 🛡️ **Admin Panel** - Admin tools for user and content management

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Search**: Fuse.js for fuzzy search
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pokemon-search-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Fill in your Supabase credentials in `.env`

4. Start the development server
```bash
npm run dev
```

## Environment Variables

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin panel components
│   ├── AuthModal.tsx   # Authentication modal
│   ├── Header.tsx      # Navigation header
│   ├── PokemonCard.tsx # Pokemon display card
│   └── ...
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── types/              # TypeScript type definitions
└── ...
```

## Features Breakdown

### Core Features
- [x] Pokemon search with fuzzy matching
- [x] User authentication (email/password, Google OAuth)
- [x] Personal Pokemon library
- [x] Favorites system
- [x] User profiles with avatar upload

### Admin Features
- [x] User management
- [x] Pokemon content management
- [x] Statistics dashboard
- [x] Admin-only Pokemon addition

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.