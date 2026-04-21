'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Layout from './components/Layout';
import Auth from './components/Auth';
import SettingsCard, { SettingValue } from './components/SettingsCard';
import AuthModal from './components/AuthModal';
import { authService } from './services/authService';
import { urlService, UrlPayload } from './services/urlService';
import styles from './page.module.css';

const getEmailFromAuthPayload = (data: unknown): string => {
  if (!data || typeof data !== 'object') {
    return '';
  }

  const payload = data as { email?: unknown; data?: { email?: unknown } };

  if (typeof payload.email === 'string') {
    return payload.email;
  }

  if (typeof payload.data?.email === 'string') {
    return payload.data.email;
  }

  return '';
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [shortCode, setShortCode] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [updateShortCode, setUpdateShortCode] = useState('');
  const [updatedUrl, setUpdatedUrl] = useState('');
  const [resolvedOriginalUrl, setResolvedOriginalUrl] = useState('');
  const [statsResult, setStatsResult] = useState<UrlPayload | null>(null);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserEmail('');
  };

  const runOperation = async (
    label: string,
    operation: () => Promise<unknown>,
  ) => {
    setIsProcessing(true);

    try {
      const result = await operation();
      if (result && typeof result === 'object' && 'shortCode' in result) {
        const code = (result as { shortCode?: unknown }).shortCode;
        if (typeof code === 'string') {
          setShortCode(code);
          setUpdateShortCode(code);
        }
      }

      toast.success(`${label} successful`);
    } catch (error) {
      const message = error instanceof Error ? error.message : `Failed to ${label.toLowerCase()}`;
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateShortUrl = async () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!originalUrl.trim()) {
      toast.error('Please provide a URL to shorten');
      return;
    }

    await runOperation('Create Short URL', () => urlService.createShortUrl(originalUrl.trim()));
  };

  const handleResolveUrl = async () => {
    if (!shortCode.trim()) {
      toast.error('Please enter a short code');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await urlService.resolveShortUrl(shortCode.trim());
      setResolvedOriginalUrl(result.url);
      setShortCode(result.shortCode);
      setUpdateShortCode(result.shortCode);
      toast.success('Resolve URL successful');
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resolve url';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGetStats = async () => {
    if (!shortCode.trim()) {
      toast.error('Please enter a short code');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await urlService.getStats(shortCode.trim());
      setStatsResult(result);
      setResolvedOriginalUrl(result.url);
      toast.success('Get URL Stats successful');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get url stats';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateUrl = async () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    const targetShortCode = updateShortCode.trim() || shortCode.trim();

    if (!targetShortCode || !updatedUrl.trim()) {
      toast.error('Please provide short code and new URL');
      return;
    }

    await runOperation('Update URL', () => urlService.updateShortUrl(targetShortCode, updatedUrl.trim()));
  };

  const handleDeleteUrl = async () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!shortCode.trim()) {
      toast.error('Please enter a short code');
      return;
    }

    await runOperation('Delete URL', async () => {
      await urlService.deleteShortUrl(shortCode.trim());
      return {
        id: 0,
        url: '',
        shortCode: shortCode.trim(),
        clicks: 0,
      };
    });
  };

  const createSettings: SettingValue[] = [
    {
      label: 'Original URL',
      value: originalUrl,
      onChange: (val) => setOriginalUrl(val as string),
    },
  ];

  const lookupSettings: SettingValue[] = [
    {
      label: 'Short Code',
      value: shortCode,
      onChange: (val) => setShortCode(val as string),
    },
  ];

  const updateSettings: SettingValue[] = [
    {
      label: 'Short Code To Update',
      value: updateShortCode,
      onChange: (val) => setUpdateShortCode(val as string),
    },
    {
      label: 'New Original URL',
      value: updatedUrl,
      onChange: (val) => setUpdatedUrl(val as string),
    },
  ];

  return (
    <>
      <Layout
        topBar={
          <div className={styles.topBarContent}>
            <div className={styles.logo}>
              <h1 className={styles.appTitle}>URL Shortening Dashboard</h1>
            </div>
            <Auth
              isLoggedIn={isLoggedIn}
              userEmail={userEmail}
              onLogin={() => setIsAuthModalOpen(true)}
              onLogout={handleLogout}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          </div>
        }
        mainContent={
          <div className={styles.sidebarContent}>
            {!isLoggedIn && (
              <div className={styles.authPrompt}>
                <p>Login enables create, update, and delete actions.</p>
              </div>
            )}

            <SettingsCard
              title="Create Short URL"
              description="Authenticated endpoint: POST /shorten"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2v20M2 12h20" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              settings={createSettings}
            />

            <button
              onClick={handleCreateShortUrl}
              disabled={isProcessing}
              className={styles.transformButton}
            >
              {isProcessing ? 'Processing...' : 'Create Short URL'}
            </button>

            <SettingsCard
              title="Lookup & Stats"
              description="Public endpoints: GET /shorten/:shortCode and /stats"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <path d="m21 21-4.3-4.3" strokeWidth="2" />
                </svg>
              }
              settings={lookupSettings}
            />

            <div className={styles.actionGroup}>
              <button onClick={handleResolveUrl} disabled={isProcessing} className={styles.secondaryButton}>
                Resolve URL
              </button>
              <button onClick={handleGetStats} disabled={isProcessing} className={styles.secondaryButton}>
                Get Stats
              </button>
            </div>

            {resolvedOriginalUrl && (
              <div className={styles.resultCard}>
                <h3 className={styles.resultTitle}>Resolved Original URL</h3>
                <a
                  href={resolvedOriginalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.resultLink}
                >
                  {resolvedOriginalUrl}
                </a>
              </div>
            )}

            {statsResult && (
              <div className={styles.resultCard}>
                <h3 className={styles.resultTitle}>URL Stats</h3>
                <pre className={styles.resultJson}>{JSON.stringify(statsResult, null, 2)}</pre>
              </div>
            )}

            <SettingsCard
              title="Update Short URL"
              description="Authenticated endpoint: PUT /shorten/:shortCode"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 20h9" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" strokeWidth="2" />
                </svg>
              }
              settings={updateSettings}
            />

            <div className={styles.actionGroup}>
              <button onClick={handleUpdateUrl} disabled={isProcessing} className={styles.transformButton}>
                Update URL
              </button>
              <button onClick={handleDeleteUrl} disabled={isProcessing} className={styles.destructiveButton}>
                Delete URL
              </button>
            </div>
          </div>
        }
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(data) => {
          setIsLoggedIn(true);
          setUserEmail(getEmailFromAuthPayload(data));
        }}
        onRegisterSuccess={() => undefined}
      />
    </>
  );
}
