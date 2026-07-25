import React from 'react';
import { 
  ChevronDown, Plus, Search, Star 
} from 'lucide-react';
import { BoardType } from '../types';

interface LeftSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeBoard: BoardType;
  onSelectBoard: (board: BoardType) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  activeBoard,
  onSelectBoard
}) => {
  return (
    <div className={`left-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-workspace-header">
        <div style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: 600 }}>Workspace</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="workspace-dropdown-btn">
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00c875' }}></span>
            <span>Execution Team</span>
            <ChevronDown size={14} />
          </div>
          <button className="header-icon-btn" style={{ padding: 4 }} title="Add new board">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Content Items - CLEANED NAVIGATION (ONLY 3 REQUESTED TABS) */}
      <div className="sidebar-section">
        <div className="sidebar-item" style={{ marginBottom: 12 }}>
          <Search size={15} />
          <span>Search workspace...</span>
        </div>

        <div className="sidebar-section-title" style={{ marginTop: 4, marginBottom: 8 }}>
          <span>Workspace Boards</span>
        </div>

        {/* 1. Project Plan */}
        <div 
          className={`sidebar-item ${activeBoard === 'project-plan' ? 'active' : ''}`}
          onClick={() => onSelectBoard('project-plan')}
          style={{ padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}
        >
          <Star 
            size={15} 
            color={activeBoard === 'project-plan' ? '#ff3d57' : '#ff9900'} 
            fill={activeBoard === 'project-plan' ? '#ff3d57' : 'none'} 
          />
          <span style={{ fontWeight: activeBoard === 'project-plan' ? 700 : 500, fontSize: '13px' }}>
            Project Plan
          </span>
        </div>

        {/* 2. Data Request */}
        <div 
          className={`sidebar-item ${activeBoard === 'data-request' ? 'active' : ''}`}
          onClick={() => onSelectBoard('data-request')}
          style={{ padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}
        >
          <Star 
            size={15} 
            color={activeBoard === 'data-request' ? '#ff3d57' : '#ff9900'} 
            fill={activeBoard === 'data-request' ? '#ff3d57' : 'none'} 
          />
          <span style={{ fontWeight: activeBoard === 'data-request' ? 700 : 500, fontSize: '13px' }}>
            Data Request
          </span>
        </div>

        {/* 3. PLM */}
        <div 
          className={`sidebar-item ${activeBoard === 'plm' ? 'active' : ''}`}
          onClick={() => onSelectBoard('plm')}
          style={{ padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}
        >
          <Star 
            size={15} 
            color={activeBoard === 'plm' ? '#ff3d57' : '#ff9900'} 
            fill={activeBoard === 'plm' ? '#ff3d57' : 'none'} 
          />
          <span style={{ fontWeight: activeBoard === 'plm' ? 700 : 500, fontSize: '13px' }}>
            PLM
          </span>
        </div>
      </div>
    </div>
  );
};
