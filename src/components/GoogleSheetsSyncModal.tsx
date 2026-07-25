import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle2, Link2, Clock, Sparkles } from 'lucide-react';
import { SyncConfig, fetchLiveGoogleSheetData } from '../services/googleSheetsSync';
import { PLMItem } from '../types';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncConfig: SyncConfig;
  onUpdateSyncConfig: (config: SyncConfig) => void;
  onApplySyncedData: (items: PLMItem[]) => void;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  syncConfig,
  onUpdateSyncConfig,
  onApplySyncedData
}) => {
  const [urlInput, setUrlInput] = useState(syncConfig.sheetUrl || 'https://docs.google.com/spreadsheets/d/1WoQFoy4JYjtysnnuzrB8baexMzNPdtXGdXJkZc7tizM/edit?usp=sharing');
  const [autoSync, setAutoSync] = useState(syncConfig.autoSync);
  const [interval, setIntervalMinutes] = useState(syncConfig.intervalMinutes || 5);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSyncNow = async () => {
    if (!urlInput.trim()) return;
    setIsSyncing(true);
    setSyncStatusMsg('Connecting to Google Sheets API...');

    try {
      const items = await fetchLiveGoogleSheetData(urlInput.trim());
      onApplySyncedData(items);

      const updatedConfig: SyncConfig = {
        sheetUrl: urlInput.trim(),
        autoSync,
        intervalMinutes: interval,
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      onUpdateSyncConfig(updatedConfig);
      setSyncStatusMsg(`Successfully synced ${items.length} records from Google Sheets!`);
    } catch (err: any) {
      setSyncStatusMsg(`Sync warning: ${err.message || 'Unable to sync'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="comment-drawer-overlay" style={{ justifyContent: 'center', alignItems: 'center' }} onClick={onClose}>
      <div 
        style={{ 
          background: 'white', 
          borderRadius: 8, 
          width: 540, 
          padding: 24, 
          boxShadow: 'var(--shadow-dropdown)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#e5f0ff', color: '#0073ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={20} className={isSyncing ? 'spin-icon' : ''} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700 }}>Google Sheets Synchronization</h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Keep dashboard records 100% in sync with Google Sheets</span>
            </div>
          </div>
          <button className="header-icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Status Notification */}
        {syncConfig.lastSyncedAt && (
          <div style={{ padding: '8px 12px', background: '#e6f9f0', border: '1px solid #a3e9c9', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#0f5132' }}>
            <CheckCircle2 size={16} color="#00c875" />
            <span>Last Synced: <strong>{syncConfig.lastSyncedAt}</strong> • Status: <strong>Live Synced</strong></span>
          </div>
        )}

        {/* Form Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Link2 size={14} />
              <span>Google Sheet URL or Document ID</span>
            </label>
            <input 
              type="text" 
              placeholder="e.g. https://docs.google.com/spreadsheets/d/1WoQFoy4JYj..."
              value={urlInput} 
              onChange={(e) => setUrlInput(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 4, border: '1px solid var(--border-color)', outline: 'none', fontSize: '13px' }}
            />
          </div>

          <div style={{ padding: 12, border: '1px solid var(--border-color)', borderRadius: 6, background: '#fafbfc', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={16} color="#0073ea" />
                <span style={{ fontWeight: 600, fontSize: '13px' }}>Background Auto-Sync</span>
              </div>
              <input 
                type="checkbox" 
                checked={autoSync} 
                onChange={(e) => setAutoSync(e.target.checked)}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
            </div>

            {autoSync && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sync Interval:</span>
                <select 
                  value={interval} 
                  onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                  style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid var(--border-color)' }}
                >
                  <option value={1}>Every 1 Minute</option>
                  <option value={5}>Every 5 Minutes</option>
                  <option value={15}>Every 15 Minutes</option>
                </select>
              </div>
            )}
          </div>

          {syncStatusMsg && (
            <div style={{ fontSize: '12px', fontWeight: 500, color: syncStatusMsg.includes('warning') ? '#c62828' : '#0073ea' }}>
              {syncStatusMsg}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
          <button className="btn-secondary" type="button" onClick={onClose}>Close</button>
          <button className="btn-primary" type="button" onClick={handleSyncNow} disabled={isSyncing}>
            <RefreshCw size={15} className={isSyncing ? 'spin-icon' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
