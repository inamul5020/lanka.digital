import { supabase } from './supabase';

// Storage bucket names
export const STORAGE_BUCKETS = {
  PUBLIC: 'lanka-public',
  PRIVATE: 'lanka-private',
  AVATARS: 'user-avatars',
  FORUM_ATTACHMENTS: 'forum-attachments',
} as const;

// File upload options
export interface UploadOptions {
  bucket: string;
  path: string;
  file: File;
  metadata?: Record<string, any>;
  onProgress?: (progress: number) => void;
}

// File download options
export interface DownloadOptions {
  bucket: string;
  path: string;
  expiresIn?: number; // seconds
}

// Storage utility functions
export class StorageService {
  /**
   * Upload a file to Supabase Storage
   */
  static async uploadFile({
    bucket,
    path,
    file,
    metadata = {},
    onProgress
  }: UploadOptions) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          metadata
        });

      if (error) throw error;

      // Get public URL if it's a public bucket
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return {
        success: true,
        data: {
          ...data,
          publicUrl,
          bucket,
          path
        }
      };
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Get a public URL for a file
   */
  static getPublicUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Get a signed URL for private files
   */
  static async getSignedUrl(bucket: string, path: string, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) throw error;

      return {
        success: true,
        data: data.signedUrl
      };
    } catch (error) {
      console.error('Failed to create signed URL:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create signed URL'
      };
    }
  }

  /**
   * Download a file
   */
  static async downloadFile(bucket: string, path: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Download failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Download failed'
      };
    }
  }

  /**
   * Delete a file
   */
  static async deleteFile(bucket: string, path: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Delete failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      };
    }
  }

  /**
   * List files in a bucket/folder
   */
  static async listFiles(bucket: string, path = '', limit = 100) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path, {
          limit,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('List files failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'List files failed'
      };
    }
  }

  /**
   * Move/rename a file
   */
  static async moveFile(bucket: string, fromPath: string, toPath: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .move(fromPath, toPath);

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Move file failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Move file failed'
      };
    }
  }
}

// Product file utilities
export class ProductStorage {
  /**
   * Upload product thumbnail
   */
  static async uploadThumbnail(productId: string, file: File) {
    const path = `products/${productId}/thumbnail-${Date.now()}.${file.name.split('.').pop()}`;
    return StorageService.uploadFile({
      bucket: STORAGE_BUCKETS.PUBLIC,
      path,
      file
    });
  }

  /**
   * Upload product preview images
   */
  static async uploadPreviewImages(productId: string, files: File[]) {
    const results = await Promise.all(
      files.map(async (file, index) => {
        const path = `products/${productId}/preview-${index + 1}-${Date.now()}.${file.name.split('.').pop()}`;
        return StorageService.uploadFile({
          bucket: STORAGE_BUCKETS.PUBLIC,
          path,
          file
        });
      })
    );

    return results;
  }

  /**
   * Upload product file (digital download)
   */
  static async uploadProductFile(productId: string, file: File) {
    const path = `products/${productId}/${file.name}`;
    return StorageService.uploadFile({
      bucket: STORAGE_BUCKETS.PRIVATE,
      path,
      file
    });
  }

  /**
   * Get product download URL (with access control)
   */
  static async getProductDownloadUrl(productId: string, filePath: string) {
    // Check if user has permission (this would be handled by RLS policies)
    return StorageService.getSignedUrl(STORAGE_BUCKETS.PRIVATE, filePath, 3600); // 1 hour expiry
  }
}

// User avatar utilities
export class AvatarStorage {
  /**
   * Upload user avatar
   */
  static async uploadAvatar(userId: string, file: File) {
    // Delete old avatar first
    await AvatarStorage.deleteOldAvatar(userId);

    const extension = file.name.split('.').pop();
    const path = `avatars/${userId}/avatar-${Date.now()}.${extension}`;

    return StorageService.uploadFile({
      bucket: STORAGE_BUCKETS.AVATARS,
      path,
      file
    });
  }

  /**
   * Delete old avatar for user
   */
  static async deleteOldAvatar(userId: string) {
    try {
      const listResult = await StorageService.listFiles(STORAGE_BUCKETS.AVATARS, `avatars/${userId}`);
      if (listResult.success && listResult.data) {
        const filesToDelete = listResult.data.map(file => `avatars/${userId}/${file.name}`);
        if (filesToDelete.length > 0) {
          await StorageService.deleteFile(STORAGE_BUCKETS.AVATARS, filesToDelete[0]);
        }
      }
    } catch (error) {
      // Ignore errors when deleting old avatars
      console.log('No old avatar to delete');
    }
  }

  /**
   * Get avatar URL
   */
  static getAvatarUrl(userId: string, avatarPath?: string) {
    if (avatarPath) {
      return StorageService.getPublicUrl(STORAGE_BUCKETS.AVATARS, avatarPath);
    }
    return null;
  }
}

// Forum attachment utilities
export class ForumStorage {
  /**
   * Upload forum attachment
   */
  static async uploadAttachment(threadId: string, userId: string, file: File) {
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const path = `threads/${threadId}/${userId}/${timestamp}-${file.name}`;

    return StorageService.uploadFile({
      bucket: STORAGE_BUCKETS.FORUM_ATTACHMENTS,
      path,
      file
    });
  }

  /**
   * Get attachment download URL
   */
  static async getAttachmentUrl(attachmentPath: string) {
    return StorageService.getSignedUrl(STORAGE_BUCKETS.FORUM_ATTACHMENTS, attachmentPath, 3600);
  }
}

// File validation utilities
export class FileValidation {
  /**
   * Validate file size
   */
  static validateFileSize(file: File, maxSizeBytes: number): boolean {
    return file.size <= maxSizeBytes;
  }

  /**
   * Validate file type
   */
  static validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  /**
   * Get file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get bucket constraints
   */
  static getBucketConstraints(bucket: string) {
    const constraints = {
      [STORAGE_BUCKETS.PUBLIC]: {
        maxSize: 50 * 1024 * 1024, // 50MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
      },
      [STORAGE_BUCKETS.PRIVATE]: {
        maxSize: 1024 * 1024 * 1024, // 1GB
        allowedTypes: [
          'application/zip', 'application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg', 'image/png', 'video/mp4', 'audio/mp3'
        ]
      },
      [STORAGE_BUCKETS.AVATARS]: {
        maxSize: 2 * 1024 * 1024, // 2MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      },
      [STORAGE_BUCKETS.FORUM_ATTACHMENTS]: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain']
      }
    };

    return constraints[bucket as keyof typeof constraints] || null;
  }
}
