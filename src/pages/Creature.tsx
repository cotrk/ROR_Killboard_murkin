import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { MapSetup, Query, Zone } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';
import { MapPositions } from '@/components/MapPositions';
import { questTypeIcon } from '../utils';
import { ReactElement } from 'react';
import { VendorItems } from '@/components/creature/VendorItems';

const CREATURE_DETAILS = gql`
  query GetCreature($id: ID!) {
    creature(id: $id) {
      id
      name
      creatureType
      creatureSubType
      realm
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
      vendorItems {
        nodes {
          id
          name
          cost
          item {
            id
            name
            iconUrl
            type
            slot
          }
        }
      }
    }
  }
`;

export function Creature(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams<{ id: string }>();

  const { loading, error, data } = useQuery(CREATURE_DETAILS, {
    variables: { id },
  });

  if (loading) return <LoadingState message="Loading creature details..." />;
  if (error) return <div className="alert alert-error">Error loading creature: {error.message}</div>;
  if (!data?.creature) return <div className="alert alert-info">Creature not found</div>;

  const creature = data.creature;

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li>
              <Link to="/creatures" className="link-hover link-primary">{t('pages:creatures.title')}</Link>
            </li>
            <li className="text-base-content/60">
              {creature.name}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-4">{creature.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="stat">
              <div className="stat-title">Type</div>
              <div className="stat-value text-lg capitalize">{creature.creatureType}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Sub Type</div>
              <div className="stat-value text-lg capitalize">{creature.creatureSubType}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Realm</div>
              <div className="stat-value text-lg capitalize">
                <span className={creature.realm === 'Destruction' ? 'text-error' : 'text-info'}>
                  {creature.realm}
                </span>
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Spawn Points</div>
              <div className="stat-value text-lg">{creature.spawns?.length || 0}</div>
            </div>
          </div>

          {creature.spawns && creature.spawns.length > 0 && (
            <>
              <div className="divider"></div>
              <h2 className="card-title">Spawn Locations</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {creature.spawns.map((spawn) => (
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
                          <span className="font-medium">Map:</span> {spawn.position.mapSetup?.nwCornerX}, {spawn.position.mapSetup?.nwCornerY}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {creature.vendorItems && creature.vendorItems.nodes.length > 0 && (
            <>
              <div className="divider"></div>
              <h2 className="card-title">Vendor Items</h2>
              <VendorItems items={creature.vendorItems.nodes} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
