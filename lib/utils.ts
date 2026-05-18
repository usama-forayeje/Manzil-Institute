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

// ─── English to Bengali Number Conversion ───────────────────
export function convertEnglishToBengali(text: string | number): string {
  if (text === null || text === undefined) return '';
  const engStr = String(text);
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return engStr.replace(/\d/g, char => bengaliDigits[Number(char)] || char);
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
export async function compressImage(file: File, quality = 0.7): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const options = {
    maxSizeMB: quality < 0.6 ? 0.2 : 0.5, // Profile (low quality) gets smaller size limit
    maxWidthOrHeight: 1280, // Resize for better performance
    useWebWorker: true,
    initialQuality: quality,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return new File([compressedFile], file.name, { type: file.type });
  } catch (error) {
    console.error('❌ Image compression failed:', error);
    return file;
  }
}

// Convert Base64 to File for compression, then back to Base64
export async function compressBase64(base64: string, quality = 0.7): Promise<string> {
  try {
    // 1. Get blob from base64
    const res = await fetch(base64);
    const blob = await res.blob();
    const file = new File([blob], "image.jpg", { type: blob.type });

    // 2. Compress
    const compressedFile = await compressImage(file, quality);

    // 3. Back to base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => resolve(reader.result as string);
    });
  } catch (err) {
    console.error('❌ Base64 compression failed:', err);
    return base64;
  }
}
