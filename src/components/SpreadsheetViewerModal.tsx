import React, { useState, useEffect } from 'react';
import { X, ExternalLink, FileSpreadsheet, Plus } from 'lucide-react';
import { PLMItem } from '../types';
import { StatusPickerPopover, StatusOption } from './StatusPickerPopover';

interface SpreadsheetViewerModalProps {
  item: PLMItem | null;
  linkTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

interface SheetRow {
  id: number;
  metric: string;
  value: string;
  status: string;
  date: string;
}

export const SpreadsheetViewerModal: React.FC<SpreadsheetViewerModalProps> = ({
  item,
  linkTitle,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'sheet' | 'metrics' | 'logs'>('sheet');
  const [rows, setRows] = useState<SheetRow[]>([]);
  
  // Status popover state for modal cell
  const [activeStatusPopover, setActiveStatusPopover] = useState<{
    rowId: number;
    position: { top: number; left: number };
  } | null>(null);

  useEffect(() => {
    if (item) {
      setRows([
        { id: 1, metric: 'Target Industry', value: item.industry || 'IT Solutions & Services', status: 'Verified', date: 'Jul 2026' },
        { id: 2, metric: 'Target Company Size', value: item.companySize || '51-200 employees', status: 'Verified', date: 'Jul 2026' },
        { id: 3, metric: 'Contact Person / Details', value: item.contactDetails || 'Executive Leadership Team', status: 'Active', date: 'Jul 2026' },
        { id: 4, metric: 'Email Engine Config', value: item.emailEngine || 'Outlook', status: 'Configured', date: 'Jul 2026' },
        { id: 5, metric: 'Domain Health Check', value: item.domainHealth || 'Done', status: 'Active', date: 'Jul 2026' },
        { id: 6, metric: 'GTM Target Regions', value: item.gtmLink || 'Mumbai, Pune, Bengaluru', status: 'Verified', date: 'Jul 2026' },
        { id: 7, metric: 'Client Email List', value: item.emailIds || 'contact@client.com', status: 'Active', date: 'Jul 2026' }
      ]);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const modalStatusOptions: StatusOption[] = [
    { label: 'Verified', color: '#00c875' },
    { label: 'Configured', color: '#0073ea' },
    { label: 'Active', color: '#00c875' },
    { label: 'Pending', color: '#ff9900' },
    { label: 'Hold', color: '#e2445c' },
    { label: 'Manual', color: '#a25ddc' },
    { label: '', color: '#c4c4c4' }
  ];

  const handleOpenStatusPopover = (e: React.MouseEvent, rowId: number) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveStatusPopover({
      rowId,
      position: { top: rect.bottom + 8, left: rect.left - 20 }
    });
  };

  const handleStatusChange = (rowId: number, newStatus: string) => {
    setRows(prev => prev.map(r => r.id === rowId ? { ...r, status: newStatus } : r));
  };

  const handleTextChange = (rowId: number, field: 'metric' | 'value', text: string) => {
    setRows(prev => prev.map(r => r.id === rowId ? { ...r, [field]: text } : r));
  };

  const handleAddRow = () => {
    const newRow: SheetRow = {
      id: Date.now(),
      metric: 'New Custom Metric',
      value: 'Custom Value',
      status: 'Active',
      date: 'Just now'
    };
    setRows(prev => [...prev, newRow]);
  };

  const getBadgeClass = (status: string) => {
    if (status === 'Verified' || status === 'Active' || status === 'Done') return 'badge-status green';
    if (status === 'Configured') return 'badge-status blue';
    if (status === 'Pending') return 'badge-status orange';
    if (status === 'Hold') return 'badge-status red-danger';
    if (status === 'Manual') return 'badge-status purple';
    return 'badge-status gray';
  };

  const handleOpenGoogleSheetsTemplate = () => {
    window.open('https://docs.google.com/spreadsheets/u/0/', '_blank');
  };

  return (
    <div className="comment-drawer-overlay" style={{ justifyContent: 'center', alignItems: 'center' }} onClick={onClose}>
      <div 
        style={{ 
          background: 'white', 
          borderRadius: 8, 
          width: 780, 
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-dropdown)',
          overflow: 'hidden',
          position: 'relative'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafbfc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 6, backgroundColor: '#00c875', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{linkTitle || item.name}</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Project Dashboard & Editable Spreadsheet Viewer • {item.name}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn-secondary" onClick={handleOpenGoogleSheetsTemplate} title="Open Google Sheets App">
              <ExternalLink size={14} />
              <span>Open Google Sheets</span>
            </button>
            <button className="header-icon-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal View Tabs */}
        <div className="view-tabs-row" style={{ padding: '0 20px', background: '#ffffff' }}>
          <div className={`view-tab ${activeTab === 'sheet' ? 'active' : ''}`} onClick={() => setActiveTab('sheet')}>
            <span>Data Spreadsheet</span>
          </div>
          <div className={`view-tab ${activeTab === 'metrics' ? 'active' : ''}`} onClick={() => setActiveTab('metrics')}>
            <span>Project Metrics</span>
          </div>
          <div className={`view-tab ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
            <span>Activity Logs</span>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
          {activeTab === 'sheet' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>Spreadsheet Data Entries ({rows.length})</span>
                <button className="btn-secondary" onClick={handleAddRow} style={{ padding: '4px 10px', color: 'var(--primary-color)' }}>
                  <Plus size={14} />
                  <span>Add Data Entry</span>
                </button>
              </div>

              <table className="monday-table" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', width: '30%' }}>Metric / Field</th>
                    <th style={{ textAlign: 'left', width: '40%' }}>Value</th>
                    <th style={{ textAlign: 'center', width: '15%' }}>Status (Click to Edit)</th>
                    <th style={{ textAlign: 'center', width: '15%' }}>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.id}>
                      <td 
                        style={{ fontWeight: 600 }}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleTextChange(r.id, 'metric', e.currentTarget.textContent || '')}
                      >
                        {r.metric}
                      </td>
                      <td 
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleTextChange(r.id, 'value', e.currentTarget.textContent || '')}
                        style={{ color: r.value.startsWith('http') ? '#0073ea' : 'inherit' }}
                      >
                        {r.value}
                      </td>
                      {/* EDITABLE STATUS COLUMN WITH POPOVER */}
                      <td 
                        style={{ textAlign: 'center', cursor: 'pointer' }}
                        onClick={(e) => handleOpenStatusPopover(e, r.id)}
                      >
                        <span className={getBadgeClass(r.status)}>
                          {r.status || '-'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, padding: 16, background: '#fafbfc' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CS Front Lead</span>
                <div style={{ fontSize: '18px', fontWeight: 700, marginTop: 4, color: '#0073ea' }}>{item.csFront || 'Akshay'}</div>
              </div>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, padding: 16, background: '#fafbfc' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Project Health State</span>
                <div style={{ fontSize: '18px', fontWeight: 700, marginTop: 4, color: '#00c875' }}>{item.state || 'Green - Low Risk'}</div>
              </div>
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 6, padding: 16, background: '#fafbfc' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Days Active</span>
                <div style={{ fontSize: '18px', fontWeight: 700, marginTop: 4, color: '#ff9900' }}>{item.totalDays || '18 Days'}</div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: 12, border: '1px solid var(--border-color)', borderRadius: 6 }}>
                <span style={{ fontWeight: 600 }}>Spreadsheet Linked & Editable</span>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status & value changes synchronized dynamically for {item.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', background: '#fafbfc' }}>
          <button className="btn-primary" onClick={onClose}>
            <span>Done</span>
          </button>
        </div>

        {/* Floating Status Picker Popover inside Modal */}
        {activeStatusPopover && (
          <StatusPickerPopover 
            currentValue={rows.find(r => r.id === activeStatusPopover.rowId)?.status || ''}
            options={modalStatusOptions}
            position={activeStatusPopover.position}
            onSelect={(newStatus) => handleStatusChange(activeStatusPopover.rowId, newStatus)}
            onClose={() => setActiveStatusPopover(null)}
          />
        )}
      </div>
    </div>
  );
};
