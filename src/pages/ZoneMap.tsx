import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { LoadingState } from '@/components/shared/LoadingState';
import { MapPositions } from '@/components/MapPositions';
import { ReactElement } from 'react';

const ZONE_DETAILS = gql`
  query GetZone($id: ID!) {
    zone(id: $id) {
      id
      name
      mapSetup {
        nwCornerX
        nwCornerY
        seCornerX
        seCornerY
      }
      creatures {
        nodes {
          id
          name
          spawns {
            position {
              x
              y
            }
          }
        }
      }
      gameObjects {
        nodes {
          id
          name
          spawns {
            position {
              x
              y
            }
          }
        }
      }
    }
  }
`;

export function ZoneMap(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams<{ id: string }>();

  const { loading, error, data } = useQuery(ZONE_DETAILS, {
    variables: { id },
  });

  if (loading) return <LoadingState message="Loading zone map..." />;
  if (error) return <div className="alert alert-error">Error loading zone: {error.message}</div>;
  if (!data?.zone) return <div className="alert alert-info">Zone not found</div>;

  const zone = data.zone;

  // Combine all positions for the map
  const allPositions = [
    ...(zone.creatures?.nodes?.map((creature: any) => ({
      x: creature.spawns?.[0]?.position?.x || 0,
      y: creature.spawns?.[0]?.position?.y || 0,
      name: creature.name,
      type: 'creature',
      id: creature.id,
    })) || []),
    ...(zone.gameObjects?.nodes?.map((obj: any) => ({
      x: obj.spawns?.[0]?.position?.x || 0,
      y: obj.spawns?.[0]?.position?.y || 0,
      name: obj.name,
      type: 'gameObject',
      id: obj.id,
    })) || []),
  ];

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-6">{zone.name} Map</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title">Zone Map</h2>
                  {zone.mapSetup && (
                    <MapPositions
                      zoneId={zone.id}
                      positions={allPositions}
                      nwCornerX={zone.mapSetup.nwCornerX}
                      nwCornerY={zone.mapSetup.nwCornerY}
                      seCornerX={zone.mapSetup.seCornerX}
                      seCornerY={zone.mapSetup.seCornerY}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {zone.creatures && zone.creatures.nodes.length > 0 && (
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Creatures</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {zone.creatures.nodes.map((creature: any) => (
                        <div key={creature.id} className="flex justify-between items-center">
                          <span className="text-sm">{creature.name}</span>
                          <span className="badge badge-ghost badge-sm">
                            {creature.spawns?.length || 0} spawns
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {zone.gameObjects && zone.gameObjects.nodes.length > 0 && (
                <div className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">Objects</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {zone.gameObjects.nodes.map((obj: any) => (
                        <div key={obj.id} className="flex justify-between items-center">
                          <span className="text-sm">{obj.name}</span>
                          <span className="badge badge-ghost badge-sm">
                            {obj.spawns?.length || 0} spawns
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
