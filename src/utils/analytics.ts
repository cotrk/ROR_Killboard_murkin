// Advanced analytics utilities for player trends, guild metrics, and predictive statistics

interface PlayerStats {
  playerId: string;
  playerName: string;
  totalKills: number;
  totalDeaths: number;
  killDeathRatio: number;
  renownGained: number;
  averageKillsPerDay: number;
  peakPerformanceDay: string;
  career: string;
  level: number;
  guildId?: string;
}

interface GuildStats {
  guildId: string;
  guildName: string;
  totalMembers: number;
  totalKills: number;
  totalDeaths: number;
  averageKillDeathRatio: number;
  topPerformers: PlayerStats[];
  guildActivity: number; // 0-1 scale
  dominanceScore: number; // 0-100 scale
}

interface TrendData {
  date: string;
  value: number;
  movingAverage?: number;
  trend?: 'up' | 'down' | 'stable';
}

interface PredictionResult {
  predictedValue: number;
  confidence: number; // 0-1 scale
  trend: 'increasing' | 'decreasing' | 'stable';
  factors: string[];
}

class AdvancedAnalytics {
  private static instance: AdvancedAnalytics;

  private constructor() {}

  static getInstance(): AdvancedAnalytics {
    if (!AdvancedAnalytics.instance) {
      AdvancedAnalytics.instance = new AdvancedAnalytics();
    }
    return AdvancedAnalytics.instance;
  }

  // Player trend analysis
  analyzePlayerTrends(playerData: any[]): TrendData[] {
    const sortedData = playerData.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return sortedData.map((item, index) => {
      const value = item.kills || 0;
      let movingAverage = value;
      let trend: 'up' | 'down' | 'stable' = 'stable';

      // Calculate 7-day moving average
      if (index >= 6) {
        const last7Days = sortedData.slice(index - 6, index + 1);
        movingAverage = last7Days.reduce((sum, day) => sum + (day.kills || 0), 0) / 7;
      }

      // Determine trend
      if (index > 0) {
        const previousValue = sortedData[index - 1].kills || 0;
        const changePercent = ((value - previousValue) / previousValue) * 100;
        
        if (changePercent > 10) trend = 'up';
        else if (changePercent < -10) trend = 'down';
        else trend = 'stable';
      }

      return {
        date: item.date,
        value,
        movingAverage,
        trend
      };
    });
  }

