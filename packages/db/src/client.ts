import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types.js';

// Sprint 1: run `supabase gen types typescript` to generate database.types.ts

let _client: ReturnType<typeof createClient<Database>> | undefined;

export function getDbClient() {
  if (_client) return _client;

  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  }

  _client = createClient<Database>(url, key, {
    auth: { persistSession: false },
  });

  return _client;
}
