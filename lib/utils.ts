import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import imageCompression from 'browser-image-compression';

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return twMerge(clsx(inputs));
}

// ─── Bengali to English Number Conversion ───────────────────
export function convertBengaliToEnglish(text: string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return text.replace(/[০-৯]/g, char => {
    const index = bengaliDigits.indexOf(char);
    return index !== -1 ? englishDigits[index] : char;
  });
}

// ─── Gender Normalization ───────────────────────────────────
export function normalizeGender(
  gender: string | undefined | null
): 'male' | 'female' | undefined {
  if (!gender) return undefined;
  const g = gender.toLowerCase().trim();
  if (g === 'পুরুষ' || g === 'male') return 'male';
  if (g === 'মহিলা' || g === 'female') return 'female';
  return undefined;
}

// ─── Image Compression Utility ──────────────────────────────
export async function compressImage(file: File, quality = 0.85): Promise<File> {
  // Default 85% quality compression
  // Only compress images
  if (!file.type.startsWith('image/')) return file;

  const originalSize = (file.size / 1024 / 1024).toFixed(2); // MB

  const options = {
    maxSizeMB: 1, // Target max 1MB
    maxWidthOrHeight: 1920, // 1080p equivalent
    useWebWorker: false, // Disabled due to CSP issues
    initialQuality: quality,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2); // MB
    const compressionRatio = (
      ((file.size - compressedFile.size) / file.size) *
      100
    ).toFixed(1);

    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `🗜️ Image compressed: ${originalSize}MB → ${compressedSize}MB (${compressionRatio}% reduction)`
      );
    }

    // Return the name and type from original file
    return new File([compressedFile], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error('❌ Image compression failed:', error);
    return file;
  }
}
