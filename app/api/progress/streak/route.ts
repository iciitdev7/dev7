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

    const { data: completions } = await supabase
      .from('drill_completions')
      .select('completed_at')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false });

    if (!completions || completions.length === 0) {
      return NextResponse.json({
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null,
      });
    }

    const dateSet = new Set(
      completions.map(c => new Date(c.completed_at).toISOString().split('T')[0])
    );
    const uniqueDates = Array.from(dateSet).sort().reverse();

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastActivityDate = uniqueDates[0];
    const lastDate = new Date(lastActivityDate);
    lastDate.setHours(0, 0, 0, 0);

    if (lastDate.getTime() === today.getTime() || lastDate.getTime() === yesterday.getTime()) {
      currentStreak = 1;
      let checkDate = new Date(lastDate);

      for (let i = 1; i < uniqueDates.length; i++) {
        checkDate.setDate(checkDate.getDate() - 1);
        const expectedDate = checkDate.toISOString().split('T')[0];

        if (uniqueDates[i] === expectedDate) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    tempStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    longestStreak = Math.max(longestStreak, currentStreak);

    return NextResponse.json({
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_activity_date: lastActivityDate,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred', status_code: 500 },
      { status: 500 }
    );
  }
}
