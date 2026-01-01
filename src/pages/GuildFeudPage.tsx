import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { LoadingState } from '@/components/shared/LoadingState';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { ReactElement } from 'react';

const GUILD_FEUD = gql`
  query GetGuildFeud($guild1Id: ID!, $guild2Id: ID!) {
    guild1: guild(id: $guild1Id) {
      id
      name
      level
      realm
      heraldry
      members {
        totalCount
      }
    }
    guild2: guild(id: $guild2Id) {
      id
      name
      level
      realm
      heraldry
      members {
        totalCount
      }
    }
    feudStats: guildFeudStats(guild1Id: $guild1Id, guild2Id: $guild2Id) {
      totalEncounters
      guild1Wins
      guild2Wins
      guild1Kills
      guild2Kills
      guild1Deaths
      guild2Deaths
    }
  }
`;

export function GuildFeudPage(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { guild1Id, guild2Id } = useParams<{ guild1Id: string; guild2Id: string }>();

  const { loading, error, data } = useQuery(GUILD_FEUD, {
    variables: { guild1Id, guild2Id },
    skip: !guild1Id || !guild2Id,
  });

  if (loading) return <LoadingState message="Loading guild feud data..." />;
  if (error) return <div className="alert alert-error">Error loading guild feud: {error.message}</div>;
  if (!data?.guild1 || !data?.guild2) return <div className="alert alert-info">Guilds not found</div>;

  const { guild1, guild2, feudStats } = data;

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:guildFeud.title')}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-6">Guild Feud</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Guild 1 */}
            <div className="card bg-base-200">
              <div className="card-body text-center">
                <h2 className="card-title">
                  <Link to={`/guild/${guild1.id}`} className="link-hover link-primary">
                    {guild1.name}
                  </Link>
                </h2>
                <div className="flex justify-center mb-4">
                  <GuildHeraldry
                    size="64"
                    heraldry={guild1.heraldry}
                    realm={guild1.realm}
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Level:</span> {guild1.level}</div>
                  <div><span className="font-medium">Realm:</span> {guild1.realm}</div>
                  <div><span className="font-medium">Members:</span> {guild1.members?.totalCount || 0}</div>
                </div>
              </div>
            </div>

            {/* Guild 2 */}
            <div className="card bg-base-200">
              <div className="card-body text-center">
                <h2 className="card-title">
                  <Link to={`/guild/${guild2.id}`} className="link-hover link-primary">
                    {guild2.name}
                  </Link>
                </h2>
                <div className="flex justify-center mb-4">
                  <GuildHeraldry
                    size="64"
                    heraldry={guild2.heraldry}
                    realm={guild2.realm}
                  />
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Level:</span> {guild2.level}</div>
                  <div><span className="font-medium">Realm:</span> {guild2.realm}</div>
                  <div><span className="font-medium">Members:</span> {guild2.members?.totalCount || 0}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          {feudStats && (
            <>
              <h2 className="card-title mb-4">Feud Statistics</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="stat">
                  <div className="stat-title">Total Encounters</div>
                  <div className="stat-value text-2xl">{feudStats.totalEncounters}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">{guild1.name} Wins</div>
                  <div className="stat-value text-2xl text-primary">{feudStats.guild1Wins}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">{guild2.name} Wins</div>
                  <div className="stat-value text-2xl text-secondary">{feudStats.guild2Wins}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Win Rate</div>
                  <div className="stat-value text-2xl">
                    {feudStats.totalEncounters > 0 
                      ? Math.round((feudStats.guild1Wins / feudStats.totalEncounters) * 100)
                      : 0}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">{guild1.name} Performance</h3>
                    <div className="stats grid grid-cols-3 gap-4">
                      <div className="stat">
                        <div className="stat-title">Kills</div>
                        <div className="stat-value text-success">{feudStats.guild1Kills}</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">Deaths</div>
                        <div className="stat-value text-error">{feudStats.guild1Deaths}</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">K/D Ratio</div>
                        <div className="stat-value">
                          {feudStats.guild1Deaths > 0 
                            ? (feudStats.guild1Kills / feudStats.guild1Deaths).toFixed(2)
                            : feudStats.guild1Kills}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">{guild2.name} Performance</h3>
                    <div className="stats grid grid-cols-3 gap-4">
                      <div className="stat">
                        <div className="stat-title">Kills</div>
                        <div className="stat-value text-success">{feudStats.guild2Kills}</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">Deaths</div>
                        <div className="stat-value text-error">{feudStats.guild2Deaths}</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">K/D Ratio</div>
                        <div className="stat-value">
                          {feudStats.guild2Deaths > 0 
                            ? (feudStats.guild2Kills / feudStats.guild2Deaths).toFixed(2)
                            : feudStats.guild2Kills}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
