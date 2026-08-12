/* ========================================
   Automated Dataset Generation Tool
   Main Application Entry Point
   
   This app allows users to:
   - Upload multiple images (JPG, JPEG, PNG)
   - Automatically label images using AI
     (TensorFlow.js MobileNet model)
   - Manually assign/edit labels
   - Preview the dataset in a table
   - Export as downloadable CSV
   - Toggle dark/light mode
   - Search images by label
   ======================================== */

import { useState, useCallback, useEffect } from 'react';
import type { PageView, ImageItem, Notification as NotificationType } from './types';

/* ---------- Component Imports ---------- */
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import UploadImages from './components/UploadImages';
import DatasetPreview from './components/DatasetPreview';
import ExportDataset from './components/ExportDataset';
import AboutPage from './components/AboutPage';
import NotificationContainer from './components/Notification';

/* ---------- AI Classifier Hook ---------- */
import useImageClassifier from './hooks/useImageClassifier';

export default function App() {
  /* ========================================
     State Management
     ======================================== */

  /** Current page/view being displayed */
  const [currentPage, setCurrentPage] = useState<PageView>('landing');

  /** Uploaded images dataset */
  const [images, setImages] = useState<ImageItem[]>([]);

  /** Dark mode toggle */
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  /** Toast notifications */
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  /** AI Image Classifier (MobileNet via TensorFlow.js) */
  const { modelStatus, statusMessage, classifyImage, loadModel } = useImageClassifier();

  /* ========================================
     Effects
     ======================================== */

  /** Apply dark mode class to html element */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  /* ========================================
     Handlers
     ======================================== */

  /** Toggle dark mode */
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  /** Navigate to a page */
  const navigateTo = useCallback((page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /** Add a toast notification */
  const addNotification = useCallback(
    (message: string, type: NotificationType['type']) => {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
      const notification: NotificationType = { id, message, type };
      setNotifications((prev) => [...prev, notification]);

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  /* ========================================
     Page Rendering
     ======================================== */

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage
            onGetStarted={() => navigateTo('dashboard')}
            darkMode={darkMode}
          />
        );

      case 'dashboard':
        return (
          <Dashboard
            navigateTo={navigateTo}
            images={images}
            darkMode={darkMode}
          />
        );

      case 'upload':
        return (
          <UploadImages
            images={images}
            setImages={setImages}
            addNotification={addNotification}
            darkMode={darkMode}
            modelStatus={modelStatus}
            statusMessage={statusMessage}
            classifyImage={classifyImage}
            loadModel={loadModel}
          />
        );

      case 'preview':
        return <DatasetPreview images={images} darkMode={darkMode} />;

      case 'export':
        return (
          <ExportDataset
            images={images}
            addNotification={addNotification}
            darkMode={darkMode}
          />
        );

      case 'about':
        return <AboutPage darkMode={darkMode} />;

      default:
        return (
          <Dashboard
            navigateTo={navigateTo}
            images={images}
            darkMode={darkMode}
          />
        );
    }
  };

  /* ========================================
     Main Render
     ======================================== */
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg)',
        color: 'var(--text)',
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Toast Notifications */}
      <NotificationContainer notifications={notifications} />

      {/* Show header on all pages except landing */}
      {currentPage !== 'landing' && (
        <Header
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          currentPage={currentPage}
          navigateTo={navigateTo}
        />
      )}

      {/* Landing page has its own dark mode toggle */}
      {currentPage === 'landing' && (
        <button
          onClick={toggleDarkMode}
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            zIndex: 50,
            background: darkMode
              ? 'rgba(30, 41, 59, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: darkMode
              ? '1px solid rgba(148,163,184,0.2)'
              : '1px solid rgba(37,99,235,0.15)',
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: darkMode ? '#fbbf24' : '#2563eb',
            transition: 'all 0.3s ease',
            fontSize: '1.2rem',
          }}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      )}

      {/* Page content */}
      <main style={{ flex: 1 }}>{renderPage()}</main>

      {/* Footer */}
      {currentPage !== 'landing' && (
        <footer
          style={{
            marginTop: 'auto',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            padding: '1.25rem 1.5rem',
            transition: 'all 0.3s ease',
          }}
          className="pb-16 md:pb-5"
        >
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
            className="sm:!flex-row"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
              <span>© {new Date().getFullYear()} Automated Dataset Generation Tool</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                opacity: 0.85,
              }}
            >
              <span>AI-Powered with MobileNet v2 & TensorFlow.js</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
