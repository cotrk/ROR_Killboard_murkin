import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { KillLeaderboardEntry } from '@/__generated__/graphql';
import { CareerIcon } from '@/components/CareerIcon';
import '@/components/styles/table.scss';

export function LeaderboardTable({
  data,
}: {
  data: KillLeaderboardEntry[];
}): React.ReactElement | null {
  const { t } = useTranslation(['common', 'components']);

  return (
    <table className="table table-zebra table-hover w-full">
      <thead>
        <tr>
          <th className="text-left">{t('components:leaderboard.rank')}</th>
          <th className="text-left">{t('components:leaderboard.player')}</th>
          <th className="text-right">
            {t('components:leaderboard.kills')}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((leaderboardEntry) => (
          <tr key={leaderboardEntry.rank} className="hover:bg-base-200">
            <td className="font-medium">{leaderboardEntry.rank}</td>
            <td>
              <div className="flex items-center gap-3">
                <CareerIcon career={leaderboardEntry.character.career} />
                <div className="flex-1">
                  <Link 
                    to={`/character/${leaderboardEntry.character.id}`}
                    className="font-medium hover:text-primary transition-colors"
                  >
                    {leaderboardEntry.character.name}
                  </Link>
                  <div className="text-sm text-base-content/60">
                    <Link
                      to={`/guild/${leaderboardEntry.character.guildMembership?.guild?.id}`}
                      className="hover:text-primary transition-colors"
                    >
                      {leaderboardEntry.character.guildMembership?.guild?.name}
                    </Link>
                  </div>
                </div>
                <div className="text-sm text-right text-base-content/60">
                  <div>Lvl {leaderboardEntry.character.level}</div>
                  <div>RR {leaderboardEntry.character.renownRank}</div>
                </div>
              </div>
            </td>
            <td className="text-right font-medium">{leaderboardEntry.kills}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
