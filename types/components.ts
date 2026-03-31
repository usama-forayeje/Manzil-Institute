// Component prop types

// Comparison Modal
export interface ComparisonModalProps {
  levels: Level[];
  onClose: () => void;
}

// Level structure for curriculum comparison
export interface Level {
  level: string;
  age: string;
  subjects: {
    madrasa: string[];
    general: string[];
    technical: string[];
  };
  // Additional properties from curriculum levels
  id?: number;
  title?: string;
  duration?: string;
  color?: string;
  madrasaLabel?: string;
  generalLabel?: string;
  technicalLabel?: string;
}

// Subject Modal
export interface SubjectModalProps {
  subject: SubjectDetails;
  onClose: () => void;
}

export interface SubjectDetails {
  name: string;
  arabicName?: string;
  description: string;
  objectives: string[];
  outcomes?: string[];
  levelInfo?: string;
}

// Loading Skeleton
export interface LoadingSkeletonProps {
  // Add props if any
}

// Floating Action Buttons
export interface FloatingActionButtonsProps {
  // Add props if any
}

// Curriculum Section
export interface CurriculumSectionProps {
  // Add props if any
}

// MIC Curriculum Component
export interface MICCurriculumProps {
  // Add props if any
}

// Hero Section
export interface HeroSectionProps {
  // Add props if any
}

// Header components
export interface DesktopMenuProps {
  // Add props if any
}

export interface MobileMenuProps {
  // Add props if any
}

// UI Components
export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  // Add props if any
}

export interface FAQAccordionProps {
  // Add props if any
}

export interface CurriculumSearchProps {
  // Add props if any
}

export interface CurriculumTimelineProps {
  // Add props if any
}

export interface LevelFinderQuizProps {
  // Add props if any
}

export interface ProgressiveBlurProps {
  // Add props if any
}

export interface QuickActionFABProps {
  // Add props if any
}

export interface SubjectModalProps {
  subject: SubjectDetails;
  onClose: () => void;
}

export interface TableProps {
  // Add props if any
}

// SEO Components
export interface MetaTagsProps {
  // Add props if any
}

export interface PageStructuredDataProps {
  // Add props if any
}

export interface SEOMonitorProps {
  // Add props if any
}

export interface StructuredDataProps {
  type: string;
  data: any;
}

// Theme Components
export interface ThemeProviderProps {
  children: React.ReactNode;
}

export interface ThemeToggleProps {
  // Add props if any
}

// Contact Component
export interface ContactProps {
  // Add props if any
}

// Content Components
export interface Content1Props {
  // Add props if any
}

// Footer
export interface FooterProps {
  // Add props if any
}

// Logo Cloud
export interface LogoCloudProps {
  // Add props if any
}

// Team Component
export interface TeamProps {
  // Add props if any
}

// Providers
export interface ProvidersProps {
  children: React.ReactNode;
}

// Service Worker Register
export interface ServiceWorkerRegisterProps {
  // Add props if any
}

// Animated Group
export interface AnimatedGroupProps {
  className?: string;
  children: React.ReactNode;
}

// Animated Stats Counter
export interface AnimatedStatsCounterProps {
  // Add props if any
}

// Infinite Slider
export interface InfiniteSliderProps {
  // Add props if any
}

// Lazy Image
export interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

// Error Boundary
export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

// Fallback Component
export interface FallbackComponentProps {
  // Add props if any
}