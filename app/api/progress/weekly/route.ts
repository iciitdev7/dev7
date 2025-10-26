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
    const weekOffset = parseInt(searchParams.get('week_offset') || '0');

    const now = new Date();
    const currentDay = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - currentDay - (weekOffset * 7));
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const { data: completions } = await supabase
      .from('drill_completions')
      .select(`
        completed_at,
        duration_seconds,
        skill_id
      `)
      .eq('user_id', user.id)
      .gte('completed_at', weekStart.toISOString())
      .lte('completed_at', weekEnd.toISOString());

    const dailyProgress = [];
    let totalDrillsCompleted = 0;
    let totalTimeMinutes = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const dayCompletions = completions?.filter(c => {
        const completedDate = new Date(c.completed_at).toISOString().split('T')[0];
        return completedDate === dateStr;
      }) || [];

      const drillsCompleted = dayCompletions.length;
      const totalTime = Math.round(
        dayCompletions.reduce((sum, c) => sum + (c.duration_seconds || 0), 0) / 60
      );
      const skillsSet = new Set(dayCompletions.map(c => c.skill_id));
      const skillsPracticed = Array.from(skillsSet);

      totalDrillsCompleted += drillsCompleted;
      totalTimeMinutes += totalTime;

      dailyProgress.push({
        date: dateStr,
        drills_completed: drillsCompleted,
        total_time_minutes: totalTime,
        skills_practiced: skillsPracticed,
      });
    }

    return NextResponse.json({
      week_start: weekStart.toISOString().split('T')[0],
      week_end: weekEnd.toISOString().split('T')[0],
      daily_progress: dailyProgress,
      total_drills_completed: totalDrillsCompleted,
      total_time_minutes: totalTimeMinutes,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred', status_code: 500 },
      { status: 500 }
    );
  }
}
