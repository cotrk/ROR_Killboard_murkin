import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import Tippy from '@tippyjs/react';
import { Query } from '@/__generated__/graphql';
import { LoadingState } from '@/components/shared/LoadingState';
import { ItemPopup } from './ItemPopup';
import { questTypeIcon } from '@/utils';
import { ReactElement } from 'react';

const ITEM_INFO = gql`
  query GetItemRewardedFromQuests(
    $itemId: ID!
    $first: Int
    $last: Int
    $before: String
    $after: String
  ) {
    item(id: $itemId) {
      id
      rewardedFromQuests(
        first: $first
        last: $last
        before: $before
        after: $after
      ) {
        nodes {
          id
          name
          type
          minLevel
          maxLevel
          journalEntry
          questDescription: description
          repeatableType
          zone {
            id
            name
          }
        }
        pageInfo {
          hasNextPage
          endCursor
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`;

interface ItemQuestsProps {
  itemId: string;
}

export function ItemQuests({ itemId }: ItemQuestsProps): ReactElement {
  const { t } = useTranslation(['common', 'items', 'quests']);

  const { loading, error, data } = useQuery(ITEM_INFO, {
    variables: { itemId, first: 20 },
  });

  if (loading) return <LoadingState message="Loading quest information..." />;
  if (error) return <div className="alert alert-error">Error loading quests: {error.message}</div>;
  if (!data?.item?.rewardedFromQuests?.nodes.length) {
    return <div className="alert alert-info">No quests reward this item</div>;
  }

  const quests = data.item.rewardedFromQuests.nodes;
  const pageInfo = data.item.rewardedFromQuests.pageInfo;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Quest Rewards</h2>
        
        <div className="space-y-4">
          {quests.map((quest: any) => (
            <div key={quest.id} className="card bg-base-200">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary text-lg font-bold">
                        {questTypeIcon(quest.type)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="card-title text-lg">
                      <Link 
                        to={`/quest/${quest.id}`} 
                        className="link-hover link-primary"
                      >
                        {quest.name}
                      </Link>
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 text-sm text-base-content/80 mb-2">
                      <span className="badge badge-outline">
                        {quest.type}
                      </span>
                      <span className="badge badge-outline">
                        Level {quest.minLevel}-{quest.maxLevel}
                      </span>
                      {quest.repeatableType && quest.repeatableType !== 'NONE' && (
                        <span className="badge badge-warning">
                          {quest.repeatableType}
                        </span>
                      )}
                    </div>

                    {quest.journalEntry && (
                      <div className="mb-3">
                        <p className="text-sm text-base-content/80 italic">
                          {quest.journalEntry}
                        </p>
                      </div>
                    )}

                    {quest.questDescription && (
                      <div className="mb-3">
                        <p className="text-sm text-base-content/70">
                          {quest.questDescription}
                        </p>
                      </div>
                    )}

                    {quest.zone && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Zone:</span>
                        <Link 
                          to={`/zone/${quest.zone.id}`} 
                          className="link-hover link-info"
                        >
                          {quest.zone.name}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex justify-center gap-2">
            {pageInfo.hasPreviousPage && (
              <button className="btn btn-outline btn-sm">Previous</button>
            )}
            {pageInfo.hasNextPage && (
              <button className="btn btn-outline btn-sm">Next</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
