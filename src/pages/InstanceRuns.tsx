import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ReactElement } from 'react';
import { LoadingState } from '@/components/shared/LoadingState';

export function InstanceRuns(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">
                {t('common:home')}
              </Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:instanceRuns.title')}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">
            {t('pages:instanceRuns.title')}
          </h2>

          <div className="alert alert-info">
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Instance runs data coming soon...</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h3 className="font-bold mb-2">Recent Runs</h3>
                <LoadingState className="py-2" />
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h3 className="font-bold mb-2">Top Performers</h3>
                <LoadingState className="py-2" />
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h3 className="font-bold mb-2">Statistics</h3>
                <LoadingState className="py-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
