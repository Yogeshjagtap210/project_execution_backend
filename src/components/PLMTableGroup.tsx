import React from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { PLMGroup, PLMItem } from '../types';
import { PLMTableRow } from './PLMTableRow';

interface PLMTableGroupProps {
  group: PLMGroup;
  onToggleGroup: (groupId: string) => void;
  onItemChange: (groupId: string, updatedItem: PLMItem) => void;
  onOpenComments: (item: PLMItem) => void;
  onAddItemToGroup: (groupId: string) => void;
}

export const PLMTableGroup: React.FC<PLMTableGroupProps> = ({
  group,
  onToggleGroup,
  onItemChange,
  onOpenComments,
  onAddItemToGroup
}) => {
  const allSelected = group.items.length > 0 && group.items.every(i => i.selected);

  return (
    <div className="table-group-container">
      {/* Group Collapsible Banner */}
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
              <th className="col-item">Project name</th>

              {/* SCROLLABLE HEADER COLS */}
              <th style={{ width: 100 }}>Start Date</th>
              <th style={{ width: 110 }}>Total Days</th>
              <th style={{ width: 110 }}>Date of I...</th>
              <th style={{ width: 110 }}>End Date</th>
              <th style={{ width: 110 }}>Current S...</th>
              <th style={{ width: 160 }}>State</th>
              <th style={{ width: 120 }}>Company Size</th>
              <th className="col-email">Spreadsheet Link</th>
              <th className="col-email">Dashboard...</th>
              <th className="col-email">Content Link</th>
              <th style={{ width: 90 }}>PC</th>
              <th style={{ width: 100 }}>CS: Front</th>
              <th style={{ width: 110 }}>CS: Back</th>
              <th style={{ width: 90 }}>Country</th>
              <th style={{ width: 140 }}>Analyst</th>
              <th style={{ width: 170 }}>Industry</th>
              <th style={{ width: 120 }}>Email Engine</th>
              <th style={{ width: 120 }}>Project type</th>
              <th className="col-email">Contact details</th>
              <th className="col-email">Email IDs</th>
              <th className="col-email">GTM of Project</th>
              <th style={{ width: 100 }}>Fortnight...</th>
              <th style={{ width: 100 }}>Email...</th>
              <th style={{ width: 140 }}>Email Trigger</th>
              <th className="col-email">Domain Health Link</th>
              <th style={{ width: 130 }}>Domain Health</th>
              <th style={{ width: 110 }}>WhatsApp...</th>
              <th style={{ width: 120 }}>Email ID & Pas...</th>
              <th style={{ width: 110 }}>Calendly</th>
              <th style={{ width: 120 }}>LinkedIn Campai...</th>
              <th style={{ width: 110 }}>BD</th>
              <th style={{ width: 120 }}>Reason of hold</th>
              <th style={{ width: 110 }}>Back up CX</th>
              <th className="col-add">+</th>
            </tr>
          </thead>
          <tbody>
            {group.items.map((item) => (
              <PLMTableRow 
                key={item.id}
                item={item}
                onItemChange={(updated) => onItemChange(group.id, updated)}
                onOpenComments={onOpenComments}
              />
            ))}

            {/* Quick Add Row */}
            <tr>
              <td className="col-checkbox"></td>
              <td className="col-item" style={{ cursor: 'pointer', color: 'var(--text-light)' }} onClick={() => onAddItemToGroup(group.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={14} />
                  <span>+ Add project name</span>
                </div>
              </td>
              <td colSpan={40} style={{ background: '#fafbfc' }}></td>
            </tr>

            {/* Bottom Summary Bar Matching Reference Screenshot */}
            <tr className="summary-row" style={{ height: 42, background: '#fafbfc' }}>
              <td className="col-checkbox"></td>
              <td className="col-item"></td>
              <td style={{ textAlign: 'center' }}>
                <span className="summary-badge green">Jun 3 - 30</span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className="summary-badge-sub">34.394 avg</span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className="summary-pill-gray">-</span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span className="summary-pill-gray">-</span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <div className="progress-bar-stack">
                  <div style={{ width: '100%', background: '#00c875', height: 12, borderRadius: 3 }}></div>
                </div>
              </td>
              <td style={{ textAlign: 'center' }}>
                <div className="progress-bar-stack">
                  <div style={{ width: '60%', background: '#00c875', height: 12, borderRadius: '3px 0 0 3px' }}></div>
                  <div style={{ width: '20%', background: '#ff9900', height: 12 }}></div>
                  <div style={{ width: '20%', background: '#e2445c', height: 12, borderRadius: '0 3px 3px 0' }}></div>
                </div>
              </td>
              <td style={{ textAlign: 'center' }}>
                <div className="progress-bar-stack">
                  <div style={{ width: '50%', background: '#ff9900', height: 12, borderRadius: '3px 0 0 3px' }}></div>
                  <div style={{ width: '50%', background: '#e2445c', height: 12, borderRadius: '0 3px 3px 0' }}></div>
                </div>
              </td>
              <td colSpan={4}></td>
              <td style={{ textAlign: 'center' }}>
                <div className="progress-bar-stack">
                  <div style={{ width: '40%', background: '#00c875', height: 12 }}></div>
                  <div style={{ width: '30%', background: '#a25ddc', height: 12 }}></div>
                  <div style={{ width: '30%', background: '#579bfc', height: 12 }}></div>
                </div>
              </td>
              <td colSpan={25}></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};
