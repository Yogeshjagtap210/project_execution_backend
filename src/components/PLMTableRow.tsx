import React, { useState } from 'react';
import { MessageSquare, Plus, ExternalLink, FileSpreadsheet } from 'lucide-react';
import { PLMItem } from '../types';
import { StatusPickerPopover, StatusOption, defaultStatusOptions } from './StatusPickerPopover';
import { PersonPickerPopover, defaultTeamMembers } from './PersonPickerPopover';
import { SpreadsheetViewerModal } from './SpreadsheetViewerModal';

interface PLMTableRowProps {
  item: PLMItem;
  onItemChange: (updatedItem: PLMItem) => void;
  onOpenComments: (item: PLMItem) => void;
}

export const PLMTableRow: React.FC<PLMTableRowProps> = ({
  item,
  onItemChange,
  onOpenComments
}) => {
  // Popover & Modal state
  const [activePopover, setActivePopover] = useState<{
    field: keyof PLMItem;
    type: 'status' | 'person';
    position: { top: number; left: number };
    options?: StatusOption[] | string[];
  } | null>(null);

  const [activeModalLink, setActiveModalLink] = useState<string | null>(null);

  const handleToggleSelect = () => {
    onItemChange({ ...item, selected: !item.selected });
  };

  const handleCellTextChange = (field: keyof PLMItem, value: string) => {
    onItemChange({ ...item, [field]: value });
  };

  const openStatusPopover = (
    e: React.MouseEvent,
    field: keyof PLMItem,
    customOptions?: StatusOption[]
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setActivePopover({
      field,
      type: 'status',
      position: { top: rect.bottom + 8, left: rect.left - 30 },
      options: customOptions || defaultStatusOptions
    });
  };

  const openPersonPopover = (
    e: React.MouseEvent,
    field: keyof PLMItem,
    customOptions?: string[]
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setActivePopover({
      field,
      type: 'person',
      position: { top: rect.bottom + 8, left: rect.left - 20 },
      options: customOptions || defaultTeamMembers
    });
  };

  const handleSpreadsheetLinkClick = (e: React.MouseEvent, linkText: string) => {
    e.stopPropagation();
    if (!linkText || linkText === '-') return;

    if (linkText.startsWith('http://') || linkText.startsWith('https://')) {
      window.open(linkText, '_blank', 'noopener,noreferrer');
    } else {
      setActiveModalLink(linkText);
    }
  };

  // State Badge Helpers
  const getStateBadgeClass = (state: string) => {
    if (state.includes('Low Risk') || state === 'Green') return 'badge-status green';
    if (state.includes('Moderate') || state === 'Orange') return 'badge-status orange';
    if (state.includes('High Risk') || state === 'Red') return 'badge-status red-danger';
    return 'badge-status gray';
  };

  const getCompanySizeBadgeClass = (size: string) => {
    if (size === '11-50') return 'badge-status orange';
    if (size === '51-200') return 'badge-status red-danger';
    if (size === '1-10') return 'badge-status teal';
    return 'badge-status gray';
  };

  const getCSFrontClass = (name: string) => {
    if (name === 'Akshay') return 'person-pill dark-green';
    if (name === 'Soham') return 'person-pill purple';
    if (name === 'Naren...' || name === 'Narendra') return 'person-pill yellow-gold';
    if (name === 'Girish') return 'person-pill blue';
    if (name === 'Monika') return 'person-pill green';
    if (name === 'Megha') return 'person-pill purple';
    return 'person-pill blue';
  };

  const getCSBackClass = (name: string) => {
    if (name === 'Radheshyam') return 'person-pill gray-purple';
    if (name === 'Vivek') return 'person-pill dark-red';
    if (name === 'Megha') return 'person-pill light-purple';
    return 'person-pill gray-purple';
  };

  const getBDClass = (name: string) => {
    if (name === 'Khushboo') return 'badge-status orange';
    if (name === 'Nikhil') return 'badge-status blue';
    if (name === 'Harshal') return 'badge-status purple';
    if (name === 'Sunita') return 'badge-status bright-green';
    return 'badge-status blue';
  };

  const getIndustryColorClass = (industry: string) => {
    if (industry.includes('Manufacturing')) return 'ind-badge brown';
    if (industry.includes('Drones')) return 'ind-badge teal';
    if (industry.includes('Business Consulting')) return 'ind-badge deep-blue';
    if (industry.includes('IT Solutions')) return 'ind-badge purple';
    if (industry.includes('Management Consulting')) return 'ind-badge dark-red';
    if (industry.includes('Others')) return 'ind-badge green';
    return 'ind-badge gray';
  };

  const renderActiveLink = (linkText: string) => {
    if (!linkText) return '-';
    const isUrl = linkText.startsWith('http://') || linkText.startsWith('https://');

    return (
      <span 
        style={{ 
          color: '#0073ea', 
          cursor: 'pointer',
          fontWeight: 500,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4
        }}
        onClick={(e) => handleSpreadsheetLinkClick(e, linkText)}
      >
        <span>{linkText}</span>
        {isUrl ? <ExternalLink size={12} style={{ opacity: 0.7 }} /> : <FileSpreadsheet size={13} color="#00c875" />}
      </span>
    );
  };

  return (
    <tr className={item.selected ? 'selected' : ''}>
      {/* Col 0: Checkbox */}
      <td className="col-checkbox">
        <input 
          type="checkbox" 
          checked={!!item.selected} 
          onChange={handleToggleSelect}
          style={{ cursor: 'pointer' }}
        />
      </td>

      {/* Col 1: STICKY LEFT ITEM NAME */}
      <td className="col-item editable-cell">
        <div className="item-cell-content">
          <span 
            className="item-name-text" 
            contentEditable 
            suppressContentEditableWarning
            onBlur={(e) => handleCellTextChange('name', e.currentTarget.textContent || '')}
            title={item.name}
          >
            {item.name}
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

      {/* Col 2: Start Date */}
      <td 
        className="col-date editable-cell"
        contentEditable 
        suppressContentEditableWarning
        onBlur={(e) => handleCellTextChange('startDate', e.currentTarget.textContent || '')}
      >
        {item.startDate || '-'}
      </td>

      {/* Col 3: Total Days */}
      <td 
        className="editable-cell"
        style={{ textAlign: 'center', width: 110 }}
        contentEditable 
        suppressContentEditableWarning
        onBlur={(e) => handleCellTextChange('totalDays', e.currentTarget.textContent || '')}
      >
        {item.totalDays || '-'}
      </td>

      {/* Col 4: Date of Onboarding */}
      <td className="editable-cell" style={{ textAlign: 'center', width: 110 }}>-</td>

      {/* Col 5: End Date */}
      <td className="editable-cell" style={{ textAlign: 'center', width: 110 }}>-</td>

      {/* Col 6: Current Status */}
      <td 
        style={{ textAlign: 'center', width: 110 }}
        onClick={(e) => openStatusPopover(e, 'currentStatus', [
          { label: 'Active', color: '#00c875' },
          { label: 'Manual', color: '#ff9900' },
          { label: 'Hold', color: '#ff9900' },
          { label: 'Notice', color: '#e2445c' },
          { label: 'Upcoming', color: '#00a0ef' },
          { label: '', color: '#c4c4c4' }
        ])}
      >
        {item.currentStatus ? (
          <span className="badge-status green">{item.currentStatus}</span>
        ) : (
          <span className="badge-status gray">-</span>
        )}
      </td>

      {/* Col 7: State / Project Health */}
      <td 
        style={{ textAlign: 'center', width: 160 }}
        onClick={(e) => openStatusPopover(e, 'state', [
          { label: 'Green - Low Risk', color: '#00c875' },
          { label: 'Orange - Moderate', color: '#ff9900' },
          { label: 'Red - High Risk', color: '#e2445c' },
          { label: 'Manual', color: '#ff9900' },
          { label: 'Not updated', color: '#c4c4c4' }
        ])}
      >
        {item.state ? (
          <span className={getStateBadgeClass(item.state)}>{item.state}</span>
        ) : (
          <span className="badge-status gray">-</span>
        )}
      </td>

      {/* Col 8: Company Size */}
      <td 
        style={{ textAlign: 'center', width: 120 }}
        onClick={(e) => openStatusPopover(e, 'companySize', [
          { label: '1-10', color: '#00c3d1' },
          { label: '11-50', color: '#ff9900' },
          { label: '51-200', color: '#e2445c' },
          { label: '200-500', color: '#a25ddc' },
          { label: 'Not updated', color: '#c4c4c4' }
        ])}
      >
        <span className={getCompanySizeBadgeClass(item.companySize)}>
          {item.companySize || '-'}
        </span>
      </td>

      {/* Col 9: SPREADSHEET LINK */}
      <td className="col-email editable-cell" title={item.spreadsheetLink}>
        {renderActiveLink(item.spreadsheetLink)}
      </td>

      {/* Col 10: DASHBOARD LINK */}
      <td className="col-email editable-cell" title={item.dashboardLink}>
        {renderActiveLink(item.dashboardLink)}
      </td>

      {/* Col 11: CONTENT LINK */}
      <td className="col-email editable-cell" title={item.contentLink}>
        {renderActiveLink(item.contentLink)}
      </td>

      {/* Col 12: PC */}
      <td style={{ textAlign: 'center', width: 90 }} onClick={(e) => openPersonPopover(e, 'pc')}>
        {item.pc ? <span className={getCSFrontClass(item.pc)}>{item.pc}</span> : '-'}
      </td>

      {/* Col 13: CS: Front */}
      <td style={{ textAlign: 'center', width: 100 }} onClick={(e) => openPersonPopover(e, 'csFront')}>
        {item.csFront ? <span className={getCSFrontClass(item.csFront)}>{item.csFront}</span> : '-'}
      </td>

      {/* Col 14: CS: Back */}
      <td style={{ textAlign: 'center', width: 110 }} onClick={(e) => openPersonPopover(e, 'csBack')}>
        {item.csBack ? <span className={getCSBackClass(item.csBack)}>{item.csBack}</span> : '-'}
      </td>

      {/* Col 15: Country */}
      <td style={{ textAlign: 'center', width: 90 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span>🇮🇳</span>
          <span style={{ fontWeight: 600 }}>IND</span>
        </div>
      </td>

      {/* Col 16: Analyst */}
      <td style={{ textAlign: 'center', width: 140 }} onClick={(e) => openPersonPopover(e, 'analyst')}>
        {item.analyst ? (
          <span className="analyst-pill">{item.analyst}</span>
        ) : '-'}
      </td>

      {/* Col 17: Industry */}
      <td 
        style={{ textAlign: 'center', width: 170 }}
        onClick={(e) => openStatusPopover(e, 'industry', [
          { label: 'Manufacturing', color: '#4e342e' },
          { label: 'Drones solutions', color: '#00838f' },
          { label: 'Business Consulting', color: '#1565c0' },
          { label: 'IT Solutions & Services', color: '#7b1fa2' },
          { label: 'Management Consulting', color: '#c62828' },
          { label: 'Others', color: '#2e7d32' }
        ])}
      >
        {item.industry ? (
          <span className={getIndustryColorClass(item.industry)}>{item.industry}</span>
        ) : '-'}
      </td>

      {/* Col 18: Email Engine */}
      <td 
        style={{ textAlign: 'center', width: 120 }}
        onClick={(e) => openStatusPopover(e, 'emailEngine', [
          { label: 'Outlook', color: '#ff9900' },
          { label: 'G-suit', color: '#00c875' },
          { label: 'Zoho', color: '#00a0ef' },
          { label: 'Manual', color: '#ff9900' },
          { label: '', color: '#c4c4c4' }
        ])}
      >
        {item.emailEngine === 'Outlook' ? (
          <span className="badge-status orange">Outlook</span>
        ) : item.emailEngine === 'G-suit' ? (
          <span className="badge-status green">G-suit</span>
        ) : item.emailEngine ? (
          <span className="badge-status blue">{item.emailEngine}</span>
        ) : '-'}
      </td>

      {/* Col 19: Project Type */}
      <td 
        style={{ textAlign: 'center', width: 120 }}
        onClick={(e) => openStatusPopover(e, 'projectType', [
          { label: 'Automation', color: '#00c875' },
          { label: 'Manual', color: '#ff9900' },
          { label: '', color: '#c4c4c4' }
        ])}
      >
        {item.projectType === 'Automation' ? (
          <span className="badge-status green">Automation</span>
        ) : item.projectType === 'Manual' ? (
          <span className="badge-status orange">Manual</span>
        ) : item.projectType ? (
          <span className="badge-status blue">{item.projectType}</span>
        ) : '-'}
      </td>

      {/* Col 20: Contact Details */}
      <td 
        className="col-email editable-cell" 
        contentEditable 
        suppressContentEditableWarning
        onBlur={(e) => handleCellTextChange('contactDetails', e.currentTarget.textContent || '')}
        title={item.contactDetails}
      >
        {item.contactDetails || '-'}
      </td>

      {/* Col 21: Email IDs */}
      <td 
        className="col-email editable-cell" 
        contentEditable 
        suppressContentEditableWarning
        onBlur={(e) => handleCellTextChange('emailIds', e.currentTarget.textContent || '')}
        title={item.emailIds}
      >
        {item.emailIds || '-'}
      </td>

      {/* Col 22: GTM Link */}
      <td 
        className="col-email editable-cell" 
        contentEditable 
        suppressContentEditableWarning
        onBlur={(e) => handleCellTextChange('gtmLink', e.currentTarget.textContent || '')}
        title={item.gtmLink}
      >
        {item.gtmLink || '-'}
      </td>

      {/* Col 23: Fortnight */}
      <td 
        style={{ textAlign: 'center', width: 100 }}
        onClick={(e) => openStatusPopover(e, 'fortnight', [
          { label: 'Done', color: '#00c875' },
          { label: 'Working on it', color: '#ff9900' },
          { label: 'Manual', color: '#00a0ef' },
          { label: 'Pending', color: '#c4c4c4' }
        ])}
      >
        {item.fortnight === 'Done' ? <span className="badge-status green">Done</span> : item.fortnight ? <span className="badge-status orange">{item.fortnight}</span> : '-'}
      </td>

      {/* Col 24: Email Warmup */}
      <td 
        style={{ textAlign: 'center', width: 100 }}
        onClick={(e) => openStatusPopover(e, 'emailWarmup', [
          { label: 'Done', color: '#00c875' },
          { label: 'Working on it', color: '#ff9900' },
          { label: 'Manual', color: '#00a0ef' },
          { label: 'Pending', color: '#c4c4c4' }
        ])}
      >
        {item.emailWarmup === 'Done' ? <span className="badge-status green">Done</span> : item.emailWarmup ? <span className="badge-status orange">{item.emailWarmup}</span> : '-'}
      </td>

      {/* Col 25: Email Trigger */}
      <td 
        style={{ textAlign: 'center', width: 140 }}
        onClick={(e) => openStatusPopover(e, 'emailTrigger', [
          { label: 'Content', color: '#ff9900' },
          { label: 'Domain Health', color: '#e2445c' },
          { label: 'MOM - Kickoff', color: '#ffcb00' },
          { label: 'Updated Content', color: '#795548' },
          { label: 'Manual', color: '#00a0ef' }
        ])}
      >
        {item.emailTrigger === 'Content' ? (
          <span className="badge-status orange">Content</span>
        ) : item.emailTrigger === 'Domain Health' ? (
          <span className="badge-status red-danger">Domain Health</span>
        ) : item.emailTrigger === 'MOM - Kickoff' ? (
          <span className="badge-status yellow-gold">MOM - Kickoff</span>
        ) : item.emailTrigger === 'Updated Content' ? (
          <span className="badge-status olive-green">Updated Content</span>
        ) : item.emailTrigger ? (
          <span className="badge-status blue">{item.emailTrigger}</span>
        ) : '-'}
      </td>

      {/* Col 26: DOMAIN HEALTH LINK */}
      <td className="col-email editable-cell" title={item.domainHealthLink}>
        {renderActiveLink(item.domainHealthLink)}
      </td>

      {/* Col 27: Domain Health Status */}
      <td 
        style={{ textAlign: 'center', width: 130 }}
        onClick={(e) => openStatusPopover(e, 'domainHealth', [
          { label: 'Done', color: '#00c875' },
          { label: 'Needs to be...', color: '#ff9900' },
          { label: 'Manual', color: '#00a0ef' },
          { label: 'Pending', color: '#c4c4c4' }
        ])}
      >
        {item.domainHealth === 'Done' ? (
          <span className="badge-status green">Done</span>
        ) : item.domainHealth.includes('Needs') ? (
          <span className="badge-status orange">Needs to be...</span>
        ) : item.domainHealth ? (
          <span className="badge-status blue">{item.domainHealth}</span>
        ) : (
          <span className="badge-status gray">Pending 🚩</span>
        )}
      </td>

      {/* Col 28: WhatsApp */}
      <td 
        style={{ textAlign: 'center', width: 110 }}
        onClick={(e) => openStatusPopover(e, 'whatsApp', [
          { label: 'Done', color: '#00c875' },
          { label: 'Manual', color: '#00a0ef' },
          { label: 'Pending ...', color: '#c4c4c4' }
        ])}
      >
        {item.whatsApp === 'Done' ? (
          <span className="badge-status green">Done</span>
        ) : item.whatsApp ? (
          <span className="badge-status blue">{item.whatsApp}</span>
        ) : (
          <span className="badge-status gray">Pending ...</span>
        )}
      </td>

      {/* Col 29: Email ID & Pass */}
      <td 
        style={{ textAlign: 'center', width: 120 }}
        onClick={(e) => openStatusPopover(e, 'emailIdPass', [
          { label: 'Done', color: '#00c875' },
          { label: 'Manual', color: '#00a0ef' },
          { label: 'Pending', color: '#c4c4c4' }
        ])}
      >
        {item.emailIdPass === 'Done' ? (
          <span className="badge-status green">Done</span>
        ) : item.emailIdPass ? (
          <span className="badge-status blue">{item.emailIdPass}</span>
        ) : (
          <span className="badge-status gray">Pending 🚩</span>
        )}
      </td>

      {/* Col 30: Calendly */}
      <td 
        style={{ textAlign: 'center', width: 110 }}
        onClick={(e) => openStatusPopover(e, 'calendly', [
          { label: 'Done', color: '#00c875' },
          { label: 'Manual', color: '#00a0ef' },
          { label: 'Pending', color: '#c4c4c4' }
        ])}
      >
        {item.calendly === 'Done' ? (
          <span className="badge-status green">Done</span>
        ) : item.calendly ? (
          <span className="badge-status blue">{item.calendly}</span>
        ) : (
          <span className="badge-status gray">Pending 🚩</span>
        )}
      </td>

      {/* Col 31: LinkedIn */}
      <td className="editable-cell" style={{ textAlign: 'center', width: 120 }}>-</td>

      {/* Col 32: BD */}
      <td style={{ textAlign: 'center', width: 110 }} onClick={(e) => openPersonPopover(e, 'bd')}>
        {item.bd ? <span className={getBDClass(item.bd)}>{item.bd}</span> : '-'}
      </td>

      {/* Col 33: Reason of hold */}
      <td 
        className="editable-cell" 
        contentEditable 
        suppressContentEditableWarning
        onBlur={(e) => handleCellTextChange('reasonOfHold', e.currentTarget.textContent || '')}
        style={{ textAlign: 'center', width: 120 }}
      >
        {item.reasonOfHold || '-'}
      </td>

      {/* Col 34: Back up CX */}
      <td style={{ textAlign: 'center', width: 110 }} onClick={(e) => openPersonPopover(e, 'backupCx')}>
        {item.backupCx ? <span className="person-pill dark-green">{item.backupCx}</span> : '-'}
      </td>

      {/* Col 35: Add Plus */}
      <td className="col-add">
        <Plus size={14} style={{ color: 'var(--text-light)', cursor: 'pointer' }} />
      </td>

      {/* Active Floating Popovers */}
      {activePopover && activePopover.type === 'status' && (
        <StatusPickerPopover 
          currentValue={String(item[activePopover.field] || '')}
          options={activePopover.options as StatusOption[]}
          position={activePopover.position}
          onSelect={(selectedVal) => handleCellTextChange(activePopover.field, selectedVal)}
          onClose={() => setActivePopover(null)}
        />
      )}

      {activePopover && activePopover.type === 'person' && (
        <PersonPickerPopover 
          currentValue={String(item[activePopover.field] || '')}
          options={activePopover.options as string[]}
          position={activePopover.position}
          onSelect={(selectedPerson) => handleCellTextChange(activePopover.field, selectedPerson)}
          onClose={() => setActivePopover(null)}
        />
      )}

      {/* Embedded Spreadsheet Viewer Modal */}
      <SpreadsheetViewerModal 
        item={item}
        linkTitle={activeModalLink || ''}
        isOpen={!!activeModalLink}
        onClose={() => setActiveModalLink(null)}
      />
    </tr>
  );
};
