import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import { LoadingState } from '@/components/shared/LoadingState';
import { RankedLeaderboardTable } from '@/components/RankedLeaderboardTable';
import { ReactElement } from 'react';
import { GetRankedLeaderboardSeasonsQuery } from '@/__generated__/graphql';

const RANKED_LEADERBOARD_SEASONS = gql`
  query GetRankedLeaderboardSeasons {
    rankedSeasons {
      id
      name
      start
      end
      mainSeason
    }
  }
`;

export function RankedLeaderboard(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const [search, setSearch] = useSearchParams();
  const { loading, error, data } = useQuery<GetRankedLeaderboardSeasonsQuery>(
    RANKED_LEADERBOARD_SEASONS,
    {},
  );

  if (loading) return <LoadingState message="Loading leaderboard seasons..." />;
  if (error) return <div className="alert alert-error">Error loading leaderboard: {error.message}</div>;
  if (!data?.rankedSeasons) return <div className="alert alert-info">No seasons found</div>;

  const selectedSeason = search.get('season') || data.rankedSeasons.find(s => s.mainSeason)?.id || '';

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:rankedLeaderboard.title')}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-4">{t('pages:rankedLeaderboard.title')}</h1>
          
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">Select Season</span>
            </label>
            <select 
              className="select select-bordered"
              value={selectedSeason}
              onChange={(e) => {
                search.set('season', e.target.value);
                setSearch(search);
              }}
            >
              {data.rankedSeasons.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.name} {season.mainSeason && '(Main)'}
                </option>
              ))}
            </select>
          </div>

          <div className="divider"></div>

          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Leaderboard</h2>
              <RankedLeaderboardTable season={selectedSeason} type="ranked" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
