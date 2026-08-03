/* ========================================
   Header / Navigation Bar Component
   Desktop: sticky top navbar with links
   Mobile: compact top bar + fixed bottom
          tab navigation for easy thumb reach
   ======================================== */

import { useState } from 'react';
import {
  Sun,
  Moon,
  Database,
  LayoutDashboard,
  Upload,
  Eye,
  Download,
  Info,
  Menu,
  X,
} from 'lucide-react';
import type { PageView } from '../types';

interface Props {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentPage: PageView;
  navigateTo: (page: PageView) => void;
}

/** Navigation items shared between desktop and mobile */
const NAV_ITEMS: { page: PageView; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: 'Home', icon: <LayoutDashboard size={20} /> },
  { page: 'upload', label: 'Upload', icon: <Upload size={20} /> },
  { page: 'preview', label: 'Preview', icon: <Eye size={20} /> },
  { page: 'export', label: 'Export', icon: <Download size={20} /> },
  { page: 'about', label: 'About', icon: <Info size={20} /> },
];

export default function Header({ darkMode, toggleDarkMode, currentPage, navigateTo }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (page: PageView) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ===== TOP HEADER BAR ===== */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: darkMode
            ? 'rgba(15, 23, 42, 0.92)'
            : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${darkMode ? 'rgba(148,163,184,0.1)' : 'rgba(37,99,235,0.08)'}`,
          padding: '0 1rem',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '60px',
          }}
        >
          {/* Logo / Brand */}
          <div
            onClick={() => handleNav('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                padding: '0.4rem',
                borderRadius: '9px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
              }}
            >
              <Database size={20} />
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '-0.02em',
              }}
              className="gradient-text"
            >
              Dataset Generator
            </span>
          </div>

          {/* Desktop nav links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.25rem',
            }}
            className="md:!flex"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                style={{
                  background:
                    currentPage === item.page
                      ? darkMode
                        ? 'rgba(37,99,235,0.15)'
                        : 'rgba(37,99,235,0.08)'
                      : 'transparent',
                  color: currentPage === item.page ? '#3b82f6' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: currentPage === item.page ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              style={{
                background: darkMode
                  ? 'linear-gradient(135deg, #1e293b, #334155)'
                  : 'linear-gradient(135deg, #f0f4ff, #dbeafe)',
                border: darkMode ? '1px solid rgba(148,163,184,0.2)' : '1px solid rgba(37,99,235,0.15)',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: darkMode ? '#fbbf24' : '#2563eb',
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Mobile hamburger menu button */}
            <button
              className="md:!hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'flex',
                background: darkMode ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.08)',
                border: 'none',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#3b82f6',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ===== MOBILE DROPDOWN MENU ===== */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 90,
            }}
            className="md:!hidden"
          />
          {/* Menu panel */}
          <div
            className="md:!hidden animate-slideDown"
            style={{
              position: 'fixed',
              top: '60px',
              left: 0,
              right: 0,
              zIndex: 95,
              background: darkMode
                ? 'rgba(15, 23, 42, 0.97)'
                : 'rgba(255, 255, 255, 0.97)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: `1px solid var(--border)`,
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: 'none',
                  background:
                    currentPage === item.page
                      ? darkMode
                        ? 'rgba(37,99,235,0.15)'
                        : 'rgba(37,99,235,0.08)'
                      : 'transparent',
                  color: currentPage === item.page ? '#3b82f6' : 'var(--text)',
                  fontSize: '0.95rem',
                  fontWeight: currentPage === item.page ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                <span style={{ color: currentPage === item.page ? '#3b82f6' : 'var(--text-secondary)' }}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <nav
        className="md:!hidden"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: darkMode
            ? 'rgba(15, 23, 42, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: `1px solid ${darkMode ? 'rgba(148,163,184,0.1)' : 'rgba(37,99,235,0.08)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '60px',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => handleNav(item.page)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                flex: 1,
                padding: '0.4rem 0',
                border: 'none',
                background: 'transparent',
                color: isActive ? '#3b82f6' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                position: 'relative',
              }}
            >
              {/* Active indicator dot */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    width: '20px',
                    height: '3px',
                    borderRadius: '0 0 3px 3px',
                    background: 'linear-gradient(90deg, #2563eb, #06b6d4)',
                  }}
                />
              )}
              <span style={{ transform: isActive ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.2s ease' }}>
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.02em',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
