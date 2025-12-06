# Manzil International Institute Website

A modern, responsive educational institution website built with React, TanStack Router, and Tailwind CSS. This project showcases Manzil Institute's commitment to quality education through an interactive and visually appealing web presence.

## 🌟 Features

- **Modern React Architecture**: Built with React 19 for modern development
- **File-Based Routing**: TanStack Router for efficient client-side routing
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for engaging user interactions
- **Component Library**: Shadcn UI components for consistent design
- **State Management**: TanStack Query for server state management
- **Developer Experience**: Hot reload, ESLint, Prettier, and comprehensive tooling
- **SEO Optimized**: Client-side rendering with SEO optimizations
- **PWA Ready**: Progressive Web App features with service worker support

## 🛠️ Tech Stack

### Core Framework

- **React 19** - Latest React with concurrent features
- **TanStack Router** - File-based routing for client-side navigation

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn UI** - Modern component library
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Development Tools

- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting with TanStack config
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing (via MCP)

### State Management

- **TanStack Query** - Server state management
- **TanStack Store** - Client state management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher
- **pnpm** 8.0.0 or higher (recommended) or npm/yarn
- **Git** for version control

### Installing pnpm (Recommended)

```bash
npm install -g pnpm
```

## 🚀 Installation and Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd manzil-international-institute
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory for environment variables (if needed):

```env
# Add any environment variables here
VITE_API_URL=https://api.manzilinstitute.com
```

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
pnpm build
```

### 6. Preview Production Build

```bash
pnpm serve
```

## 📁 Project Structure

```
manzil-international-institute/
├── public/                          # Static assets
│   ├── favicon.ico
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── components/                      # Reusable components
│   ├── Header.jsx                   # Main navigation header
│   └── ui/                         # Shadcn UI components
│       ├── badge.jsx
│       ├── button.jsx
│       ├── card.jsx
│       ├── input.jsx
│       └── textarea.jsx
├── hooks/                          # Custom hooks
├── lib/                            # Utility functions
│   └── utils.js                    # Class name utility
├── src/
│   ├── routes/                     # File-based routes
│   │   ├── __root.jsx              # Root layout
│   │   ├── index.jsx               # Home page
│   │   ├── admission.jsx           # Admission page
│   │   ├── campus.jsx              # Campus page
│   │   ├── curriculum.jsx          # Curriculum page
│   │   └── sitemap.xml.js          # Sitemap XML
│   ├── router.jsx                  # Router configuration
│   ├── routeTree.gen.js            # Auto-generated route tree
│   └── main.jsx                    # Application entry point
├── styles.css                      # Global styles
├── .vscode/                        # VS Code settings
├── components.json                 # Shadcn configuration
├── eslint.config.js                # ESLint configuration
├── package.json                    # Dependencies and scripts
├── prettier.config.js              # Prettier configuration
├── vite.config.js                  # Vite configuration
└── README.md                       # This file
```

## 🏗️ Architecture Overview

### Routing Architecture

The application uses **TanStack Router** with file-based routing:

- Routes are defined as files in `src/routes/`
- File names correspond to URL paths (e.g., `admission.jsx` → `/admission`)
- `__root.jsx` provides the layout wrapper
- Auto-generated `routeTree.gen.js` for route management

### Component Architecture

- **Header Component** (`components/header.jsx`): Responsive navigation with mobile menu
- **UI Components**: Shadcn-based reusable components in `/ui`
- **Page Components**: Route-specific components in `/routes`
- **Layout Components**: Root layout with providers

### State Management

- **Server State**: TanStack Query for API data
- **Client State**: TanStack Store for local state
- **Route State**: TanStack Router's built-in state management

## 🧩 Components

### Header Component (`components/Header.tsx`)

- Responsive navigation bar
- Mobile-friendly slide-out menu
- Active link highlighting
- Smooth transitions

**Key Features:**

- Hamburger menu for mobile devices
- Expandable demo sections
- Icon-based navigation
- Active state management

### UI Components (Shadcn)

Located in `components/ui/`:

- **Button**: Customizable button variants
- **Card**: Content containers
- **Input/Textarea**: Form inputs
- **Badge**: Status indicators

## 📄 Pages and Routes

### Main Pages

1. **Home (`/`)**: Landing page with hero section, stats, features, and events
2. **About (`/about`)**: Institute information and mission
3. **Curriculum (`/curriculum`)**: Course offerings and syllabus
4. **Admission (`/admission`)**: Application process and requirements
5. **Fees (`/fees`)**: Fee structure and payment information
6. **Rules (`/rules`)**: Institute regulations and policies
7. **Facilities (`/facilities`)**: Campus facilities and resources
8. **Workshops (`/workshops`)**: Training programs and events
9. **Location (`/location`)**: Contact information and map
10. **Founders (`/founders`)**: Leadership and team information

### Route Configuration

Each route file exports a `Route` component using `createFileRoute`:

```jsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: AboutComponent,
});
```

## 🎨 Styling

### Tailwind CSS Configuration

- **Version**: Tailwind CSS 4.0.6
- **Configuration**: CSS variables for theming
- **Dark Mode**: Built-in dark mode support
- **Custom Variants**: Extended with `tw-animate-css`

### Design System

- **Color Palette**: Cyan/blue gradient theme
- **Typography**: System fonts with custom spacing
- **Spacing**: Consistent spacing scale
- **Shadows**: Layered shadow system for depth

### CSS Variables

Defined in `styles.css`:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  /* ... more variables */
}
```

