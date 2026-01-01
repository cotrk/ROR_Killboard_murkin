import { getISOWeek, getISOWeekYear } from 'date-fns';
import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Query } from '@/__generated__/graphql';
import { LeaderboardTable } from '@/components/kill/LeaderboardTable';
import { LoadingState } from '@/components/shared/LoadingState';
import { ReactElement } from 'react';

const WEEKLY_LEADERBOARD = gql`
  query GetWeeklyLeaderboard($year: Int!, $week: Int!) {
    weeklyKillLeaderboard(year: $year, week: $week) {
      rank
      kills
      character {
        id
        name
        career
        level
        renownRank
        guildMembership {
          guild {
            id
            name
          }
        }
      }
    }
  }
`;

export function WeeklyLeaderboard(): ReactElement {
  const { t } = useTranslation(['common', 'leaderboard']);

  const now = new Date();
  const year = now.getFullYear();
  const week = Math.ceil(now.getDate() / 7); // Simple week calculation

  const { loading, error, data } = useQuery<Query>(WEEKLY_LEADERBOARD, {
    variables: { year, week },
  });

  const leaderboard = data?.weeklyKillLeaderboard;

  if (loading) return <LoadingState message="Loading weekly leaderboard..." />;
  if (error) return <div className="alert alert-error">Error loading leaderboard: {error.message}</div>;
  if (!leaderboard?.length) {
    return <div className="alert alert-info">No leaderboard data available</div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {t('leaderboard:weeklyLeaderboard')} - Week {week}, {year}
        </h2>
        
        <LeaderboardTable data={leaderboard} />
      </div>
    </div>
  );
}
