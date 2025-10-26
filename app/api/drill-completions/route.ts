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
    const skillId = searchParams.get('skill_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('drill_completions')
      .select(`
        id,
        user_id,
        drill_id,
        skill_id,
        completed_at,
        duration_seconds,
        score,
        completion_data,
        drills (title),
        skills (name)
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (skillId) {
      query = query.eq('skill_id', skillId);
    }

    if (startDate) {
      query = query.gte('completed_at', startDate);
    }

    if (endDate) {
      query = query.lte('completed_at', endDate);
    }

    const { data: completions, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Internal Server Error', message: error.message, status_code: 500 },
        { status: 500 }
      );
    }

    const formattedCompletions = (completions || []).map((c: any) => ({
      id: c.id,
      user_id: c.user_id,
      drill_id: c.drill_id,
      drill_title: c.drills?.title || '',
      skill_id: c.skill_id,
      skill_name: c.skills?.name || '',
      completed_at: c.completed_at,
      duration_seconds: c.duration_seconds,
      score: c.score,
      completion_data: c.completion_data,
    }));

    return NextResponse.json({
      data: formattedCompletions,
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
    const { drill_id, skill_id, duration_seconds, score, completion_data } = body;

    if (!drill_id || !skill_id || duration_seconds === undefined) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'drill_id, skill_id, and duration_seconds are required', status_code: 400 },
        { status: 400 }
      );
    }

    if (duration_seconds < 0) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'duration_seconds must be non-negative', status_code: 400 },
        { status: 400 }
      );
    }

    if (score !== undefined && (score < 0 || score > 100)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'score must be between 0 and 100', status_code: 400 },
        { status: 400 }
      );
    }

    const { data: completion, error } = await supabase
      .from('drill_completions')
      .insert({
        user_id: user.id,
        drill_id,
        skill_id,
        duration_seconds,
        score: score || null,
        completion_data: completion_data || {},
      })
      .select(`
        id,
        user_id,
        drill_id,
        skill_id,
        completed_at,
        duration_seconds,
        score,
        completion_data,
        drills (title),
        skills (name)
      `)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Bad Request', message: error.message, status_code: 400 },
        { status: 400 }
      );
    }

    const formattedCompletion = {
      id: completion.id,
      user_id: completion.user_id,
      drill_id: completion.drill_id,
      drill_title: (completion as any).drills?.title || '',
      skill_id: completion.skill_id,
      skill_name: (completion as any).skills?.name || '',
      completed_at: completion.completed_at,
      duration_seconds: completion.duration_seconds,
      score: completion.score,
      completion_data: completion.completion_data,
    };

    return NextResponse.json(formattedCompletion, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred', status_code: 500 },
      { status: 500 }
    );
  }
}
