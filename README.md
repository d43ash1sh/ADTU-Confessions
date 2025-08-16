# Assam Down Town University Confessions

A full-stack anonymous confession platform for Assam Down Town University students. Built with React, TypeScript, Express.js, and PostgreSQL.

## Features

- 🔐 **Anonymous Confession System** - Submit confessions anonymously with categories
- 👨‍💼 **Admin Panel** - Approve/reject confessions with secure authentication
- 💬 **Interactive Feed** - Emoji reactions, search, and filtering
- 🎨 **ADTU Branding** - Official blue theme and responsive design
- 🔒 **Secure** - JWT authentication and input validation

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1. Clone and Install

```bash
cd ADTUConfess
npm install
```

### 2. Database Setup

**Option A: Local PostgreSQL (Recommended for development)**
```bash
# Start PostgreSQL
brew services start postgresql@14

# Create database
createdb adtu_confessions
```

**Option B: Cloud Database**
- [Neon](https://neon.tech) (Free tier available)
- [Supabase](https://supabase.com) (Free tier available)
- [PlanetScale](https://planetscale.com) (Free tier available)

### 3. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your database URL
DATABASE_URL="postgresql://username:password@localhost:5432/adtu_confessions"
```

### 4. Start Development Server

```bash
# Using the startup script (recommended)
./start.sh

# Or manually
export $(cat .env.local | xargs) && npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API**: http://localhost:3000/api

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

## Project Structure

```
ADTUConfess/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Application pages
│   │   ├── lib/           # Utilities and API
│   │   └── hooks/         # Custom React hooks
│   └── index.html
├── server/                 # Express.js backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database connection
├── shared/                 # Shared schemas
│   └── schema.ts          # Drizzle ORM schema
└── start.sh               # Development startup script
```

## API Endpoints

### Public Endpoints
- `GET /api/confessions` - Get approved confessions
- `GET /api/confessions/stats` - Get confession statistics
- `POST /api/confessions` - Submit new confession
- `PATCH /api/confessions/:id/reactions` - Update reactions

### Admin Endpoints (JWT Required)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/confessions` - Get pending confessions
- `PATCH /api/admin/confessions/:id/approve` - Approve confession
- `DELETE /api/admin/confessions/:id` - Delete confession

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push database schema
npm run check        # TypeScript type checking
```

### Database Schema

The application uses Drizzle ORM with PostgreSQL:

- **confessions** - Stores confession data with status and reactions
- **admins** - Stores admin user credentials

### Environment Variables

```bash
DATABASE_URL         # PostgreSQL connection string
ADMIN_USERNAME       # Admin login username
ADMIN_PASSWORD       # Admin login password
JWT_SECRET          # JWT signing secret
NODE_ENV            # Environment (development/production)
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel, Railway, or other platforms.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript, JWT Authentication
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom ADTU theme

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub or contact the development team. 