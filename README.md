# MentoraSI - Mentoring Platform for University of São Paulo Students

## 🎯 About the Project

MentoraSI is an anonymous mentoring platform that connects students from **Universidade de São Paulo** with experienced alumni who serve as mentors. The platform allows students to book mentoring sessions.

### 🚀 Key Features

- **Anonymous Booking**: Students book sessions without knowing which mentor they'll meet
- **Calendar Integration**: Automatic sync with Google Calendar for confirmed sessions
- **Availability Management**: Mentors can set recurring schedules or specific dates
- **Email Verification**: Confirmation system before identity disclosure
- **Responsive Interface**: Optimized experience for desktop and mobile devices

### 🎯 Target Audience

**For USP Students:**
- Receive professional and career guidance
- Prepare for technical and behavioral interviews
- Understand the current technology market
- Plan academic and professional development

**For Alumni Mentors:**
- Share knowledge and professional experience
- Contribute to the next generation's development
- Network with the academic community
- Flexible hours and remote modality

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.2** - React framework with server-side rendering
- **TypeScript** - Static typing for better code safety
- **Tailwind CSS** - CSS framework for rapid styling
- **date-fns** - Date manipulation and formatting

### Backend & Infrastructure
- **API Routes** - RESTful endpoints with Next.js
- **Supabase** - PostgreSQL database and authentication
- **Resend** - Transactional email service
- **Google OAuth 2.0** - Authentication and Google Calendar integration

### Deployment
- **Vercel** - Hosting and continuous deployment
- **Zero Configuration** - Environment variables configured

## 📋 Project Structure

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── api/                # API routes
│   │   ├── auth/           # Google OAuth authentication
│   │   ├── availability/    # Availability management
│   │   ├── book/           # Booking and verification
│   │   └── sessions/       # Scheduled session management
│   ├── alumni/             # Mentor dashboard
│   ├── book/              # Booking interface
│   └── globals.css         # Global styles and custom properties
├── components/             # Reusable React components
│   ├── BookingCalendar.tsx  # Booking calendar
│   ├── AvailabilityForm.tsx  # Availability form
│   └── LogoutButton.tsx    # Logout button
└── lib/                   # Utilities and configurations
    ├── auth.ts            # Supabase auth configuration
    ├── email.ts           # Email templates and sending
    ├── google.ts          # Google OAuth configuration
    └── supabase/         # Supabase clients (server/client)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **npm, yarn, or pnpm**
- **Google Account** (for OAuth and Calendar integration)
- **Supabase Account** (database setup)

### Installation

1. Clone the repository
```bash
git clone https://github.com/MCanhisares/mentoraSI.git
cd mentoraSI
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Start development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Environment Configuration

### Required Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@mentorasi.com

# URLs
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## 📊 Detailed Features

### Booking System

1. **Student Interface**: Calendar view with available time slots
2. **Filter System**: Monthly navigation and slot selection
3. **Email Confirmation**: Mandatory verification before sessions
4. **Calendar Integration**: Events automatically created in Google Calendar

### Mentor Dashboard

1. **Availability Management**: Recurring (weekly) and one-time schedules
2. **Session Overview**: Upcoming booked sessions with meeting links
3. **Statistics**: Slot counter and Calendar integration status
4. **Access Control**: Google OAuth login with persistent sessions

### Notification System

1. **Transactional Emails**: Confirmations, reminders, and cancellations
2. **Portuguese Templates**: Localized content for Brazilian audience
3. **Management Links**: Direct cancellation and rescheduling via email

## 🧪 Testing

### Running Tests

```bash
# Unit and integration tests
npm run test

# E2E tests (if configured)
npm run test:e2e

# Coverage
npm run test:coverage
```

### Production Build

```bash
npm run build
npm start
```

## 🚀 Deployment

### Automatic Deployment

The application is configured for automatic deployment on **Vercel**:

1. Connect repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Automatic deployment on each push to `main`

### Manual Deployment

```bash
npm run build
# Upload the .next folder to your hosting platform
```

## 🔧 Development

### Available Scripts

```json
{
  "dev": "next dev",           # Development server
  "build": "next build",       # Production build
  "start": "next start",        # Production server
  "lint": "next lint",          # Code linting
  "type-check": "tsc --noEmit"  # TypeScript verification
}
```

### Best Practices

- **Components**: Use TypeScript interfaces for props
- **Styling**: Maintain consistency with Tailwind classes
- **APIs**: Implement proper error handling
- **Commits**: Follow conventional commits pattern
- **Branches**: Use feature branches for development

## 🤝 Contributing

### Contribution Workflow

1. **Fork** the repository
2. **Branch**: `git checkout -b feature/new-feature`
3. **Develop** with appropriate tests
4. **Commit**: `git commit -m "feat: add new feature"`
5. **Push**: `git push origin feature/new-feature`
6. **Pull Request**: Open PR describing changes

### Guidelines

- **Code**: Follow established code standards
- **Tests**: Maintain coverage above 80%
- **Documentation**: Update README for significant changes
- **Issues**: Report bugs using available templates

## 📄 License

This project is licensed under **MIT License** - see [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/MCanhisares/MentoraSI/issues)
- **Email**: support@mentorasi.com.br
- **Website**: https://mentorasi.com.br

---

## 🙏 Acknowledgments

- **Next.js Team** - Amazing web framework
- **Supabase** - Powerful Backend-as-a-Service  
- **Vercel** - Hassle-free deployment platform
- **EACH USP Community** - Feedback and idea validation

---

**MentoraSI** 🚀 