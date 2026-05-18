import { beforeAll, afterEach, afterAll, vi } from 'vitest';

// 1. Initial Mocks for standard browser APIs
if (typeof window !== 'undefined') {
  // Use window instead of global for browser environment
  (window as any).ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

beforeAll(() => {
  // Global initializer
});

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
});
