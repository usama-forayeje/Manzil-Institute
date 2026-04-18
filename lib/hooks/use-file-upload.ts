"use client";

import { useState, useCallback, useRef } from 'react';
import { compressImage, fileToBase64, validateFile, getImageDimensions, revokeBlobUrls } from '@/lib/utils/file';

export interface FileUploadState<T = File> {
  files: T[];
  previews: string[];
  errors: string[];
  isProcessing: boolean;
}

export function useFileUpload<T extends File = File>(options?: {
  maxSizeMB?: number;
  allowedTypes?: string[];
  maxFiles?: number;
  compress?: boolean;
  compressionQuality?: number;
}) {
  const { maxSizeMB = 5, allowedTypes, maxFiles = 1, compress = true, compressionQuality = 0.85 } = options || {};

  const [state, setState] = useState<FileUploadState<T>>({
    files: [] as T[],
    previews: [],
    errors: [],
    isProcessing: false,
  });

  const cleanupRef = useRef<string[]>([]);

  const cleanup = useCallback(() => {
    revokeBlobUrls(cleanupRef.current);
    cleanupRef.current = [];
  }, []);

  const processFiles = useCallback(async (files: FileList | File[]): Promise<void> => {
    const fileArray = Array.from(files);
    
    if (maxFiles && fileArray.length > maxFiles) {
      setState(prev => ({
        ...prev,
        errors: [`???????? ${maxFiles}?? ???? ????? ???? ??????`],
      }));
      return;
    }

    setState(prev => ({ ...prev, isProcessing: true, errors: [] }));

    try {
      const processedFiles: T[] = [];
      const previews: string[] = [];

      for (const file of fileArray) {
        // Validate
        const validation = validateFile(file, { maxSizeMB, allowedTypes });
        if (!validation.valid) {
          setState(prev => ({
            ...prev,
            errors: [...prev.errors, validation.error!],
          }));
          continue;
        }

        // Get dimensions if image
        if (file.type.startsWith('image/')) {
          const { width, height } = await getImageDimensions(file);
          // Could add dimension validation here
        }

        // Compress if needed
        const processedFile = compress && file.type.startsWith('image/')
          ? (await compressImage(file, compressionQuality)) as T
          : file as T;

        processedFiles.push(processedFile);

        // Generate preview
        const preview = await fileToBase64(processedFile);
        previews.push(preview);
      }

      setState(prev => ({
        ...prev,
        files: maxFiles === 1 ? [processedFiles[0]] : [...prev.files, ...processedFiles] as T[],
        previews: maxFiles === 1 ? [previews[0]] : [...prev.previews, ...previews],
        isProcessing: false,
      }));

      cleanupRef.current.push(...previews);
    } catch (error) {
      console.error('File processing error:', error);
      setState(prev => ({
        ...prev,
        errors: ['???? ???????? ? ?????? ??????'],
        isProcessing: false,
      }));
    }
  }, [maxSizeMB, allowedTypes, maxFiles, compress, compressionQuality]);

  const addFiles = useCallback((files: FileList | File[]) => {
    return processFiles(files);
  }, [processFiles]);

  const removeFile = useCallback((index: number) => {
    setState(prev => {
      const newFiles = prev.files.filter((_, i) => i !== index);
      const newPreviews = prev.previews.filter((_, i) => i !== index);
      return { ...prev, files: newFiles, previews: newPreviews };
    });
  }, []);

  const clearAll = useCallback(() => {
    cleanup();
    setState({
      files: [] as T[],
      previews: [],
      errors: [],
      isProcessing: false,
    });
  }, [cleanup]);

  return {
    ...state,
    addFiles,
    removeFile,
    clearAll,
    cleanup,
    setPreviews: (previews: string[]) => setState(prev => ({ ...prev, previews })),
    setFiles: (files: T[]) => setState(prev => ({ ...prev, files })),
  };
}
