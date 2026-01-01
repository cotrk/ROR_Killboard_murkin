import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import { LoadingState } from '@/components/shared/LoadingState';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { ReactElement } from 'react';
import React from 'react';

const SEARCH_GUILDS = gql`
  query SearchGuilds($query: String!, $first: Int = 20) {
    guilds(where: { name: { contains: $query } }, first: $first) {
      nodes {
        id
        name
        level
        realm
        heraldry
        members {
          totalCount
        }
        leader {
          id
          name
          career
          level
        }
      }
    }
  }
`;

export function SearchGuild(): ReactElement {
  const { t } = useTranslation(['common', 'pages']);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { loading, error, data } = useQuery(SEARCH_GUILDS, {
    variables: { query: debouncedQuery, first: 20 },
    skip: !debouncedQuery || debouncedQuery.length < 2,
  });

  return (
    <div className="container mx-auto max-w-7xl mt-2">
      <div className="flex justify-between items-center mb-4">
        <nav className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/" className="link-hover link-primary">{t('common:home')}</Link>
            </li>
            <li className="text-base-content/60">
              {t('pages:searchGuild.title')}
            </li>
          </ul>
        </nav>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl mb-6">{t('pages:searchGuild.title')}</h1>
          
          <div className="form-control mb-6">
            <input
              type="text"
              placeholder="Search guilds..."
              className="input input-bordered"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <label className="label">
              <span className="label-text-alt">
                Enter at least 2 characters to search
              </span>
            </label>
          </div>

          {loading && debouncedQuery && <LoadingState message="Searching guilds..." />}
          
          {error && (
            <div className="alert alert-error">
              Error searching guilds: {error.message}
            </div>
          )}

          {data?.guilds?.nodes && data.guilds.nodes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.guilds.nodes.map((guild: any) => (
                <div key={guild.id} className="card bg-base-200">
                  <div className="card-body">
                    <div className="flex items-center gap-3 mb-4">
                      <GuildHeraldry
                        size="48"
                        heraldry={guild.heraldry}
                        realm={guild.realm}
                      />
                      <div className="flex-1">
                        <h2 className="card-title text-lg">
                          <Link to={`/guild/${guild.id}`} className="link-hover link-primary">
                            {guild.name}
                          </Link>
                        </h2>
                        <div className="text-sm space-y-1">
                          <div>
                            <span className="font-medium">Level:</span> {guild.level}
                          </div>
                          <div>
                            <span className="font-medium">Realm:</span>{' '}
                            <span className={guild.realm === 'Destruction' ? 'text-error' : 'text-info'}>
                              {guild.realm}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Members:</span> {guild.members?.totalCount || 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    {guild.leader && (
                      <div className="text-sm">
                        <span className="font-medium">Leader:</span>{' '}
                        <Link 
                          to={`/character/${guild.leader.id}`} 
                          className="link-hover link-info"
                        >
                          {guild.leader.name}
                        </Link>
                        <span className="text-base-content/60 ml-1">
                          ({guild.leader.career} {guild.leader.level})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {data?.guilds?.nodes && data.guilds.nodes.length === 0 && (
            <div className="alert alert-info">
              No guilds found for "{debouncedQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
