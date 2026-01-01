import { gql, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { LoadingState } from '@/components/shared/LoadingState';
import { ReactElement } from 'react';
import { Query } from '@/__generated__/graphql';

const CHARACTER_INFO = gql`
  query GetCharacterInfo($id: ID!) {
    character(id: $id) {
      name
      career
      guildMembership {
        guild {
          id
          name
        }
      }
    }
  }
`;

export function CharacterInfo({ id }: { id: number }): ReactElement {
  const { t } = useTranslation(['common', 'components', 'enums']);
  const { loading, error, data } = useQuery<Query>(CHARACTER_INFO, {
    variables: { id },
  });

  if (loading) return <LoadingState size="lg" className="py-12" />;
  if (error)
    return (
      <div className="alert alert-error">
        Error loading character: {error.message}
      </div>
    );

  if (!data?.character)
    return <div className="alert alert-info">Character not found</div>;

  const character = data.character;

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
            <li>
              <Link to={`/character/${id}`} className="link-hover link-primary">
                {t('common:character')}
              </Link>
            </li>
            <li className="text-base-content/60">{character.name}</li>
          </ul>
        </nav>
      </div>

      {/* Character Info Card */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex items-start gap-6">
            {/* Character Icon */}
            <div className="avatar">
              <div className="w-24 h-24 rounded-lg bg-primary/20 flex items-center justify-center text-4xl">
                {character.career?.charAt(0) || '👤'}
              </div>
            </div>

            {/* Character Details */}
            <div className="flex-1 min-w-0">
              <h2 className="card-title text-2xl mb-4">{character.name}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="stat">
                  <div className="stat-title">Career</div>
                  <div className="stat-value">{character.career}</div>
                </div>

                {character.guildMembership?.guild && (
                  <div className="stat">
                    <div className="stat-title">Guild</div>
                    <div className="stat-value">
                      <Link
                        to={`/guild/${character.guildMembership.guild.id}`}
                        className="link-hover link-primary"
                      >
                        {character.guildMembership.guild.name}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex gap-4">
            <Link to={`/character/${id}/kills`} className="btn btn-outline">
              View Kills
            </Link>

            <Link to={`/character/${id}/deaths`} className="btn btn-outline">
              View Deaths
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
