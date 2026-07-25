import React from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import { BoardItem, ViewTab } from '../types';

interface TableRowProps {
  item: BoardItem;
  activeTab: ViewTab;
  onItemChange: (updatedItem: BoardItem) => void;
  onOpenComments: (item: BoardItem) => void;
}

export const TableRow: React.FC<TableRowProps> = ({
  item,
  activeTab,
  onItemChange,
  onOpenComments
}) => {
  const handleToggleSelect = () => {
    onItemChange({ ...item, selected: !item.selected });
  };

  const handleCellBlur = (field: keyof BoardItem, value: string) => {
    onItemChange({ ...item, [field]: value });
  };

  // Determine column visibility based on view tab
  const showWeek1 = activeTab === 'main' || activeTab === 'week1';
  const showWeek2 = activeTab === 'main' || activeTab === 'week2';
  const showWeek3 = activeTab === 'main' || activeTab === 'week3';
  const showWeek4 = activeTab === 'main' || activeTab === 'week4';

  return (
    <tr className={item.selected ? 'selected' : ''}>
      {/* Col 0: Sticky Select Checkbox */}
      <td className="col-checkbox">
        <input 
          type="checkbox" 
          checked={!!item.selected} 
          onChange={handleToggleSelect}
          style={{ cursor: 'pointer' }}
        />
      </td>

      {/* Col 1: STICKY LEFT ITEM NAME + COMMENT ICON */}
      <td className="col-item">
        <div className="item-cell-content">
          <span 
            className="item-name-text" 
            contentEditable 
            suppressContentEditableWarning
            onBlur={(e) => handleCellBlur('name', e.currentTarget.textContent || '')}
            title={item.name || 'New item'}
          >
            {item.name || ''}
          </span>

          <button 
            className={`comment-bubble-btn ${item.commentsCount > 0 ? 'has-comments' : ''}`}
            onClick={() => onOpenComments(item)}
            title="Open comments"
          >
            <MessageSquare size={15} />
            {item.commentsCount > 0 && (
              <span className="comment-count-badge">{item.commentsCount}</span>
            )}
          </button>
        </div>
      </td>

      {/* Col 2: CS - Back */}
      <td className="col-csback">
        {item.csBack ? (
          <span className={`badge-status ${item.csBackColor}`}>
            {item.csBack}
          </span>
        ) : (
          <span style={{ color: 'var(--text-light)' }}>-</span>
        )}
      </td>

      {/* Col 3: Date of Creating Plan */}
      <td className="col-date">
        <span 
          contentEditable 
          suppressContentEditableWarning
          onBlur={(e) => handleCellBlur('dateCreated', e.currentTarget.textContent || '')}
        >
          {item.dateCreated || '-'}
        </span>
      </td>

      {/* Col 4: Duration of Plan */}
      <td className="col-duration">
        {item.duration && item.duration !== '-' ? (
          <span className={`badge-pill-duration ${item.durationBadgeColor || 'orange'}`}>
            {item.duration}
          </span>
        ) : (
          <span style={{ color: 'var(--text-light)' }}>-</span>
        )}
      </td>

      {/* WEEK 1 COLUMNS */}
      {showWeek1 && (
        <>
          <td className="col-industry" title={item.w1Industry}>{item.w1Industry}</td>
          <td className="col-companysize" title={item.w1CompanySize}>{item.w1CompanySize}</td>
          <td className="col-titles" title={item.w1Titles}>{item.w1Titles}</td>
          <td className="col-region" title={item.w1Region}>{item.w1Region}</td>
        </>
      )}

      {/* WEEK 2 COLUMNS */}
      {showWeek2 && (
        <>
          <td className="col-industry" title={item.w2Industry}>{item.w2Industry}</td>
          <td className="col-companysize" title={item.w2CompanySize}>{item.w2CompanySize}</td>
          <td className="col-titles" title={item.w2Titles}>{item.w2Titles}</td>
          <td className="col-region" title={item.w2Region}>{item.w2Region}</td>
        </>
      )}

      {/* WEEK 3 COLUMNS */}
      {showWeek3 && (
        <>
          <td className="col-industry" title={item.w3Industry}>{item.w3Industry}</td>
          <td className="col-companysize" title={item.w3CompanySize}>{item.w3CompanySize}</td>
          <td className="col-titles" title={item.w3Titles}>{item.w3Titles}</td>
          <td className="col-region" title={item.w3Region}>{item.w3Region}</td>
        </>
      )}

      {/* WEEK 4 COLUMNS */}
      {showWeek4 && (
        <>
          <td className="col-industry" title={item.w4Industry}>{item.w4Industry}</td>
          <td className="col-companysize" title={item.w4CompanySize}>{item.w4CompanySize}</td>
          <td className="col-titles" title={item.w4Titles}>{item.w4Titles}</td>
          <td className="col-region" title={item.w4Region}>{item.w4Region}</td>
        </>
      )}

      {/* Client Email Column */}
      <td className="col-email" title={item.clientEmail}>
        <span style={{ color: item.clientEmail ? '#0073ea' : 'inherit' }}>
          {item.clientEmail}
        </span>
      </td>

      {/* Send to Client Column */}
      <td className="col-send">
        {item.sendToClientStatus === 'Sent' ? (
          <span className="badge-status green">Sent</span>
        ) : (
          <span className="badge-status gray">-</span>
        )}
      </td>

      {/* Add Column Plus */}
      <td className="col-add">
        <Plus size={14} style={{ color: 'var(--text-light)', cursor: 'pointer' }} />
      </td>
    </tr>
  );
};
