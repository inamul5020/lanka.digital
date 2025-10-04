-- Lanka.Digital File Storage Configuration
-- Phase 1.3: File Storage Configuration

-- ===========================================
-- STORAGE BUCKETS CONFIGURATION
-- ===========================================

-- Create public bucket for product thumbnails and previews
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lanka-public',
  'lanka-public',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ]
);

-- Create private bucket for full digital products
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lanka-private',
  'lanka-private',
  false,
  1073741824, -- 1GB limit for large files
  ARRAY[
    'application/zip',
    'application/x-zip-compressed',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'video/mp4',
    'video/avi',
    'video/mov',
    'audio/mp3',
    'audio/wav',
    'audio/m4a'
  ]
);

-- Create bucket for user avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-avatars',
  'user-avatars',
  true,
  2097152, -- 2MB limit for avatars
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
);

-- Create bucket for forum attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'forum-attachments',
  'forum-attachments',
  false,
  10485760, -- 10MB limit for forum attachments
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain'
  ]
);

-- ===========================================
-- STORAGE POLICIES
-- ===========================================

-- Public bucket policies (lanka-public)
-- Allow anyone to view files
CREATE POLICY "Public bucket files are viewable by everyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'lanka-public');

-- Allow authenticated users to upload to public bucket
CREATE POLICY "Authenticated users can upload to public bucket" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'lanka-public'
    AND auth.role() = 'authenticated'
  );

-- Allow users to update their own uploads in public bucket
CREATE POLICY "Users can update their own files in public bucket" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'lanka-public'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own uploads in public bucket
CREATE POLICY "Users can delete their own files in public bucket" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'lanka-public'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Private bucket policies (lanka-private)
-- Allow authenticated users to view files (will be filtered by RLS later)
CREATE POLICY "Authenticated users can view private files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'lanka-private'
    AND auth.role() = 'authenticated'
  );

-- Allow premium users and file owners to download private files
CREATE POLICY "Premium users and owners can download private files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'lanka-private'
    AND (
      -- Check if user has purchased the product or is premium
      EXISTS (
        SELECT 1 FROM purchases p
        WHERE p.user_id = auth.uid()
        AND p.product_id::text = (storage.foldername(name))[1]
        AND p.status = 'completed'
      )
      OR
      -- Check if user is premium (unlimited downloads)
      EXISTS (
        SELECT 1 FROM users u
        WHERE u.id = auth.uid()
        AND u.is_premium = true
        AND (u.premium_until IS NULL OR u.premium_until > NOW())
      )
      OR
      -- Allow admins
      auth.jwt() ->> 'role' = 'admin'
    )
  );

-- Allow authors to upload their own products
CREATE POLICY "Authors can upload their own products" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'lanka-private'
    AND auth.role() = 'authenticated'
    AND (
      -- Product files: user_id/product_id/filename
      (storage.foldername(name))[1] = auth.uid()::text
      OR
      -- Allow admins to upload any product
      auth.jwt() ->> 'role' = 'admin'
    )
  );

-- User avatars bucket policies
CREATE POLICY "Avatar files are viewable by everyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "Users can upload their own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars'
    AND auth.role() = 'authenticated'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Forum attachments bucket policies
CREATE POLICY "Authenticated users can view forum attachments" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'forum-attachments'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can upload forum attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'forum-attachments'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their own forum attachments" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'forum-attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ===========================================
-- STORAGE UTILITY FUNCTIONS
-- ===========================================

-- Function to get file size for a user (for quota checking)
CREATE OR REPLACE FUNCTION get_user_storage_used(user_uuid UUID)
RETURNS BIGINT AS $$
  SELECT COALESCE(SUM(file_size_bytes), 0)::BIGINT
  FROM file_storage
  WHERE user_id = user_uuid
  AND expires_at IS NULL OR expires_at > NOW();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to clean up expired files
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

-- ===========================================
-- STORAGE MONITORING
-- ===========================================

-- View for storage usage by user
CREATE VIEW user_storage_usage AS
SELECT
  fs.user_id,
  u.username,
  COUNT(*) as total_files,
  SUM(fs.file_size_bytes) as total_size_bytes,
  pg_size_pretty(SUM(fs.file_size_bytes)) as total_size_readable
FROM file_storage fs
JOIN users u ON fs.user_id = u.id
WHERE fs.expires_at IS NULL OR fs.expires_at > NOW()
GROUP BY fs.user_id, u.username
ORDER BY total_size_bytes DESC;

-- View for storage usage by bucket
CREATE VIEW bucket_storage_usage AS
SELECT
  bucket_name,
  COUNT(*) as total_files,
  SUM(file_size_bytes) as total_size_bytes,
  pg_size_pretty(SUM(file_size_bytes)) as total_size_readable
FROM file_storage
WHERE expires_at IS NULL OR expires_at > NOW()
GROUP BY bucket_name
ORDER BY total_size_bytes DESC;

-- ===========================================
-- FILE UPLOAD VALIDATION
-- ===========================================

-- Function to validate file upload
CREATE OR REPLACE FUNCTION validate_file_upload(
  bucket_name TEXT,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT
) RETURNS JSON AS $$
DECLARE
  result JSON;
  max_size BIGINT;
  allowed_types TEXT[];
BEGIN
  -- Get bucket configuration
  SELECT
    file_size_limit,
    allowed_mime_types
  INTO max_size, allowed_types
  FROM storage.buckets
  WHERE id = bucket_name;

  -- Check file size
  IF file_size > max_size THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'File size exceeds limit',
      'max_size', max_size
    );
  END IF;

  -- Check mime type
  IF NOT (mime_type = ANY(allowed_types)) THEN
    RETURN json_build_object(
      'valid', false,
      'error', 'File type not allowed',
      'allowed_types', allowed_types
    );
  END IF;

  RETURN json_build_object('valid', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
