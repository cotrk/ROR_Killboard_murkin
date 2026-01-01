import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Query } from '@/__generated__/graphql';
import { LeaderboardTable } from '@/components/kill/LeaderboardTable';
import { LoadingState } from '@/components/shared/LoadingState';
import { ReactElement } from 'react';

const MONTHLY_LEADERBOARD = gql`
  query GetMonthlyLeaderboard($year: Int!, $month: Int!) {
    monthlyKillLeaderboard(year: $year, month: $month) {
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

export function MonthlyLeaderboard(): ReactElement {
  const { t } = useTranslation(['common', 'leaderboard']);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { loading, error, data } = useQuery<Query>(MONTHLY_LEADERBOARD, {
    variables: { year, month },
  });

  const leaderboard = data?.monthlyKillLeaderboard;

  if (loading) return <LoadingState message="Loading monthly leaderboard..." />;
  if (error) return <div className="alert alert-error">Error loading leaderboard: {error.message}</div>;
  if (!leaderboard?.length) {
    return <div className="alert alert-info">No leaderboard data available</div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {t('leaderboard:monthlyLeaderboard')} - {month}/{year}
        </h2>
        
        <LeaderboardTable data={leaderboard} />
      </div>
    </div>
  );
}
