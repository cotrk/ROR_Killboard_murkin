export const API_CONFIG = {
  GRAPHQL_ENDPOINT: 'https://production-api.waremu.com/graphql',
  ARMORY_BASE_URL: 'https://armory.returnofreckoning.com',
  WEBSITE_BASE_URL: 'https://www.returnofreckoning.com',
  IMAGE_BASE_URL: '/images',
  ICON_BASE_URL: '/images/icons',
  HERALRY_BASE_URL: 'https://armory.returnofreckoning.com/heraldry',
} as const;

export const ICON_CONFIG = {
  GOLD: 46,
  SILVER: 47,
  COPPER: 47,
  ORDER: 1,
} as const;

export const STYLING_CONFIG = {
  CONTAINER_CLASSES: {
    MAX_WIDE: 'container mx-auto max-w-7xl mt-2',
    MAX_DESKTOP: 'container mx-auto max-w-5xl mt-2',
    CENTERED: 'container mx-auto max-w-4xl mt-2',
  },
  TABLE_CLASSES: {
    DEFAULT: 'table table-zebra table-hover table-compact w-full',
    RESPONSIVE: 'table table-zebra table-hover table-compact w-full',
    MOBILE: 'table table-zebra table-hover table-compact w-full',
  },
  COLUMN_CLASSES: {
    DESKTOP: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
    THREE_COLUMN: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    TWO_COLUMN: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  },
  TEXT_CLASSES: {
    BOLD: 'font-bold',
    INFO: 'text-info',
    WEIGHT_BOLD: 'font-semibold',
    CENTERED: 'text-center',
    WHITE: 'text-white',
  },
  IMAGE_CLASSES: {
    SMALL: 'w-6 h-6',
    MEDIUM: 'w-8 h-8',
    LARGE: 'w-12 h-12',
    EXTRA_LARGE: 'w-16 h-16',
    ICON: 'w-4 h-4',
  },
} as const;

export const URL_HELPERS = {
  armoryCharacter: (id: string) => `${API_CONFIG.WEBSITE_BASE_URL}/armory/character/${id}`,
  armoryIcon: (iconId: number) => `${API_CONFIG.ARMORY_BASE_URL}/icon/${iconId}`,
  heraldry: (size: number, realmNum: number, heraldry: any) => 
    `${API_CONFIG.HERALDRY_BASE_URL}/frame/${size}/${size}/${realmNum}/${heraldry.emblem}/${heraldry.pattern}/${heraldry.color1}/${heraldry.color2}/${heraldry.shape}`,
  localIcon: (iconName: string) => `${API_CONFIG.ICON_BASE_URL}/${iconName}`,
  localImage: (imageName: string) => `${API_CONFIG.IMAGE_BASE_URL}/${imageName}`,
} as const;
