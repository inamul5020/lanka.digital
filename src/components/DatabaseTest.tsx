import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface TableStatus {
  name: string;
  count: number;
  status: 'checking' | 'success' | 'error';
  error?: string;
}

export default function DatabaseTest() {
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const tables = [
    'categories',
    'users',
    'products',
    'threads',
    'replies',
    'downloads',
    'purchases',
    'reviews',
    'badges',
    'user_badges',
    'file_storage',
    'notifications',
    'analytics'
  ];

  useEffect(() => {
    async function testTables() {
      const results: TableStatus[] = [];

      for (const tableName of tables) {
        try {
          // Test if table exists by trying to count rows
          const { count, error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });

          if (error) {
            results.push({
              name: tableName,
              count: 0,
              status: 'error',
              error: error.message
            });
          } else {
            results.push({
              name: tableName,
              count: count || 0,
              status: 'success'
            });
          }
        } catch (error: any) {
          results.push({
            name: tableName,
            count: 0,
            status: 'error',
            error: error.message || 'Unknown error'
          });
        }
      }

      setTableStatuses(results);
      setIsLoading(false);
    }

    testTables();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-medium text-sm">Testing Database Tables...</span>
        </div>
      </div>
    );
  }

  const successCount = tableStatuses.filter(t => t.status === 'success').length;
  const errorCount = tableStatuses.filter(t => t.status === 'error').length;

  return (
    <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md z-50 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            errorCount === 0 ? 'bg-green-500' : errorCount < successCount ? 'bg-yellow-500' : 'bg-red-500'
          }`} />
          <span className="font-medium text-sm">Database Tables</span>
        </div>
        <span className="text-xs text-gray-500">
          {successCount}/{tables.length} OK
        </span>
      </div>

      <div className="space-y-1">
        {tableStatuses.map((table) => (
          <div key={table.name} className="flex items-center justify-between text-xs">
            <span className="font-mono text-gray-600">{table.name}</span>
            <div className="flex items-center space-x-1">
              {table.status === 'success' ? (
                <>
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-500">{table.count}</span>
                </>
              ) : (
                <span className="text-red-600" title={table.error}>✗</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {errorCount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-red-600">
            {errorCount} table(s) have issues. Check RLS policies or table creation.
          </div>
        </div>
      )}
    </div>
  );
}
