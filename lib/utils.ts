import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import imageCompression from "browser-image-compression";

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return twMerge(clsx(inputs));
}

// ─── Image Compression Utility ──────────────────────────────
export async function compressImage(file: File, quality = 0.85): Promise<File> {
  // Only compress images
  if (!file.type.startsWith("image/")) return file;

  const options = {
    maxSizeMB: 1, // Target max 1MB
    maxWidthOrHeight: 1920, // 1080p equivalent
    useWebWorker: false, // Disabled due to CSP issues
    initialQuality: quality,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // Return the name and type from original file
    return new File([compressedFile], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Image compression failed:", error);
    return file;
  }
}
