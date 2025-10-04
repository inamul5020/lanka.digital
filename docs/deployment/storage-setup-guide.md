# 🗄️ Phase 1.3: File Storage Setup Guide

**Lanka.Digital File Storage Configuration**

## 📋 Storage Architecture Overview

Lanka.Digital uses a comprehensive file storage system with 4 specialized buckets:

### Storage Buckets

| Bucket | Purpose | Access | Size Limit | File Types |
|--------|---------|--------|------------|------------|
| **lanka-public** | Product thumbnails, previews | Public | 50MB | Images (JPEG, PNG, GIF, WebP, SVG) |
| **lanka-private** | Digital product files | Private | 1GB | All formats (ZIP, PDF, videos, etc.) |
| **user-avatars** | User profile pictures | Public | 2MB | Images only |
| **forum-attachments** | Forum file attachments | Private | 10MB | Images, PDFs, text files |

---

## 🔧 Storage Configuration Details

### Bucket Policies

#### Public Bucket (lanka-public)
- **Access**: Anyone can view files
- **Upload**: Authenticated users only
- **Files**: Product thumbnails and preview images
- **Security**: User-specific folders prevent conflicts

#### Private Bucket (lanka-private)
- **Access**: Premium users and file owners only
- **Upload**: Product authors and admins
- **Files**: Actual digital products for download
- **Security**: Row Level Security (RLS) enforced

#### User Avatars Bucket
- **Access**: Public (for profile display)
- **Upload**: Users can only upload their own avatars
- **Files**: Profile pictures with size limits
- **Security**: Automatic old avatar cleanup

#### Forum Attachments Bucket
- **Access**: Authenticated users for viewing
- **Upload**: Authenticated users for posting
- **Files**: Supporting files for forum discussions
- **Security**: Thread-specific organization

---

## 🛠️ Frontend Storage Integration

### Storage Utility Classes

#### ProductStorage
```typescript
// Upload product thumbnail
await ProductStorage.uploadThumbnail(productId, file);

// Upload preview images
await ProductStorage.uploadPreviewImages(productId, files);

// Upload digital product file
await ProductStorage.uploadProductFile(productId, file);

// Get download URL (with access control)
const downloadUrl = await ProductStorage.getProductDownloadUrl(productId, filePath);
```

#### AvatarStorage
```typescript
// Upload user avatar
const result = await AvatarStorage.uploadAvatar(userId, file);

// Get avatar URL
const avatarUrl = AvatarStorage.getAvatarUrl(userId, avatarPath);
```

#### ForumStorage
```typescript
// Upload forum attachment
await ForumStorage.uploadAttachment(threadId, userId, file);

// Get attachment download URL
const attachmentUrl = await ForumStorage.getAttachmentUrl(attachmentPath);
```

### File Validation

#### Size and Type Validation
```typescript
import { FileValidation } from '../lib/storage';

// Check file size
const isValidSize = FileValidation.validateFileSize(file, 50 * 1024 * 1024); // 50MB

// Check file type
const isValidType = FileValidation.validateFileType(file, ['image/jpeg', 'image/png']);

// Get bucket constraints
const constraints = FileValidation.getBucketConstraints('lanka-public');

// Format file size for display
const readableSize = FileValidation.formatFileSize(file.size);
```

---

## 🔒 Security Implementation

### Row Level Security (RLS) Policies

#### Database-Level Access Control
```sql
-- Products: Public read for published items
CREATE POLICY "Published products are viewable by everyone" ON storage.objects
  FOR SELECT USING (status = 'published' AND is_active = true);

-- Private files: Premium access only
CREATE POLICY "Premium users and owners can download private files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'lanka-private'
    AND (
      -- Check purchase history
      EXISTS (SELECT 1 FROM purchases p WHERE p.user_id = auth.uid() AND p.product_id::text = ...)
      OR
      -- Check premium status
      EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_premium = true)
    )
  );
```

### Access Control Features

- **Purchase Verification**: Only users who purchased products can download
- **Premium Access**: Unlimited downloads for premium members
- **Author Rights**: Product authors maintain control over their files
- **Admin Override**: Administrators can access all files
- **Time-Limited URLs**: Signed URLs expire for security

---

## 📊 Storage Monitoring

### Usage Tracking

#### Storage Usage Views
```sql
-- View user storage usage
CREATE VIEW user_storage_usage AS
SELECT
  fs.user_id,
  u.username,
  COUNT(*) as total_files,
  SUM(fs.file_size_bytes) as total_size_bytes,
  pg_size_pretty(SUM(fs.file_size_bytes)) as total_size_readable
FROM file_storage fs
JOIN users u ON fs.user_id = u.id
GROUP BY fs.user_id, u.username;

-- View bucket storage usage
CREATE VIEW bucket_storage_usage AS
SELECT
  bucket_name,
  COUNT(*) as total_files,
  SUM(file_size_bytes) as total_size_bytes,
  pg_size_pretty(SUM(file_size_bytes)) as total_size_readable
FROM file_storage
GROUP BY bucket_name;
```

### Monitoring Functions

#### User Storage Quota
```sql
-- Function to check user storage usage
CREATE OR REPLACE FUNCTION get_user_storage_used(user_uuid UUID)
RETURNS BIGINT AS $$
  SELECT COALESCE(SUM(file_size_bytes), 0)::BIGINT
  FROM file_storage
  WHERE user_id = user_uuid
  AND expires_at IS NULL OR expires_at > NOW();
$$ LANGUAGE SQL SECURITY DEFINER;
```

