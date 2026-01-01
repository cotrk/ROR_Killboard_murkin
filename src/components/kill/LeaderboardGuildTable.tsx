import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';

interface GuildLeaderboardEntry {
  rank: number;
  kills: number;
  guild: {
    id: string;
    name: string;
    heraldry: any;
  };
}

interface LeaderboardGuildTableProps {
  data: GuildLeaderboardEntry[];
}

export function LeaderboardGuildTable({ data }: LeaderboardGuildTableProps): React.ReactElement {
  const { t } = useTranslation(['common', 'leaderboard']);

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th className="text-left">Rank</th>
            <th className="text-left">Guild</th>
            <th className="text-left">Kills</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={entry.guild?.id || `guild-${index}`} className="hover">
              <td className="font-bold">#{entry.rank}</td>
              <td>
                <div className="flex items-center gap-2">
                  <GuildHeraldry
                    heraldry={entry.guild.heraldry}
                    realm={entry.guild.name}
                    size="24"
                  />
                  <Link 
                    to={`/guild/${entry.guild?.id}`} 
                    className="link-hover link-primary font-medium"
                  >
                    {entry.guild.name}
                  </Link>
                </div>
              </td>
              <td className="font-mono">{entry.kills.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