## ✨ Animations

### Framer Motion Integration

- **Version**: 11.0.0
- **Usage**: Page transitions, hover effects, scroll animations

### Animation Patterns

1. **Hero Section**: Fade-in with staggered text animation
2. **Stats Section**: Counter animations on scroll
3. **Features Grid**: Hover effects and scale transforms
4. **Events Section**: Slide-in animations

Example animation:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
>
  Content
</motion.div>
```

## 🧪 Testing

### Unit Testing

```bash
pnpm test
```

Uses **Vitest** with React Testing Library.

### End-to-End Testing

The project includes Playwright MCP server for E2E testing:

```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npx playwright test
```

## 🔧 Development Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm serve            # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Run Prettier
pnpm check            # Format and lint

# Testing
pnpm test             # Run unit tests
```

## 🚀 Deployment

### Prerequisites for Deployment

Before deploying, ensure you have:

- **Node.js 18.0.0+** installed
- **Git repository** with your code
- **Environment variables** configured (see below)
- **Domain name** (optional, for custom domain)

### Environment Variables

Create the following environment files:

#### `.env.local` (Development)

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# Analytics (Optional)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
```

#### `.env.production` (Production)

```env
# API Configuration
VITE_API_URL=https://api.manzilinstitute.com

# Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false

# Security (if using external services)
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_key
```

### Build Process

1. **Install dependencies**: `pnpm install`
2. **Build for production**: `pnpm build`
3. **Preview build**: `pnpm serve`
4. **Output location**: `dist/` directory

### Deployment Options

#### Vercel (Recommended)

**Option 1: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

**Option 2: GitHub Integration**

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the project settings
3. Configure the following in Vercel dashboard:

**Build Settings:**

- **Framework Preset**: `Vite`
- **Root Directory**: `./` (leave empty)
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

**Environment Variables:**
Add all production environment variables from `.env.production`

**Domain Configuration:**

- Add custom domain in Vercel dashboard
- Configure DNS records as instructed

**Advanced Settings:**

- **Node.js Version**: `18.x` or higher
- **Build Image**: `Ubuntu Latest`
- **Function Region**: `Washington D.C. (iad1)` or nearest

#### Netlify

1. Connect your Git repository to Netlify
2. Configure build settings:
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
   - **Node version**: `18`
3. Add environment variables in Netlify dashboard
4. Deploy

#### Railway

1. Connect your Git repository
2. Railway auto-detects Vite configuration
3. Set environment variables in dashboard
4. Deploy

#### Manual Deployment

```bash
# Build the project
pnpm build

