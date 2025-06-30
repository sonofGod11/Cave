"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import Link from "next/link";

interface SecuritySettings {
  twoFactorEnabled: boolean;
  pinEnabled: boolean;
  pin: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  loginAlerts: boolean;
  sessionTimeout: number; // in minutes
  requirePinForPayments: boolean;
  requirePinForSettings: boolean;
  dailyLimit?: number;
  perTransactionLimit?: number;
}

interface LoginSession {
  id: string;
  device: string;
  location: string;
  ip: string;
  timestamp: string;
  isCurrent: boolean;
}

export default function Security() {
  const { user, loading } = useAuth();
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    pinEnabled: false,
    pin: '',
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    sessionTimeout: 30,
    requirePinForPayments: false,
    requirePinForSettings: true
  });
  const [showPinModal, setShowPinModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');
  const [activeSessions, setActiveSessions] = useState<LoginSession[]>([]);
  const [showSessions, setShowSessions] = useState(false);
  const [twoFactorSentCode, setTwoFactorSentCode] = useState("");
  const [twoFactorSending, setTwoFactorSending] = useState(false);
  const [dailyLimitInput, setDailyLimitInput] = useState(settings.dailyLimit?.toString() || "");
  const [perTransactionLimitInput, setPerTransactionLimitInput] = useState(settings.perTransactionLimit?.toString() || "");
  const [limitError, setLimitError] = useState("");
  const [securityAlerts, setSecurityAlerts] = useState([
    {
      id: 'alert1',
      type: 'new_device',
      message: 'New device login detected: Chrome on Windows 10, Accra, Ghana',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: 'alert2',
      type: 'location',
      message: 'Login from unusual location: Cape Coast, Ghana',
      timestamp: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
      read: true
    }
  ]);

  // Load security settings from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cave_security_settings') || '{}');
    setSettings({ ...settings, ...stored });
    
    // Load mock login sessions
    const mockSessions: LoginSession[] = [
      {
        id: '1',
        device: 'Chrome on Windows 10',
        location: 'Accra, Ghana',
        ip: '192.168.1.100',
        timestamp: new Date().toISOString(),
        isCurrent: true
      },
      {
        id: '2',
        device: 'Safari on iPhone',
        location: 'Kumasi, Ghana',
        ip: '192.168.1.101',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        isCurrent: false
      },
      {
        id: '3',
        device: 'Firefox on MacBook',
        location: 'Cape Coast, Ghana',
        ip: '192.168.1.102',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        isCurrent: false
      }
    ];
    setActiveSessions(mockSessions);
  }, []);

  // Save security settings to localStorage
  const saveSettings = (newSettings: Partial<SecuritySettings>) => {
    const updated = { ...settings, ...newSettings };
    localStorage.setItem('cave_security_settings', JSON.stringify(updated));
    setSettings(updated);
    // Update limit inputs if changed
    if (newSettings.dailyLimit !== undefined) setDailyLimitInput(newSettings.dailyLimit?.toString() || "");
    if (newSettings.perTransactionLimit !== undefined) setPerTransactionLimitInput(newSettings.perTransactionLimit?.toString() || "");
  };

  // Validate PIN
  const validatePin = (pin: string) => {
    if (pin.length !== 4) {
      return 'PIN must be exactly 4 digits';
    }
    if (!/^\d{4}$/.test(pin)) {
      return 'PIN must contain only numbers';
    }
    return null;
  };

  // Set up PIN
  const setupPin = () => {
    const error = validatePin(pin);
    if (error) {
      setPinError(error);
      return;
    }
    
    if (pin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }

    saveSettings({ pinEnabled: true, pin });
    setShowPinModal(false);
    setPin('');
    setConfirmPin('');
    setPinError('');
  };

  // Disable PIN
  const disablePin = () => {
    saveSettings({ pinEnabled: false, pin: '' });
  };

  // Send 2FA code to email (mock)
  const send2FACode = async () => {
    setTwoFactorSending(true);
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setTwoFactorSentCode(code);
    // In production, send code to user.email via backend/email service
    setTimeout(() => {
      alert(`2FA code sent to ${user?.email || 'your email'} (demo): ${code}`);
      setTwoFactorSending(false);
    }, 1000);
  };

  // Set up 2FA (now checks sent code)
  const setup2FA = () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      setTwoFactorError('Please enter a valid 6-digit code');
      return;
    }
    if (twoFactorCode === twoFactorSentCode) {
      saveSettings({ twoFactorEnabled: true });
      setShow2FAModal(false);
      setTwoFactorCode('');
      setTwoFactorError('');
      setTwoFactorSentCode("");
    } else {
      setTwoFactorError('Invalid verification code');
    }
  };

  // Disable 2FA
  const disable2FA = () => {
    saveSettings({ twoFactorEnabled: false });
  };

  // Terminate session
  const terminateSession = (sessionId: string) => {
    setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  // Terminate all other sessions
  const terminateAllOtherSessions = () => {
    setActiveSessions(prev => prev.filter(s => s.isCurrent));
  };

  // Handle limit update
  const handleLimitUpdate = () => {
    setLimitError("");
    const daily = dailyLimitInput ? parseFloat(dailyLimitInput) : undefined;
    const perTxn = perTransactionLimitInput ? parseFloat(perTransactionLimitInput) : undefined;
    if ((daily !== undefined && (isNaN(daily) || daily < 1)) || (perTxn !== undefined && (isNaN(perTxn) || perTxn < 1))) {
      setLimitError("Limits must be numbers greater than 0");
      return;
    }
    saveSettings({ dailyLimit: daily, perTransactionLimit: perTxn });
  };

  const handleClearLimits = () => {
    saveSettings({ dailyLimit: undefined, perTransactionLimit: undefined });
    setDailyLimitInput("");
    setPerTransactionLimitInput("");
    setLimitError("");
  };

  const markAlertRead = (id: string) => {
    setSecurityAlerts(alerts => alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Not signed in.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/40 to-orange-100/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Security Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account security and privacy</p>
            </div>
            <Link 
              href="/dashboard" 
              className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-blue-700 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Two-Factor Authentication</h2>
              <p className="text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                settings.twoFactorEnabled 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
              {settings.twoFactorEnabled ? (
                <button
                  className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-all"
                  onClick={disable2FA}
                >
                  Disable
                </button>
              ) : (
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                  onClick={() => setShow2FAModal(true)}
                >
                  Enable
                </button>
              )}
            </div>
          </div>
          {show2FAModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm relative">
                <button onClick={() => setShow2FAModal(false)} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
                <h3 className="text-lg font-bold mb-2">Enable Two-Factor Authentication</h3>
                <p className="text-gray-600 mb-4">A 6-digit code will be sent to your email. Enter it below to enable 2FA.</p>
                <button
                  className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all mb-3"
                  onClick={send2FACode}
                  disabled={twoFactorSending}
                >
                  {twoFactorSending ? 'Sending...' : 'Send Code'}
                </button>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={twoFactorCode}
                  onChange={e => setTwoFactorCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 mb-2"
                  maxLength={6}
                />
                {twoFactorError && <div className="text-red-500 text-sm mb-2">{twoFactorError}</div>}
                <button
                  className="w-full px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
                  onClick={setup2FA}
                  disabled={!twoFactorSentCode}
                >
                  Enable 2FA
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PIN Protection */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">PIN Protection</h2>
              <p className="text-gray-600">Set a 4-digit PIN for additional security</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                settings.pinEnabled 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {settings.pinEnabled ? 'Enabled' : 'Disabled'}
              </span>
              {settings.pinEnabled ? (
                <button
                  onClick={disablePin}
                  className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-all"
                >
                  Disable
                </button>
              ) : (
                <button
                  onClick={() => setShowPinModal(true)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                >
                  Enable
                </button>
              )}
            </div>
          </div>
          
          {settings.pinEnabled && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requirePinForPayments}
                    onChange={(e) => saveSettings({ requirePinForPayments: e.target.checked })}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">Require PIN for payments</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requirePinForSettings}
                    onChange={(e) => saveSettings({ requirePinForSettings: e.target.checked })}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">Require PIN for settings changes</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-gray-700">Email Notifications</span>
                <p className="text-sm text-gray-500">Receive security alerts via email</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => saveSettings({ emailNotifications: e.target.checked })}
                className="text-blue-600"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-gray-700">SMS Notifications</span>
                <p className="text-sm text-gray-500">Receive security alerts via SMS</p>
              </div>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => saveSettings({ smsNotifications: e.target.checked })}
                className="text-blue-600"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-gray-700">Login Alerts</span>
                <p className="text-sm text-gray-500">Get notified of new login attempts</p>
              </div>
              <input
                type="checkbox"
                checked={settings.loginAlerts}
                onChange={(e) => saveSettings({ loginAlerts: e.target.checked })}
                className="text-blue-600"
              />
            </label>
          </div>
        </div>

        {/* Session Management */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Active Sessions</h2>
            <button
              onClick={() => setShowSessions(!showSessions)}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              {showSessions ? 'Hide' : 'View'} Sessions
            </button>
          </div>
          
          {showSessions && (
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${session.isCurrent ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <div className="font-semibold text-gray-800">{session.device}</div>
                      <div className="text-sm text-gray-500">
                        {session.location} • {session.ip} • {new Date(session.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <button
                      onClick={() => terminateSession(session.id)}
                      className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-sm hover:bg-red-200 transition-all"
                    >
                      Terminate
                    </button>
                  )}
                </div>
              ))}
              {activeSessions.filter(s => !s.isCurrent).length > 0 && (
                <button
                  onClick={terminateAllOtherSessions}
                  className="w-full px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition-all"
                >
                  Terminate All Other Sessions
                </button>
              )}
            </div>
          )}
        </div>

        {/* Session Timeout */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Session Timeout</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Auto-logout after inactivity
              </label>
              <select
                value={settings.sessionTimeout}
                onChange={(e) => saveSettings({ sessionTimeout: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={0}>Never</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transaction Limits */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Transaction Limits</h2>
              <p className="text-gray-600">Set daily and per-transaction limits for extra security</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Daily Limit (GHS)</label>
              <input
                type="number"
                min="1"
                placeholder="No limit"
                value={dailyLimitInput}
                onChange={e => setDailyLimitInput(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Per-Transaction Limit (GHS)</label>
              <input
                type="number"
                min="1"
                placeholder="No limit"
                value={perTransactionLimitInput}
                onChange={e => setPerTransactionLimitInput(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          </div>
          {limitError && <div className="text-red-500 text-sm mt-2">{limitError}</div>}
          <div className="flex gap-3 mt-4">
            <button
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
              onClick={handleLimitUpdate}
            >
              Save Limits
            </button>
            <button
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all"
              onClick={handleClearLimits}
            >
              Clear Limits
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">Leave blank for no limit.</div>
        </div>

        {/* Security Alerts */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Security Alerts</h2>
              <p className="text-gray-600">Recent security-related activity and alerts</p>
            </div>
          </div>
          {securityAlerts.length === 0 ? (
            <div className="text-gray-500">No security alerts.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {securityAlerts.map(alert => (
                <li key={alert.id} className={`py-3 flex items-center gap-3 ${alert.read ? 'opacity-60' : ''}`}>
                  <span className="text-2xl">
                    {alert.type === 'new_device' ? '🖥️' : alert.type === 'location' ? '📍' : '⚠️'}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{alert.message}</div>
                    <div className="text-xs text-gray-500">{new Date(alert.timestamp).toLocaleString()}</div>
                  </div>
                  {!alert.read && (
                    <button
                      className="px-3 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold hover:bg-blue-200"
                      onClick={() => markAlertRead(alert.id)}
                    >
                      Mark as read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Login History */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Login History</h2>
              <p className="text-gray-600">Recent logins to your account</p>
            </div>
          </div>
          {activeSessions.length === 0 ? (
            <div className="text-gray-500">No login sessions found.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {activeSessions.map(session => (
                <li key={session.id} className={`py-3 flex items-center gap-3 ${session.isCurrent ? 'font-bold' : ''}`}>
                  <span className="text-2xl">{session.isCurrent ? '🟢' : '🟡'}</span>
                  <div className="flex-1">
                    <div className="text-gray-800">{session.device} - {session.location}</div>
                    <div className="text-xs text-gray-500">IP: {session.ip} | {new Date(session.timestamp).toLocaleString()}</div>
                  </div>
                  {!session.isCurrent && (
                    <button
                      className="px-3 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200"
                      onClick={() => terminateSession(session.id)}
                    >
                      Terminate
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* PIN Setup Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Set Up PIN</h2>
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPin('');
                  setConfirmPin('');
                  setPinError('');
                }}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Enter 4-digit PIN</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="0000"
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-center text-2xl tracking-widest"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm PIN</label>
                <input
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="0000"
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-center text-2xl tracking-widest"
                />
              </div>

              {pinError && (
                <div className="text-red-500 text-sm text-center">{pinError}</div>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={setupPin}
                  className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                >
                  Set PIN
                </button>
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setPin('');
                    setConfirmPin('');
                    setPinError('');
                  }}
                  className="flex-1 px-6 py-3 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 