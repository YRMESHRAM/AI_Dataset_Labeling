/* ========================================
   About Project Page
   Mobile-optimized layout
   ======================================== */

import {
  Database, Upload, Tag, Eye, Download, BarChart3,
  Search, Moon, Smartphone, Zap, Shield, Code, Heart, Brain,
} from 'lucide-react';

interface Props { darkMode: boolean; }

export default function AboutPage({ darkMode }: Props) {
  const features = [
    { icon: <Brain size={20} />, title: 'AI Auto-Labeling', desc: 'Classify images with MobileNet — entirely in your browser.', gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)' },
    { icon: <Upload size={20} />, title: 'Multi-Image Upload', desc: 'Drag & drop or browse to upload JPG/PNG images.', gradient: 'linear-gradient(135deg, #2563eb, #3b82f6)' },
    { icon: <Tag size={20} />, title: 'Manual Labeling', desc: 'Override AI labels or type your own.', gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)' },
    { icon: <Eye size={20} />, title: 'Dataset Preview', desc: 'View images in a table with AI vs manual sources.', gradient: 'linear-gradient(135deg, #10b981, #34d399)' },
    { icon: <Download size={20} />, title: 'CSV Export', desc: 'Export with labels, confidence scores, and metadata.', gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
    { icon: <BarChart3 size={20} />, title: 'Statistics', desc: 'Track images, labels, and dataset size.', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)' },
    { icon: <Search size={20} />, title: 'Search & Filter', desc: 'Find images by label or file name.', gradient: 'linear-gradient(135deg, #14b8a6, #5eead4)' },
    { icon: <Moon size={20} />, title: 'Dark Mode', desc: 'Toggle between light and dark themes.', gradient: 'linear-gradient(135deg, #6366f1, #818cf8)' },
    { icon: <Smartphone size={20} />, title: 'Mobile Ready', desc: 'Fully responsive on all devices.', gradient: 'linear-gradient(135deg, #f97316, #fb923c)' },
  ];

  const techStack = [
    { name: 'TensorFlow.js', desc: 'In-browser ML engine' },
    { name: 'MobileNet v2', desc: '1000+ image classes' },
    { name: 'React + TS', desc: 'UI framework' },
    { name: 'Tailwind CSS', desc: 'Utility styling' },
    { name: 'Lucide Icons', desc: 'Modern icons' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.25rem 1rem 2.5rem' }}>
      {/* Header */}
      <div className="animate-fadeIn" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', margin: '0 auto 1.25rem', boxShadow: '0 6px 25px rgba(37,99,235,0.3)' }}>
          <Database size={26} />
        </div>
        <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: '0.6rem' }}>
          <span className="gradient-text">About This Project</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.85rem, 2vw, 1.05rem)', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6, padding: '0 0.5rem' }}>
          Uses <strong>TensorFlow.js MobileNet</strong> to automatically classify and label images — all locally in your browser. No server, no API keys.
        </p>
      </div>

      {/* AI Banner */}
      <div className="animate-fadeIn" style={{
        background: darkMode ? 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.08))' : 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(99,102,241,0.04))',
        borderRadius: '16px', border: `1px solid ${darkMode ? 'rgba(139,92,246,0.2)' : 'rgba(139,92,246,0.15)'}`,
        padding: 'clamp(1rem, 3vw, 1.75rem)', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem',
      }}>
        <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', padding: '0.75rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
          <Brain size={26} />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h3 style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontWeight: 700, marginBottom: '0.3rem' }}>Powered by MobileNet v2</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.8rem, 1.5vw, 0.88rem)', lineHeight: 1.5 }}>
            Classifies images into <strong>1,000+ categories</strong>. Runs entirely in your browser using WebGL — no data leaves your device.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="animate-fadeIn delay-100" style={{ opacity: 0, background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', padding: 'clamp(1rem, 3vw, 1.75rem)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Zap size={20} style={{ color: '#f59e0b' }} /> How It Works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
          {[
            { s: '1', t: 'Load AI', d: 'Download MobileNet model' },
            { s: '2', t: 'Upload', d: 'Add your images' },
            { s: '3', t: 'Auto-Label', d: 'AI classifies each image' },
            { s: '4', t: 'Review', d: 'Edit labels as needed' },
            { s: '5', t: 'Export', d: 'Download as CSV' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '1rem 0.5rem', borderRadius: '12px', background: darkMode ? 'rgba(37,99,235,0.05)' : 'rgba(37,99,235,0.03)', border: '1px solid var(--border)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg, #2563eb, #06b6d4)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', margin: '0 auto 0.5rem' }}>{item.s}</div>
              <h4 style={{ fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.2rem' }}>{item.t}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', lineHeight: 1.4 }}>{item.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="animate-fadeIn delay-200" style={{ opacity: 0, marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Shield size={20} style={{ color: '#3b82f6' }} /> Features
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', padding: '1rem', transition: 'all 0.3s ease' }}>
              <div style={{ background: f.gradient, width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '0.65rem' }}>{f.icon}</div>
              <h4 style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{f.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: 1.4 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div className="animate-fadeIn delay-300" style={{ opacity: 0, background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', padding: 'clamp(1rem, 3vw, 1.75rem)', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Code size={20} style={{ color: '#8b5cf6' }} /> Tech Stack
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.65rem' }}>
          {techStack.map((t, i) => (
            <div key={i} style={{ background: darkMode ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.04)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.75rem' }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.15rem' }}>{t.name}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
