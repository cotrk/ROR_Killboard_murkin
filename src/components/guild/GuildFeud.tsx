import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { LoadingState } from '@/components/shared/LoadingState';
import { ReactElement } from 'react';

const GUILD_FEUD = gql`
  query GetGuildFeud($guildId: ID!) {
    guild(id: $guildId) {
      id
      name
      feud {
        enemyGuild {
          id
          name
          heraldry
        }
        kills
        deaths
        victoryPoints
      }
    }
  }
`;

interface GuildFeudProps {
  guildId: string;
}

export function GuildFeud({ guildId }: GuildFeudProps): ReactElement {
  const { t } = useTranslation(['common', 'guild']);

  const { loading, error, data } = useQuery(GUILD_FEUD, {
    variables: { guildId: parseInt(guildId) },
  });

  const feud = data?.guild?.feud;

  if (loading) return <LoadingState size="lg" className="py-12" />;
  if (error)
    return (
      <div className="alert alert-error">
        Error loading guild feud: {error.message}
      </div>
    );
  if (!feud) {
    return <div className="alert alert-info">No feud data available</div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Guild Feud</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">Your Guild</h3>
            <div className="text-2xl font-bold">{data.guild.name}</div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">Enemy Guild</h3>
            <div className="text-2xl font-bold">{feud.enemyGuild.name}</div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="stats stats-vertical lg:stats-horizontal">
          <div className="stat">
            <div className="stat-title">Your Kills</div>
            <div className="stat-value text-success">
              {feud.kills.toLocaleString()}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Your Deaths</div>
            <div className="stat-value text-error">
              {feud.deaths.toLocaleString()}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Victory Points</div>
            <div className="stat-value text-primary">
              {feud.victoryPoints.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
