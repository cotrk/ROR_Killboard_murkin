import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { ReactElement } from 'react';

export function CharacterArmory({ id }: { id: number }): ReactElement {
  const { t } = useTranslation(['common', 'components', 'enums']);

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/" className="link-hover link-primary">{t('common:home')}</a>
            </li>
            <li>
              <a href={`/character/${id}`} className="link-hover link-primary">{t('common:character')}</a>
            </li>
            <li className="text-base-content/60">
              {t('common:armory')}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">{t('common:armory')}</h2>
          <div className="alert alert-info">
            Character armory component coming soon...
          </div>
        </div>
      </div>
    </div>
  );
}
