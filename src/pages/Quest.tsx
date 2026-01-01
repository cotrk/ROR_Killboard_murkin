import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import { ReactElement } from 'react';
import { GetQuestInfoQuery } from '@/__generated__/graphql';

const QUEST_INFO = gql`
  query GetQuestInfo($id: ID!) {
    quest(id: $id) {
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
      description
      objectives {
        description
        count
      }
      journalEntry
    }
  }
`;

export function Quest(): ReactElement {
  const { t } = useTranslation(['common', 'pages', 'quests']);
  const { id } = useParams();

  const { loading, error, data } = useQuery<GetQuestInfoQuery>(QUEST_INFO, {
    variables: { id },
  });

  if (loading) return <div className="skeleton h-64"></div>;
  if (error) return <div className="alert alert-error">Error loading quest: {error.message}</div>;
  if (!data?.quest) return <div className="alert alert-info">Quest not found</div>;

  const quest = data.quest;

  const getQuestTypeIcon = (type: any) => {
    if (type.isEpic) return '⭐';
    if (type.isRvR) return '⚔️';
    if (type.isGroup) return '👥';
    if (type.isTravel) return '🗺️';
    if (type.isTome) return '📖';
    if (type.isPlayerKill) return '💀';
    return '📋';
  };

  const getQuestTypeLabel = (type: any) => {
    const types = [];
    if (type.isEpic) types.push('Epic');
    if (type.isRvR) types.push('RvR');
    if (type.isGroup) types.push('Group');
    if (type.isTravel) types.push('Travel');
    if (type.isTome) types.push('Tome');
    if (type.isPlayerKill) types.push('Player Kill');
    return types.length > 0 ? types.join(', ') : 'Standard';
  };

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li>
              <Link to="/quests" className="link-hover link-primary">{t('common:quests')}</Link>
            </li>
            <li className="text-base-content/60">
              {quest.name}
            </li>
          </ul>
        </nav>
      </div>

      {/* Quest Info Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex gap-6">
            {/* Quest Icon */}
            <div className="flex-shrink-0">
              <div className="avatar">
                <div className="w-24 h-24 rounded-lg bg-base-200 flex items-center justify-center text-6xl">
                  {getQuestTypeIcon(quest.type)}
                </div>
              </div>
            </div>

            {/* Quest Details */}
            <div className="flex-1">
              <h2 className="card-title text-2xl mb-2">{quest.name}</h2>
              
              <div className="flex gap-2 mb-2">
                <div className="badge badge-outline">
                  {getQuestTypeLabel(quest.type)}
                </div>
                {quest.choiceCount > 0 && (
                  <div className="badge badge-primary">
                    {quest.choiceCount} Choices
                  </div>
                )}
              </div>

              {quest.description && (
                <div className="prose prose-sm max-w-none mb-4">
                  <p>{quest.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quest Objectives */}
          {quest.objectives && quest.objectives.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">Objectives</h3>
              <div className="space-y-2">
                {quest.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-base-200 rounded">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-bold">
                      {objective.count}
                    </div>
                    <span>{objective.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quest Rewards */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-4">Rewards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quest.xp && (
                <div className="stat">
                  <div className="stat-title">Experience</div>
                  <div className="stat-value text-success">{quest.xp}</div>
                </div>
              )}
              
              {quest.gold && (
                <div className="stat">
                  <div className="stat-title">Gold</div>
                  <div className="stat-value text-warning">{quest.gold}</div>
                </div>
              )}
              
              {quest.choiceCount > 0 && (
                <div className="stat">
                  <div className="stat-title">Choices</div>
                  <div className="stat-value text-primary">{quest.choiceCount}</div>
                </div>
              )}
            </div>
          </div>

          {/* Journal Entry */}
          {quest.journalEntry && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">Journal Entry</h3>
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <p className="text-base-content/80 italic">{quest.journalEntry}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
