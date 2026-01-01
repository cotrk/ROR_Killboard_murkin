import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { LoadingState } from '@/components/shared/LoadingState';
import { ReactElement } from 'react';

const PLAYER_FEUD = gql`
  query GetPlayerFeud($player1Id: ID!, $player2Id: ID!) {
    player1: character(id: $player1Id) {
      id
      name
      career
      level
      renownRank
      guild {
        id
        name
        heraldry
      }
    }
    player2: character(id: $player2Id) {
      id
      name
      career
      level
      renownRank
      guild {
        id
        name
        heraldry
      }
    }
    feudStats: characterFeudStats(character1Id: $player1Id, character2Id: $player2Id) {
      totalEncounters
      player1Wins
      player2Wins
      player1Kills
      player2Kills
      player1Deaths
      player2Deaths
    }
  }
`;

export function PlayerFeudPage(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { player1Id, player2Id } = useParams<{ player1Id: string; player2Id: string }>();

  const { loading, error, data } = useQuery(PLAYER_FEUD, {
    variables: { player1Id, player2Id },
    skip: !player1Id || !player2Id,
  });

  if (loading) return <LoadingState message="Loading feud data..." />;
  if (error) return <div className="alert alert-error">Error loading feud: {error.message}</div>;
  if (!data?.player1 || !data?.player2) return <div className="alert alert-info">Players not found</div>;

  const { player1, player2, feudStats } = data;

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:playerFeud.title')}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-6">Player Feud</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Player 1 */}
            <div className="card bg-base-200">
              <div className="card-body text-center">
                <h2 className="card-title">
                  <Link to={`/character/${player1.id}`} className="link-hover link-primary">
                    {player1.name}
                  </Link>
                </h2>
                <div className="avatar placeholder mb-4">
                  <div className="bg-neutral text-neutral-content rounded-full w-24">
                    <span className="text-3xl">{player1.career?.[0]}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Career:</span> {player1.career}</div>
                  <div><span className="font-medium">Level:</span> {player1.level}</div>
                  <div><span className="font-medium">Renown:</span> {player1.renownRank}</div>
                  {player1.guild && (
                    <div>
                      <span className="font-medium">Guild:</span>{' '}
                      <Link to={`/guild/${player1.guild.id}`} className="link-hover link-info">
                        {player1.guild.name}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Player 2 */}
            <div className="card bg-base-200">
              <div className="card-body text-center">
                <h2 className="card-title">
                  <Link to={`/character/${player2.id}`} className="link-hover link-primary">
                    {player2.name}
                  </Link>
                </h2>
                <div className="avatar placeholder mb-4">
                  <div className="bg-neutral text-neutral-content rounded-full w-24">
                    <span className="text-3xl">{player2.career?.[0]}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Career:</span> {player2.career}</div>
                  <div><span className="font-medium">Level:</span> {player2.level}</div>
                  <div><span className="font-medium">Renown:</span> {player2.renownRank}</div>
                  {player2.guild && (
                    <div>
                      <span className="font-medium">Guild:</span>{' '}
                      <Link to={`/guild/${player2.guild.id}`} className="link-hover link-info">
                        {player2.guild.name}
                      </Link>
                    </div>
                  )}
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
                  <div className="stat-title">{player1.name} Wins</div>
                  <div className="stat-value text-2xl text-primary">{feudStats.player1Wins}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">{player2.name} Wins</div>
                  <div className="stat-value text-2xl text-secondary">{feudStats.player2Wins}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Win Rate</div>
                  <div className="stat-value text-2xl">
                    {feudStats.totalEncounters > 0 
                      ? Math.round((feudStats.player1Wins / feudStats.totalEncounters) * 100)
                      : 0}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">{player1.name} Performance</h3>
                    <div className="stats grid grid-cols-3 gap-4">
                      <div className="stat">
                        <div className="stat-title">Kills</div>
                        <div className="stat-value text-success">{feudStats.player1Kills}</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">Deaths</div>
                        <div className="stat-value text-error">{feudStats.player1Deaths}</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">K/D Ratio</div>
                        <div className="stat-value">
                          {feudStats.player1Deaths > 0 
                            ? (feudStats.player1Kills / feudStats.player1Deaths).toFixed(2)
                            : feudStats.player1Kills}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">{player2.name} Performance</h3>
                    <div className="stats grid grid-cols-3 gap-4">
                      <div className="stat">
                        <div className="stat-title">Kills</div>
                        <div className="stat-value text-success">{feudStats.player2Kills}</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">Deaths</div>
                        <div className="stat-value text-error">{feudStats.player2Deaths}</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">K/D Ratio</div>
                        <div className="stat-value">
                          {feudStats.player2Deaths > 0 
                            ? (feudStats.player2Kills / feudStats.player2Deaths).toFixed(2)
                            : feudStats.player2Kills}
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
