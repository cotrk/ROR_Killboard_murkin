import React, { useState, useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { GET_LIVE_KILLS_SUBSCRIPTION } from '@/graphql/queries/killQueries';
import { LoadingState } from '@/components/shared/LoadingState';

interface LiveKill {
  id: string;
  victim: {
    name: string;
    level: number;
    renownRank: number;
    career: string;
    character: {
      id: string;
      career: string;
      name: string;
    };
    guild?: {
      id: string;
      name: string;
    };
  };
  attackers: {
    name: string;
    damagePercent: number;
    character: {
      id: string;
      career: string;
      name: string;
    };
    guild?: {
      id: string;
      name: string;
    };
  }[];
  time: string;
  zone: {
    id: string;
    name: string;
  };
}

interface LiveFeedProps {
  maxItems?: number;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ maxItems = 10 }) => {
  const [kills, setKills] = useState<LiveKill[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, error: subscriptionError } = useSubscription(
    GET_LIVE_KILLS_SUBSCRIPTION,
  );

  useEffect(() => {
    if (subscriptionError) {
      setError(subscriptionError.message);
      setIsConnected(false);
    } else if (data?.liveKills) {
      setError(null);
      setIsConnected(true);
      setKills((prevKills) =>
        [...data.liveKills, ...prevKills].slice(0, maxItems),
      );
    }
  }, [data, subscriptionError, maxItems]);

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString();
  };

  if (error) {
    return (
      <div className="alert alert-warning">
        <strong>Live Feed Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title text-primary">Live Kill Feed</h3>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-error'}`}
            />
            <span className="text-xs text-base-content/60">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {kills.length === 0 ? (
          <div className="text-center py-8 text-base-content/60">
            <LoadingState size="sm" message="Waiting for live kills..." />
          </div>
        ) : (
          <div className="space-y-2">
            {kills.map((kill) => (
              <div
                key={kill.id}
                className="card bg-base-200 border border-base-300"
              >
                <div className="card-body p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <span className="text-error font-medium">
                        {kill.attackers[0]?.name || 'Unknown'}
                      </span>
                      <span className="text-base-content/60 mx-2">
                        defeated
                      </span>
                      <span className="text-info font-medium">
                        {kill.victim.name}
                      </span>
                      {kill.victim.guild && (
                        <span className="text-base-content/60 ml-2">
                          [{kill.victim.guild.name}]
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-base-content/60">
                      {formatTime(kill.time)}
                    </div>
                  </div>
                  <div className="text-xs text-base-content/60 mt-1">
                    {kill.zone.name} • Level {kill.victim.level}{' '}
                    {kill.victim.career}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
