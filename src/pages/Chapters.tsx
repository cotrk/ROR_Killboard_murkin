import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { LoadingState } from '@/components/shared/LoadingState';
import { ReactElement } from 'react';

const CHAPTERS_LIST = gql`
  query GetChapters {
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
`;

export function Chapters(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);

  const { loading, error, data } = useQuery(CHAPTERS_LIST);

  if (loading) return <LoadingState message="Loading chapters..." />;
  if (error) return <div className="alert alert-error">Error loading chapters: {error.message}</div>;
  if (!data?.chapters?.nodes) return <div className="alert alert-info">No chapters found</div>;

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:chapters.title')}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-6">{t('pages:chapters.title')}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.chapters.nodes.map((chapter: any) => (
              <div key={chapter.id} className="card bg-base-200">
                <div className="card-body">
                  <h2 className="card-title">
                    <Link to={`/chapter/${chapter.id}`} className="link-hover link-primary">
                      {chapter.name}
                    </Link>
                  </h2>
                  
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
        </div>
      </div>
    </div>
  );
}
