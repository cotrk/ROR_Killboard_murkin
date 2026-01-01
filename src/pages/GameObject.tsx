import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { MapSetup, Query, Zone } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';
import { MapPositions } from '@/components/MapPositions';
import { questTypeIcon } from '../utils';
import { ReactElement } from 'react';

const GAMEOBJECT_DETAILS = gql`
  query GetGameObject($id: ID!) {
    gameObject(id: $id) {
      id
      name
      modelName
      spawns {
        id
        position {
          x
          y
          zone {
            id
            name
          }
          mapSetup {
            nwCornerX
            nwCornerY
            seCornerX
            seCornerY
          }
        }
      }
    }
  }
`;

// STEP 2: MODERN VERSION - With DaisyUI Design System
export function GameObject(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams<{ id: string }>();

  const { loading, error, data } = useQuery(GAMEOBJECT_DETAILS, {
    variables: { id },
  });

  if (loading) return <LoadingState message="Loading game object..." />;
  if (error) return <div className="alert alert-error">Error loading game object: {error.message}</div>;
  if (!data?.gameObject) return <div className="alert alert-info">Game object not found</div>;

  const gameObject = data.gameObject;

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li className="text-base-content/60">
              {gameObject.name}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-4">{gameObject.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="stat">
              <div className="stat-title">Model Name</div>
              <div className="stat-value text-lg">{gameObject.modelName}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Spawn Points</div>
              <div className="stat-value text-lg">{gameObject.spawns?.length || 0}</div>
            </div>
          </div>

          {gameObject.spawns && gameObject.spawns.length > 0 && (
            <>
              <div className="divider"></div>
              <h2 className="card-title">Spawn Locations</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {gameObject.spawns.map((spawn: any) => (
                  <div key={spawn.id} className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="card-title text-lg">
                        <Link to={`/zone/${spawn.position.zone.id}`} className="link-hover link-primary">
                          {spawn.position.zone.name}
                        </Link>
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Position:</span> ({spawn.position.x}, {spawn.position.y})
                        </div>
                        <div>
                          <span className="font-medium">Map Bounds:</span> 
                          ({spawn.position.mapSetup?.nwCornerX}, {spawn.position.mapSetup?.nwCornerY}) to 
                          ({spawn.position.mapSetup?.seCornerX}, {spawn.position.mapSetup?.seCornerY})
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
