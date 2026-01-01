import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { LoadingState } from '@/components/shared/LoadingState';
import { ReactElement } from 'react';

const RECENT_KILLS = gql`
  query GetRecentKills($first: Int = 50) {
    kills(first: $first) {
      nodes {
        id
        timestamp
        victim {
          id
          name
          career
          level
          renownRank
          guild {
            id
            name
          }
        }
        attackers {
          nodes {
            character {
              id
              name
              career
              level
              renownRank
              guild {
                id
                name
              }
            }
            damageDone
            killingBlow
          }
        }
        zone {
          id
          name
        }
      }
    }
  }
`;

export function Kills(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);

  const { loading, error, data } = useQuery(RECENT_KILLS, {
    variables: { first: 50 },
  });

  if (loading) return <LoadingState message="Loading recent kills..." />;
  if (error) return <div className="alert alert-error">Error loading kills: {error.message}</div>;
  if (!data?.kills?.nodes) return <div className="alert alert-info">No kills found</div>;

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:kills.title')}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-6">{t('pages:kills.title')}</h1>
          
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Victim</th>
                  <th>Killers</th>
                  <th>Zone</th>
                </tr>
              </thead>
              <tbody>
                {data.kills.nodes.map((kill: any) => (
                  <tr key={kill.id}>
                    <td className="text-sm">
                      {new Date(kill.timestamp * 1000).toLocaleTimeString()}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/character/${kill.victim.id}`} 
                          className="link-hover link-primary font-medium"
                        >
                          {kill.victim.name}
                        </Link>
                        <div className="text-xs text-base-content/60">
                          {kill.victim.career} {kill.victim.level}
                        </div>
                      </div>
                      {kill.victim.guild && (
                        <div className="text-xs">
                          <Link 
                            to={`/guild/${kill.victim.guild.id}`} 
                            className="link-hover link-info"
                          >
                            {kill.victim.guild.name}
                          </Link>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="space-y-1">
                        {kill.attackers.nodes.slice(0, 3).map((attacker: any, index: number) => (
                          <div key={attacker.character.id} className="flex items-center gap-2 text-sm">
                            {attacker.killingBlow && (
                              <span className="badge badge-error badge-xs">KB</span>
                            )}
                            <Link 
                              to={`/character/${attacker.character.id}`} 
                              className="link-hover link-primary"
                            >
                              {attacker.character.name}
                            </Link>
                            <span className="text-base-content/60">
                              {attacker.character.career} {attacker.character.level}
                            </span>
                          </div>
                        ))}
                        {kill.attackers.nodes.length > 3 && (
                          <div className="text-xs text-base-content/60">
                            +{kill.attackers.nodes.length - 3} more attackers
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {kill.zone && (
                        <Link 
                          to={`/zone/${kill.zone.id}`} 
                          className="link-hover link-info"
                        >
                          {kill.zone.name}
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
