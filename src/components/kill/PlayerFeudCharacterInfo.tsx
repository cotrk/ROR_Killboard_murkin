import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

interface PlayerFeudCharacterInfoProps {
  character: {
    id: string;
    name: string;
    career: string;
    level: number;
    guild?: {
      id: string;
      name: string;
    };
  };
  kills: number;
  deaths: number;
  victoryPoints: number;
}

export function PlayerFeudCharacterInfo({ character, kills, deaths, victoryPoints }: PlayerFeudCharacterInfoProps): ReactElement {
  const { t } = useTranslation(['common', 'character']);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
              <span className="text-primary">?</span>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold">
              {character.name}
            </h3>
            
            <div className="text-sm text-base-content/80 space-y-1">
              <div>
                <span className="font-medium">Career:</span> {character.career}
              </div>
              <div>
                <span className="font-medium">Level:</span> {character.level}
              </div>
              {character.guild && (
                <div>
                  <span className="font-medium">Guild:</span> {character.guild.name}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="stats stats-vertical">
          <div className="stat">
            <div className="stat-title">Kills</div>
            <div className="stat-value text-success">{kills.toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Deaths</div>
            <div className="stat-value text-error">{deaths.toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Victory Points</div>
            <div className="stat-value text-primary">{victoryPoints.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
