import React from 'react';
import { BoardGroup, BoardItem, ViewTab } from '../types';
import { TableGroup } from './TableGroup';

interface BoardTableProps {
  groups: BoardGroup[];
  activeTab: ViewTab;
  onToggleGroup: (groupId: string) => void;
  onItemChange: (groupId: string, updatedItem: BoardItem) => void;
  onOpenComments: (item: BoardItem) => void;
  onAddItemToGroup: (groupId: string) => void;
}

export const BoardTable: React.FC<BoardTableProps> = ({
  groups,
  activeTab,
  onToggleGroup,
  onItemChange,
  onOpenComments,
  onAddItemToGroup
}) => {
  return (
    <div className="board-table-viewport">
      {groups.map((group) => (
        <TableGroup 
          key={group.id}
          group={group}
          activeTab={activeTab}
          onToggleGroup={onToggleGroup}
          onItemChange={onItemChange}
          onOpenComments={onOpenComments}
          onAddItemToGroup={onAddItemToGroup}
        />
      ))}
    </div>
  );
};