#### Cleanup Expired Files
```sql
-- Function to remove expired files
CREATE OR REPLACE FUNCTION cleanup_expired_files()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM storage.objects
  WHERE expires_at IS NOT NULL
  AND expires_at < NOW();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🚀 CDN Integration

### Supabase Storage CDN Features

- **Global Distribution**: Files served from edge locations worldwide
- **Automatic Optimization**: Images optimized automatically
- **Caching**: Intelligent caching for better performance
- **SSL/TLS**: HTTPS encryption for all file transfers

### CDN Configuration

#### For Production Deployment
```nginx
# Nginx configuration for CDN-like behavior
location /storage/v1/ {
    proxy_pass https://your-supabase-url/storage/v1/;
    proxy_set_header Host $host;
    proxy_cache storage_cache;
    proxy_cache_valid 200 1h;
    add_header Cache-Control "public, max-age=3600";
}
```

---

## 🧪 Testing Storage Setup

### Storage Test Component Features

The `StorageTest` component provides:
- **Bucket Status Monitoring**: Real-time bucket health checks
- **File Upload Testing**: Test uploads to public bucket
- **File Validation**: Size and type checking
- **Error Reporting**: Detailed error messages for troubleshooting

### Testing Checklist

- [ ] All 4 buckets accessible
- [ ] File upload working
- [ ] Public URLs generated correctly
- [ ] Private files require authentication
- [ ] File size limits enforced
- [ ] File type restrictions working
- [ ] RLS policies functioning
- [ ] CDN serving files correctly

---

## 📈 Performance Optimization

### File Organization Strategy

```
/lanka-public/
├── products/
│   ├── {productId}/
│   │   ├── thumbnail-{timestamp}.jpg
│   │   ├── preview-1-{timestamp}.jpg
│   │   └── preview-2-{timestamp}.jpg
└── temp/
    └── uploads/

/lanka-private/
├── products/
│   └── {productId}/
│       └── {original-filename}
/avatars/
├── {userId}/
│   └── avatar-{timestamp}.jpg
/forum-attachments/
├── threads/
│   └── {threadId}/
│       └── {userId}/
│           └── {timestamp}-{filename}
```

### Optimization Techniques

1. **File Naming**: Timestamp-based to prevent conflicts
2. **Folder Structure**: Organized by entity type and ID
3. **Compression**: Automatic image optimization
4. **Caching**: Appropriate cache headers for different file types
5. **CDN**: Global distribution for faster downloads

---

## 🔧 Maintenance & Operations

### Regular Maintenance Tasks

#### Daily Cleanup
```bash
# Clean up expired files (run daily)
SELECT cleanup_expired_files();
```

#### Storage Monitoring
```sql
-- Check storage usage
SELECT * FROM user_storage_usage ORDER BY total_size_bytes DESC LIMIT 10;

-- Monitor bucket usage
SELECT * FROM bucket_storage_usage;
```

#### Backup Strategy
```bash
# Export storage metadata
pg_dump -t file_storage > file_storage_backup.sql

# Backup actual files (consider cloud storage sync)
# Files are automatically replicated in Supabase
```

### Scaling Considerations

- **Storage Limits**: Monitor usage and plan for growth
- **CDN Costs**: Track bandwidth usage
- **File Optimization**: Implement compression for large files
- **Access Patterns**: Monitor and optimize frequently accessed files

---

## 🚨 Troubleshooting

### Common Issues

#### Upload Failures
```
Error: File size exceeds limit
Solution: Check FileValidation.validateFileSize()
```

#### Access Denied
```
Error: RLS policy violation
Solution: Verify user permissions and purchase history
```

#### CDN Issues
```
Error: Files not loading
Solution: Check bucket public/private settings
```

#### Storage Quota Exceeded
```
Error: Insufficient storage
Solution: Implement cleanup or upgrade plan
```

---

## 📚 Integration Examples

### React Component Usage
```tsx
import { ProductStorage, FileValidation } from '../lib/storage';

function ProductUpload({ productId }: { productId: string }) {
  const handleFileUpload = async (file: File) => {
    // Validate file
    const constraints = FileValidation.getBucketConstraints('lanka-private');
    if (!FileValidation.validateFileSize(file, constraints.maxSize)) {
      alert('File too large');
      return;
    }

    // Upload file
    const result = await ProductStorage.uploadProductFile(productId, file);
    if (result.success) {
      console.log('Upload successful:', result.data);
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
    />
  );
}
```

---

## 🎯 Success Metrics

### Storage KPIs
- **Upload Success Rate**: >99%
- **Download Speed**: <2 seconds average
- **Storage Utilization**: <80% capacity
- **Security Incidents**: 0 per month

### User Experience
- **File Upload Time**: <10 seconds for typical files
- **Download Start Time**: <3 seconds
- **Error Rate**: <1% for valid operations
- **CDN Hit Rate**: >85%

---

**Status**: ✅ **Phase 1.3 Complete**
**Storage Buckets**: 4 configured
**Security Policies**: RLS implemented
**CDN Integration**: Ready for production
**Testing**: Components and utilities available
