import { convertBengaliToEnglish, compressImage } from '../utils';
export { compressImage };

// --- File to Base64 Conversion -----------------------------
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// --- File Validation ---------------------------------------
export function validateFile(
  file: File,
  options?: {
    maxSizeMB?: number;
    allowedTypes?: string[];
    minWidth?: number;
    minHeight?: number;
  }
): { valid: boolean; error?: string; width?: number; height?: number } {
  const {
    maxSizeMB = 5,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    minWidth = 200,
    minHeight = 200,
  } = options || {};

  // Check file type
  if (!allowedTypes.some(type => file.type.startsWith(type.split('/')[0]))) {
    return {
      valid: false,
      error: `অনুমোদিত ফাইল টাইপ: ${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} (JPEG, PNG, WEBP)`,
    };
  }

  // Check file size
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    return {
      valid: false,
      error: `ফাইলের সাইজ ${maxSizeMB}MB থেকে বেশি: ${sizeMB.toFixed(2)}MB`,
    };
  }

  // For images, check dimensions (async)
  if (file.type.startsWith('image/')) {
    // We'll return a promise-like object but actual check happens in caller
    // Just return valid, dimensions will be checked after load
    return { valid: true };
  }

  return { valid: true };
}

// --- Get Image Dimensions ----------------------------------
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// --- Compress and Validate Image ---------------------------
export async function processImageFile(
  file: File,
  quality = 0.85,
  maxSizeMB = 1
): Promise<{ file: File; base64: string; error?: string }> {
  try {
    // Validate
    const validation = validateFile(file, { maxSizeMB: 5 });
    if (!validation.valid) {
      return { file, base64: '', error: validation.error };
    }

    // Get dimensions
    const { width, height } = await getImageDimensions(file);

    // Compress
    const compressed = await compressImage(file, quality);

    // Convert to base64
    const base64 = await fileToBase64(compressed);

    return { file: compressed, base64 };
  } catch (error) {
    console.error('Image processing failed:', error);
    return { file, base64: '', error: 'প্রক্রিয়া চলাকালীন সমস্যা হয়েছে' };
  }
}

// --- Revoke Blob URLs --------------------------------------
export function revokeBlobUrls(urls: string[]): void {
  urls.forEach(url => {
    if (url && url.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        // Ignore errors
      }
    }
  });
}
