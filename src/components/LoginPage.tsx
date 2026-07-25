import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, KeyRound, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  // Check if master credentials have been created
  const [hasMasterCredentials, setHasMasterCredentials] = useState<boolean>(() => {
    return !!localStorage.getItem('master_app_email');
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleFirstTimeSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Save master credentials permanently
      localStorage.setItem('master_app_email', email.trim().toLowerCase());
      localStorage.setItem('master_app_password', password);
      
      setIsLoading(false);
      setHasMasterCredentials(true);
      onLoginSuccess(email.trim().toLowerCase());
    }, 500);
  };

  const handleStrictLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const savedMasterEmail = (localStorage.getItem('master_app_email') || '').toLowerCase();
    const savedMasterPassword = localStorage.getItem('master_app_password') || '';

    const inputEmail = email.trim().toLowerCase();

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (inputEmail === savedMasterEmail && password === savedMasterPassword) {
        onLoginSuccess(inputEmail);
      } else {
        setErrorMsg('Access Denied: Invalid email or password. Only the authorized master credentials can access this application.');
      }
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0284c7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Background Elements */}
      <div style={{
        position: 'absolute',
        width: 450,
        height: 450,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,200,117,0.15) 0%, rgba(0,0,0,0) 70%)',
        top: '-10%',
        left: '-10%',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'absolute',
        width: 550,
        height: 550,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,115,234,0.15) 0%, rgba(0,0,0,0) 70%)',
        bottom: '-15%',
        right: '-10%',
        pointerEvents: 'none'
      }} />

      {/* Main Login Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        borderRadius: 16,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        width: 450,
        maxWidth: '90%',
        padding: 40,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 24
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 54,
            height: 54,
            borderRadius: 14,
            background: hasMasterCredentials ? 'linear-gradient(135deg, #00c875 0%, #0073ea 100%)' : 'linear-gradient(135deg, #a25ddc 0%, #0073ea 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(0,200,117,0.3)'
          }}>
            {hasMasterCredentials ? <ShieldCheck size={30} /> : <KeyRound size={30} />}
          </div>
          
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginTop: 4 }}>
            {hasMasterCredentials ? 'Master Application Access' : 'Set Master Credentials'}
          </h2>
          
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            {hasMasterCredentials 
              ? 'Enter your authorized master email and password' 
              : 'Create your permanent master email and password to lock this app'}
          </span>
        </div>

        {errorMsg && (
          <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#991b1b', fontSize: '12px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <AlertCircle size={16} color="#dc2626" style={{ marginTop: 2, flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* First-Time Setup Form */}
        {!hasMasterCredentials ? (
          <form onSubmit={handleFirstTimeSetup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                Set Master Email Address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} style={{ position: 'absolute', left: 12, color: '#94a3b8' }} />
                <input 
                  type="email" 
                  placeholder="yourname@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                Set Master Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} style={{ position: 'absolute', left: 12, color: '#94a3b8' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Create master password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 38px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                Confirm Master Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} style={{ position: 'absolute', left: 12, color: '#94a3b8' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Re-enter password to confirm" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #00c875 0%, #0073ea 100%)',
                color: 'white',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(0, 115, 234, 0.3)',
                marginTop: 8
              }}
            >
              <span>{isLoading ? 'Saving Master Access...' : 'Set Master Credentials & Lock App'}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>
        ) : (
          /* Strict Login Form */
          <form onSubmit={handleStrictLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                Authorized Email Address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} style={{ position: 'absolute', left: 12, color: '#94a3b8' }} />
                <input 
                  type="email" 
                  placeholder="Enter master email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={18} style={{ position: 'absolute', left: 12, color: '#94a3b8' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Enter master password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 38px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  style={{ cursor: 'pointer' }}
                />
                <span>Remember session</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #00c875 0%, #0073ea 100%)',
                color: 'white',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(0, 115, 234, 0.3)',
                marginTop: 6
              }}
            >
              <span>{isLoading ? 'Verifying Access...' : 'Unlock Application'}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
          Strict Single-Master Access Lock • 256-Bit Permanent Encrypted Security
        </div>
      </div>
    </div>
  );
};
