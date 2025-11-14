# Manzil International Institute Website

A modern, responsive educational institution website built with React, TanStack Router, and Tailwind CSS. This project showcases Manzil Institute's commitment to quality education through an interactive and visually appealing web presence.

## 🌟 Features

- **Modern React Architecture**: Built with React 19 and TypeScript for type safety
- **File-Based Routing**: TanStack Router for efficient client-side routing
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for engaging user interactions
- **Component Library**: Shadcn UI components for consistent design
- **State Management**: TanStack Query for server state management
- **Developer Experience**: Hot reload, ESLint, Prettier, and comprehensive tooling
- **SEO Optimized**: Server-side rendering capabilities with TanStack Start
- **PWA Ready**: Progressive Web App features with service worker support

## 🛠️ Tech Stack

### Core Framework

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript development
- **TanStack Router** - File-based routing with SSR support
- **TanStack Start** - Full-stack React framework

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
├── src/
│   ├── components/                  # Reusable components
│   │   ├── Header.tsx              # Main navigation header
│   │   └── ui/                     # Shadcn UI components
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── textarea.tsx
│   ├── data/                       # Static data files
│   ├── lib/                        # Utility functions
│   │   └── utils.ts                # Class name utility
│   ├── routes/                     # File-based routes
│   │   ├── __root.tsx              # Root layout
│   │   ├── index.tsx               # Home page
│   │   ├── about.tsx               # About page
│   │   ├── curriculum.tsx          # Curriculum page
│   │   ├── admission.tsx           # Admission page
│   │   ├── fees.tsx                # Fees page
│   │   ├── rules.tsx               # Rules page
│   │   ├── facilities.tsx          # Facilities page
│   │   ├── workshops.tsx           # Workshops page
│   │   ├── location.tsx            # Location page
│   │   ├── founders.tsx            # Founders page
│   │   └── demo/                   # Demo routes (can be removed)
│   ├── router.tsx                  # Router configuration
│   ├── routeTree.gen.ts            # Auto-generated route tree
│   ├── styles.css                  # Global styles
│   └── logo.svg                    # Logo asset
├── .vscode/                        # VS Code settings
├── components.json                 # Shadcn configuration
├── eslint.config.js                # ESLint configuration
├── package.json                    # Dependencies and scripts
├── prettier.config.js              # Prettier configuration
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite configuration
└── README.md                       # This file
```

## 🏗️ Architecture Overview

### Routing Architecture

The application uses **TanStack Router** with file-based routing:

- Routes are defined as files in `src/routes/`
- File names correspond to URL paths (e.g., `about.tsx` → `/about`)
- `__root.tsx` provides the layout wrapper
- Auto-generated `routeTree.gen.ts` for type safety

### Component Architecture

- **Header Component**: Responsive navigation with mobile menu
- **UI Components**: Shadcn-based reusable components
- **Page Components**: Route-specific components in `/routes`
- **Layout Components**: Root layout with providers

### State Management

- **Server State**: TanStack Query for API data
- **Client State**: TanStack Store for local state
- **Route State**: TanStack Router's built-in state management

## 🧩 Components

### Header Component (`src/components/Header.tsx`)

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

Located in `src/components/ui/`:

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

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutComponent,
})
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

Defined in `src/styles.css`:

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

### Build Process

1. **Environment Variables**: Set production environment variables
2. **Build Command**: `pnpm build`
3. **Output**: `dist/` directory contains production assets

### Deployment Options

#### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

#### Netlify

1. Connect repository
2. Set build command: `pnpm build`
3. Set publish directory: `dist`

#### Manual Deployment

```bash
# Build the project
pnpm build

# Serve with any static hosting
# Example with serve
npx serve dist
```

### Environment Configuration

Create environment files:

- `.env.local` - Local development
- `.env.production` - Production variables

## 🔒 Security Considerations

- **Content Security Policy**: Configure CSP headers
- **HTTPS**: Always use HTTPS in production
- **Environment Variables**: Never commit secrets
- **Dependencies**: Regularly update dependencies

## 📈 Performance Optimization

### Code Splitting

- Route-based code splitting with TanStack Router
- Lazy loading for heavy components

### Image Optimization

- Use WebP format for images
- Implement lazy loading
- Optimize image sizes

### Bundle Analysis

```bash
pnpm build --analyze
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Code Standards

- Follow ESLint and Prettier configurations
- Use TypeScript for type safety
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
