import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export function getAuthenticatedClient(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}

export async function getAuthenticatedUser(request: NextRequest) {
  const supabase = getAuthenticatedClient(request);

  if (!supabase) {
    return { user: null, error: 'Missing or invalid authorization header' };
  }

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, error: 'Invalid authentication token' };
  }

  return { user, error: null, supabase };
}
