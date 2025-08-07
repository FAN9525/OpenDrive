# OpenDrive Setup Instructions

## Quick Setup Guide

### 1. Environment Variables

Create a `.env.local` file in the root directory with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ftrmqahltiegkvqtnved.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Encryption Key for API passwords (use a secure random string)
ENCRYPTION_KEY=your_secure_encryption_key_here

# eValue8 API Configuration
EVALUE8_BASE_URL=https://www.evalue8.co.za/evalue8webservice/
```

### 2. Get Supabase Keys

1. Go to your Supabase project: https://supabase.com/dashboard/project/ftrmqahltiegkvqtnved
2. Navigate to Settings → API
3. Copy the "Project URL" and "anon public" key
4. Copy the "service_role" key (keep this secret!)

### 3. Create GitHub Repository

1. Go to GitHub and create a new repository named "OpenDrive"
2. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/OpenDrive.git
git branch -M main
git push -u origin main
```

### 4. Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add the environment variables in Vercel dashboard
4. Deploy!

### 5. Test the Application

1. Run locally: `npm run dev`
2. Go to the Configuration tab
3. Enter your eValue8 API credentials
4. Test the connection
5. Start valuating vehicles!

## Supabase Database

The database tables are already created:
- ✅ `api_configurations`
- ✅ `valuation_logs` 
- ✅ `cached_vehicle_data`

## Next Steps

1. Set up your environment variables
2. Create GitHub repository
3. Deploy to Vercel
4. Configure eValue8 API credentials
5. Start using the system!

## Support

If you need help, check the README.md file for detailed instructions.

