# ADTU Confessions - Deployment Guide

## Complete Project Structure

```
adtu-confessions/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── confession-card.tsx
│   │   │   ├── navbar.tsx
│   │   │   └── theme-provider.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities and API client
│   │   ├── pages/             # Application pages
│   │   │   ├── home.tsx       # Main confession feed
│   │   │   ├── submit.tsx     # Confession submission
│   │   │   ├── admin.tsx      # Admin panel
│   │   │   └── not-found.tsx
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # React entry point
│   │   └── index.css          # Global styles with ADTU theme
│   └── index.html             # HTML template
├── server/                     # Express.js backend
│   ├── db.ts                  # Database connection
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # API routes
│   └── storage.ts             # Database operations
├── shared/                     # Shared types and schemas
│   └── schema.ts              # Drizzle ORM schema
├── .env.example               # Environment variables template
├── vercel.json                # Vercel deployment configuration
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind CSS configuration
├── vite.config.ts             # Vite build configuration
├── drizzle.config.ts          # Database configuration
└── tsconfig.json              # TypeScript configuration
```

## Quick Deployment Steps

### 1. Download & Setup
```bash
# Download the project files from Replit
# Extract to your local machine
cd adtu-confessions

# Install dependencies
npm install
```

### 2. Database Setup
Choose one of these PostgreSQL providers:

**Option A: Neon (Recommended for Vercel)**
1. Go to https://neon.tech
2. Create free account & new project
3. Copy the connection string

**Option B: Supabase**
1. Go to https://supabase.com
2. Create new project
3. Go to Settings > Database
4. Copy the connection string

**Option C: PlanetScale**
1. Go to https://planetscale.com
2. Create new database
3. Copy the connection string

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values:
DATABASE_URL="your-postgresql-connection-string"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password"
JWT_SECRET="your-32-character-secret"
NODE_ENV="production"
```

### 4. Initialize Database
```bash
# Push schema to database
npm run db:push
```

### 5. Deploy to Vercel

**Option A: GitHub Integration (Recommended)**
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: ADTU Confessions"

# Create GitHub repository
# Push to GitHub
git remote add origin https://github.com/yourusername/adtu-confessions.git
git branch -M main
git push -u origin main

# Connect to Vercel:
# 1. Go to https://vercel.com
# 2. Import your GitHub repository
# 3. Add environment variables in Vercel dashboard
# 4. Deploy!
```

**Option B: Direct Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and add environment variables
```

### 6. Post-Deployment
1. Visit your Vercel app URL
2. Test confession submission workflow
3. Access admin panel with your credentials
4. Verify database connectivity

## Environment Variables for Production

Add these in your hosting platform (Vercel dashboard):

```
DATABASE_URL=postgresql://username:password@hostname:5432/database
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-32-character-secret
NODE_ENV=production
```

## Features Included

✅ **Anonymous Confession System**
- Public submission form with categories
- Admin approval workflow
- Auto-generated confession IDs (#001, #002, etc.)

✅ **Admin Panel**
- Secure login with JWT authentication
- Approve/reject pending confessions
- Real-time stats dashboard

✅ **Interactive Feed**
- Emoji reactions (❤️😂🔥)
- Search by keywords
- Filter by categories
- Dark/light mode toggle

✅ **ADTU Branding**
- Official blue color theme (#004C99)
- Responsive mobile-first design
- Professional typography

✅ **Production Ready**
- TypeScript for type safety
- PostgreSQL for reliable data storage
- Optimistic UI updates
- Error handling and validation

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript, JWT Authentication
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Vercel serverless functions
- **Styling**: Tailwind CSS with custom ADTU theme

## Troubleshooting

**Database Connection Issues:**
- Verify DATABASE_URL is correct
- Check if database accepts external connections
- Ensure firewall allows connections

**Deployment Failures:**
- Check all environment variables are set
- Verify build scripts run locally: `npm run build`
- Check Vercel function logs for errors

**Admin Login Issues:**
- Verify ADMIN_USERNAME and ADMIN_PASSWORD are set
- Check JWT_SECRET is properly configured
- Clear browser cache and try again

## Support

This is a complete, production-ready confession website for ADTU students. All features are fully implemented and tested.