import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { ReactElement } from 'react';
import { GetInstancesQuery } from '@/__generated__/graphql';

const QUERY = gql`
  query GetInstances($first: Int, $after: String) {
    instances(first: $first, after: $after) {
      nodes {
        id
        name
        encounters {
          id
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export function Instances(): ReactElement {
  const { t } = useTranslation(['common', 'pages', 'instances']);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('name') || '';

  const { loading, error, data } = useQuery<GetInstancesQuery>(QUERY, {
    variables: {
      first: 20,
      where: search ? { name: { contains: search } } : undefined,
    },
  });

  if (loading && !data) return <div className="skeleton h-64"></div>;
  if (error) return <div className="alert alert-error">Error loading instances: {error.message}</div>;

  const instances = data?.instances?.nodes || [];

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li className="text-base-content/60">
              {t('common:instances')}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">{t('common:instances')}</h2>
          
          {search && (
            <div className="alert alert-info mb-4">
              Searching for: {search}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Encounters</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {instances.map((instance) => (
                  <tr key={instance.id}>
                    <td>
                      <Link 
                        to={`/instance/${instance.id}`}
                        className="link-hover link-primary font-medium"
                      >
                        {instance.name}
                      </Link>
                    </td>
                    <td>
                      <div className="badge badge-outline">
                        {instance.encounters?.length || 0} Encounters
                      </div>
                    </td>
                    <td>
                      <Link 
                        to={`/instance-runs?instance=${instance.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        View Runs
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {instances.length === 0 && !loading && (
            <div className="alert alert-info">
              {search ? 'No instances found matching your search.' : 'No instances available.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
