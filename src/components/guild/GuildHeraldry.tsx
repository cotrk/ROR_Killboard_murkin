import React from 'react';

interface GuildHeraldryProps {
  heraldry: {
    emblem: string;
    pattern: string;
    color1: string;
    color2: string;
    shape: string;
  } | null;
  realm: string;
  size: '24' | '32' | '48' | '64' | '128';
}

export function GuildHeraldry({ heraldry, realm, size }: GuildHeraldryProps): React.ReactElement {
  const sizeClass = {
    '24': 'w-6 h-6',
    '32': 'w-8 h-8',
    '48': 'w-12 h-12',
    '64': 'w-16 h-16',
    '128': 'w-32 h-32',
  }[size];

  const realmColors = {
    'destruction': 'bg-red-500',
    'order': 'bg-blue-500',
  };

  if (!heraldry) {
    return (
      <div className={`${sizeClass} bg-base-300 rounded flex items-center justify-center`}>
        <span className="text-base-content/60 text-xs">No Heraldry</span>
      </div>
    );
  }

  const realmColor = realmColors[realm.toLowerCase() as keyof typeof realmColors] || 'bg-gray-500';

  return (
    <div className={`${sizeClass} ${realmColor} rounded flex items-center justify-center`}>
      <div className="w-full h-full rounded overflow-hidden">
        <img
          src={`/images/heraldry/patterns/${heraldry.pattern}.png`}
          alt={heraldry.pattern}
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={`/images/heraldry/emblems/${heraldry.emblem}.png`}
            alt={heraldry.emblem}
            className="w-1/2 h-1/2 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
