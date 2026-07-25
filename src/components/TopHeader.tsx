import React from 'react';
import { Search, Bell, Inbox, UserPlus, Bot, HelpCircle, Grid, ChevronDown } from 'lucide-react';

interface TopHeaderProps {
  onSearchChange?: (term: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onSearchChange }) => {
  return (
    <header style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Trial Alert Banner */}
      <div className="top-banner">
        <span>You have <strong>5 days</strong> left on your trial</span>
        <a className="upgrade-link" href="#upgrade">Upgrade Now</a>
      </div>

      {/* Primary Top Header */}
      <div className="top-header">
        <div className="header-left">
          <div className="logo-badge" title="monday.com">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" fill="#00a0ef"/>
            </svg>
            <span style={{ fontSize: '15px', color: '#323338' }}>monday<span style={{ color: '#00a0ef' }}>.com</span></span>
          </div>

          <button className="btn-see-plans">
            <span>See plans</span>
          </button>

          <div className="header-search">
            <Search className="search-icon" size={15} />
            <input 
              type="text" 
              placeholder="Search for anything..." 
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>

        <div className="header-right">
          <button className="header-icon-btn" title="Notifications">
            <Bell size={18} />
          </button>
          <button className="header-icon-btn" title="Inbox / Updates">
            <Inbox size={18} />
          </button>
          <button className="header-icon-btn" title="Invite Members">
            <UserPlus size={18} />
          </button>
          <button className="header-icon-btn" title="AI Agents / Sidekick">
            <Bot size={18} />
          </button>
          <button className="header-icon-btn" title="Help & Support">
            <HelpCircle size={18} />
          </button>
          <button className="header-icon-btn" title="Monday Apps Grid">
            <Grid size={18} />
          </button>

          <div className="avatar-badge" title="User Profile">
            BR
          </div>
        </div>
      </div>
    </header>
  );
};
