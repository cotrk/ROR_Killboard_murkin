import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ItemIconWithPopup } from '@/components/item/ItemIconWithPopup';
import { itemNameClass } from '@/itemUtils';
import { ItemListEntryFragment } from '@/__generated__/graphql';

export function ItemListEntry({
  item,
}: {
  item: ItemListEntryFragment;
}): ReactElement {
  const { t } = useTranslation(['enums']);

  return (
    <tr className="hover:bg-base-200">
      <td>
        <ItemIconWithPopup item={item} />
      </td>
      <td>
        <Link to={`/item/${item.id}`} className="font-semibold hover:text-primary transition-colors">
          {item.name}
        </Link>
      </td>
      <td className="text-sm text-base-content/60">{t(`enums:itemType.${item.type}`)}</td>
      <td className="text-sm text-base-content/60">{t(`enums:itemSlot.${item.slot}`)}</td>
      <td className="text-sm text-base-content/60">
        {item.stats?.slice(0, 3).map(stat => (
          <div key={stat.stat} className="badge badge-ghost badge-sm">
            {stat.stat}: {stat.value}
          </div>
        ))}
      </td>
    </tr>
  );
}
