/* ========================================
   Dashboard Component
   Responsive navigation cards & stats
   Mobile: 2-col grid, compact cards
   ======================================== */

import {
  Upload,
  Eye,
  Download,
  Info,
  Image,
  Tag,
  HardDrive,
  BarChart3,
  Brain,
} from 'lucide-react';
import type { PageView, ImageItem } from '../types';

interface Props {
  navigateTo: (page: PageView) => void;
  images: ImageItem[];
  darkMode: boolean;
}

export default function Dashboard({ navigateTo, images, darkMode }: Props) {
  const totalImages = images.length;
  const totalLabels = images.filter((img) => img.label.trim() !== '').length;
  const aiLabels = images.filter((img) => img.autoLabeled).length;
  const totalSize = images.reduce((sum, img) => sum + img.size, 0);

  function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  const navCards = [
    {
      title: 'Upload Images',
      desc: 'Upload & auto-label with AI',
      icon: <Upload size={24} />,
      gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      shadow: 'rgba(37,99,235,0.25)',
      page: 'upload' as PageView,
    },
    {
      title: 'Dataset Preview',
      desc: 'View labeled images in table',
      icon: <Eye size={24} />,
      gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      shadow: 'rgba(139,92,246,0.25)',
      page: 'preview' as PageView,
    },
    {
      title: 'Export Dataset',
      desc: 'Download dataset as CSV',
      icon: <Download size={24} />,
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      shadow: 'rgba(16,185,129,0.25)',
      page: 'export' as PageView,
    },
    {
      title: 'About Project',
      desc: 'Learn about this AI tool',
      icon: <Info size={24} />,
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      shadow: 'rgba(245,158,11,0.25)',
      page: 'about' as PageView,
    },
  ];

  const statCards = [
    { label: 'Images', value: totalImages, icon: <Image size={20} />, color: '#3b82f6', bg: darkMode ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)' },
    { label: 'Labels', value: totalLabels, icon: <Tag size={20} />, color: '#10b981', bg: darkMode ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.08)' },
    { label: 'AI Labels', value: aiLabels, icon: <Brain size={20} />, color: '#8b5cf6', bg: darkMode ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.08)' },
    { label: 'Size', value: formatSize(totalSize), icon: <HardDrive size={20} />, color: '#f59e0b', bg: darkMode ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.08)' },
  ];

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.5rem 1rem 2.5rem',
      }}
    >
      {/* Page title */}
      <div className="animate-fadeIn" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 800, marginBottom: '0.4rem' }}>
          <span className="gradient-text">Dashboard</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
          Upload images and let AI automatically label them.
        </p>
      </div>

      {/* Statistics — 2x2 on mobile, 4 across on desktop */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
          marginBottom: '2rem',
        }}
        className="sm:!grid-cols-4"
      >
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="animate-fadeIn"
            style={{
              animationDelay: `${i * 0.08}s`,
              opacity: 0,
              background: 'var(--bg-card)',
              borderRadius: '14px',
              padding: '1rem',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                background: stat.bg,
                color: stat.color,
                padding: '0.55rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {stat.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 800, lineHeight: 1.2 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }} className="animate-fadeIn">
        <BarChart3 size={18} style={{ color: 'var(--primary-light)' }} />
        <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Quick Actions</h2>
      </div>

      {/* Navigation cards — 2 cols on mobile, auto-fit on desktop */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem',
        }}
        className="sm:!grid-cols-2 md:!grid-cols-4"
      >
        {navCards.map((card, i) => (
          <div
            key={i}
            className="animate-fadeIn"
            style={{
              animationDelay: `${0.15 + i * 0.08}s`,
              opacity: 0,
              background: 'var(--bg-card)',
              borderRadius: '16px',
              padding: 'clamp(1rem, 3vw, 1.75rem)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onClick={() => navigateTo(card.page)}
          >
            {/* Background decoration */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: card.gradient,
                opacity: 0.08,
              }}
            />
            {/* Icon */}
            <div
              style={{
                background: card.gradient,
                padding: '0.65rem',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                marginBottom: '0.75rem',
                boxShadow: `0 4px 12px ${card.shadow}`,
              }}
            >
              {card.icon}
            </div>
            <h3 style={{ fontSize: 'clamp(0.85rem, 2vw, 1.05rem)', fontWeight: 700, marginBottom: '0.3rem' }}>
              {card.title}
            </h3>
            <p style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
