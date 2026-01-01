import React, { ReactElement } from 'react';
import { Link } from 'react-router';
import Tippy from '@tippyjs/react';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { Query } from '@/__generated__/graphql';
import { CareerIcon } from '@/components/CareerIcon';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { SortConfig, SortConfigDirection } from '@/hooks/useSortableData';
import { LoadingState } from '@/components/shared/LoadingState';

const SKIRMISH_SCOREBOARD = gql`
  query GetSkirmishScoreboard(
    $id: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
    $order: [SkirmishScoreboardEntrySortInput!]
  ) {
    skirmish(id: $id) {
      id
      scoreboardEntries(
        first: $first
        last: $last
        before: $before
        after: $after
        order: $order
      ) {
        nodes {
          id
          rank
          character {
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
          archetype
          kills
          deaths
          soloKills
          killingBlows
          damageDone
          damageTaken
          healingDone
          healingTaken
          experience
          renown
        }
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

interface SkirmishScoreboardProps {
  id: string;
  order?: SortConfig;
}

export function SkirmishScoreboard({ id, order }: SkirmishScoreboardProps): ReactElement {
  const { t } = useTranslation(['common', 'skirmish']);

  const { loading, error, data } = useQuery(SKIRMISH_SCOREBOARD, {
    variables: {
      id,
      first: 20,
      order: order ? [{ field: 'rank', direction: order.direction as SortConfigDirection }] : [{ field: 'rank', direction: 'ASC' }],
    },
  });

  if (loading) return <LoadingState message="Loading scoreboard..." />;
  if (error) return <div className="alert alert-error">Error loading scoreboard: {error.message}</div>;
  if (!data?.skirmish?.scoreboardEntries?.nodes.length) {
    return <div className="alert alert-info">No scoreboard data available</div>;
  }

  const entries = data.skirmish.scoreboardEntries.nodes;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Scoreboard</h2>
        
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Career</th>
                <th>Level</th>
                <th>Guild</th>
                <th>K/D</th>
                <th>Damage</th>
                <th>Healing</th>
                <th>Renown</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry: any) => (
                <tr key={entry.id}>
                  <td className="font-bold">#{entry.rank}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <CareerIcon career={entry.character.career} />
                      <Link 
                        to={`/character/${entry.character.id}`} 
                        className="link-hover link-primary"
                      >
                        {entry.character.name}
                      </Link>
                    </div>
                  </td>
                  <td>{entry.character.career}</td>
                  <td>{entry.character.level}</td>
                  <td>
                    {entry.character.guild && (
                      <div className="flex items-center gap-1">
                        <GuildHeraldry
                          size="24"
                          heraldry={entry.character.guild.heraldry}
                          realm={entry.character.guild.realm}
                        />
                        <Link 
                          to={`/guild/${entry.character.guild.id}`} 
                          className="link-hover link-info text-sm"
                        >
                          {entry.character.guild.name}
                        </Link>
                      </div>
                    )}
                  </td>
                  <td className="font-mono">
                    <span className={entry.deaths === 0 ? 'text-success' : 'text-base-content'}>
                      {entry.kills}/{entry.deaths}
                    </span>
                  </td>
                  <td className="font-mono text-sm">{entry.damageDone.toLocaleString()}</td>
                  <td className="font-mono text-sm">{entry.healingDone.toLocaleString()}</td>
                  <td className="font-mono">{entry.renown.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.skirmish.scoreboardEntries.pageInfo && (
          <div className="mt-4">
            <div className="flex justify-center gap-2">
              {data.skirmish.scoreboardEntries.pageInfo.hasPreviousPage && (
                <button className="btn btn-outline btn-sm">Previous</button>
              )}
              {data.skirmish.scoreboardEntries.pageInfo.hasNextPage && (
                <button className="btn btn-outline btn-sm">Next</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
