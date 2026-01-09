import { User } from '../types/domain';

// File upload constraints
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Custom error types for better error handling
export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileValidationError';
  }
}

export class UploadError extends Error {
  constructor(message: string, public readonly retryable: boolean = false) {
    super(message);
    this.name = 'UploadError';
  }
}

export class UserServiceError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'UserServiceError';
  }
}

// Validate file before upload
export const validateProfilePicture = (file: File): void => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new FileValidationError(
      `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    );
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new FileValidationError(
      `File type ${file.type} is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
    );
  }

  // Check file extension
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    throw new FileValidationError(
      `File extension ${extension} is not allowed. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`
    );
  }
};

// Upload profile picture with retry logic
export const uploadProfilePicture = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // Validate file first
    validateProfilePicture(file);

    // Simulate upload progress (in real implementation, use Supabase Storage)
    // This would be replaced with actual Supabase storage upload
    return await simulateUpload(file, onProgress);
  } catch (error) {
    if (error instanceof FileValidationError) {
      throw error;
    }
    throw new UploadError(
      `Failed to upload profile picture: ${error instanceof Error ? error.message : 'Unknown error'}`,
      true // Mark as retryable
    );
  }
};

// Simulate upload for demonstration (replace with actual Supabase implementation)
const simulateUpload = (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress?.(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // Generate a simulated URL (in real app, this would be Supabase storage URL)
        const simulatedUrl = URL.createObjectURL(file);
        resolve(simulatedUrl);
      }
    }, 100);

    // Simulate potential network error (5% chance)
    if (Math.random() < 0.05) {
      clearInterval(interval);
      reject(new Error('Network error during upload'));
    }
  });
};

// Upload with automatic retry
export const uploadWithRetry = async (
  file: File,
  maxRetries: number = 3,
  onProgress?: (progress: number) => void
): Promise<string> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadProfilePicture(file, onProgress);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Don't retry validation errors
      if (error instanceof FileValidationError) {
        throw error;
      }
      
      // Don't retry if not retryable
      if (error instanceof UploadError && !error.retryable) {
        throw error;
      }
      
      // Wait before retry with exponential backoff
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw new UploadError(
    `Failed to upload after ${maxRetries} attempts: ${lastError?.message}`,
    false
  );
};

// Update user profile
export const updateUserProfile = (
  userId: string,
  updates: Partial<User>
): User => {
  // In real implementation, this would call Supabase API
  // For now, we'll simulate the update
  const currentUser = getUserProfile(userId);
  const updatedUser: User = {
    ...currentUser,
    ...updates,
  };
  
  // Save to storage (in real app, save to Supabase)
  return updatedUser;
};

// Get user profile
export const getUserProfile = (userId: string): User => {
  // In real implementation, fetch from Supabase
  // For now, return a mock user
  const mockUser: User = {
    id: userId,
    email: 'user@example.com',
    name: 'Enterprise User',
    role: 'editor',
    preferences: {
      theme: 'system',
      notifications: true,
      reducedMotion: false,
    },
  };
  
  return mockUser;
};

// Helper to format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
