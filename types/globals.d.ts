// Global type declarations

declare global {
  // Extend Window interface if needed
  interface Window {
    // Add any global window properties
  }

  // Extend Navigator interface if needed
  interface Navigator {
    // Add any navigator properties
  }

  // Global constants
  const __DEV__: boolean;
  const __PROD__: boolean;

  // Module declarations for non-TypeScript modules
  declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
  }

  declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
  }

  declare module '*.sass' {
    const content: { [className: string]: string };
    export default content;
  }

  declare module '*.png' {
    const src: string;
    export default src;
  }

  declare module '*.jpg' {
    const src: string;
    export default src;
  }

  declare module '*.jpeg' {
    const src: string;
    export default src;
  }

  declare module '*.gif' {
    const src: string;
    export default src;
  }

  declare module '*.svg' {
    const src: string;
    export default src;
  }

  declare module '*.webp' {
    const src: string;
    export default src;
  }

  declare module '*.ico' {
    const src: string;
    export default src;
  }
}

export {};