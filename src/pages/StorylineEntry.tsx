import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import { ReactElement } from 'react';
import { GetWarJournalEntryQuery } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';

const WAR_JOURNAL_ENTRY_DETAILS = gql`
  query GetWarJournalEntry($id: ID!) {
    warJournalEntry(id: $id) {
      storyline {
        name
      }
      id
      name
      locationText
      npcName
      text
      title
      shortTitle
      isRvR
      area {
        id
        name
      }
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
      zone {
        id
        name
      }
    }
  }
`;

export function StorylineEntry(): ReactElement {
  const { t } = useTranslation(['common', 'pages', 'storylines']);
  const { id } = useParams();

  const { loading, error, data } = useQuery<GetWarJournalEntryQuery>(
    WAR_JOURNAL_ENTRY_DETAILS,
    {
      variables: { id },
    },
  );

  if (loading) return <LoadingState size="lg" className="py-12" />;
  if (error)
    return (
      <div className="alert alert-error">
        Error loading story entry: {error.message}
      </div>
    );
  if (!data?.warJournalEntry)
    return <div className="alert alert-info">Story entry not found</div>;

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
            <li className="text-base-content/60">{entry.title}</li>
          </ul>
        </nav>
      </div>

      {/* Story Entry Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">{entry.title}</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Entry Details */}
            <div className="space-y-4">
              <div className="stat">
                <div className="stat-title">Location</div>
                <div className="stat-value">{entry.locationText}</div>
              </div>

              <div className="stat">
                <div className="stat-title">NPC</div>
                <div className="stat-value">{entry.npcName}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Type</div>
                <div className="stat-value">
                  {entry.isRvR ? (
                    <span className="badge badge-error">RvR</span>
                  ) : (
                    <span className="badge badge-info">PvE</span>
                  )}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Area</div>
                <div className="stat-value">{entry.area?.name}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Zone</div>
                <div className="stat-value">{entry.zone?.name}</div>
              </div>
            </div>

            {/* Storyline */}
            <div className="space-y-4">
              <div className="stat">
                <div className="stat-title">Storyline</div>
                <div className="stat-value">{entry.storyline?.name}</div>
              </div>
            </div>
          </div>

          {/* Entry Text */}
          <div className="divider"></div>
          <div className="prose max-w-none">
            <p className="text-base-content/80 whitespace-pre-wrap">
              {entry.text}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex gap-4">
            <Link to={`/storylines`} className="btn btn-outline">
              Back to Storylines
            </Link>

            {entry.zone && (
              <Link to={`/zone/${entry.zone.id}`} className="btn btn-primary">
                View Zone
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
