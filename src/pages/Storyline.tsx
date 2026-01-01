import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { LoadingState } from '@/components/shared/LoadingState';
import { ReactElement } from 'react';

const STORYLINE_DETAILS = gql`
  query GetStoryline($id: ID!) {
    storyline(id: $id) {
      id
      name
      description
      chapters {
        nodes {
          id
          name
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
`;

export function Storyline(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const { id } = useParams<{ id: string }>();

  const { loading, error, data } = useQuery(STORYLINE_DETAILS, {
    variables: { id },
  });

  if (loading) return <LoadingState message="Loading storyline..." />;
  if (error) return <div className="alert alert-error">Error loading storyline: {error.message}</div>;
  if (!data?.storyline) return <div className="alert alert-info">Storyline not found</div>;

  const storyline = data.storyline;

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li>
              <Link to="/storylines" className="link-hover link-primary">{t('pages:storylines.title')}</Link>
            </li>
            <li className="text-base-content/60">
              {storyline.name}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-4">{storyline.name}</h1>
          
          {storyline.description && (
            <div className="prose max-w-none mb-6">
              <p className="text-base-content/80">{storyline.description}</p>
            </div>
          )}

          <div className="stat mb-6">
            <div className="stat-title">Chapters</div>
            <div className="stat-value text-lg">{storyline.chapters?.nodes?.length || 0}</div>
          </div>

          {storyline.chapters && storyline.chapters.nodes.length > 0 && (
            <>
              <div className="divider"></div>
              <h2 className="card-title">Chapters</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {storyline.chapters.nodes.map((chapter: any, index: number) => (
                  <div key={chapter.id} className="card bg-base-200">
                    <div className="card-body">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge badge-primary">#{index + 1}</span>
                        <h3 className="card-title text-lg flex-1">
                          <Link to={`/chapter/${chapter.id}`} className="link-hover link-primary">
                            {chapter.name}
                          </Link>
                        </h3>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium">Location:</span>{' '}
                          {chapter.position?.zone && (
                            <Link to={`/zone/${chapter.position.zone.id}`} className="link-hover link-info">
                              {chapter.position.zone.name}
                            </Link>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Position:</span> ({chapter.position?.x}, {chapter.position?.y})
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
