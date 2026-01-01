import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react';

const PLAYER_FEUD = gql`
  query GetPlayerFeud($playerId: ID!) {
    character(id: $playerId) {
      id
      name
      feud {
        enemyCharacter {
          id
          name
          career
          level
          guild {
            id
            name
          }
        }
        kills
        deaths
        victoryPoints
      }
    }
  }
`;

interface PlayerFeudProps {
  playerId: string;
}

export function PlayerFeud({ playerId }: PlayerFeudProps): ReactElement {
  const { t } = useTranslation(['common', 'character']);

  const { loading, error, data } = useQuery(PLAYER_FEUD, {
    variables: { playerId: parseInt(playerId) },
  });

  const feud = data?.character?.feud;

  if (loading) return <div className="skeleton h-64"></div>;
  if (error) return <div className="alert alert-error">Error loading player feud: {error.message}</div>;
  if (!feud) {
    return <div className="alert alert-info">No feud data available</div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Player Feud</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">Your Character</h3>
            <div className="text-2xl font-bold">{data.character.name}</div>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">Enemy Character</h3>
            <div className="text-2xl font-bold">{feud.enemyCharacter.name}</div>
          </div>
        </div>
        
        <div className="divider"></div>
        
        <div className="stats stats-vertical lg:stats-horizontal">
          <div className="stat">
            <div className="stat-title">Your Kills</div>
            <div className="stat-value text-success">{feud.kills.toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Your Deaths</div>
            <div className="stat-value text-error">{feud.deaths.toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Victory Points</div>
            <div className="stat-value text-primary">{feud.victoryPoints.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
