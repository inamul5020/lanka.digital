import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StorageService, STORAGE_BUCKETS, FileValidation } from '../lib/storage';

interface BucketStatus {
  name: string;
  exists: boolean;
  public: boolean;
  fileCount: number;
  error?: string;
}

export default function StorageTest() {
  const [bucketStatuses, setBucketStatuses] = useState<BucketStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testFile, setTestFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<string>('');

  const buckets = [
    { name: STORAGE_BUCKETS.PUBLIC, displayName: 'Public Assets' },
    { name: STORAGE_BUCKETS.PRIVATE, displayName: 'Private Products' },
    { name: STORAGE_BUCKETS.AVATARS, displayName: 'User Avatars' },
    { name: STORAGE_BUCKETS.FORUM_ATTACHMENTS, displayName: 'Forum Attachments' },
  ];

  useEffect(() => {
    async function testBuckets() {
      const results: BucketStatus[] = [];

      for (const bucket of buckets) {
        try {
          // Test if bucket exists by listing files
          const listResult = await StorageService.listFiles(bucket.name);
          const fileCount = listResult.success ? listResult.data.length : 0;

          results.push({
            name: bucket.displayName,
            exists: listResult.success || (listResult.error?.includes('not found') === false),
            public: bucket.name === STORAGE_BUCKETS.PUBLIC || bucket.name === STORAGE_BUCKETS.AVATARS,
            fileCount,
            error: listResult.success ? undefined : listResult.error
          });
        } catch (error: any) {
          results.push({
            name: bucket.displayName,
            exists: false,
            public: bucket.name === STORAGE_BUCKETS.PUBLIC || bucket.name === STORAGE_BUCKETS.AVATARS,
            fileCount: 0,
            error: error.message
          });
        }
      }

      setBucketStatuses(results);
      setIsLoading(false);
    }

    testBuckets();
  }, []);

  const handleTestUpload = async () => {
    if (!testFile) {
      setUploadResult('Please select a file first');
      return;
    }

    // Validate file
    const constraints = FileValidation.getBucketConstraints(STORAGE_BUCKETS.PUBLIC);
    if (!constraints) {
      setUploadResult('Invalid bucket constraints');
      return;
    }

    if (!FileValidation.validateFileSize(testFile, constraints.maxSize)) {
      setUploadResult(`File too large. Max size: ${FileValidation.formatFileSize(constraints.maxSize)}`);
      return;
    }

    if (!FileValidation.validateFileType(testFile, constraints.allowedTypes)) {
      setUploadResult(`File type not allowed. Allowed: ${constraints.allowedTypes.join(', ')}`);
      return;
    }

    setUploadResult('Uploading...');

    // Upload to public bucket for testing
    const result = await StorageService.uploadFile({
      bucket: STORAGE_BUCKETS.PUBLIC,
      path: `test-uploads/${Date.now()}-${testFile.name}`,
      file: testFile
    });

    if (result.success) {
      setUploadResult(`✅ Upload successful! URL: ${result.data.publicUrl}`);
    } else {
      setUploadResult(`❌ Upload failed: ${result.error}`);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-medium text-sm">Testing Storage Buckets...</span>
        </div>
      </div>
    );
  }

  const successCount = bucketStatuses.filter(b => b.exists && !b.error).length;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md z-50 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            successCount === buckets.length ? 'bg-green-500' : successCount > 0 ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="font-medium text-sm">Storage Buckets</span>
        </div>
        <span className="text-xs text-gray-500">
          {successCount}/{buckets.length} OK
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {bucketStatuses.map((bucket) => (
          <div key={bucket.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-gray-600">{bucket.name}</span>
              {bucket.public && <span className="text-green-600">🌐</span>}
            </div>
            <div className="flex items-center space-x-1">
              {bucket.exists && !bucket.error ? (
                <>
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-500">{bucket.fileCount}</span>
                </>
              ) : (
                <span className="text-red-600" title={bucket.error}>✗</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Test Upload Section */}
      <div className="border-t border-gray-200 pt-3">
        <div className="text-xs font-medium text-gray-700 mb-2">Test Upload</div>
        <div className="space-y-2">
          <input
            type="file"
            onChange={(e) => setTestFile(e.target.files?.[0] || null)}
            className="text-xs w-full p-1 border border-gray-300 rounded"
            accept="image/*"
          />
          <button
            onClick={handleTestUpload}
            disabled={!testFile}
            className="w-full text-xs bg-blue-500 text-white py-1 px-2 rounded disabled:bg-gray-300"
          >
            Upload to Public Bucket
          </button>
          {uploadResult && (
            <div className="text-xs text-gray-600 break-all">{uploadResult}</div>
          )}
        </div>
      </div>
    </div>
  );
}
