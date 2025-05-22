# DOPE Lifestyle Waitlist

A modern, responsive waitlist landing page with phone verification for DOPE Lifestyle, a premium fitness supplements brand. This project features a sleek, animated UI with Firebase phone authentication and Supabase database integration.

## Features

- Responsive design
- Modern UI components
- Waitlist functionality
- User authentication

## 🚀 Features

- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Phone Verification**: Secure OTP verification via Firebase Authentication
- **Database Integration**: Supabase backend for storing verified waitlist entries
- **Indian Phone Format**: Specialized input for Indian phone numbers (+91)
- **Multi-step Form**: Smooth user experience with step-by-step verification
- **Animations**: Engaging animations using Framer Motion
- **Error Handling**: Comprehensive error handling and user feedback
- **Duplicate Prevention**: Checks for existing entries to prevent duplicates

## 📋 Technical Overview

### Frontend

- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Form Validation**: Custom validation for Indian phone numbers
- **UI Components**: Custom components with shadcn/ui styling

### Backend

- **Authentication**: Firebase Phone Authentication
- **Database**: Supabase PostgreSQL
- **Server Actions**: Next.js Server Actions for database operations
- **Schema**: Structured database schema with proper indexes and constraints

## 🔧 Setup Instructions

### Prerequisites

- Node.js 16.x or higher
- Supabase account
- Firebase account with Phone Authentication enabled
- Vercel account (optional, for deployment)

### Installation

1. Clone the repository:

```shellscript
git clone https://github.com/Madhav3766/dope-website.git
cd dope-website
```

2. Install dependencies:

```shellscript
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:

```plaintext
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

4. Set up the database:
Run the SQL migration script in your Supabase SQL editor:

```sql
-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create OTP codes table for phone verification
CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS waitlist_phone_idx ON waitlist (phone);
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);
CREATE INDEX IF NOT EXISTS otp_codes_phone_idx ON otp_codes (phone);
CREATE INDEX IF NOT EXISTS otp_codes_expires_at_idx ON otp_codes (expires_at);

-- Add RLS policies
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Only allow server-side access to these tables
CREATE POLICY "Server-side only insert to waitlist" ON waitlist 
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Server-side only select from waitlist" ON waitlist 
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Server-side only insert to otp_codes" ON otp_codes 
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Server-side only select from otp_codes" ON otp_codes 
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Server-side only delete from otp_codes" ON otp_codes 
  FOR DELETE USING (auth.role() = 'service_role');
```

5. Start the development server:

```shellscript
npm run dev
# or
yarn dev
# or
pnpm dev
```

## 🔥 Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
2. Enable Phone Authentication:
   1. Go to Authentication > Sign-in method
   2. Enable Phone provider

3. Add your app to Firebase:
   1. Click the web icon (`</>`) to add a web app
   2. Register your app and get the configuration

4. **Important**: Enable billing for Phone Authentication to work
   1. Go to Billing in Firebase console
   2. Add a payment method (required even for free tier)

5. For testing:
   1. Add test phone numbers in Firebase console
   2. Use code "123456" for verification during development

## 📊 Database Schema

### Waitlist Table

| Column | Type | Description
|-----|-----|-----
| id | UUID | Primary key
| name | TEXT | User's full name
| email | TEXT | User's email (optional)
| phone | TEXT | User's phone number (unique)
| created_at | TIMESTAMP WITH TIME ZONE | Entry creation timestamp
| updated_at | TIMESTAMP WITH TIME ZONE | Entry update timestamp

### OTP Codes Table

| Column | Type | Description
|-----|-----|-----
| id | UUID | Primary key
| phone | TEXT | User's phone number
| code | TEXT | Verification code
| created_at | TIMESTAMP WITH TIME ZONE | Code creation timestamp
| expires_at | TIMESTAMP WITH TIME ZONE | Code expiration timestamp
| used | BOOLEAN | Whether code has been used

## 📱 Phone Verification Flow

1. User enters name, email (optional), and phone number
2. System checks for duplicate entries
3. Firebase sends OTP to the provided phone number
4. User enters the OTP code
5. System verifies the code with Firebase
6. On successful verification, user is added to waitlist
7. Confirmation message is displayed

## 🎨 Customization

### Styling

- Edit `tailwind.config.ts` to change colors, fonts, etc.
- Modify `globals.css` for global styles
- Component-specific styles are in their respective files

### Content

- Update text in `waitlist-section.tsx` for different messaging
- Change images by replacing files in `/public/images/`

### Functionality

- Modify form fields in `waitlist-section.tsx`
- Adjust validation in `phone-input.tsx`
- Change database schema in Supabase as needed

## 📦 Project Structure

```plaintext
├── app/
│   ├── actions/
│   │   └── waitlist.ts       # Server actions for waitlist operations
│   ├── api/                  # API routes
│   ├── firebase.ts           # Firebase initialization
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── about-section.tsx     # About section component
│   ├── features-section.tsx  # Features section component
│   ├── hero-section.tsx      # Hero section component
│   ├── navbar.tsx            # Navigation component
│   ├── phone-input.tsx       # Custom phone input component
│   ├── text-carousel.tsx     # Text carousel component
│   └── waitlist-section.tsx  # Waitlist form component
├── public/
│   └── images/               # Static images
└── supabase/
    └── migrations/           # Database migration scripts
```

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel project settings
4. Deploy

### Environment Variables for Production

Ensure these environment variables are set in your production environment:

```plaintext
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

## License

MIT 