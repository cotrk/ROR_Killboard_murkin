import { Link, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { ReactElement } from 'react';
import { GetQuestsQuery } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';

const QUESTS = gql`
  query GetQuests($first: Int, $after: String) {
    quests(first: $first, after: $after) {
      nodes {
        id
        name
        type {
          isGroup
          isTravel
          isTome
          isRvR
          isPlayerKill
          isEpic
        }
        xp
        gold
        choiceCount
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export function Quests(): ReactElement {
  const { t } = useTranslation(['common', 'pages', 'quests']);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';

  const { loading, error, data } = useQuery<GetQuestsQuery>(QUESTS, {
    variables: {
      first: 20,
    },
  });

  if (loading && !data) return <LoadingState size="lg" className="py-12" />;
  if (error)
    return (
      <div className="alert alert-error">
        Error loading quests: {error.message}
      </div>
    );

  const quests = data?.quests?.nodes || [];

  const getQuestTypeIcon = (type: any) => {
    if (type.isEpic) return '⭐';
    if (type.isRvR) return '⚔️';
    if (type.isGroup) return '👥';
    if (type.isTravel) return '🗺️';
    if (type.isTome) return '📖';
    if (type.isPlayerKill) return '💀';
    return '📋';
  };

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
            <li className="text-base-content/60">{t('common:quests')}</li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">{t('common:quests')}</h2>

          {search && (
            <div className="alert alert-info mb-4">Searching for: {search}</div>
          )}

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Rewards</th>
                </tr>
              </thead>
              <tbody>
                {quests.map((quest) => (
                  <tr key={quest.id}>
                    <td>
                      <div className="text-2xl">
                        {getQuestTypeIcon(quest.type)}
                      </div>
                    </td>
                    <td>
                      <Link
                        to={`/quest/${quest.id}`}
                        className="link-hover link-primary font-medium"
                      >
                        {quest.name}
                      </Link>
                    </td>
                    <td>
                      <div className="space-y-1">
                        {quest.xp && (
                          <div className="text-sm text-success">
                            +{quest.xp} XP
                          </div>
                        )}
                        {quest.gold && (
                          <div className="text-sm text-warning">
                            {quest.gold} Gold
                          </div>
                        )}
                        {quest.choiceCount > 0 && (
                          <div className="badge badge-outline badge-sm">
                            {quest.choiceCount} Choices
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {quests.length === 0 && !loading && (
            <div className="alert alert-info">
              {search
                ? 'No quests found matching your search.'
                : 'No quests available.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
