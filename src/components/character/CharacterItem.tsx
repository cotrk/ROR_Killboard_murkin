import { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  EquippedCharacterItemFragment,
  ItemListEntryFragment,
  TalismanFragment,
} from '@/__generated__/graphql';
import { CharacterItemPopup } from './CharacterItemPopup';
import { itemFigureClass, itemNameClass } from '@/itemUtils';
import { gql } from '@apollo/client';
import { ITEM_FRAGMENT } from '@/components/item/ItemIconWithPopup';

export const ITEM_TALISMAN_FRAGMENT = gql`
  fragment Talisman on Item {
    id
    name
    rarity
    iconUrl
    stats {
      stat
      value
    }
    buffs {
      id
      description
    }
  }
`;

interface CharacterItemProps {
  item: EquippedCharacterItemFragment;
  talismans: TalismanFragment[];
}

export function CharacterItem({ item, talismans }: CharacterItemProps): ReactElement {
  const { t } = useTranslation(['common', 'items']);
  const [showPopup, setShowPopup] = useState(false);

  const matchingTalismans = talismans.filter(
    (talisman) => talisman.item?.itemSet?.id === item.item?.itemSet?.id,
  );

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-start gap-4">
          <div className="avatar">
            <div className={`w-16 h-16 rounded ${itemFigureClass(item.item)}`}>
              <img
                src={item.item.iconUrl}
                alt={item.item.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`text-lg font-bold ${itemNameClass(item.item)}`}>
                {item.item.name}
              </h3>
              <span className="badge badge-outline">
                {item.item.type}
              </span>
            </div>
            
            <div className="text-sm text-base-content/80 space-y-1">
              <div>
                <span className="font-medium">Slot:</span> {item.equipSlot}
              </div>
              {item.item.careerRestriction && item.item.careerRestriction.length > 0 && (
                <div>
                  <span className="font-medium">Careers:</span> {item.item.careerRestriction.join(', ')}
                </div>
              )}
              {item.item.itemSet && (
                <div>
                  <span className="font-medium">Set:</span> {item.item.itemSet.name}
                </div>
              )}
            </div>
            
            <button
              className="btn btn-outline btn-sm mt-2"
              onClick={() => setShowPopup(true)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="modal-action">
              <button 
                className="btn btn-circle btn-ghost"
                onClick={() => setShowPopup(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <CharacterItemPopup 
                item={item} 
                itemsEquipped={[]} 
                talismans={talismans} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
