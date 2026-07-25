import React, { useState } from 'react';
import { Pencil, Sparkles, Plus, Check } from 'lucide-react';

export interface StatusOption {
  label: string;
  color: string; // e.g. '#00c875', '#ff9900', '#e2445c', '#00a0ef', '#c4c4c4'
}

interface StatusPickerPopoverProps {
  currentValue: string;
  options: StatusOption[];
  position: { top: number; left: number };
  onSelect: (selectedLabel: string) => void;
  onClose: () => void;
}

export const defaultStatusOptions: StatusOption[] = [
  { label: 'Active', color: '#00c875' },
  { label: 'Manual', color: '#ff9900' },
  { label: 'Hold', color: '#ff9900' },
  { label: 'Notice', color: '#e2445c' },
  { label: 'Upcoming', color: '#00a0ef' },
  { label: '', color: '#c4c4c4' }
];

export const StatusPickerPopover: React.FC<StatusPickerPopoverProps> = ({
  currentValue,
  options = defaultStatusOptions,
  position,
  onSelect,
  onClose
}) => {
  const [customText, setCustomText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    onSelect(customText.trim());
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
        className="status-picker-popover"
        style={{
          top: position.top,
          left: position.left,
          zIndex: 1000
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popover-caret" />

        <div className="popover-options-list">
          {options.map((opt, idx) => (
            <button
              key={idx}
              className="popover-status-btn"
              style={{ backgroundColor: opt.color || '#c4c4c4' }}
              onClick={() => {
                onSelect(opt.label);
                onClose();
              }}
            >
              <span>{opt.label || '-'}</span>
            </button>
          ))}
        </div>

        {/* Custom Input Toggle / Form */}
        {showCustomInput ? (
          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            <input 
              type="text" 
              placeholder="Type custom text..."
              value={customText} 
              onChange={(e) => setCustomText(e.target.value)}
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
          <div className="popover-footer-action" onClick={() => setShowCustomInput(true)}>
            <Plus size={14} color="var(--primary-color)" />
            <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Custom Input</span>
          </div>
        )}

        <div className="popover-footer-action" onClick={onClose}>
          <Pencil size={14} />
          <span>Edit Labels</span>
        </div>

        <div className="popover-footer-action ai-action" onClick={onClose}>
          <Sparkles size={14} color="#00a0ef" />
          <span>Auto-assign labels</span>
        </div>
      </div>
    </>
  );
};
