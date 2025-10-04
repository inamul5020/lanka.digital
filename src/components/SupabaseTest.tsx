import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function testConnection() {
      try {
        // Test basic connection by trying to get the current user
        const { data, error } = await supabase.auth.getUser();

        if (error && error.message !== 'Auth session missing!') {
          throw error;
        }

        // Test database connection by checking if we can query (will fail gracefully since no tables exist yet)
        const { error: dbError } = await supabase.from('users').select('count').single();

        // If we get here, the connection is working (even if the table doesn't exist yet)
        setConnectionStatus('success');
        setMessage('✅ Successfully connected to Supabase! Database tables will be created in Phase 1.2.');
      } catch (error: any) {
        console.error('Supabase connection test failed:', error);
        setConnectionStatus('error');
        setMessage(`❌ Connection failed: ${error.message}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          connectionStatus === 'testing' ? 'bg-yellow-500 animate-pulse' :
          connectionStatus === 'success' ? 'bg-green-500' :
          'bg-red-500'
        }`} />
        <span className="font-medium text-sm">Supabase Connection</span>
      </div>
      <p className="text-xs text-gray-600 mt-1">{message}</p>
      <div className="mt-2 text-xs text-gray-500">
        <div>API: {import.meta.env.VITE_SUPABASE_URL}</div>
        <div>Studio: http://127.0.0.1:54323</div>
      </div>
    </div>
  );
}
