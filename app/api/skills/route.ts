import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request);

    if (authError || !supabase) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication token is missing or invalid', status_code: 401 },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const isActive = searchParams.get('is_active');

    let query = supabase.from('skills').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    } else {
      query = query.eq('is_active', true);
    }

    const { data: skills, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Internal Server Error', message: error.message, status_code: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: skills || [],
      count: skills?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred', status_code: 500 },
      { status: 500 }
    );
  }
}
