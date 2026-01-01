import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { gql, useQuery } from '@apollo/client';
import { ItemQuests } from '@/components/item/ItemQuests';
import { ItemVendorsPurchase } from '@/components/item/ItemVendorsPurchase';
import { ItemVendorsSell } from '@/components/item/ItemVendorsSell';
import { ReactElement } from 'react';
import { GetItemInfoQuery } from '@/__generated__/graphql';

const ITEM_INFO = gql`
  query GetItemInfo($id: ID!) {
    item(id: $id) {
      id
      name
      description
      careerRestriction
      rarity
      itemLevel
      iconUrl
      stats {
        stat
        value
      }
      type
      levelRequirement
      renownRankRequirement
      slot
      armor
      talismanSlots
      speed
      dps
      itemSet {
        id
        name
        items {
          id
          name
          iconUrl
        }
      }
    }
  }
`;

export function Item({
  tab = 'vendors'
}: {
  tab: 'vendors' | 'purchase' | 'quests';
}): ReactElement {
  const { t } = useTranslation(['common', 'pages', 'items']);
  const { id } = useParams();

  const { loading, error, data } = useQuery<GetItemInfoQuery>(ITEM_INFO, {
    variables: { id },
  });

  if (loading) return <div className="skeleton h-64"></div>;
  if (error) return <div className="alert alert-error">Error loading item: {error.message}</div>;
  if (!data?.item) return <div className="alert alert-info">Item not found</div>;

  const item = data.item;

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'common': return 'text-base-content';
      case 'uncommon': return 'text-success';
      case 'rare': return 'text-info';
      case 'epic': return 'text-warning';
      case 'legendary': return 'text-error';
      default: return 'text-base-content';
    }
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
              <Link to="/items" className="link-hover link-primary">{t('common:items')}</Link>
            </li>
            <li className="text-base-content/60">
              {item.name}
            </li>
          </ul>
        </nav>
      </div>

      {/* Item Info Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex gap-6">
            {/* Item Icon */}
            <div className="flex-shrink-0">
              <div className="avatar">
                <div className="w-24 h-24 rounded-lg bg-base-200 flex items-center justify-center">
                  {item.iconUrl ? (
                    <img 
                      src={item.iconUrl} 
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-4xl">📦</div>
                  )}
                </div>
              </div>
            </div>

            {/* Item Details */}
            <div className="flex-1">
              <h2 className={`card-title text-2xl mb-2 ${getRarityColor(item.rarity || '')}`}>
                {item.name}
              </h2>
              
              {item.rarity && (
                <div className="badge badge-outline mb-2">
                  {item.rarity}
                </div>
              )}

              {item.itemLevel && (
                <div className="text-sm text-base-content/80 mb-2">
                  Item Level: {item.itemLevel}
                </div>
              )}

              {item.levelRequirement && (
                <div className="text-sm text-base-content/80 mb-2">
                  Level Requirement: {item.levelRequirement}
                </div>
              )}

              {item.renownRankRequirement && (
                <div className="text-sm text-base-content/80 mb-2">
                  Renown Rank: {item.renownRankRequirement}
                </div>
              )}

              {item.careerRestriction && (
                <div className="text-sm text-base-content/80 mb-2">
                  Career: {item.careerRestriction}
                </div>
              )}

              {item.description && (
                <p className="text-base-content/80 mt-4">{item.description}</p>
              )}
            </div>
          </div>

          {/* Item Stats */}
          {item.stats && item.stats.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {item.stats.map((stat, index) => (
                  <div key={index} className="flex justify-between p-2 bg-base-200 rounded">
                    <span className="font-medium">{stat.stat}</span>
                    <span className="text-success font-bold">+{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Item Properties */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {item.type && (
              <div className="stat">
                <div className="stat-title">Type</div>
                <div className="stat-value text-sm">{item.type}</div>
              </div>
            )}
            
            {item.slot && (
              <div className="stat">
                <div className="stat-title">Slot</div>
                <div className="stat-value text-sm">{item.slot}</div>
              </div>
            )}
            
            {item.armor && (
              <div className="stat">
                <div className="stat-title">Armor</div>
                <div className="stat-value text-sm">{item.armor}</div>
              </div>
            )}
            
            {item.dps && (
              <div className="stat">
                <div className="stat-title">DPS</div>
                <div className="stat-value text-sm">{item.dps}</div>
              </div>
            )}
            
            {item.speed && (
              <div className="stat">
                <div className="stat-title">Speed</div>
                <div className="stat-value text-sm">{item.speed}</div>
              </div>
            )}
            
            {item.talismanSlots && (
              <div className="stat">
                <div className="stat-title">Talisman Slots</div>
                <div className="stat-value text-sm">{item.talismanSlots}</div>
              </div>
            )}
          </div>

          {/* Item Set */}
          {item.itemSet && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">Item Set: {item.itemSet.name}</h3>
              <div className="card bg-base-200">
                <div className="card-body p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {item.itemSet.items.map((setItem) => (
                      <div key={setItem.id} className="text-center">
                        <div className="avatar mb-2">
                          <div className="w-12 h-12 rounded bg-base-300 flex items-center justify-center">
                            {setItem.iconUrl ? (
                              <img 
                                src={setItem.iconUrl} 
                                alt={setItem.name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="text-lg">📦</div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs">{setItem.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <Link 
          to={`/item/${id}`}
          className={`tab tab-lg ${tab === 'vendors' ? 'tab-active' : ''}`}
        >
          {t('items:vendors')}
        </Link>
        <Link 
          to={`/item/${id}/purchase`}
          className={`tab tab-lg ${tab === 'purchase' ? 'tab-active' : ''}`}
        >
          {t('items:purchase')}
        </Link>
        <Link 
          to={`/item/${id}/quests`}
          className={`tab tab-lg ${tab === 'quests' ? 'tab-active' : ''}`}
        >
          {t('items:quests')}
        </Link>
      </div>

      {/* Tab Content */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {tab === 'vendors' && (
            <div>
              <h3 className="text-lg font-bold mb-4">{t('items:vendors')}</h3>
              <ItemVendorsSell itemId={id || ''} />
            </div>
          )}

          {tab === 'purchase' && (
            <div>
              <h3 className="text-lg font-bold mb-4">{t('items:purchase')}</h3>
              <ItemVendorsPurchase itemId={id || ''} />
            </div>
          )}

          {tab === 'quests' && (
            <div>
              <h3 className="text-lg font-bold mb-4">{t('items:quests')}</h3>
              <ItemQuests itemId={id || ''} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
