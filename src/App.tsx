import React, { useState, useEffect } from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { BoardHeader } from './components/BoardHeader';
import { BoardTable } from './components/BoardTable';
import { PLMTableGroup } from './components/PLMTableGroup';
import { CommentDrawer } from './components/CommentDrawer';
import { NewItemModal } from './components/NewItemModal';
import { GoogleSheetsSyncModal } from './components/GoogleSheetsSyncModal';
import { LoginPage } from './components/LoginPage';
import { initialGroups } from './mock/initialData';
import { initialPLMGroups } from './mock/plmData';
import { initialDataRequestGroups } from './mock/dataRequestData';
import { BoardGroup, BoardItem, BoardType, PLMGroup, PLMItem, ViewTab } from './types';
import { SyncConfig } from './services/googleSheetsSync';
import './styles/index.css';

export const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('is_app_authenticated') === 'true';
  });

  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('app_user_email') || 'admin@executionteam.com';
  });

  const [boardType, setBoardType] = useState<BoardType>('project-plan');
  const [groups, setGroups] = useState<BoardGroup[]>(initialGroups);
  const [plmGroups, setPlmGroups] = useState<PLMGroup[]>(initialPLMGroups);
  const [dataRequestGroups, setDataRequestGroups] = useState<PLMGroup[]>(initialDataRequestGroups);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>('main');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Drawer and Modal States
  const [activeCommentItem, setActiveCommentItem] = useState<BoardItem | null>(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [newItemGroupId, setNewItemGroupId] = useState('');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const [syncConfig, setSyncConfig] = useState<SyncConfig>({
    sheetUrl: 'https://docs.google.com/spreadsheets/d/1WoQFoy4JYjtysnnuzrB8baexMzNPdtXGdXJkZc7tizM/edit?usp=sharing',
    autoSync: true,
    intervalMinutes: 5,
    lastSyncedAt: 'Just now'
  });

  const handleLoginSuccess = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('is_app_authenticated', 'true');
    localStorage.setItem('app_user_email', email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('is_app_authenticated');
  };

  // Toggle group collapse state
  const handleToggleGroup = (groupId: string) => {
    if (boardType === 'project-plan') {
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, collapsed: !g.collapsed } : g));
    } else if (boardType === 'plm') {
      setPlmGroups(prev => prev.map(g => g.id === groupId ? { ...g, collapsed: !g.collapsed } : g));
    } else {
      setDataRequestGroups(prev => prev.map(g => g.id === groupId ? { ...g, collapsed: !g.collapsed } : g));
    }
  };

  // Handle Synced Data Application
  const handleApplySyncedData = (syncedItems: PLMItem[]) => {
    if (boardType === 'plm') {
      setPlmGroups(prev => prev.map(g => {
        if (g.id === 'plm-group-active') {
          return { ...g, items: [...syncedItems, ...g.items] };
        }
        return g;
      }));
    } else if (boardType === 'data-request') {
      setDataRequestGroups(prev => prev.map(g => {
        if (g.id === 'dr-scrapped-completed') {
          return { ...g, items: [...syncedItems, ...g.items] };
        }
        return g;
      }));
    }
  };

  // Update item details for Project Plan
  const handleItemChange = (groupId: string, updatedItem: BoardItem) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        items: g.items.map(item => item.id === updatedItem.id ? updatedItem : item)
      };
    }));

    if (activeCommentItem && activeCommentItem.id === updatedItem.id) {
      setActiveCommentItem(updatedItem);
    }
  };

  // Update PLM item details
  const handlePLMItemChange = (groupId: string, updatedItem: PLMItem) => {
    const updateTarget = (prev: PLMGroup[]) => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        items: g.items.map(item => item.id === updatedItem.id ? updatedItem : item)
      };
    });

    if (boardType === 'plm') {
      setPlmGroups(updateTarget);
    } else {
      setDataRequestGroups(updateTarget);
    }

    if (activeCommentItem && activeCommentItem.id === updatedItem.id) {
      setActiveCommentItem({
        id: updatedItem.id,
        name: updatedItem.name,
        commentsCount: updatedItem.commentsCount,
        commentsList: updatedItem.commentsList || [],
        csBack: updatedItem.csBack,
        csBackColor: 'purple',
        dateCreated: updatedItem.startDate,
        duration: '',
        w1Industry: updatedItem.industry,
        w1CompanySize: updatedItem.companySize,
        w1Titles: '',
        w1Region: '',
        w2Industry: '',
        w2CompanySize: '',
        w2Titles: '',
        w2Region: '',
        w3Industry: '',
        w3CompanySize: '',
        w3Titles: '',
        w3Region: '',
        w4Industry: '',
        w4CompanySize: '',
        w4Titles: '',
        w4Region: '',
        clientEmail: updatedItem.emailIds,
        sendToClientStatus: ''
      });
    }
  };

  // Add Comment
  const handleAddComment = (itemId: string, text: string) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      author: 'You',
      text,
      timestamp: 'Just now'
    };

    if (boardType === 'project-plan') {
      setGroups(prev => prev.map(g => ({
        ...g,
        items: g.items.map(i => {
          if (i.id !== itemId) return i;
          const updatedList = [newComment, ...i.commentsList];
          const updatedItem = {
            ...i,
            commentsList: updatedList,
            commentsCount: updatedList.length
          };
          if (activeCommentItem?.id === itemId) {
            setActiveCommentItem(updatedItem);
          }
          return updatedItem;
        })
      })));
    } else if (boardType === 'plm') {
      setPlmGroups(prev => prev.map(g => ({
        ...g,
        items: g.items.map(i => {
          if (i.id !== itemId) return i;
          const updatedList = [newComment, ...(i.commentsList || [])];
          return {
            ...i,
            commentsList: updatedList,
            commentsCount: updatedList.length
          };
        })
      })));
    } else {
      setDataRequestGroups(prev => prev.map(g => ({
        ...g,
        items: g.items.map(i => {
          if (i.id !== itemId) return i;
          const updatedList = [newComment, ...(i.commentsList || [])];
          return {
            ...i,
            commentsList: updatedList,
            commentsCount: updatedList.length
          };
        })
      })));
    }
  };

  // Open New Item Modal
  const handleOpenNewItemModal = (groupId?: string) => {
    const defaultGroup = boardType === 'data-request' 
      ? dataRequestGroups[0]?.id 
      : boardType === 'plm' 
      ? plmGroups[0]?.id 
      : groups[0]?.id;
    setNewItemGroupId(groupId || defaultGroup || '');
    setIsNewItemModalOpen(true);
  };

  // Add New Item
  const handleAddNewItem = (groupId: string, name: string, csBack: string, clientEmail: string) => {
    if (boardType === 'project-plan') {
      const newItem: BoardItem = {
        id: `item-${Date.now()}`,
        name,
        commentsCount: 0,
        commentsList: [],
        csBack,
        csBackColor: csBack === 'Jayesh' ? 'green' : 'purple',
        dateCreated: 'May 26',
        duration: 'May 26 - Jun 26',
        durationBadgeColor: 'orange',
        w1Industry: 'Technology, Consulting',
        w1CompanySize: '51 to 200 employees',
        w1Titles: 'CEO, Founder, CTO',
        w1Region: 'Mumbai, Bengaluru',
        w2Industry: 'Technology, Consulting',
        w2CompanySize: '51 to 200 employees',
        w2Titles: 'CEO, Founder, CTO',
        w2Region: 'Mumbai, Bengaluru',
        w3Industry: 'Technology, Consulting',
        w3CompanySize: '51 to 200 employees',
        w3Titles: 'CEO, Founder, CTO',
        w3Region: 'Mumbai, Bengaluru',
        w4Industry: 'Technology, Consulting',
        w4CompanySize: '51 to 200 employees',
        w4Titles: 'CEO, Founder, CTO',
        w4Region: 'Mumbai, Bengaluru',
        clientEmail,
        sendToClientStatus: clientEmail ? 'Sent' : ''
      };
      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, items: [...g.items, newItem] } : g));
    } else {
      const newPLMItem: PLMItem = {
        id: `dr-item-${Date.now()}`,
        name,
        commentsCount: 0,
        commentsList: [],
        startDate: 'Jul 25',
        totalDays: '1.000',
        currentStatus: 'Active',
        state: 'Active',
        companySize: '11-50',
        spreadsheetLink: `${name} (Linked)`,
        dashboardLink: '',
        contentLink: name,
        pc: 'Monika',
        csFront: 'Akshay',
        csBack: csBack || 'Radheshyam',
        country: 'IND',
        analyst: 'BTB Analyst',
        industry: 'IT Solutions & Services',
        emailEngine: 'Outlook',
        projectType: 'Automation',
        contactDetails: 'Contact Team',
        emailIds: clientEmail,
        gtmLink: '',
        fortnight: 'Done',
        emailWarmup: 'Done',
        emailTrigger: 'Content',
        domainHealthLink: '',
        domainHealth: 'Done',
        whatsApp: 'Done',
        emailIdPass: 'Pending 🚩',
        calendly: 'Pending 🚩',
        linkedIn: '',
        bd: 'Khushboo',
        reasonOfHold: '',
        backupCx: 'Akshay'
      };

      if (boardType === 'plm') {
        setPlmGroups(prev => prev.map(g => g.id === groupId ? { ...g, items: [...g.items, newPLMItem] } : g));
      } else {
        setDataRequestGroups(prev => prev.map(g => g.id === groupId ? { ...g, items: [...g.items, newPLMItem] } : g));
      }
    }
  };

  // Filter groups based on search term
  const filterPLMLikeGroups = (targetGroups: PLMGroup[]) => targetGroups.map(g => ({
    ...g,
    items: g.items.filter(item => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(term) ||
        item.csBack.toLowerCase().includes(term) ||
        item.csFront.toLowerCase().includes(term) ||
        item.industry.toLowerCase().includes(term) ||
        item.emailIds.toLowerCase().includes(term)
      );
    })
  }));

  const filteredProjectGroups = groups.map(g => ({
    ...g,
    items: g.items.filter(item => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(term) ||
        item.csBack.toLowerCase().includes(term) ||
        item.clientEmail.toLowerCase().includes(term)
      );
    })
  }));

  const activeGroupList = boardType === 'data-request' 
    ? filterPLMLikeGroups(dataRequestGroups) 
    : filterPLMLikeGroups(plmGroups);

  // Render Login Page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Main Body */}
      <div className="app-main-body">
        {/* Left Navigation Bar */}
        <LeftSidebar 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeBoard={boardType}
          onSelectBoard={setBoardType}
        />

        {/* Main Workspace */}
        <div className="workspace-container">
          <BoardHeader 
            boardType={boardType}
            onBoardTypeChange={setBoardType}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onNewItemClick={() => handleOpenNewItemModal()}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            syncConfig={syncConfig}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
            userEmail={userEmail}
            onLogout={handleLogout}
          />

          <div className="board-table-viewport">
            {boardType === 'project-plan' ? (
              <BoardTable 
                groups={filteredProjectGroups}
                activeTab={activeTab}
                onToggleGroup={handleToggleGroup}
                onItemChange={handleItemChange}
                onOpenComments={(item) => setActiveCommentItem(item)}
                onAddItemToGroup={(gId) => handleOpenNewItemModal(gId)}
              />
            ) : (
              activeGroupList.map((group) => (
                <PLMTableGroup 
                  key={group.id}
                  group={group}
                  onToggleGroup={handleToggleGroup}
                  onItemChange={handlePLMItemChange}
                  onOpenComments={(plmItem) => setActiveCommentItem({
                    id: plmItem.id,
                    name: plmItem.name,
                    commentsCount: plmItem.commentsCount,
                    commentsList: plmItem.commentsList || [],
                    csBack: plmItem.csBack,
                    csBackColor: 'purple',
                    dateCreated: plmItem.startDate,
                    duration: '',
                    w1Industry: plmItem.industry,
                    w1CompanySize: plmItem.companySize,
                    w1Titles: '',
                    w1Region: '',
                    w2Industry: '',
                    w2CompanySize: '',
                    w2Titles: '',
                    w2Region: '',
                    w3Industry: '',
                    w3CompanySize: '',
                    w3Titles: '',
                    w3Region: '',
                    w4Industry: '',
                    w4CompanySize: '',
                    w4Titles: '',
                    w4Region: '',
                    clientEmail: plmItem.emailIds,
                    sendToClientStatus: ''
                  })}
                  onAddItemToGroup={(gId) => handleOpenNewItemModal(gId)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Comment Side Drawer */}
      <CommentDrawer 
        item={activeCommentItem}
        onClose={() => setActiveCommentItem(null)}
        onAddComment={handleAddComment}
      />

      {/* New Item Modal */}
      <NewItemModal 
        groups={groups}
        selectedGroupId={newItemGroupId}
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        onAddItem={handleAddNewItem}
      />

      {/* Google Sheets Sync Control Modal */}
      <GoogleSheetsSyncModal 
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        syncConfig={syncConfig}
        onUpdateSyncConfig={setSyncConfig}
        onApplySyncedData={handleApplySyncedData}
      />
    </div>
  );
};
