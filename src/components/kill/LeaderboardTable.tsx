import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { careerIcon } from '@/utils';
import clsx from 'clsx';

interface LeaderboardEntry {
  rank: number;
  kills: number;
  character: {
    id: string;
    name: string;
    career: string;
    level: number;
    renownRank: number;
    guild?: {
      id: string;
      name: string;
      heraldry: any;
    };
  };
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

export function LeaderboardTable({ data }: LeaderboardTableProps): React.ReactElement {
  const { t } = useTranslation(['common', 'leaderboard']);

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th className="text-left">Rank</th>
            <th className="text-left">Player</th>
            <th className="text-left">Career</th>
            <th className="text-left">Level</th>
            <th className="text-left">Renown</th>
            <th className="text-left">Guild</th>
            <th className="text-left">Kills</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.character.id} className="hover">
              <td className="font-bold">#{entry.rank}</td>
              <td>
                <div className="flex items-center gap-2">
                  <div className="text-lg">
                    {careerIcon(entry.character.career)}
                  </div>
                  <Link 
                    to={`/character/${entry.character.id}`} 
                    className="link-hover link-primary font-medium"
                  >
                    {entry.character.name}
                  </Link>
                </div>
              </td>
              <td>{entry.character.career}</td>
              <td>{entry.character.level}</td>
              <td>{entry.character.renownRank}</td>
              <td>
                {entry.character.guild && (
                  <div className="flex items-center gap-2">
                    <GuildHeraldry
                      heraldry={entry.character.guild.heraldry}
                      realm={entry.character.guild.name}
                      size="24"
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
              <td className="font-mono">{entry.kills.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
