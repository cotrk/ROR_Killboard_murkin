import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Query } from '@/__generated__/graphql';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { careerIcon } from '@/utils';
import { LoadingState } from '@/components/shared/LoadingState';
import { ReactElement } from 'react';

const SKIRMISH_TOP_PLAYER = gql`
  query GetSkirmishTopPlayer(
    $id: ID!
    $order: [SkirmishScoreboardEntrySortInput!]
  ) {
    skirmish(id: $id) {
      id
      scoreboardEntries(first: 1, order: $order) {
        nodes {
          realm
          damage
          healing
          protection
          deathBlows
          level
          renownRank
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
        }
      }
    }
  }
`;

export function SkirmishTopPlayer({ id }: { id: string }): ReactElement {
  const { t } = useTranslation(['common', 'skirmish']);

  const { loading, error, data } = useQuery<Query>(SKIRMISH_TOP_PLAYER, {
    variables: {
      id,
      order: [{ field: 'damage', direction: 'DESC' }],
    },
  });

  const topPlayer = data?.skirmish?.scoreboardEntries?.nodes?.[0];

  if (loading) return <LoadingState size="lg" className="py-12" />;
  if (error)
    return (
      <div className="alert alert-error">
        Error loading top player: {error.message}
      </div>
    );
  if (!topPlayer) {
    return <div className="alert alert-info">No player data available</div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Top Player</h2>

        <div className="flex items-center gap-4 p-4">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full">
              <div
                className={`
                w-full h-full rounded-full flex items-center justify-center text-2xl
                ${topPlayer.realm?.toLowerCase() === 'destruction' ? 'bg-error' : 'bg-info'}
              `}
              >
                {careerIcon(topPlayer.character.career)}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold">
                <Link
                  to={`/character/${topPlayer.character.id}`}
                  className="link-hover link-primary"
                >
                  {topPlayer.character.name}
                </Link>
              </h3>
              {topPlayer.guild && (
                <div className="flex items-center gap-1">
                  <GuildHeraldry
                    size="24"
                    heraldry={
                      topPlayer.guild.heraldry
                        ? {
                            emblem: String(topPlayer.guild.heraldry.emblem),
                            pattern: String(topPlayer.guild.heraldry.pattern),
                            color1: String(topPlayer.guild.heraldry.color1),
                            color2: String(topPlayer.guild.heraldry.color2),
                            shape: String(topPlayer.guild.heraldry.shape),
                          }
                        : null
                    }
                    realm={topPlayer.guild.realm}
                  />
                  <Link
                    to={`/guild/${topPlayer.guild.id}`}
                    className="link-hover link-info text-sm"
                  >
                    {topPlayer.guild.name}
                  </Link>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="stat">
                <div className="stat-title">Level</div>
                <div className="stat-value">{topPlayer.level}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Renown</div>
                <div className="stat-value">{topPlayer.renownRank}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Damage</div>
                <div className="stat-value">
                  {topPlayer.damage.toLocaleString()}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Healing</div>
                <div className="stat-value">
                  {topPlayer.healing.toLocaleString()}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Protection</div>
                <div className="stat-value">
                  {topPlayer.protection.toLocaleString()}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Death Blows</div>
                <div className="stat-value">
                  {topPlayer.deathBlows.toLocaleString()}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Realm</div>
                <div
                  className={`
                  stat-value capitalize
                  ${topPlayer.realm?.toLowerCase() === 'destruction' ? 'text-error' : 'text-info'}
                `}
                >
                  {topPlayer.realm}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
