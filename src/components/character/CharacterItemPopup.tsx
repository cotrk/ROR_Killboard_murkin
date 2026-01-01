import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  EquippedCharacterItemFragment,
  TalismanFragment,
} from '@/__generated__/graphql';
import { isPercentage } from '@/utils';
import { itemNameClass, statMultiplier } from '@/itemUtils';
import { ReactElement } from 'react';
import { ItemListEntryFragment } from '@/__generated__/graphql';

const numEquippedInSet = (
  itemSet: ItemListEntryFragment['itemSet'],
  itemsEquipped: EquippedCharacterItemFragment[],
): number => {
  let numEquipped = 0;

  if (!itemSet) return 0;

  itemsEquipped.forEach((item) => {
    if (
      item.item.itemSet &&
      item.item.itemSet.id === itemSet.id &&
      item.equipSlot !== 'NONE'
    ) {
      numEquipped += 1;
    }
  });

  return numEquipped;
};

export function CharacterItemPopup({
  item,
  itemsEquipped,
  talismans,
}: {
  item: EquippedCharacterItemFragment;
  itemsEquipped: EquippedCharacterItemFragment[];
  talismans: TalismanFragment[];
}): ReactElement {
  const { t } = useTranslation(['common', 'items']);

  const numInSet = numEquippedInSet(item.item.itemSet, itemsEquipped);

  return (
    <div className="card bg-base-100 shadow-xl p-4 max-w-sm">
      <div className="flex items-start gap-4">
        <div className="avatar">
          <div className="w-16 h-16 rounded">
            <img
              src={item.item.iconUrl}
              alt={item.item.name}
              className="object-cover"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={clsx('font-bold text-lg truncate', itemNameClass(item.item))}>
            {item.item.name}
          </h3>
          
          <div className="text-sm text-base-content/80 space-y-1">
            <div>
              <span className="font-medium">Type:</span> {item.item.type}
            </div>
            <div>
              <span className="font-medium">Slot:</span> {item.equipSlot}
            </div>
            {item.item.careerRestriction && item.item.careerRestriction.length > 0 && (
              <div>
                <span className="font-medium">Career:</span> {item.item.careerRestriction.join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>

      {item.item.stats && item.item.stats.length > 0 && (
        <>
          <div className="divider my-4"></div>
          <h4 className="font-medium mb-2">Stats:</h4>
          <div className="space-y-1">
            {item.item.stats.map((stat, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{stat.stat}</span>
                <span className={clsx(
                  'font-medium',
                  statMultiplier(stat.value) > 1 ? 'text-success' : 
                  statMultiplier(stat.value) < 1 ? 'text-error' : 'text-base-content'
                )}>
                  {isPercentage(stat.stat) 
                    ? `${(statMultiplier(stat.value) * 100).toFixed(1)}%`
                    : stat.value
                  }
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {item.item.itemSet && (
        <>
          <div className="divider my-4"></div>
          <h4 className="font-medium mb-2">Set Bonus:</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>{item.item.itemSet.name}</span>
              <span className="badge badge-primary">
                {numInSet}/{item.item.itemSet.items.length}
              </span>
            </div>
            {item.item.itemSet.bonuses?.map((bonus, index) => (
              <div 
                key={index} 
                className={clsx(
                  'text-xs',
                  numInSet >= bonus.itemsRequired ? 'text-success' : 'text-base-content/60'
                )}
              >
                {bonus.itemsRequired} pieces: {
                  bonus.bonus.__typename === 'Ability' 
                    ? bonus.bonus.description 
                    : `${bonus.bonus.stat}: ${bonus.bonus.value}${bonus.bonus.percentage ? '%' : ''}`
                }
              </div>
            ))}
          </div>
        </>
      )}

      {item.item.description && (
        <>
          <div className="divider my-4"></div>
          <p className="text-sm text-base-content/80 italic">
            {item.item.description}
          </p>
        </>
      )}
    </div>
  );
}
