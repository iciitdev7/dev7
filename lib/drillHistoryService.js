import { supabase } from './supabase';

export const drillHistoryService = {
  async getDrillHistory(userId, drillId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('drill_completions')
        .select('*')
        .eq('user_id', userId)
        .eq('drill_id', drillId)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching drill history:', error);
        return [];
      }

      return data.map(item => ({
        id: item.id,
        drillId: item.drill_id,
        completedAt: item.completed_at,
        score: item.score || 100,
        duration: item.duration,
        metadata: item.metadata,
        date: new Date(item.completed_at).toLocaleDateString()
      }));
    } catch (err) {
      console.error('Error in getDrillHistory:', err);
      return [];
    }
  },

  async getAllDrillsHistory(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('drill_completions')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching all drills history:', error);
        return [];
      }

      return data.map(item => ({
        id: item.id,
        drillId: item.drill_id,
        completedAt: item.completed_at,
        score: item.score || 100,
        duration: item.duration,
        metadata: item.metadata,
        date: new Date(item.completed_at).toLocaleDateString()
      }));
    } catch (err) {
      console.error('Error in getAllDrillsHistory:', err);
      return [];
    }
  },

  async getDrillStats(userId, drillId) {
    try {
      const history = await this.getDrillHistory(userId, drillId, 100);

      if (history.length === 0) {
        return {
          totalCompletions: 0,
          averageScore: 0,
          lastCompletion: null,
          bestScore: 0,
          recentHistory: []
        };
      }

      const scores = history.map(h => h.score || 100);
      const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const bestScore = Math.max(...scores);

      return {
        totalCompletions: history.length,
        averageScore,
        lastCompletion: history[0].completedAt,
        bestScore,
        recentHistory: history.slice(0, 7)
      };
    } catch (err) {
      console.error('Error in getDrillStats:', err);
      return {
        totalCompletions: 0,
        averageScore: 0,
        lastCompletion: null,
        bestScore: 0,
        recentHistory: []
      };
    }
  }
};
