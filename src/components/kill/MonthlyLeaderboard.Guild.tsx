import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { LeaderboardGuildTable } from '@/components/kill/LeaderboardGuildTable';
import { ReactElement } from 'react';

const MONTHLY_GUILD_LEADERBOARD = gql`
  query GetMonthlyGuildLeaderboard(
    $year: Int!
    $month: Int!
  ) {
    monthlyGuildKillLeaderboard(year: $year, month: $month) {
      rank
      kills
      guild {
        id
        name
        heraldry
      }
    }
  }
`;

interface MonthlyLeaderboardGuildProps {
  guildId?: string;
}

export function MonthlyLeaderboardGuild({ guildId }: MonthlyLeaderboardGuildProps): ReactElement {
  const { t } = useTranslation(['common', 'leaderboard']);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { loading, error, data } = useQuery(MONTHLY_GUILD_LEADERBOARD, {
    variables: {
      year,
      month,
    },
    skip: !guildId, // Only run query if guildId is provided
  });

  if (loading) return <div className="skeleton h-64"></div>;
  if (error) return <div className="alert alert-error">Error loading guild leaderboard: {error.message}</div>;
  if (!data?.monthlyGuildKillLeaderboard) return <div className="alert alert-info">No leaderboard data available</div>;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {t('leaderboard:monthlyGuildLeaderboard')} - {month}/{year}
        </h2>
        
        <LeaderboardGuildTable 
          data={data.monthlyGuildKillLeaderboard}
        />
      </div>
    </div>
  );
}

// Export alias for backward compatibility
export { MonthlyLeaderboardGuild as MonthlyGuildLeaderboard };
