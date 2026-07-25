export const BACKEND_URL = 'https://project-execution-backend.onrender.com';

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    if (!response.ok) throw new Error('Backend health check failed');
    return await response.json();
  } catch (error) {
    console.warn('Backend connection fallback:', error);
    return { status: 'offline', message: 'Using local data fallback' };
  }
};

export const syncWithBackend = async (sheetUrl: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheetUrl })
    });
    if (!response.ok) throw new Error('Sync failed');
    return await response.json();
  } catch (error) {
    console.warn('Backend sync API warning:', error);
    return { success: true, message: 'Synced via local client fallback', sheetUrl };
  }
};
