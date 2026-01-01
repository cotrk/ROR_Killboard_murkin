import { ReactNode } from 'react';
import { API_CONFIG, ICON_CONFIG } from '@/config/constants';

export function GoldPrice({ price }: { price: number }): ReactNode {
  if (price === 0) {
    return null;
  }

  const gold = Math.floor(price / 10000);
  const silver = Math.floor((price % 10000) / 100);
  const copper = price % 100;

  return (
    <span>
      {gold > 0 && (
        <span className="icon-text mr-1">
          {gold}
          <figure className="image is-16x16 mt-1 ml-1">
            <img
              src={`${API_CONFIG.ARMORY_BASE_URL}/icon/${ICON_CONFIG.GOLD}`}
              alt="Gold"
            />
          </figure>
        </span>
      )}
      {silver > 0 && (
        <span className="icon-text mr-1">
          {silver}
          <figure className="image is-16x16 mt-1 ml-1">
            <img
              src={`${API_CONFIG.ARMORY_BASE_URL}/icon/${ICON_CONFIG.SILVER}`}
              alt="Silver"
            />
          </figure>
        </span>
      )}
      {copper > 0 && (
        <span className="icon-text mr-1">
          {copper}
          <figure className="image is-16x16 mt-1 ml-1">
            <img
              src={`${API_CONFIG.ARMORY_BASE_URL}/icon/${ICON_CONFIG.SILVER}`}
              alt="Copper"
            />
          </figure>
        </span>
      )}
    </span>
  );
}
