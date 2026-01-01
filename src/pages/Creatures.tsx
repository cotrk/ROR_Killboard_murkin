import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { LoadingState } from '@/components/shared/LoadingState';
import { ReactElement } from 'react';

const CREATURES_LIST = gql`
  query GetCreatures {
    creatures {
      nodes {
        id
        name
        creatureType
        creatureSubType
        realm
        spawns {
          nodes {
            id
            position {
              x
              y
              zone {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

export function Creatures(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);

  const { loading, error, data } = useQuery(CREATURES_LIST);

  if (loading) return <LoadingState message="Loading creatures..." />;
  if (error) return <div className="alert alert-error">Error loading creatures: {error.message}</div>;
  if (!data?.creatures?.nodes) return <div className="alert alert-info">No creatures found</div>;

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:creatures.title')}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-6">{t('pages:creatures.title')}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.creatures.nodes.map((creature: any) => (
              <div key={creature.id} className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title">
                    <Link to={`/creature/${creature.id}`} className="link-hover link-primary">
                      {creature.name}
                    </Link>
                  </h2>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Type:</span> {creature.creatureType}
                    </div>
                    <div>
                      <span className="font-medium">Sub Type:</span> {creature.creatureSubType}
                    </div>
                    <div>
                      <span className="font-medium">Realm:</span>{' '}
                      <span className={creature.realm === 'Destruction' ? 'text-error' : 'text-info'}>
                        {creature.realm}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Spawn Points:</span> {creature.spawns?.nodes?.length || 0}
                    </div>
                  </div>

                  {creature.spawns && creature.spawns.nodes.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2 text-sm">Locations:</h3>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {creature.spawns.nodes.slice(0, 3).map((spawn: any) => (
                          <div key={spawn.id} className="text-xs flex items-center gap-2">
                            <Link 
                              to={`/zone/${spawn.position.zone.id}`} 
                              className="link-hover link-info truncate"
                            >
                              {spawn.position.zone.name}
                            </Link>
                            <span className="text-base-content/60">
                              ({spawn.position.x}, {spawn.position.y})
                            </span>
                          </div>
                        ))}
                        {creature.spawns.nodes.length > 3 && (
                          <div className="text-xs text-base-content/60">
                            +{creature.spawns.nodes.length - 3} more locations
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
