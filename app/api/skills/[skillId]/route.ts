import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/api-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { skillId: string } }
) {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request);

    if (authError || !supabase || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication token is missing or invalid', status_code: 401 },
        { status: 401 }
      );
    }

    const { skillId } = params;

    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .select('*')
      .eq('id', skillId)
      .eq('is_active', true)
      .maybeSingle();

    if (skillError) {
      return NextResponse.json(
        { error: 'Internal Server Error', message: skillError.message, status_code: 500 },
        { status: 500 }
      );
    }

    if (!skill) {
      return NextResponse.json(
        { error: 'Not Found', message: 'The requested resource does not exist', status_code: 404 },
        { status: 404 }
      );
    }

    const { data: drills } = await supabase
      .from('drills')
      .select('*, completion_count:drill_completions(count)')
      .eq('skill_id', skillId)
      .eq('is_active', true);

    const { data: userSkill } = await supabase
      .from('user_skills')
      .select('current_score')
      .eq('user_id', user.id)
      .eq('skill_id', skillId)
      .maybeSingle();

    const drillsWithCount = (drills || []).map((drill: any) => ({
      ...drill,
      completion_count: drill.completion_count?.[0]?.count || 0,
    }));

    return NextResponse.json({
      ...skill,
      drills: drillsWithCount,
      user_score: userSkill?.current_score || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred', status_code: 500 },
      { status: 500 }
    );
  }
}
