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

    const { data: userSkill, error } = await supabase
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
      .eq('user_id', user.id)
      .eq('skill_id', skillId)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: 'Internal Server Error', message: error.message, status_code: 500 },
        { status: 500 }
      );
    }

    if (!userSkill) {
      return NextResponse.json(
        { error: 'Not Found', message: 'The requested resource does not exist', status_code: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: userSkill.id,
      user_id: userSkill.user_id,
      skill_id: userSkill.skill_id,
      skill_name: (userSkill as any).skills?.name || '',
      current_score: userSkill.current_score,
      initial_score: userSkill.initial_score,
      improvement: (userSkill.current_score || 0) - (userSkill.initial_score || 0),
      last_updated: userSkill.last_updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred', status_code: 500 },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const body = await request.json();
    const { current_score } = body;

    if (current_score === undefined || current_score < 0 || current_score > 100) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'current_score must be between 0 and 100', status_code: 400 },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from('user_skills')
      .select('id')
      .eq('user_id', user.id)
      .eq('skill_id', skillId)
      .maybeSingle();

    let userSkill;
    let error;

    if (existing) {
      const result = await supabase
        .from('user_skills')
        .update({ current_score, last_updated: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('skill_id', skillId)
        .select(`
          id,
          user_id,
          skill_id,
          current_score,
          initial_score,
          last_updated,
          skills (name)
        `)
        .single();

      userSkill = result.data;
      error = result.error;
    } else {
      const result = await supabase
        .from('user_skills')
        .insert({
          user_id: user.id,
          skill_id: skillId,
          current_score,
          initial_score: current_score,
        })
        .select(`
          id,
          user_id,
          skill_id,
          current_score,
          initial_score,
          last_updated,
          skills (name)
        `)
        .single();

      userSkill = result.data;
      error = result.error;
    }

    if (error || !userSkill) {
      return NextResponse.json(
        { error: 'Bad Request', message: error?.message || 'Failed to update skill', status_code: 400 },
        { status: 400 }
      );
    }

    return NextResponse.json({
      id: userSkill.id,
      user_id: userSkill.user_id,
      skill_id: userSkill.skill_id,
      skill_name: (userSkill as any).skills?.name || '',
      current_score: userSkill.current_score,
      initial_score: userSkill.initial_score,
      improvement: (userSkill.current_score || 0) - (userSkill.initial_score || 0),
      last_updated: userSkill.last_updated,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred', status_code: 500 },
      { status: 500 }
    );
  }
}
