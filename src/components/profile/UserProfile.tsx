import React, { useState, useRef } from 'react';
import { User } from '../../types/domain';
import {
  uploadWithRetry,
  formatFileSize,
  FileValidationError,
  UploadError,
} from '../../services/userService';
import { storageService } from '../../services/storage';

interface UserProfileProps {
  user: User;
  onUpdate?: (user: User) => void;
  onError?: (error: Error) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate, onError }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.avatarUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset error state
    setError(null);
    setUploadProgress(0);

    // Create preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Start upload asynchronously (not awaited intentionally for UX)
    void (async () => {
      try {
        setUploading(true);
        const avatarUrl = await uploadWithRetry(
          file,
          3,
          (progress) => setUploadProgress(progress)
        );

        // Update user profile with new avatar URL
        const updatedUser: User = {
          ...user,
          avatarUrl,
        };

        // Save to storage
        storageService.setUser(updatedUser);

        // Notify parent component
        onUpdate?.(updatedUser);

        setUploading(false);
        setUploadProgress(100);
      } catch (err) {
        setUploading(false);
        setUploadProgress(0);
        
        // Handle different error types
        let errorMessage = 'Failed to upload profile picture';
        
        if (err instanceof FileValidationError) {
          errorMessage = err.message;
        } else if (err instanceof UploadError) {
          errorMessage = err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        setPreviewUrl(user.avatarUrl || null); // Revert to original avatar
        
        // Notify parent component
        if (err instanceof Error) {
          onError?.(err);
        }
      }
    })();
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePicture = () => {
    const updatedUser: User = {
      ...user,
      avatarUrl: undefined,
    };
    
    setPreviewUrl(null);
    storageService.setUser(updatedUser);
    onUpdate?.(updatedUser);
  };

  return (
    <div className="user-profile-container">
      {/* Profile Picture Section */}
      <div className="profile-picture-section">
        <div className="avatar-container">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={`${user.name}'s avatar`}
              className="avatar-image"
            />
          ) : (
            <div className="avatar-placeholder">
              <span className="avatar-initials">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            </div>
          )}
          
          {uploading && (
            <div className="upload-overlay">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="upload-controls">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            disabled={uploading}
            className="file-input"
            aria-label="Upload profile picture"
          />
          
          <button
            onClick={handleButtonClick}
            disabled={uploading}
            className="upload-button"
          >
            {uploading ? 'Uploading...' : previewUrl ? 'Change Picture' : 'Upload Picture'}
          </button>
          
          {previewUrl && !uploading && (
            <button
              onClick={handleRemovePicture}
              className="remove-button"
            >
              Remove Picture
            </button>
          )}
        </div>

        {/* Upload Guidelines */}
        <div className="upload-guidelines">
          <p className="guidelines-text">
            Max file size: {formatFileSize(5 * 1024 * 1024)}
          </p>
          <p className="guidelines-text">
            Supported formats: JPG, PNG, WebP
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* User Information */}
      <div className="user-info-section">
        <h2 className="user-name">{user.name}</h2>
        <p className="user-email">{user.email}</p>
        <span className="user-role-badge">{user.role}</span>
      </div>

      {/* Inline styles for quick implementation - should be moved to CSS module in production */}
      <style>{`
        .user-profile-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .profile-picture-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .avatar-container {
          position: relative;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #e5e7eb;
          background-color: #f3f4f6;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .avatar-initials {
          font-size: 3rem;
          font-weight: bold;
          color: white;
        }

        .upload-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .progress-bar {
          width: 80%;
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #10b981;
          transition: width 0.3s ease;
        }

        .progress-text {
          color: white;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .upload-controls {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .file-input {
          display: none;
        }

        .upload-button,
        .remove-button {
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .upload-button {
          background: #3b82f6;
          color: white;
        }

        .upload-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .upload-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .remove-button {
          background: #ef4444;
          color: white;
        }

        .remove-button:hover {
          background: #dc2626;
        }

        .upload-guidelines {
          text-align: center;
        }

        .guidelines-text {
          font-size: 0.75rem;
          color: #6b7280;
          margin: 0.25rem 0;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          color: #991b1b;
          font-size: 0.875rem;
        }

        .error-icon {
          font-size: 1.25rem;
        }

        .user-info-section {
          text-align: center;
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .user-name {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          color: #111827;
        }

        .user-email {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0 0 0.75rem 0;
        }

        .user-role-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #dbeafe;
          color: #1e40af;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
