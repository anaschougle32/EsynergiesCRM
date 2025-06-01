# Marketing Agency CRM SaaS

A comprehensive CRM system designed for marketing agencies to manage multiple business clients with real-time lead processing, platform integrations, and WhatsApp automation.

## 🚀 Features

### Admin Features
- **Client Management**: Manage multiple business clients with detailed profiles
- **Per-Client Platform Integrations**: Connect Meta Ads, Google Ads, LinkedIn, and WhatsApp individually for each client
- **Real-time Lead Dashboard**: Monitor leads across all clients with live updates
- **WhatsApp Automation**: Set up automated message templates and rules
- **Billing Management**: Assign subscription plans and track payments per client
- **Integration Guides**: Step-by-step guides for platform integrations

### Client Features
- **Real-time Dashboard**: Live lead updates with instant WhatsApp automation (5-10 seconds)
- **Lead Management**: View, filter, and manage leads with detailed information
- **WhatsApp History**: Track automated message status and delivery
- **Billing Overview**: View subscription details and payment history
- **Account Settings**: Manage profile and preferences

### Platform Integrations
- **Meta Ads** (Facebook & Instagram combined): Unified lead sync from both platforms
- **Google Ads**: Lead form extensions and campaign leads
- **LinkedIn**: Lead Gen Forms from Campaign Manager
- **WhatsApp Business**: Automated messaging with delivery tracking

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Charts**: ApexCharts
- **Icons**: Heroicons, Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Fonts**: Satoshi (body), Poppins (headings) from Fontshare

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account (optional, has fallback mock authentication)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marketing-agency-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup (Optional)**
   
   If using Supabase:
   - Run the initial schema: `docs/database-schema.sql`
   - Run the updates: `docs/database-schema-update.sql`
   
   The application works with mock authentication if Supabase is not configured.

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## 🔐 Authentication

### Mock Authentication (Default)
- **Admin**: `admin@marketingagency.com` / `admin123`
- **Client**: `client1@restaurant.com` / `client123`

### Supabase Authentication
Configure your Supabase project with the provided schema for full functionality.

## 📱 Mobile Responsiveness

The application is fully responsive with:
- Mobile-first design approach
- Touch-friendly interface elements (44px minimum touch targets)
- Responsive typography and spacing
- Optimized layouts for all screen sizes
- Custom scrollbars and smooth animations

## 🎨 Design System

### Typography
- **Headings**: Poppins font family
- **Body**: Satoshi font family
- **Responsive**: Mobile-first scaling

### Colors
- **Primary**: Indigo palette
- **Success**: Green palette
- **Warning**: Yellow palette
- **Danger**: Red palette
- **Secondary**: Gray palette

### Components
- Custom shadows (soft, medium, large)
- Rounded corners (xl = 12px)
- Consistent spacing and padding
- Hover and focus states

## 🔄 Real-time Features

### Live Dashboard Updates
- New leads appear instantly
- WhatsApp automation triggers within 5-10 seconds
- Real-time status tracking (sent → delivered → read)
- Live notification system
- Pause/resume functionality

### WhatsApp Automation
- Automatic message sending on lead creation
- Template-based messaging
- Delivery status tracking
- Real-time status updates

## 📊 Integration Guides

The application includes comprehensive step-by-step guides for:

### Meta Ads (Facebook & Instagram)
- **Difficulty**: Medium
- **Time**: 15-20 minutes
- **Requirements**: Business accounts, active campaigns

### Google Ads
- **Difficulty**: Hard
- **Time**: 20-25 minutes
- **Requirements**: Google Cloud project, API access

### LinkedIn
- **Difficulty**: Hard
- **Time**: 25-30 minutes
- **Requirements**: Company page, Campaign Manager access

### WhatsApp Business
- **Difficulty**: Medium
- **Time**: 30-45 minutes
- **Requirements**: Business verification, message templates

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── admin/          # Admin-specific pages
│   └── client/         # Client-specific pages
├── stores/             # Zustand state management
├── services/           # API and external services
├── utils/              # Utility functions
├── lib/                # Third-party library configurations
└── types/              # TypeScript type definitions

docs/
├── CONTEXT.MD          # Detailed feature specifications
├── database-schema.sql # Initial database schema
└── database-schema-update.sql # Schema updates
```

## 🚀 Deployment

### Build Optimization
- Code splitting for better performance
- Optimized bundle size
- Tree shaking for unused code
- Asset optimization

### Environment Variables
Ensure all environment variables are set in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Consistent naming conventions

## 📈 Performance

### Optimizations
- Lazy loading for route components
- Optimized re-renders with proper state management
- Efficient data fetching patterns
- Responsive images and assets

### Monitoring
- Real-time updates without performance impact
- Efficient state updates
- Minimal re-renders
- Optimized chart rendering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation in `docs/CONTEXT.MD`
- Review the integration guides in the application
- Check the database schema files for data structure

## 🔮 Future Enhancements

- Additional platform integrations
- Advanced analytics and reporting
- Team collaboration features
- API for third-party integrations
- Mobile app development
- Advanced automation workflows 