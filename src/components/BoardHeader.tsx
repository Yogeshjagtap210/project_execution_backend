import React from 'react';
import { 
  Pin, ChevronDown, Zap, Bot, Users, Link2, MoreHorizontal,
  Plus, Search, User, Filter, ArrowUpDown, EyeOff, Layers, Heart, RefreshCw, FileText, LogOut
} from 'lucide-react';
import { BoardType, ViewTab } from '../types';
import { SyncConfig } from '../services/googleSheetsSync';

interface BoardHeaderProps {
  boardType: BoardType;
  onBoardTypeChange: (type: BoardType) => void;
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onNewItemClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  syncConfig: SyncConfig;
  onOpenSyncModal: () => void;
  userEmail: string;
  onLogout: () => void;
}

export const BoardHeader: React.FC<BoardHeaderProps> = ({
  boardType,
  onBoardTypeChange,
  activeTab,
  onTabChange,
  onNewItemClick,
  searchTerm,
  onSearchChange,
  syncConfig,
  onOpenSyncModal,
  userEmail,
  onLogout
}) => {
  const getBoardTitle = () => {
    if (boardType === 'plm') return 'PLM';
    if (boardType === 'data-request') return 'Data Requests - Data Scrapped (1)';
    return 'Project Plan';
  };

  const cycleBoardType = () => {
    if (boardType === 'project-plan') onBoardTypeChange('plm');
    else if (boardType === 'plm') onBoardTypeChange('data-request');
    else onBoardTypeChange('project-plan');
  };

  return (
    <div className="board-header">
      {/* Title Bar */}
      <div className="board-title-row">
        <div className="board-title-left">
          <Pin className="board-pin-icon" size={20} />
          <h1 
            className="board-title" 
            onClick={cycleBoardType}
            title="Click to cycle boards"
          >
            {getBoardTitle()} <ChevronDown size={18} />
          </h1>

          {/* Live Sync Status Badge */}
          <div 
            onClick={onOpenSyncModal}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              padding: '4px 10px', 
              borderRadius: 12, 
              background: '#e6f9f0', 
              color: '#0f5132', 
              fontSize: '11px', 
              fontWeight: 600, 
              cursor: 'pointer',
              marginLeft: 8,
              border: '1px solid #a3e9c9'
            }}
            title="Click to configure Google Sheets Live Sync"
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#00c875' }}></span>
            <span>{syncConfig.lastSyncedAt ? `Synced ${syncConfig.lastSyncedAt}` : 'Google Sheets Sync'}</span>
          </div>
        </div>

        <div className="board-actions-right">
          {/* Prominent Google Sheet Sync Button */}
          <button 
            className="btn-primary" 
            style={{ backgroundColor: '#00c875' }} 
            onClick={onOpenSyncModal}
          >
            <RefreshCw size={14} />
            <span>Sync Google Sheet</span>
          </button>

          {/* Logged in User Profile Avatar & Sign Out */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 6 }}>
            <div 
              style={{ 
                width: 28, 
                height: 28, 
                borderRadius: '50%', 
                backgroundColor: '#a25ddc', 
                color: 'white', 
                fontSize: '12px', 
                fontWeight: 700, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
              title={`Logged in as ${userEmail}`}
            >
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <button 
              className="btn-secondary" 
              onClick={onLogout} 
              style={{ color: '#e2445c', borderColor: '#ffcdd2', padding: '4px 8px' }}
              title="Sign Out"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>

          <button className="btn-secondary" style={{ padding: '4px 8px' }}>
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="view-tabs-row">
        {boardType === 'data-request' ? (
          <>
            <div className="view-tab active">
              <FileText size={14} color="#0073ea" />
              <span>Data Requests - Data Scrapped (1)</span>
              <MoreHorizontal size={13} style={{ opacity: 0.5 }} />
            </div>
            <div className="view-tab"><span>All Requests</span></div>
            <div className="view-tab"><span>Pending Requests</span></div>
            <div className="view-tab"><span>Completed Requests</span></div>
            <div className="view-tab"><span>By Analyst</span></div>
            <div className="view-tab"><span>Charts & Metrics</span></div>
            <div className="view-tab" style={{ padding: '8px 10px' }}><Plus size={16} /></div>
          </>
        ) : boardType === 'plm' ? (
          <>
            <div className="view-tab"><span>General</span></div>
            <div className="view-tab"><span>Analyst</span></div>
            <div className="view-tab active">
              <span>Table</span>
              <MoreHorizontal size={13} style={{ opacity: 0.5 }} />
            </div>
            <div className="view-tab"><span>Vivek</span></div>
            <div className="view-tab"><span>Radheshyam</span></div>
            <div className="view-tab"><span>Retention average</span></div>
            <div className="view-tab"><span>Phase 2</span></div>
            <div className="view-tab"><span>Phase 3</span></div>
            <div className="view-tab"><span>Phase 4</span></div>
            <div className="view-tab"><span>Final Phase</span></div>
            <div className="view-tab"><span>NP</span></div>
            <div className="view-tab"><span>Chart</span></div>
            <div className="view-tab"><span>RED</span></div>
            <div className="view-tab"><span>Chart</span></div>
            <div className="view-tab"><span>All <ChevronDown size={12} /></span></div>
            <div className="view-tab" style={{ padding: '8px 10px' }}><Plus size={16} /></div>
          </>
        ) : (
          <>
            <div 
              className={`view-tab ${activeTab === 'main' ? 'active' : ''}`}
              onClick={() => onTabChange('main')}
            >
              <span>Main table</span>
              <MoreHorizontal size={13} style={{ opacity: 0.5 }} />
            </div>
            <div 
              className={`view-tab ${activeTab === 'week1' ? 'active' : ''}`}
              onClick={() => onTabChange('week1')}
            >
              <span>Week 1</span>
            </div>
            <div 
              className={`view-tab ${activeTab === 'week2' ? 'active' : ''}`}
              onClick={() => onTabChange('week2')}
            >
              <span>Week 2</span>
            </div>
            <div 
              className={`view-tab ${activeTab === 'week3' ? 'active' : ''}`}
              onClick={() => onTabChange('week3')}
            >
              <span>Week 3</span>
            </div>
            <div 
              className={`view-tab ${activeTab === 'week4' ? 'active' : ''}`}
              onClick={() => onTabChange('week4')}
            >
              <span>Week 4</span>
            </div>
            <div 
              className={`view-tab ${activeTab === 'vibe' ? 'active' : ''}`}
              onClick={() => onTabChange('vibe')}
            >
              <Heart size={14} color="#ff3d57" fill="#ff3d57" />
              <span>Build Vibe view</span>
            </div>
            <div className="view-tab" style={{ padding: '8px 10px' }}>
              <Plus size={16} />
            </div>
          </>
        )}
      </div>

      {/* Control Toolbar */}
      <div className="toolbar-row">
        <div className="toolbar-left">
          <button className="btn-primary" onClick={onNewItemClick}>
            <span>{boardType === 'data-request' ? 'New request' : boardType === 'plm' ? 'New project name' : 'New item'}</span>
            <ChevronDown size={14} />
          </button>

          <div className="toolbar-search">
            <Search size={14} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <button className="toolbar-btn">
            <User size={14} />
            <span>Person</span>
          </button>
          <button className="toolbar-btn">
            <Filter size={14} />
            <span>Filter</span>
            <ChevronDown size={12} />
          </button>
          <button className="toolbar-btn">
            <ArrowUpDown size={14} />
            <span>Sort</span>
          </button>
          <button className="toolbar-btn" style={{ backgroundColor: '#e5f0ff', color: '#0073ea' }}>
            <EyeOff size={14} />
            <span>Hide / 1</span>
          </button>
          <button className="toolbar-btn">
            <Layers size={14} />
            <span>Group by</span>
          </button>
          <button className="toolbar-btn" style={{ padding: '5px 6px' }}>
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
