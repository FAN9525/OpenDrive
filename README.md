# OpenDrive Vehicle Valuation System

A modern web-based vehicle valuation system that integrates with eValue8 API to provide accurate vehicle pricing with optional accessories. Built with Next.js, React, Supabase, and deployed on Vercel.

## Features

- 🚗 **Vehicle Lookup**: Progressive dropdown selection (Make → Model → Year)
- 🛠️ **Accessories Management**: Visual card-based accessory selection with real-time pricing
- 📊 **Valuation Results**: Comprehensive valuation display with breakdowns
- ⚙️ **Admin Configuration**: Secure credential management with environment switching
- 🔒 **Security**: Encrypted password storage and proper authentication
- 📱 **Responsive Design**: Mobile-first design using Tailwind CSS

## Tech Stack

- **Frontend**: React + Next.js 14 (App Router)
- **Backend**: Next.js API Routes
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS
- **Hosting**: Vercel
- **External API**: eValue8 Web Services

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project
- eValue8 API credentials from Imagin8

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd opendrive
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Encryption Key for API passwords
   ENCRYPTION_KEY=your_secure_encryption_key

   # eValue8 API Configuration
   EVALUE8_BASE_URL=https://www.evalue8.co.za/evalue8webservice/
   ```

4. **Set up the database**:
   The database schema is automatically created when you run the application. Tables include:
   - `api_configurations`: Stores encrypted API credentials
   - `valuation_logs`: Logs all vehicle valuations
   - `cached_vehicle_data`: Caches API responses for performance

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

### API Setup

1. Go to the **Configuration** tab in the application
2. Choose your environment (Live or Sandbox)
3. Enter your eValue8 credentials:
   - Application Name (registered with Imagin8)
   - Username
   - Password
   - Client Reference Number
   - Computer/Workstation Name
4. Click **Save Configuration**
5. Test the connection with **Test Connection**

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `ENCRYPTION_KEY` | Key for encrypting stored passwords | Yes |
| `EVALUE8_BASE_URL` | eValue8 API base URL | Yes |

## Usage

### Vehicle Valuation

1. **Configure API settings** in the Admin section
2. **Load vehicle makes** by clicking "Load Vehicle Makes"
3. **Select** your vehicle make, model, and year
4. **Choose** condition and mileage category
5. **Add accessories** (if available) for more accurate pricing
6. **Get valuation** to see comprehensive pricing breakdown

### Accessories

- Accessories are automatically loaded based on the selected vehicle
- Select accessories by clicking on the cards
- View real-time totals and updated valuations
- Both retail and trade values are calculated

## API Endpoints

### Vehicle Data
- `GET /api/vehicles/makes` - Get all vehicle makes
- `GET /api/vehicles/models?make=AUDI` - Get models for a make
- `GET /api/vehicles/years?mmCode=04041980` - Get years for a model
- `GET /api/vehicles/accessories?mmCode=04041980&year=2020` - Get accessories

### Configuration
- `GET /api/config` - Get current API configuration
- `POST /api/config` - Save API configuration
- `POST /api/config/test` - Test API connection

### Valuation
- `POST /api/valuation` - Get vehicle valuation with accessories

## Deployment

### Vercel Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial OpenDrive setup"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Configure Supabase**:
   - Add your Vercel domain to Supabase allowed origins
   - Update RLS policies if needed

### Environment Variables on Vercel

Add these environment variables in your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ENCRYPTION_KEY`
- `EVALUE8_BASE_URL`

## Database Schema

### api_configurations
```sql
CREATE TABLE api_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  app_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password_encrypted TEXT NOT NULL,
  client_ref VARCHAR(255) NOT NULL,
  computer_name VARCHAR(255) NOT NULL,
  environment VARCHAR(20) DEFAULT 'live',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### valuation_logs
```sql
CREATE TABLE valuation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  make VARCHAR(100),
  model VARCHAR(255),
  year INTEGER,
  mm_code VARCHAR(20),
  condition VARCHAR(20),
  mileage VARCHAR(20),
  base_retail DECIMAL(12,2),
  base_trade DECIMAL(12,2),
  accessories_value DECIMAL(12,2),
  total_retail DECIMAL(12,2),
  total_trade DECIMAL(12,2),
  selected_accessories JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Caching Strategy

- **Vehicle Makes/Models**: Cached for 24 hours
- **Years/Accessories**: Cached for 6 hours
- **Automatic cache invalidation**: On API errors or expiry

## Security Features

- **Password Encryption**: All API passwords are encrypted before storage
- **Environment Variables**: Sensitive data stored in environment variables
- **Input Validation**: All user inputs are validated
- **Rate Limiting**: Built-in API rate limiting
- **RLS Policies**: Row Level Security enabled on all tables

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact the development team or create an issue in the GitHub repository.

## Acknowledgments

- [eValue8](https://www.evalue8.co.za/) for providing the vehicle valuation API
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vercel](https://vercel.com/) for deployment platform
- [Tailwind CSS](https://tailwindcss.com/) for styling