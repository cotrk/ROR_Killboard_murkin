import { Link } from 'react-router';
import Tippy from '@tippyjs/react';
import { useTranslation } from 'react-i18next';
import { CareerIcon } from '@/components/CareerIcon';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { ReactElement } from 'react';
import {
  InstanceEncounterRunScoreboardEntryFragment,
  InstanceRunScoreboardEntryFragment,
} from '@/__generated__/graphql';
import { gql } from '@apollo/client';

export const INSTANCE_RUN_SCOREBOARD_FRAGMENT = gql`
  fragment InstanceRunScoreboardEntry on InstanceRunScoreboardEntry {
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
`;

interface InstanceRunScoreboardProps {
  entries: (InstanceRunScoreboardEntryFragment | InstanceEncounterRunScoreboardEntryFragment)[];
}

export function InstanceRunScoreboard({ entries }: InstanceRunScoreboardProps): ReactElement {
  const { t } = useTranslation(['common', 'instance']);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Scoreboard</h2>
        
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Player</th>
                <th>Career</th>
                <th>Guild</th>
                <th>K/D</th>
                <th>Damage</th>
                <th>Healing</th>
                <th>Renown</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry: any, index: number) => (
                <tr key={entry.id || index}>
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
                  <td>
                    {entry.guild && (
                      <div className="flex items-center gap-1">
                        <GuildHeraldry
                          size="24"
                          heraldry={entry.guild.heraldry}
                          realm={entry.guild.realm}
                        />
                        <Link 
                          to={`/guild/${entry.guild.id}`} 
                          className="link-hover link-info text-sm"
                        >
                          {entry.guild.name}
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
      </div>
    </div>
  );
}
