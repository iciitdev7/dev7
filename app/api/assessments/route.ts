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

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data: assessments, error, count } = await supabase
      .from('assessments')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Internal Server Error', message: error.message, status_code: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: assessments || [],
      count: count || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred', status_code: 500 },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request);

    if (authError || !supabase || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication token is missing or invalid', status_code: 401 },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { answers_data, calculated_scores, total_questions, assessment_version } = body;

    if (!answers_data || !calculated_scores) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'answers_data and calculated_scores are required', status_code: 400 },
        { status: 400 }
      );
    }

    const { data: assessment, error } = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        answers_data,
        calculated_scores,
        total_questions: total_questions || 0,
        assessment_version: assessment_version || '1.0',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Bad Request', message: error.message, status_code: 400 },
        { status: 400 }
      );
    }

    for (const [skillId, score] of Object.entries(calculated_scores)) {
      if (typeof score !== 'number') continue;

      const { data: existing } = await supabase
        .from('user_skills')
        .select('id, initial_score')
        .eq('user_id', user.id)
        .eq('skill_id', skillId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('user_skills')
          .update({ current_score: score, last_updated: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase.from('user_skills').insert({
          user_id: user.id,
          skill_id: skillId,
          current_score: score,
          initial_score: score,
        });
      }
    }

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred', status_code: 500 },
      { status: 500 }
    );
  }
}
