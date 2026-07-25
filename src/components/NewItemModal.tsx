import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { BoardGroup } from '../types';

interface NewItemModalProps {
  groups: BoardGroup[];
  selectedGroupId: string;
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (groupId: string, name: string, csBack: string, clientEmail: string) => void;
}

export const NewItemModal: React.FC<NewItemModalProps> = ({
  groups,
  selectedGroupId,
  isOpen,
  onClose,
  onAddItem
}) => {
  const [groupId, setGroupId] = useState(selectedGroupId || groups[0]?.id || '');
  const [name, setName] = useState('');
  const [csBack, setCsBack] = useState('Radheshyam');
  const [clientEmail, setClientEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddItem(groupId, name.trim(), csBack, clientEmail.trim());
    setName('');
    setClientEmail('');
    onClose();
  };

  return (
    <div className="comment-drawer-overlay" style={{ justifyContent: 'center', alignItems: 'center' }} onClick={onClose}>
      <div 
        style={{ 
          background: 'white', 
          borderRadius: 8, 
          width: 440, 
          padding: 24, 
          boxShadow: 'var(--shadow-dropdown)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Add New Item</h3>
          <button className="header-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              Select Group
            </label>
            <select 
              value={groupId} 
              onChange={(e) => setGroupId(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border-color)', outline: 'none' }}
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              Item Name *
            </label>
            <input 
              type="text" 
              placeholder="e.g. Acme Tech Solutions"
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              CS - Back Assignee
            </label>
            <select 
              value={csBack} 
              onChange={(e) => setCsBack(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border-color)', outline: 'none' }}
            >
              <option value="Radheshyam">Radheshyam</option>
              <option value="Jayesh">Jayesh</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              Client Email
            </label>
            <input 
              type="email" 
              placeholder="e.g. contact@acme.com"
              value={clientEmail} 
              onChange={(e) => setClientEmail(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button className="btn-secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="btn-primary" type="submit">
              <Plus size={15} />
              <span>Create Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
