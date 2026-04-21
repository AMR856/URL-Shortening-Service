'use client';

import { ReactNode } from 'react';
import styles from './Preview.module.css';

interface PreviewProps {
  title?: string;
  children?: ReactNode;
  jsonData?: unknown;
  primaryLink?: string;
  primaryLinkLabel?: string;
  loading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  error?: string;
}

export default function Preview({
  title = 'Preview',
  children,
  jsonData,
  primaryLink,
  primaryLinkLabel,
  loading = false,
  loadingMessage = 'Processing request...',
  emptyMessage = 'No response available yet',
  error,
}: PreviewProps) {
  const hasResult = Boolean(jsonData);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.info}>
          {loading && <span className={styles.badge}>Processing...</span>}
          {error && <span className={`${styles.badge} ${styles.error}`}>Error</span>}
          {!loading && !error && hasResult && (
            <span className={`${styles.badge} ${styles.success}`}>Ready</span>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {error && (
          <div className={styles.errorMessage}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>{loadingMessage}</p>
          </div>
        )}

        {hasResult && !loading && !error && (
          <div className={styles.resultContainer}>
            {primaryLink && (
              <a href={primaryLink} target="_blank" rel="noreferrer" className={styles.resultLink}>
                {primaryLinkLabel || primaryLink}
              </a>
            )}
            <pre className={styles.resultJson}>{JSON.stringify(jsonData, null, 2)}</pre>
          </div>
        )}

        {!hasResult && !loading && !error && (
          <div className={styles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 4h16v16H4z"></path>
              <path d="M8 9h8M8 13h8M8 17h5"></path>
            </svg>
            <p>No response available</p>
            <small>{emptyMessage}</small>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
