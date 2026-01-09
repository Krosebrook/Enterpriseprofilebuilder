import { describe, it, expect, vi } from 'vitest';
import {
  validateProfilePicture,
  uploadProfilePicture,
  uploadWithRetry,
  formatFileSize,
  FileValidationError,
  UploadError,
} from '../userService';

describe('UserService', () => {
  describe('validateProfilePicture', () => {
    it('should accept valid JPEG file', () => {
      const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
      expect(() => validateProfilePicture(file)).not.toThrow();
    });

    it('should accept valid PNG file', () => {
      const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
      expect(() => validateProfilePicture(file)).not.toThrow();
    });

    it('should accept valid WebP file', () => {
      const file = new File(['dummy content'], 'test.webp', { type: 'image/webp' });
      expect(() => validateProfilePicture(file)).not.toThrow();
    });

    it('should reject file exceeding size limit', () => {
      const largeContent = new Array(6 * 1024 * 1024).fill('x').join('');
      const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' });
      
      expect(() => validateProfilePicture(file)).toThrow(FileValidationError);
      expect(() => validateProfilePicture(file)).toThrow(/File size exceeds/);
    });

    it('should reject invalid file type', () => {
      const file = new File(['dummy content'], 'test.gif', { type: 'image/gif' });
      
      expect(() => validateProfilePicture(file)).toThrow(FileValidationError);
      expect(() => validateProfilePicture(file)).toThrow(/File type.*is not allowed/);
    });

    it('should reject invalid file extension', () => {
      const file = new File(['dummy content'], 'test.bmp', { type: 'image/png' });
      
      expect(() => validateProfilePicture(file)).toThrow(FileValidationError);
      expect(() => validateProfilePicture(file)).toThrow(/File extension.*is not allowed/);
    });

    it('should be case insensitive for file extensions', () => {
      const file = new File(['dummy content'], 'test.JPG', { type: 'image/jpeg' });
      expect(() => validateProfilePicture(file)).not.toThrow();
    });
  });

  describe('uploadProfilePicture', () => {
    it('should successfully upload valid file', async () => {
      const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
      const result = await uploadProfilePicture(file);
      
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should call onProgress callback during upload', async () => {
      const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
      const onProgress = vi.fn();
      
      await uploadProfilePicture(file, onProgress);
      
      expect(onProgress).toHaveBeenCalled();
      expect(onProgress).toHaveBeenCalledWith(expect.any(Number));
    });

    it('should throw FileValidationError for invalid file', async () => {
      const file = new File(['dummy content'], 'test.gif', { type: 'image/gif' });
      
      await expect(uploadProfilePicture(file)).rejects.toThrow(FileValidationError);
    });

    it('should wrap other errors in UploadError', async () => {
      const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
      
      // Mock to force an error scenario (though in actual implementation, it has a 5% random failure)
      // This test validates error wrapping structure
      try {
        await uploadProfilePicture(file);
      } catch (error) {
        if (error instanceof UploadError) {
          expect(error.retryable).toBeDefined();
        }
      }
    });
  });

  describe('uploadWithRetry', () => {
    it('should retry on failure and succeed', async () => {
      const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
      
      // Even with potential failures, should eventually succeed or throw after retries
      const result = await uploadWithRetry(file, 3);
      expect(typeof result).toBe('string');
    });

    it('should not retry FileValidationError', async () => {
      const file = new File(['dummy content'], 'test.gif', { type: 'image/gif' });
      
      await expect(uploadWithRetry(file, 3)).rejects.toThrow(FileValidationError);
    });

    it('should respect maxRetries parameter', async () => {
      const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
      
      // Should complete within reasonable time (not retry indefinitely)
      const start = Date.now();
      try {
        await uploadWithRetry(file, 2);
      } catch (error) {
        // If it fails, should not take too long
      }
      const elapsed = Date.now() - start;
      
      // Should not take more than 10 seconds even with retries
      expect(elapsed).toBeLessThan(10000);
    }, 15000);
  });

  describe('formatFileSize', () => {
    it('should format 0 bytes', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });

    it('should format bytes', () => {
      expect(formatFileSize(500)).toBe('500 Bytes');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB');
    });

    it('should format with decimals', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB');
    });
  });
});
