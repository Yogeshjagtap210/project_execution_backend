import React from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { BoardGroup, BoardItem, ViewTab } from '../types';
import { TableRow } from './TableRow';

interface TableGroupProps {
  group: BoardGroup;
  activeTab: ViewTab;
  onToggleGroup: (groupId: string) => void;
  onItemChange: (groupId: string, updatedItem: BoardItem) => void;
  onOpenComments: (item: BoardItem) => void;
  onAddItemToGroup: (groupId: string) => void;
}

export const TableGroup: React.FC<TableGroupProps> = ({
  group,
  activeTab,
  onToggleGroup,
  onItemChange,
  onOpenComments,
  onAddItemToGroup
}) => {
  const showWeek1 = activeTab === 'main' || activeTab === 'week1';
  const showWeek2 = activeTab === 'main' || activeTab === 'week2';
  const showWeek3 = activeTab === 'main' || activeTab === 'week3';
  const showWeek4 = activeTab === 'main' || activeTab === 'week4';

  const allSelected = group.items.length > 0 && group.items.every(i => i.selected);

  return (
    <div className="table-group-container">
      {/* Group Collapsible Header Banner */}
      <div 
        className="group-header-banner" 
        style={{ color: group.color }}
        onClick={() => onToggleGroup(group.id)}
      >
        {group.collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        <span>{group.title}</span>
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-light)', marginLeft: 8 }}>
          {group.items.length} items
        </span>
      </div>

      {!group.collapsed && (
        <table className="monday-table">
          <thead>
            <tr>
              {/* STICKY HEADER COLS */}
              <th className="col-checkbox">
                <input 
                  type="checkbox" 
                  checked={allSelected} 
                  onChange={(e) => {
                    const selected = e.target.checked;
                    group.items.forEach(item => onItemChange(group.id, { ...item, selected }));
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th className="col-item">Item</th>

              {/* SCROLLABLE HEADER COLS */}
              <th className="col-csback">CS - Back</th>
              <th className="col-date">Date of Creating Plan</th>
              <th className="col-duration">Duration of Plan</th>

              {showWeek1 && (
                <>
                  <th className="col-industry">Week 1 - Target Industry</th>
                  <th className="col-companysize">Week 1 - Target Company Size</th>
                  <th className="col-titles">Week 1 - Target Titles</th>
                  <th className="col-region">Week 1 - Target Region</th>
                </>
              )}

              {showWeek2 && (
                <>
                  <th className="col-industry">Week 2 - Target Industry</th>
                  <th className="col-companysize">Week 2 - Target Company Size</th>
                  <th className="col-titles">Week 2 - Target Titles</th>
                  <th className="col-region">Week 2 - Target Region</th>
                </>
              )}

              {showWeek3 && (
                <>
                  <th className="col-industry">Week 3 - Target Industry</th>
                  <th className="col-companysize">Week 3 - Target Company Size</th>
                  <th className="col-titles">Week 3 - Target Titles</th>
                  <th className="col-region">Week 3 - Target Region</th>
                </>
              )}

              {showWeek4 && (
                <>
                  <th className="col-industry">Week 4 - Target Industry</th>
                  <th className="col-companysize">Week 4 - Target Company Size</th>
                  <th className="col-titles">Week 4 - Target Titles</th>
                  <th className="col-region">Week 4 - Target Region</th>
                </>
              )}

              <th className="col-email">Email of client</th>
              <th className="col-send">Send to client</th>
              <th className="col-add">+</th>
            </tr>
          </thead>
          <tbody>
            {group.items.map((item) => (
              <TableRow 
                key={item.id}
                item={item}
                activeTab={activeTab}
                onItemChange={(updated) => onItemChange(group.id, updated)}
                onOpenComments={onOpenComments}
              />
            ))}

            {/* Quick Add Item Row */}
            <tr>
              <td className="col-checkbox"></td>
              <td className="col-item" style={{ cursor: 'pointer', color: 'var(--text-light)' }} onClick={() => onAddItemToGroup(group.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={14} />
                  <span>+ Add Item</span>
                </div>
              </td>
              <td colSpan={30} style={{ background: '#fafbfc' }}></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};
