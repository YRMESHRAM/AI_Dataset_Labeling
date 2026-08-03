/* ========================================
   Landing Page Component
   Fully responsive hero with animated
   title, description and CTA button
   ======================================== */

import { Database, Sparkles, Layers, ArrowRight, Image, Tag, Download, Brain } from 'lucide-react';

interface Props {
  onGetStarted: () => void;
  darkMode: boolean;
}

export default function LandingPage({ onGetStarted, darkMode }: Props) {
  return (
    <div
      style={{
        minHeight: '100dvh', /* Dynamic viewport height for mobile, falls back to 100vh */
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: darkMode
          ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)'
          : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 25%, #c7d2fe 50%, #bfdbfe 75%, #ecfeff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background orbs (hidden on very small screens for perf) */}
      <div
        className="hidden sm:block"
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: darkMode
            ? 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div
        className="hidden sm:block"
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: darkMode
            ? 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      {/* Main content */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '800px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
        className="animate-fadeIn"
      >
        {/* Icon cluster */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          {[
            { bg: 'linear-gradient(135deg, #2563eb, #3b82f6)', shadow: 'rgba(37,99,235,0.3)', Icon: Database },
            { bg: 'linear-gradient(135deg, #06b6d4, #22d3ee)', shadow: 'rgba(6,182,212,0.3)', Icon: Sparkles },
            { bg: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', shadow: 'rgba(139,92,246,0.3)', Icon: Layers },
          ].map(({ bg, shadow, Icon }, i) => (
            <div
              key={i}
              className="animate-float"
              style={{
                background: bg,
                padding: '0.75rem',
                borderRadius: '14px',
                color: 'white',
                boxShadow: `0 6px 20px ${shadow}`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            >
              <Icon size={28} />
            </div>
          ))}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(1.75rem, 6vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            letterSpacing: '-0.02em',
          }}
        >
          <span className="gradient-text">Automated Dataset</span>
          <br />
          <span style={{ color: 'var(--text)' }}>Generation Tool</span>
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: '2rem',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '0 0.5rem',
          }}
        >
          Upload images and let <strong>AI automatically label them</strong> using MobileNet —
          preview your dataset, edit labels, and export as CSV. Build AI-ready datasets in minutes.
        </p>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
            color: 'white',
            border: 'none',
            padding: '0.9rem 2.25rem',
            borderRadius: '14px',
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 30px rgba(37,99,235,0.35)',
          }}
        >
          Get Started
          <ArrowRight size={20} />
        </button>

        {/* Feature pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.6rem',
            marginTop: '2.5rem',
            padding: '0 0.5rem',
          }}
        >
          {[
            { icon: <Brain size={14} />, text: 'AI Auto-Labeling' },
            { icon: <Image size={14} />, text: 'Multi-Upload' },
            { icon: <Tag size={14} />, text: 'Manual Override' },
            { icon: <Download size={14} />, text: 'CSV Export' },
            { icon: <Sparkles size={14} />, text: 'Live Preview' },
          ].map((feature, i) => (
            <div
              key={i}
              className="animate-fadeIn"
              style={{
                animationDelay: `${0.3 + i * 0.1}s`,
                opacity: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '50px',
                background: darkMode ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${darkMode ? 'rgba(148,163,184,0.15)' : 'rgba(37,99,235,0.12)'}`,
                color: 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ color: 'var(--primary-light)' }}>{feature.icon}</span>
              {feature.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
