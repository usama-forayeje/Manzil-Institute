export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => {
      reject(new Error(`Failed to load image: ${typeof url === 'string' ? url.slice(0, 100) : 'unknown'}`));
    };

    if (url.startsWith('http://') || url.startsWith('https://')) {
      image.crossOrigin = 'anonymous';
      image.src = `/api/image-proxy?url=${encodeURIComponent(url)}`;
    } else {
      image.src = url;
    }
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Common function to process, crop, rotate and compress images to WebP
 */
export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: any,
  rotation = 0,
  isProfileImage = false
): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  // --- Compression & Formatting Logic ---
  // High fidelity export for print & ID card clarity: 0.85 quality
  const quality = 0.85;

  // Final export as WebP for best compression ratio
  return canvas.toDataURL('image/webp', quality);
};
