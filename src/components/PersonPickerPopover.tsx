import React, { useState } from 'react';
import { User, Plus, Check } from 'lucide-react';

interface PersonPickerPopoverProps {
  currentValue: string;
  options: string[];
  position: { top: number; left: number };
  onSelect: (personName: string) => void;
  onClose: () => void;
}

export const defaultTeamMembers = [
  'Akshay',
  'Soham',
  'Narendra',
  'Girish',
  'Monika',
  'Megha',
  'Radheshyam',
  'Vivek',
  'Khushboo',
  'Nikhil',
  'Harshal',
  'Sunita',
  'BTB Analyst',
  'Tilottama Shitole',
  'Pankaja R.',
  'Saurabh Khot',
  'Madhuri Ragade'
];

export const PersonPickerPopover: React.FC<PersonPickerPopoverProps> = ({
  currentValue,
  options = defaultTeamMembers,
  position,
  onSelect,
  onClose
}) => {
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onSelect(customName.trim());
    onClose();
  };

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999
        }} 
        onClick={onClose} 
      />

      <div 
        className="person-picker-popover"
        style={{
          top: position.top,
          left: position.left,
          zIndex: 1000
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popover-caret" />

        <div className="popover-header">
          <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-muted)' }}>Select or Edit Person</span>
        </div>

        {/* Custom Person Input Toggle / Form */}
        {showCustomInput ? (
          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: 4, padding: '4px 0' }}>
            <input 
              type="text" 
              placeholder="Type custom name..."
              value={customName} 
              onChange={(e) => setCustomName(e.target.value)}
              autoFocus
              style={{ 
                flex: 1, 
                padding: '4px 8px', 
                borderRadius: 4, 
                border: '1px solid var(--primary-color)', 
                fontSize: '12px',
                outline: 'none' 
              }}
            />
            <button 
              type="submit" 
              style={{ 
                background: 'var(--primary-color)', 
                color: 'white', 
                border: 'none', 
                borderRadius: 4, 
                padding: '4px 8px', 
                cursor: 'pointer' 
              }}
            >
              <Check size={14} />
            </button>
          </form>
        ) : (
          <div 
            className="person-option-row" 
            style={{ color: 'var(--primary-color)', fontWeight: 600 }}
            onClick={() => setShowCustomInput(true)}
          >
            <Plus size={15} />
            <span>+ Custom Person Input</span>
          </div>
        )}

        <div className="popover-person-list">
          {options.map((name, idx) => (
            <div 
              key={idx} 
              className={`person-option-row ${name === currentValue ? 'selected' : ''}`}
              onClick={() => {
                onSelect(name);
                onClose();
              }}
            >
              <div className="person-avatar">
                {name.charAt(0).toUpperCase()}
              </div>
              <span className="person-name">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
