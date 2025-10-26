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
    const skillId = searchParams.get('skill_id');
    const type = searchParams.get('type');
    const difficultyLevel = searchParams.get('difficulty_level');

    let query = supabase.from('drills').select('*').eq('is_active', true);

    if (skillId) {
      query = query.eq('skill_id', skillId);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (difficultyLevel) {
      query = query.eq('difficulty_level', difficultyLevel);
    }

    const { data: drills, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Internal Server Error', message: error.message, status_code: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: drills || [],
      count: drills?.length || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred', status_code: 500 },
      { status: 500 }
    );
  }
}
