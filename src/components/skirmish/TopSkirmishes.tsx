import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Query } from '@/__generated__/graphql';
import { ErrorMessage } from '@/components/global/ErrorMessage';
import { SkirmishListTable } from '@/components/skirmish/SkirmishListTable';
import { ReactElement } from 'react';
import { LoadingState } from '@/components/shared/LoadingState';

const TOP_SKIRMISHES = gql`
  query GetTopSkirmishes {
    topSkirmishes {
      id
      scenario {
        id
        name
      }
      primaryZone {
        id
        name
      }
      primaryZoneArea {
        id
        name
      }
      startTime
      endTime
      topGuildsByPlayers {
        guild {
          id
          name
          realm
          heraldry {
            emblem
            pattern
            color1
            color2
            shape
          }
        }
        count
      }
      numberOfKills
      numberOfKillsOrder
      numberOfKillsDestruction
      numberOfPlayers
      numberOfPlayersOrder
      numberOfPlayersDestruction
    }
  }
`;

export function TopSkirmishes(): ReactElement {
  const { t } = useTranslation('components');
  const { loading, error, data } = useQuery<Query>(TOP_SKIRMISHES);

  if (loading)
    return (
      <div className="mb-3">
        <h3 className="text-lg font-bold uppercase mb-4">
          {t('topSkirmishes.title')}
        </h3>
        <LoadingState size="md" className="py-4" />
      </div>
    );

  if (error)
    return (
      <div className="mb-3">
        <h3 className="text-lg font-bold uppercase mb-4">
          {t('topSkirmishes.title')}
        </h3>
        <ErrorMessage name={error.name} message={error.message} />
      </div>
    );

  const skirmishes = _.uniqBy(
    _.orderBy(data?.topSkirmishes, (s) => s.kills?.totalCount, 'desc'),
    (s) => s.id,
  );

  if (skirmishes == null)
    return <p className="text-center py-4">{t('common:error')}</p>;

  return (
    <div className="mb-3">
      <h3 className="text-lg font-bold uppercase mb-4">
        {t('topSkirmishes.title')}
      </h3>
      <SkirmishListTable data={skirmishes} />
    </div>
  );
}
