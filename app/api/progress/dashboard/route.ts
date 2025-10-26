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

    const { data: userSkills } = await supabase
      .from('user_skills')
      .select('current_score, skill_id, skills (name)')
      .eq('user_id', user.id);

    const overallScore = userSkills && userSkills.length > 0
      ? Math.round(userSkills.reduce((sum, s) => sum + (s.current_score || 0), 0) / userSkills.length)
      : 0;

    const { count: totalDrills } = await supabase
      .from('drill_completions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const { data: completions } = await supabase
      .from('drill_completions')
      .select('duration_seconds, completed_at')
      .eq('user_id', user.id);

    const totalTimeMinutes = completions
      ? Math.round(completions.reduce((sum, c) => sum + (c.duration_seconds || 0), 0) / 60)
      : 0;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const { data: recentCompletions } = await supabase
      .from('drill_completions')
      .select('completed_at')
      .eq('user_id', user.id)
      .gte('completed_at', sevenDaysAgo.toISOString())
      .order('completed_at', { ascending: false });

    const uniqueDays = new Set(
      recentCompletions?.map(c => new Date(c.completed_at).toDateString()) || []
    );

    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today);

    while (true) {
      const dateStr = checkDate.toDateString();
      if (uniqueDays.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const prioritySkill = userSkills && userSkills.length > 0
      ? userSkills.reduce((min, s) => (s.current_score || 0) < (min.current_score || 0) ? s : min)
      : null;

    const { data: recentActivities } = await supabase
      .from('drill_completions')
      .select(`
        completed_at,
        duration_seconds,
        drills (title),
        skills (name)
      `)
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(5);

    const formattedActivities = recentActivities?.map((a: any) => ({
      date: new Date(a.completed_at).toISOString().split('T')[0],
      activity: a.drills?.title || 'Unknown drill',
      skill: a.skills?.name || 'Unknown skill',
      duration: `${Math.round(a.duration_seconds / 60)} min`,
    })) || [];

    const weeklyProgress = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];

      const dayCompletions = recentCompletions?.filter(c =>
        new Date(c.completed_at).toDateString() === date.toDateString()
      ).length || 0;

      weeklyProgress.push({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
        completed: dayCompletions,
      });
    }

    return NextResponse.json({
      overall_score: overallScore,
      total_drills_completed: totalDrills || 0,
      current_streak: currentStreak,
      total_time_minutes: totalTimeMinutes,
      priority_skill: prioritySkill ? {
        skill_id: prioritySkill.skill_id,
        skill_name: (prioritySkill as any).skills?.name || '',
        current_score: prioritySkill.current_score || 0,
      } : null,
      recent_activities: formattedActivities,
      weekly_progress: weeklyProgress,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred', status_code: 500 },
      { status: 500 }
    );
  }
}
