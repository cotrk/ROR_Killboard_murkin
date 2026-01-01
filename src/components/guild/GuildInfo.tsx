import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { GuildHeraldry } from '@/components/guild/GuildHeraldry';
import { GuildInfoFragment } from '../../__generated__/graphql';
import { ReactElement } from 'react';
import { gql } from '@apollo/client';

export const GUILD_INFO_FRAGMENT = gql`
  fragment GuildInfo on Guild {
    name
    description
    briefDescription
    level
    realm
    heraldry {
      emblem
      pattern
      color1
      color2
      shape
    }
    leader {
      id
      name
      career
    }
    members {
      totalCount
    }
  }
`;

interface GuildInfoProps {
  guild: GuildInfoFragment;
}

export function GuildInfo({ guild }: GuildInfoProps): ReactElement {
  const { t } = useTranslation(['common', 'guilds']);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-start gap-4">
          <div className="avatar">
            <div className="w-20 h-20">
              <GuildHeraldry
                size="64"
                heraldry={guild.heraldry}
                realm={guild.realm}
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="card-title text-2xl">{guild.name}</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="stat">
                <div className="stat-title">Level</div>
                <div className="stat-value text-lg">{guild.level}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Realm</div>
                <div className={`stat-value text-lg capitalize ${
                  guild.realm?.toLowerCase() === 'destruction' ? 'text-error' : 'text-info'
                }`}>
                  {guild.realm}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Members</div>
                <div className="stat-value text-lg">{guild.members?.totalCount || 0}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Leader</div>
                <div className="stat-value text-lg">
                  {guild.leader && (
                    <Link 
                      to={`/character/${guild.leader.id}`} 
                      className="link-hover link-primary"
                    >
                      {guild.leader.name}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {(guild.description || guild.briefDescription) && (
          <>
            <div className="divider"></div>
            <div className="prose max-w-none">
              {guild.description ? (
                <p className="text-base-content/80">{guild.description}</p>
              ) : (
                <p className="text-base-content/60 italic">{guild.briefDescription}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
