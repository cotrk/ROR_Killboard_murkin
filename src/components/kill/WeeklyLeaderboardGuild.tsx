import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { LeaderboardGuildTable } from '@/components/kill/LeaderboardGuildTable';
import { ReactElement } from 'react';

const WEEKLY_GUILD_LEADERBOARD = gql`
  query GetWeeklyGuildLeaderboard(
    $year: Int!
    $week: Int!
  ) {
    weeklyGuildKillLeaderboard(year: $year, week: $week) {
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

interface WeeklyLeaderboardGuildProps {
  guildId?: string;
}

export function WeeklyLeaderboardGuild({ guildId }: WeeklyLeaderboardGuildProps): ReactElement {
  const { t } = useTranslation(['common', 'leaderboard']);

  const now = new Date();
  const year = now.getFullYear();
  const week = Math.ceil(now.getDate() / 7);

  const { loading, error, data } = useQuery(WEEKLY_GUILD_LEADERBOARD, {
    variables: {
      year,
      week,
    },
    skip: !guildId, // Only run query if guildId is provided
  });

  if (loading) return <div className="skeleton h-64"></div>;
  if (error) return <div className="alert alert-error">Error loading weekly guild leaderboard: {error.message}</div>;
  if (!data?.weeklyGuildKillLeaderboard) return <div className="alert alert-info">No weekly leaderboard data available</div>;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {t('leaderboard:weeklyGuildLeaderboard')} - Week {week}, {year}
        </h2>
        
        <LeaderboardGuildTable 
          data={data.weeklyGuildKillLeaderboard}
        />
      </div>
    </div>
  );
}
