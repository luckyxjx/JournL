'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalPhoto } from '@/lib/storage/db';
import Image from 'next/image';

interface PhotoAttachmentProps {
  photos: LocalPhoto[];
  onPhotosChange: (photos: LocalPhoto[]) => void;
  maxSizeMB?: number;
}

export default function PhotoAttachment({
  photos,
  onPhotosChange,
  maxSizeMB = 2,
}: PhotoAttachmentProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      const newPhotos: LocalPhoto[] = [];

      for (const file of Array.from(files)) {
        // Multi-layer validation: MIME type, extension, and file signature
        const isValid = await validateImageFile(file);
        if (!isValid.valid) {
          setError(isValid.error);
          continue;
        }

        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
          setError(`Image must be smaller than ${maxSizeMB}MB`);
          continue;
        }

        // Convert to base64 with compression and sanitization
        const dataUrl = await processImage(file, maxSizeMB);
        
        // Validate data URL format to prevent XSS
        if (!isValidDataUrl(dataUrl)) {
          setError('Invalid image data format');
          continue;
        }

        const photo: LocalPhoto = {
          id: crypto.randomUUID(),
          dataUrl,
          addedAt: new Date(),
        };

        newPhotos.push(photo);
      }

      if (newPhotos.length > 0) {
        onPhotosChange([...photos, ...newPhotos]);
      }
    } catch (err) {
      setError('Failed to process image');
      console.error('Image processing error:', err);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    onPhotosChange(photos.filter((p) => p.id !== photoId));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Upload Button */}
      <button
        type="button"
        onClick={handleUploadClick}
        disabled={isUploading}
        className="
          flex items-center gap-2 px-4 py-2 rounded-xl
          bg-peaceful-button/20 hover:bg-peaceful-button/30
          text-peaceful-text font-medium
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {isUploading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <UploadIcon className="w-5 h-5" />
            </motion.div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <PhotoIcon className="w-5 h-5" />
            <span>Add Photo</span>
          </>
        )}
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-red-600"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {photos.map((photo) => (
              <PhotoThumbnail
                key={photo.id}
                photo={photo}
                onDelete={() => handleDeletePhoto(photo.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// Photo Thumbnail Component
interface PhotoThumbnailProps {
  photo: LocalPhoto;
  onDelete: () => void;
}

function PhotoThumbnail({ photo, onDelete }: PhotoThumbnailProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative group aspect-square rounded-2xl overflow-hidden bg-gray-100"
    >
      {/* Photo */}
      <img
        src={photo.dataUrl}
        alt={photo.caption || 'Attached photo'}
        className="w-full h-full object-cover"
      />

      {/* Delete Button Overlay */}
      <div className="
        absolute inset-0 bg-black/0 group-hover:bg-black/40
        transition-colors duration-200
        flex items-center justify-center
      ">
        <button
          onClick={onDelete}
          className="
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            p-2 rounded-full bg-red-500 hover:bg-red-600
            text-white
          "
          title="Delete photo"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}

// Image Processing Function
async function processImage(file: File, maxSizeMB: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;

      // Check if compression is needed
      const sizeInMB = dataUrl.length / (1024 * 1024);
      
      if (sizeInMB <= maxSizeMB) {
        resolve(dataUrl);
        return;
      }

      // Compress image
      try {
        const compressed = await compressImage(dataUrl, maxSizeMB);
        resolve(compressed);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

// Image Compression Function
async function compressImage(dataUrl: string, maxSizeMB: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Calculate new dimensions (maintain aspect ratio)
      let width = img.width;
      let height = img.height;
      const maxDimension = 1920; // Max width or height

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      // Try different quality levels until size is acceptable
      let quality = 0.9;
      let compressed = canvas.toDataURL('image/jpeg', quality);

      while (compressed.length / (1024 * 1024) > maxSizeMB && quality > 0.1) {
        quality -= 0.1;
        compressed = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(compressed);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = dataUrl;
  });
}

// Data URL validation to prevent XSS
function isValidDataUrl(dataUrl: string): boolean {
  const validPrefixes = [
    'data:image/jpeg;base64,',
    'data:image/jpg;base64,',
    'data:image/png;base64,',
    'data:image/gif;base64,',
    'data:image/webp;base64,'
  ];
  
  return validPrefixes.some(prefix => dataUrl.startsWith(prefix)) &&
         /^[A-Za-z0-9+/=]+$/.test(dataUrl.split(',')[1] || '');
}

// Multi-layer file validation with detailed error reporting
async function validateImageFile(file: File): Promise<{valid: boolean, error: string}> {
  // Layer 1: MIME type validation
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedMimeTypes.includes(file.type)) {
    return {valid: false, error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are supported.'};
  }
  
  // Layer 2: File extension validation
  const fileName = file.name.toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  if (!hasValidExtension) {
    return {valid: false, error: 'Invalid file extension. Use .jpg, .jpeg, .png, .gif, or .webp'};
  }
  
  // Layer 3: File signature validation (magic bytes)
  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer.slice(0, 12));
    
    const signatures = {
      jpeg: [0xFF, 0xD8, 0xFF],
      png: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
      gif87a: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61],
      gif89a: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61],
      webp: [0x52, 0x49, 0x46, 0x46]
    };
    
    const hasValidSignature = Object.values(signatures).some(sig => 
      sig.every((byte, i) => bytes[i] === byte)
    );
    
    if (!hasValidSignature) {
      return {valid: false, error: 'File appears to be corrupted or not a valid image.'};
    }
    
    return {valid: true, error: ''};
  } catch (error) {
    return {valid: false, error: 'Unable to read file for validation.'};
  }
}

// Icon Components
function PhotoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
