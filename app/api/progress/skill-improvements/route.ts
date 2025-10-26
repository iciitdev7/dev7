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
    const period = searchParams.get('period') || 'month';

    let timeFilter: Date | null = null;
    const now = new Date();

    switch (period) {
      case 'week':
        timeFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        timeFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        timeFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        timeFilter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        timeFilter = null;
        break;
      default:
        timeFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    let query = supabase
      .from('user_skills')
      .select(`
        skill_id,
        current_score,
        initial_score,
        last_updated,
        skills (name)
      `)
      .eq('user_id', user.id);

    if (timeFilter) {
      query = query.gte('last_updated', timeFilter.toISOString());
    }

    const { data: userSkills, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Internal Server Error', message: error.message, status_code: 500 },
        { status: 500 }
      );
    }

    const improvements = (userSkills || []).map((skill: any) => {
      const initialScore = skill.initial_score || 0;
      const currentScore = skill.current_score || 0;
      const improvement = currentScore - initialScore;
      const improvementPercentage = initialScore > 0
        ? (improvement / initialScore) * 100
        : 0;

      return {
        skill_id: skill.skill_id,
        skill_name: skill.skills?.name || '',
        initial_score: initialScore,
        current_score: currentScore,
        improvement: improvement,
        improvement_percentage: parseFloat(improvementPercentage.toFixed(2)),
      };
    }).sort((a, b) => b.improvement - a.improvement);

    return NextResponse.json({ data: improvements });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred', status_code: 500 },
      { status: 500 }
    );
  }
}
