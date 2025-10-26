import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request);

    if (authError || !supabase || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication token is missing or invalid', status_code: 401 },
        { status: 401 }
      );
    }

    const { data: userSkills, error } = await supabase
      .from('user_skills')
      .select(`
        id,
        user_id,
        skill_id,
        current_score,
        initial_score,
        last_updated,
        skills (name)
      `)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json(
        { error: 'Internal Server Error', message: error.message, status_code: 500 },
        { status: 500 }
      );
    }

    const formattedSkills = (userSkills || []).map((us: any) => ({
      id: us.id,
      user_id: us.user_id,
      skill_id: us.skill_id,
      skill_name: us.skills?.name || '',
      current_score: us.current_score,
      initial_score: us.initial_score,
      improvement: (us.current_score || 0) - (us.initial_score || 0),
      last_updated: us.last_updated,
    }));

    return NextResponse.json({ data: formattedSkills });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred', status_code: 500 },
      { status: 500 }
    );
  }
}
