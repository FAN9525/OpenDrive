# OpenDrive Deployment Guide

## 🎉 GitHub Repository Created Successfully!

**Repository URL**: https://github.com/FAN9525/OpenDrive

## ✅ Project Status

- ✅ GitHub repository created and code pushed
- ✅ Next.js application with TypeScript and Tailwind CSS
- ✅ Supabase database configured (Project: AutoBot - ftrmqahltiegkvqtnved)
- ✅ All API routes implemented
- ✅ React components for vehicle selection, accessories, and admin
- ✅ Database tables created with RLS policies

## 🚀 Next Steps: Deploy to Vercel

### 1. Get Supabase Keys

1. Go to your Supabase project dashboard:
   ```
   https://supabase.com/dashboard/project/ftrmqahltiegkvqtnved
   ```

2. Navigate to **Settings** → **API**

3. Copy these values:
   - **Project URL**: `https://ftrmqahltiegkvqtnved.supabase.co`
   - **anon public key**: (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role key**: (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 2. Create Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ftrmqahltiegkvqtnved.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Encryption Key (generate a secure random string)
ENCRYPTION_KEY=your_32_character_encryption_key_123

# eValue8 API Configuration
EVALUE8_BASE_URL=https://www.evalue8.co.za/evalue8webservice/
```

### 3. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository: `FAN9525/OpenDrive`
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
4. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ENCRYPTION_KEY`
   - `EVALUE8_BASE_URL`
5. Click **Deploy**

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add ENCRYPTION_KEY
vercel env add EVALUE8_BASE_URL

# Redeploy with environment variables
vercel --prod
```

### 4. Configure eValue8 API

Once deployed:

1. Open your Vercel app URL
2. Go to **Configuration** tab
3. Enter your eValue8 credentials:
   - Application Name (registered with Imagin8)
   - Username
   - Password
   - Client Reference Number
   - Computer/Workstation Name
4. Select environment (Live/Sandbox)
5. Click **Save Configuration**
6. Test the connection

### 5. Test the Application

1. Load vehicle makes
2. Select make, model, year
3. Choose condition and mileage
4. Add accessories (if available)
5. Get vehicle valuation

## 📁 Project Structure

```
opendrive/
├── src/
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   ├── config/         # Configuration endpoints
│   │   │   ├── vehicles/       # Vehicle data endpoints
│   │   │   └── valuation/      # Valuation endpoint
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main page
│   ├── components/             # React components
│   │   ├── AccessorySelector.tsx
│   │   ├── AdminConfig.tsx
│   │   ├── ValuationResults.tsx
│   │   └── VehicleSelector.tsx
│   ├── hooks/                  # Custom React hooks
│   │   └── useVehicleData.ts
│   ├── types/                  # TypeScript types
│   │   ├── api.ts
│   │   └── vehicle.ts
│   └── utils/                  # Utility functions
│       ├── constants.ts
│       ├── encryption.ts
│       └── supabase.ts
├── .gitignore
├── package.json
├── README.md
├── setup.md
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

## 🗄️ Database Schema

The following tables are already created in Supabase:

### api_configurations
- Stores encrypted API credentials
- Fields: app_name, username, password_encrypted, client_ref, computer_name, environment

### valuation_logs
- Logs all vehicle valuations
- Fields: make, model, year, condition, mileage, pricing data, accessories

### cached_vehicle_data
- Caches API responses for performance
- Fields: data_type, cache_key, data, expires_at

## 🔒 Security Features

- ✅ Password encryption using AES
- ✅ Environment variables for sensitive data
- ✅ Row Level Security (RLS) on all tables
- ✅ Input validation on all API endpoints
- ✅ Rate limiting capabilities

## 🚀 Performance Optimizations

- ✅ API response caching (24h for makes/models, 6h for years/accessories)
- ✅ Supabase connection pooling
- ✅ Next.js static optimization
- ✅ Tailwind CSS purging

## 📊 Key Features

- 🚗 **Progressive Vehicle Selection**: Make → Model → Year
- 🛠️ **Accessory Management**: Visual cards with real-time pricing
- 📈 **Comprehensive Valuations**: Retail, trade, and total values
- ⚙️ **Admin Configuration**: Secure credential management
- 📱 **Responsive Design**: Mobile-first with Tailwind CSS
- 🔄 **Real-time Updates**: Live accessory value calculations

## 🎯 Next Steps After Deployment

1. Test all functionality in production
2. Monitor error logs in Vercel dashboard
3. Set up domain (optional)
4. Configure analytics (optional)
5. Set up monitoring and alerts

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**: Check Supabase allowed origins
2. **Environment Variables**: Ensure all required vars are set
3. **API Connection**: Test eValue8 credentials in admin panel
4. **Database Errors**: Check Supabase connection and RLS policies

### Support

- GitHub Repository: https://github.com/FAN9525/OpenDrive
- Documentation: README.md
- Setup Guide: setup.md

---

**Deployment Status**: ✅ Ready for Production
