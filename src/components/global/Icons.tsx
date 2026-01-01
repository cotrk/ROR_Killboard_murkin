import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faCloudDownloadAlt, 
  faComments, 
  faRankingStar,
  faShieldAlt,
  faCog,
  faGavel,
  faQuestion
} from '@fortawesome/free-solid-svg-icons';
import { 
  faWikipediaW as faWikipediaWBrands,
  faDiscord as faDiscordBrands,
  faFacebookF as faFacebookFBrands,
  faTwitter as faTwitterBrands,
  faYoutube as faYoutubeBrands
} from '@fortawesome/free-brands-svg-icons';

// Icon mapping for tree-shaking
export const icons = {
  home: faHome,
  download: faCloudDownloadAlt,
  comments: faComments,
  wiki: faWikipediaWBrands,
  ranking: faRankingStar,
  shield: faShieldAlt,
  cog: faCog,
  gavel: faGavel,
  question: faQuestion,
  discord: faDiscordBrands,
  facebook: faFacebookFBrands,
  twitter: faTwitterBrands,
  youtube: faYoutubeBrands,
};

export { FontAwesomeIcon };
