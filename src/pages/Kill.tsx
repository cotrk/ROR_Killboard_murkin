import { gql, useQuery } from '@apollo/client';
import { format, formatISO } from 'date-fns';
import sortBy from 'lodash/sortBy';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { PlayerFeud } from '@/components/kill/PlayerFeud';
import { Map } from '@/components/Map';
import { GuildFeud } from '@/components/guild/GuildFeud';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { ReactElement } from 'react';
import { GetKillQuery } from '@/__generated__/graphql';

const KILL_DETAILS = gql`
  query GetKill($id: ID!) {
    kill(id: $id, includeAssists: true) {
      scenario {
        id
        name
      }
      instanceId
      skirmish {
        id
      }
      time
      victim {
        character {
          id
          name
          career
        }
        guild {
          id
          name
          realm
          heraldry {
            emblem
            pattern
            color1
            color2
            shape
          }
        }
        damagePercent
      }
      attackers {
        character {
          id
          name
          career
        }
        guild {
          id
          name
          realm
          heraldry {
            emblem
            pattern
            color1
            color2
            shape
          }
        }
        damagePercent
      }
      position {
        x
        y
        zone {
          name
        }
      }
    }
  }
`;

export function Kill(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams();

  const { loading, error, data } = useQuery<GetKillQuery>(KILL_DETAILS, {
    variables: { id },
  });

  if (loading) return <div className="skeleton h-64"></div>;
  if (error) return <div className="alert alert-error">Error loading kill: {error.message}</div>;
  if (!data?.kill) return <div className="alert alert-info">Kill not found</div>;

  const kill = data.kill;
  const victim = kill.victim;
  const attackers = sortBy(kill.attackers, (attacker) => -attacker.damagePercent);
  const primaryAttacker = attackers[0];

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li>
              <Link to="/kills" className="link-hover link-primary">{t('common:kills')}</Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:killPage.killId', { killId: id })}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Kill Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Victim */}
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h3 className="text-lg font-bold text-error mb-2">Victim</h3>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                      <span className="text-error font-bold">
                        {victim.character.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Link 
                      to={`/character/${victim.character.id}`}
                      className="link-hover link-primary font-bold"
                    >
                      {victim.character.name}
                    </Link>
                    <div className="text-sm text-base-content/80">
                      {victim.character.career}
                    </div>
                    {victim.guild && (
                      <div className="flex items-center gap-2">
                        <GuildHeraldry
                          heraldry={victim.guild.heraldry}
                          realm={victim.guild.realm}
                          size="24"
                        />
                        <Link 
                          to={`/guild/${victim.guild.id}`}
                          className="link-hover link-primary text-sm"
                        >
                          {victim.guild.name}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Attacker */}
            {primaryAttacker && (
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h3 className="text-lg font-bold text-success mb-2">Primary Attacker</h3>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                        <span className="text-success font-bold">
                          {primaryAttacker.character.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Link 
                        to={`/character/${primaryAttacker.character.id}`}
                        className="link-hover link-primary font-bold"
                      >
                        {primaryAttacker.character.name}
                      </Link>
                      <div className="text-sm text-base-content/80">
                        Level {primaryAttacker.character.level} {primaryAttacker.character.career}
                      </div>
                      {primaryAttacker.character.guild && (
                        <div className="flex items-center gap-2">
                          <GuildHeraldry
                            heraldry={primaryAttacker.character.guild.heraldry}
                            realm={primaryAttacker.character.guild.name}
                            size="16"
                          />
                          <Link 
                            to={`/guild/${primaryAttacker.character.guild.id}`}
                            className="link-hover link-primary text-sm"
                          >
                            {primaryAttacker.character.guild.name}
                          </Link>
                        </div>
                      )}
                      <div className="badge badge-success mt-1">
                        {primaryAttacker.damagePercent}% Damage
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kill Details */}
          <div className="divider"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat">
              <div className="stat-title">Time</div>
              <div className="stat-value text-sm">
                {format(new Date(kill.time), 'MMM dd, yyyy HH:mm')}
              </div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Zone</div>
              <div className="stat-value text-sm">
                {kill.position?.zone?.name || 'Unknown'}
              </div>
            </div>
            
            <div className="stat">
              <div className="stat-title">Type</div>
              <div className="stat-value text-sm">
                {kill.type || 'Standard'}
              </div>
            </div>
          </div>

          {/* Scenario Info */}
          {kill.scenario && (
            <div className="mt-4">
              <div className="badge badge-info">
                Scenario: {kill.scenario.name}
              </div>
            </div>
          )}

          {/* Map */}
          {kill.position && (
            <div className="mt-6">
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <h3 className="text-lg font-bold mb-2">Location</h3>
                  <Map
                    zoneId={kill.position.zone?.id}
                    positions={[kill.position]}
                    height={300}
                  />
                </div>
              </div>
            </div>
          )}

          {/* All Attackers */}
          {attackers.length > 1 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">All Attackers</h3>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Character</th>
                      <th>Guild</th>
                      <th>Damage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attackers.map((attacker, index) => (
                      <tr key={attacker.character.id}>
                        <td>
                          <Link 
                            to={`/character/${attacker.character.id}`}
                            className="link-hover link-primary font-medium"
                          >
                            {attacker.character.name}
                          </Link>
                          <div className="text-sm text-base-content/80">
                            Level {attacker.character.level} {attacker.character.career}
                          </div>
                        </td>
                        <td>
                          {attacker.character.guild && (
                            <div className="flex items-center gap-2">
                              <GuildHeraldry
                                heraldry={attacker.character.guild.heraldry}
                                realm={attacker.character.guild.name}
                                size="16"
                              />
                              <Link 
                                to={`/guild/${attacker.character.guild.id}`}
                                className="link-hover link-primary"
                              >
                                {attacker.character.guild.name}
                              </Link>
                            </div>
                          )}
                        </td>
                        <td>
                          <div className="badge badge-outline">
                            {attacker.damagePercent}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Feud Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {primaryAttacker && (
              <PlayerFeud playerId={primaryAttacker.character.id} />
            )}
            {victim.character.guild && (
              <GuildFeud guildId={victim.character.guild.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
