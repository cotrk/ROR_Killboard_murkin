import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { LoadingState } from '@/components/shared/LoadingState';
import { ReactElement } from 'react';

const STORYLINES_LIST = gql`
  query GetStorylines {
    storylines {
      nodes {
        id
        name
        description
        chapters {
          nodes {
            id
            name
          }
        }
      }
    }
  }
`;

export function Storylines(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);

  const { loading, error, data } = useQuery(STORYLINES_LIST);

  if (loading) return <LoadingState message="Loading storylines..." />;
  if (error) return <div className="alert alert-error">Error loading storylines: {error.message}</div>;
  if (!data?.storylines?.nodes) return <div className="alert alert-info">No storylines found</div>;

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:storylines.title')}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-6">{t('pages:storylines.title')}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.storylines.nodes.map((storyline: any) => (
              <div key={storyline.id} className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title">
                    <Link to={`/storyline/${storyline.id}`} className="link-hover link-primary">
                      {storyline.name}
                    </Link>
                  </h2>
                  
                  {storyline.description && (
                    <div className="mb-4">
                      <p className="text-sm text-base-content/80 line-clamp-3">
                        {storyline.description}
                      </p>
                    </div>
                  )}

                  <div className="stat">
                    <div className="stat-title">Chapters</div>
                    <div className="stat-value text-lg">{storyline.chapters?.nodes?.length || 0}</div>
                  </div>

                  {storyline.chapters && storyline.chapters.nodes.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-medium mb-2 text-sm">Chapters:</h3>
                      <div className="space-y-1">
                        {storyline.chapters.nodes.slice(0, 3).map((chapter: any, index: number) => (
                          <div key={chapter.id} className="text-xs flex items-center gap-2">
                            <span className="badge badge-primary badge-xs">#{index + 1}</span>
                            <Link 
                              to={`/chapter/${chapter.id}`} 
                              className="link-hover link-info truncate"
                            >
                              {chapter.name}
                            </Link>
                          </div>
                        ))}
                        {storyline.chapters.nodes.length > 3 && (
                          <div className="text-xs text-base-content/60">
                            +{storyline.chapters.nodes.length - 3} more chapters
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
