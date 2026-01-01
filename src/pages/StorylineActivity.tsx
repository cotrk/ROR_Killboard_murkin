import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import { ReactElement } from 'react';
import { GetWarJournalActivityQuery } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';

const WAR_JOURNAL_ACTIVITY_DETAILS = gql`
  query GetWarJournalActivity($id: ID!) {
    warJournalEntry(id: $id) {
      id
      storyline {
        name
      }
      name
      position {
        x
        y
        zone {
          id
          name
        }
      }
      activities {
        id
        name
        text
        activityType
        zone {
          id
          name
        }
        tasks {
          name
        }
      }
    }
  }
`;

export function StorylineActivity(): ReactElement {
  const { t } = useTranslation(['common', 'pages', 'storylines']);
  const { id } = useParams();

  const { loading, error, data } = useQuery<GetWarJournalActivityQuery>(
    WAR_JOURNAL_ACTIVITY_DETAILS,
    {
      variables: { id },
    },
  );

  if (loading) return <LoadingState size="lg" className="py-12" />;
  if (error)
    return (
      <div className="alert alert-error">
        Error loading story activity: {error.message}
      </div>
    );
  if (!data?.warJournalEntry)
    return <div className="alert alert-info">Story activity not found</div>;

  const entry = data.warJournalEntry;

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">
                {t('common:home')}
              </Link>
            </li>
            <li>
              <Link to="/storylines" className="link-hover link-primary">
                {t('common:storylines')}
              </Link>
            </li>
            <li className="text-base-content/60">{entry.name}</li>
          </ul>
        </nav>
      </div>

      {/* Story Activity Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">{entry.name}</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Details */}
            <div className="space-y-4">
              <div className="stat">
                <div className="stat-title">Storyline</div>
                <div className="stat-value">{entry.storyline?.name}</div>
              </div>

              {entry.position && (
                <div className="stat">
                  <div className="stat-title">Position</div>
                  <div className="stat-value">
                    X: {entry.position.x}, Y: {entry.position.y}
                  </div>
                </div>
              )}

              {entry.position?.zone && (
                <div className="stat">
                  <div className="stat-title">Zone</div>
                  <div className="stat-value">
                    <Link
                      to={`/zone/${entry.position.zone.id}`}
                      className="link-hover link-primary"
                    >
                      {entry.position.zone.name}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activities */}
      {entry.activities && entry.activities.length > 0 && (
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title text-xl mb-4">Activities</h3>

            <div className="space-y-4">
              {entry.activities.map((activity) => (
                <div key={activity.id} className="card bg-base-200">
                  <div className="card-body p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{activity.name}</h4>
                      <span className="badge badge-outline">
                        {activity.activityType}
                      </span>
                    </div>

                    {activity.text && (
                      <p className="text-base-content/80 mb-3">
                        {activity.text}
                      </p>
                    )}

                    {activity.zone && (
                      <div className="mb-2">
                        <span className="text-sm text-base-content/60">
                          Zone:{' '}
                        </span>
                        <Link
                          to={`/zone/${activity.zone.id}`}
                          className="link-hover link-primary text-sm"
                        >
                          {activity.zone.name}
                        </Link>
                      </div>
                    )}

                    {activity.tasks && activity.tasks.length > 0 && (
                      <div>
                        <span className="text-sm text-base-content/60">
                          Tasks:{' '}
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {activity.tasks.map((task, index) => (
                            <span
                              key={index}
                              className="badge badge-sm badge-info"
                            >
                              {task.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex gap-4">
            <Link to={`/storylines`} className="btn btn-outline">
              Back to Storylines
            </Link>

            {entry.position?.zone && (
              <Link
                to={`/zone/${entry.position.zone.id}`}
                className="btn btn-primary"
              >
                View Zone
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