  // Guild performance metrics
  calculateGuildMetrics(guildData: any[]): GuildStats {
    const totalKills = guildData.reduce((sum, player) => sum + (player.totalKills || 0), 0);
    const totalDeaths = guildData.reduce((sum, player) => sum + (player.totalDeaths || 0), 0);
    const averageKDR = totalDeaths > 0 ? totalKills / totalDeaths : 0;

    // Calculate guild activity (based on recent activity)
    const recentActivity = guildData.filter(player => 
      player.lastActivity && new Date(player.lastActivity) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const guildActivity = guildData.length > 0 ? recentActivity / guildData.length : 0;

    // Calculate dominance score
    const avgKillsPerMember = guildData.length > 0 ? totalKills / guildData.length : 0;
    const dominanceScore = Math.min(100, (avgKillsPerMember / 10) * 100); // Scale to 0-100

    // Top performers (top 10% by kills)
    const sortedByKills = [...guildData].sort((a, b) => (b.totalKills || 0) - (a.totalKills || 0));
    const topPerformersCount = Math.max(1, Math.floor(guildData.length * 0.1));
    const topPerformers = sortedByKills.slice(0, topPerformersCount);

    return {
      guildId: guildData[0]?.guildId || 'unknown',
      guildName: guildData[0]?.guildName || 'Unknown Guild',
      totalMembers: guildData.length,
      totalKills,
      totalDeaths,
      averageKillDeathRatio: averageKDR,
      topPerformers,
      guildActivity,
      dominanceScore
    };
  }

  // Predictive statistics using historical data
  predictFuturePerformance(historicalData: TrendData[], daysAhead: number = 7): PredictionResult {
    if (historicalData.length < 7) {
      return {
        predictedValue: 0,
        confidence: 0,
        trend: 'stable',
        factors: ['Insufficient historical data']
      };
    }

    // Use linear regression for prediction
    const recentData = historicalData.slice(-14); // Use last 14 days
    const n = recentData.length;
    
    // Calculate linear regression coefficients
    const sumX = recentData.reduce((sum, _, index) => sum + index, 0);
    const sumY = recentData.reduce((sum, item) => sum + item.value, 0);
    const sumXY = recentData.reduce((sum, item, index) => sum + (index * item.value), 0);
    const sumX2 = recentData.reduce((sum, _, index) => sum + (index * index), 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict future value
    const futureX = n + daysAhead;
    const predictedValue = Math.max(0, slope * futureX + intercept);

    // Calculate confidence based on data consistency
    const variance = recentData.reduce((sum, item) => {
      const expected = slope * recentData.indexOf(item) + intercept;
      return sum + Math.pow(item.value - expected, 2);
    }, 0) / n;
    
    const confidence = Math.max(0, Math.min(1, 1 - (variance / (predictedValue || 1))));

    // Determine trend
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (slope > 0.5) trend = 'increasing';
    else if (slope < -0.5) trend = 'decreasing';

    // Identify influencing factors
    const factors: string[] = [];
    if (Math.abs(slope) > 2) factors.push('Strong momentum');
    if (confidence > 0.8) factors.push('High data consistency');
    if (confidence < 0.3) factors.push('Low data consistency');
    if (recentData.length >= 30) factors.push('Sufficient historical data');
    else factors.push('Limited historical data');

    return {
      predictedValue: Math.round(predictedValue),
      confidence: Math.round(confidence * 100) / 100,
      trend,
      factors
    };
  }

  // Calculate player performance score
  calculatePlayerScore(playerStats: PlayerStats): number {
    let score = 0;

    // Kill/Death ratio (40% weight)
    const kdrScore = Math.min(40, playerStats.killDeathRatio * 10);
    score += kdrScore;

    // Total kills (30% weight)
    const killsScore = Math.min(30, (playerStats.totalKills / 100) * 30);
    score += killsScore;

    // Average kills per day (20% weight)
    const avgKillsScore = Math.min(20, playerStats.averageKillsPerDay * 2);
    score += avgKillsScore;

    // Renown gained (10% weight)
    const renownScore = Math.min(10, (playerStats.renownGained / 1000) * 10);
    score += renownScore;

    return Math.round(score);
  }

  // Identify rising stars (players with improving performance)
  identifyRisingStars(playerData: any[], threshold: number = 0.3): PlayerStats[] {
    return playerData
      .map(player => {
        const trends = this.analyzePlayerTrends(player.recentActivity || []);
        const recentTrend = trends.slice(-7); // Last 7 days
        
        if (recentTrend.length < 7) return { ...player, improvementScore: 0 };

        // Calculate improvement score
        const improvementScore = recentTrend.reduce((score, trend, index) => {
          if (index === 0) return score;
          const previousValue = recentTrend[index - 1].value;
          const change = (trend.value - previousValue) / (previousValue || 1);
          return score + change;
        }, 0) / 6; // Average change over 6 periods

        return { ...player, improvementScore };
      })
      .filter(player => player.improvementScore > threshold)
      .sort((a, b) => b.improvementScore - a.improvementScore)
      .slice(0, 10); // Top 10 rising stars
  }

  // Generate comprehensive analytics report
  generateAnalyticsReport(playerData: any[], guildData: any[]): {
    playerInsights: any;
    guildInsights: any;
    predictions: any;
    recommendations: string[];
  } {
    const playerInsights = {
      totalPlayers: playerData.length,
      averageKDR: playerData.reduce((sum, p) => sum + (p.killDeathRatio || 0), 0) / playerData.length,
      topPerformers: playerData
        .sort((a, b) => (b.totalKills || 0) - (a.totalKills || 0))
        .slice(0, 10),
      risingStars: this.identifyRisingStars(playerData),
      careerDistribution: this.calculateCareerDistribution(playerData)
    };

    const guildInsights = guildData.map(guild => this.calculateGuildMetrics(guild));

    const predictions = {
      playerPerformance: playerData.slice(0, 5).map(player => ({
        playerName: player.name,
        prediction: this.predictFuturePerformance(player.recentActivity || [])
      })),
      guildActivity: guildInsights.map(guild => ({
        guildName: guild.guildName,
        prediction: this.predictFuturePerformance([]) // Use empty array as placeholder
      }))
    };

    const recommendations = this.generateRecommendations(playerInsights, guildInsights);

    return {
      playerInsights,
      guildInsights,
      predictions,
      recommendations
    };
  }

  private calculateCareerDistribution(playerData: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    playerData.forEach(player => {
      const career = player.career || 'Unknown';
      distribution[career] = (distribution[career] || 0) + 1;
    });

    return distribution;
  }

  private generateRecommendations(playerInsights: any, guildInsights: any[]): string[] {
    const recommendations: string[] = [];

    // Player-based recommendations
    if (playerInsights.averageKDR < 1.0) {
      recommendations.push('Consider implementing player training programs to improve overall K/D ratios');
    }

    if (playerInsights.risingStars.length > 0) {
      recommendations.push(`${playerInsights.risingStars.length} rising stars identified - consider recognizing their achievements`);
    }

    // Guild-based recommendations
    const activeGuilds = guildInsights.filter(guild => guild.guildActivity > 0.7);
    if (activeGuilds.length < guildInsights.length * 0.5) {
      recommendations.push('Many guilds show low activity - consider implementing guild engagement initiatives');
    }

    const dominantGuilds = guildInsights.filter(guild => guild.dominanceScore > 70);
    if (dominantGuilds.length > 0) {
      recommendations.push(`${dominantGuilds.length} guilds show high dominance - monitor for competitive balance`);
    }

    return recommendations;
  }
}

// Export singleton instance
export const analytics = AdvancedAnalytics.getInstance();

// Utility functions
export const analyzePlayerTrends = (playerData: any[]): TrendData[] => {
  return analytics.analyzePlayerTrends(playerData);
};

export const calculateGuildMetrics = (guildData: any[]): GuildStats => {
  return analytics.calculateGuildMetrics(guildData);
};

export const predictFuturePerformance = (historicalData: TrendData[], daysAhead?: number): PredictionResult => {
  return analytics.predictFuturePerformance(historicalData, daysAhead);
};

export const generateAnalyticsReport = (playerData: any[], guildData: any[]) => {
  return analytics.generateAnalyticsReport(playerData, guildData);
};
