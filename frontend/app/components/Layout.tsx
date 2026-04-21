'use client';

import { ReactNode } from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
  topBar: ReactNode;
  mainContent: ReactNode;
}

export default function Layout({ topBar, mainContent }: LayoutProps) {
  return (
    <div className={styles.layout}>
      {/* Top Bar */}
      <header className={styles.topBar}>{topBar}</header>

      {/* Main Content */}
      <div className={styles.main}>
        <section className={styles.mainContent}>{mainContent}</section>
      </div>
    </div>
  );
}
