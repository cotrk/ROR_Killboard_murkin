import { Link } from 'react-router';
import Tippy from '@tippyjs/react';
import { useTranslation } from 'react-i18next';
import { ScenarioScoreboardEntryFragment } from '@/__generated__/graphql';
import { CareerIcon } from '@/components/CareerIcon';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { useSortableData } from '@/hooks/useSortableData';
import { ReactElement } from 'react';

export function ScenarioScoreboard({
  entries,
}: {
  entries: ScenarioScoreboardEntryFragment[];
}): ReactElement {
  const { items } = useSortableData(entries);
  const { t } = useTranslation(['components']);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Scenario Scoreboard</h2>
        
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="relative">
              <tr>
                <th className="cursor-pointer hover:bg-base-200">
                  Player
                </th>
                <th>Career</th>
                <th>Guild</th>
                <th className="cursor-pointer hover:bg-base-200">
                  K/D
                </th>
                <th className="cursor-pointer hover:bg-base-200">
                  Damage
                </th>
                <th className="cursor-pointer hover:bg-base-200">
                  Healing
                </th>
                <th className="cursor-pointer hover:bg-base-200">
                  Renown
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((entry: any, index: number) => (
                <tr key={entry.id} className={entry.realm === 'Order' ? 'scenario-scoreboard-row-team-0' : 'scenario-scoreboard-row-team-1'}>
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
      </div>
    </div>
  );
}