# Deploy to any static hosting service
# Examples:

# Using Vercel CLI
npx vercel --prod

# Using Netlify CLI
npx netlify deploy --prod --dir=dist

# Using Surge
npx surge dist

# Using Firebase
firebase deploy
```

### Production Optimization

#### Performance Tips

1. **Enable Compression**: Configure your hosting to serve gzip/brotli compressed files
2. **CDN**: Use a CDN for global distribution (Vercel includes this by default)
3. **Image Optimization**: All images are automatically optimized by Vite
4. **Code Splitting**: Routes are automatically code-split by TanStack Router

#### Monitoring

- **Error Tracking**: Integrate Sentry or similar service
- **Analytics**: Google Analytics 4 is configured
- **Performance**: Use Vercel Analytics or similar

#### Security Headers

The `vercel.json` includes security headers:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- Cache headers for static assets

### Post-Deployment Checklist

- [ ] Test all routes and navigation
- [ ] Verify forms and interactive elements
- [ ] Check responsive design on mobile
- [ ] Test loading states and error boundaries
- [ ] Verify analytics are working
- [ ] Check SSL certificate
- [ ] Test contact forms and external links
- [ ] Verify SEO meta tags

## 🔒 Security Considerations

- **Content Security Policy**: Configure CSP headers
- **HTTPS**: Always use HTTPS in production
- **Environment Variables**: Never commit secrets
- **Dependencies**: Regularly update dependencies

## 📈 Performance Optimization

### Build Optimizations

The project includes several production optimizations:

#### Code Splitting

- **Route-based splitting**: TanStack Router automatically splits code by routes
- **Dynamic imports**: Components are lazy-loaded as needed
- **Vendor chunking**: Third-party libraries are bundled separately

#### Asset Optimization

- **Image optimization**: Vite automatically converts images to WebP/AVIF when supported
- **CSS minification**: Tailwind CSS is purged and minified
- **JavaScript minification**: Terser is used for production builds
- **Tree shaking**: Unused code is automatically removed

#### Caching Strategy

- **Static assets**: Cached for 1 year with immutable headers
- **HTML**: Not cached to ensure updates are immediate
- **Service worker**: Ready for PWA features (manifest.json included)

### Bundle Analysis

```bash
# Analyze bundle size
pnpm build

# Check dist/stats.html for detailed analysis
# Or use online tools like bundle-analyzer
```

### Runtime Performance

#### React Optimizations

- **Concurrent features**: React 19 concurrent rendering enabled
- **Suspense boundaries**: Proper loading states for better UX
- **Error boundaries**: Graceful error handling

#### Router Optimizations

- **Preloading**: Routes are preloaded on hover/link focus
- **Scroll restoration**: Maintains scroll position on navigation
- **Memory management**: Efficient route caching

### Monitoring & Analytics

#### Performance Monitoring

```javascript
// Add to your app for performance monitoring
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

onCLS(console.log);
onFID(console.log);
onFCP(console.log);
onLCP(console.log);
onTTFB(console.log);
```

#### Error Tracking

Consider integrating error tracking services:

- **Sentry**: Comprehensive error monitoring
- **LogRocket**: Session replay and error tracking
- **Bugsnag**: Real-time error monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Code Standards

- Follow ESLint and Prettier configurations
- Write clean, maintainable JavaScript code
- Write meaningful commit messages
- Test your changes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- **Documentation**: [TanStack Router Docs](https://tanstack.com/router)
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

## 🙏 Acknowledgments

- **TanStack** for the amazing router and query libraries
- **Shadcn** for the beautiful UI components
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations

---

**Manzil International Institute** - Empowering Future Leaders Through Quality Education
