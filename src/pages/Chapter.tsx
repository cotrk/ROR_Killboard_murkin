import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { GetChapterQuery } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';
import { MapPositions } from '@/components/MapPositions';
import { ReactElement } from 'react';
import {
  ITEM_FRAGMENT,
  ItemIconWithPopup,
} from '@/components/item/ItemIconWithPopup';

const CHAPTER_DETAILS = gql`
  query GetChapter($id: ID!) {
    chapter(id: $id) {
      id
      name
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
      influenceRewards {
        items {
          nodes {
            id
            name
            iconUrl
            type
            slot
          }
        }
        experience
        money
      }
    }
  }
`;

export function Chapter(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams<{ id: string }>();

  const { loading, error, data } = useQuery(CHAPTER_DETAILS, {
    variables: { id },
  });

  if (loading) return <LoadingState message="Loading chapter details..." />;
  if (error) return <div className="alert alert-error">Error loading chapter: {error.message}</div>;
  if (!data?.chapter) return <div className="alert alert-info">Chapter not found</div>;

  const chapter = data.chapter;

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li>
              <Link to="/chapters" className="link-hover link-primary">{t('pages:chapters.title')}</Link>
            </li>
            <li className="text-base-content/60">
              {chapter.name}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-4">{chapter.name}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stat">
              <div className="stat-title">Location</div>
              <div className="stat-value text-lg">
                {chapter.position?.zone && (
                  <Link to={`/zone/${chapter.position.zone.id}`} className="link-hover link-primary">
                    {chapter.position.zone.name}
                  </Link>
                )}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Position</div>
              <div className="stat-value text-lg">({chapter.position?.x}, {chapter.position?.y})</div>
            </div>
            <div className="stat">
              <div className="stat-title">Influence Rewards</div>
              <div className="stat-value text-lg">
                {chapter.influenceRewards?.experience ? `${chapter.influenceRewards.experience} XP` : 'None'}
              </div>
            </div>
          </div>

          {chapter.position && (
            <>
              <div className="divider"></div>
              <h2 className="card-title">Map Location</h2>
              <div className="card bg-base-200">
                <div className="card-body">
                  <MapPositions
                    zoneId={chapter.position.zone?.id || ''}
                    positions={[chapter.position]}
                    mapSetup={chapter.position.mapSetup}
                  />
                </div>
              </div>
            </>
          )}

          {chapter.influenceRewards && (
            <>
              <div className="divider"></div>
              <h2 className="card-title">Influence Rewards</h2>
              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="flex flex-wrap gap-2">
                    {chapter.influenceRewards.experience && (
                      <span className="badge badge-info">{chapter.influenceRewards.experience} XP</span>
                    )}
                    {chapter.influenceRewards.money && (
                      <span className="badge badge-warning">{chapter.influenceRewards.money} Gold</span>
                    )}
                    {chapter.influenceRewards.items?.nodes?.map((item: any) => (
                      <ItemIconWithPopup
                        key={item.id}
                        item={item}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
