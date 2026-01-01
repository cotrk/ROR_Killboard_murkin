import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface MobileNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  currentTab, 
  onTabChange 
}) => {
  const { t } = useTranslation('pages');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: 'players', label: t('home.showPlayerLeaderboard'), icon: 'fas fa-users' },
    { id: 'guilds', label: t('home.showGuildLeaderboard'), icon: 'fas fa-users-cog' },
    { id: 'scenarios', label: t('home.showScenarios'), icon: 'fas fa-map' },
    { id: 'skirmishes', label: t('home.showSkirmishes'), icon: 'fas fa-crossed-swords' },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsMenuOpen(false);
  };

  return (
    <div className="mobile-navigation">
      {/* Mobile Header */}
      <nav className="navbar is-dark is-fixed-top" role="navigation">
        <div className="navbar-brand">
          <div className="navbar-item">
            <span className="icon is-large">
              <i className="fas fa-skull"></i>
            </span>
            <span className="ml-2 has-text-weight-bold">Killboard</span>
          </div>
          
          <button
            className={`navbar-burger ${isMenuOpen ? 'is-active' : ''}`}
            aria-label="menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}>
          <div className="navbar-start">
            {tabs.map((tab) => (
              <a
                key={tab.id}
                className={`navbar-item ${currentTab === tab.id ? 'is-active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className="icon mr-2">
                  <i className={tab.icon}></i>
                </span>
                {tab.label}
              </a>
            ))}
          </div>
          
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <button className="button is-small is-outlined is-light">
                  <span className="icon">
                    <i className="fas fa-cog"></i>
                  </span>
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <div className="mobile-bottom-nav is-hidden-desktop">
        <div className="tabs is-fullwidth is-small">
          <ul>
            {tabs.map((tab) => (
              <li key={tab.id} className={currentTab === tab.id ? 'is-active' : ''}>
                <a onClick={() => handleTabClick(tab.id)}>
                  <span className="icon is-small">
                    <i className={tab.icon}></i>
                  </span>
                  <span className="is-size-7">{tab.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
