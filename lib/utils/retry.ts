/**
 * Retry a promise with exponential backoff
 * @param fn Async function to retry
 * @param maxRetries Maximum number of retry attempts (default: 3)
 * @param initialDelay Initial delay in ms (default: 1000)
 * @param maxDelay Maximum delay in ms (default: 10000)
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    onRetry?: (attempt: number, error: Error) => void;
  }
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    onRetry,
  } = options || {};

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        // Calculate exponential backoff delay
        const delay = Math.min(initialDelay * 2 ** (attempt - 1), maxDelay);
        // Add jitter to prevent thundering herd
        const jitter = delay * 0.1 * (Math.random() - 0.5);
        const actualDelay = delay + jitter;
        await new Promise(resolve => setTimeout(resolve, actualDelay));
      }
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on certain errors
      if (error instanceof Error) {
        const message = error.message;
        // Don't retry on validation errors or auth errors
        if (
          message.includes('VALIDATION') ||
          message.includes('AUTH') ||
          message.includes('Unauthorized')
        ) {
          throw error;
        }
      }

      if (attempt < maxRetries) {
        onRetry?.(attempt + 1, error as Error);
        console.warn(
          `Retry attempt ${attempt + 1}/${maxRetries} failed, retrying...`,
          error
        );
      }
    }
  }

  throw lastError;
}
