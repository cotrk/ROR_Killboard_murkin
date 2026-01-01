import { getISOWeek, getISOWeekYear } from 'date-fns';
import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Query } from '@/__generated__/graphql';
import { LeaderboardTable } from '@/components/kill/LeaderboardTable';
import { ErrorMessage } from '@/components/global/ErrorMessage';
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
  const { t } = useTranslation(['common', 'components']);

  // To make sure we get the current week, even if local timezone differs.
  const now = new Date();
  const utcDate = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );

  const week = getISOWeek(utcDate);
  const year = getISOWeekYear(utcDate);

  const { loading, error, data } = useQuery<Query>(WEEKLY_LEADERBOARD, {
    variables: { year, week },
  });

  if (loading) return <div className="flex justify-center py-4"><span className="loading loading-spinner loading-md"></span></div>;
  if (error) return <ErrorMessage name={error.name} message={error.message} />;
  if (data?.weeklyKillLeaderboard == null) return <p className="text-center py-4">{t('common:error')}</p>;

  return (
    <div>
      <h3 className="text-lg font-bold uppercase mb-4">
        {t('components:leaderboard.weeklyTitle')}
      </h3>
      <LeaderboardTable data={data.weeklyKillLeaderboard.slice(0, 10)} />
    </div>
  );
}
