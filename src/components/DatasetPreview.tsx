/* ========================================
   Dataset Preview Component
   Desktop: full data table
   Mobile: stacked card layout for each row
   ======================================== */

import { useState } from 'react';
import {
  Eye,
  Search,
  Image as ImageIcon,
  Tag,
  HardDrive,
  Hash,
  AlertCircle,
  Brain,
  Loader,
} from 'lucide-react';
import type { ImageItem } from '../types';

interface Props {
  images: ImageItem[];
  darkMode: boolean;
}

export default function DatasetPreview({ images, darkMode }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredImages = images.filter(
    (img) =>
      img.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const aiLabeled = images.filter((img) => img.autoLabeled).length;
  const manualLabeled = images.filter((img) => img.label && !img.autoLabeled).length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.25rem 1rem 2.5rem' }}>
      {/* Header */}
      <div className="animate-fadeIn" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
          <span className="gradient-text">Dataset Preview</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.82rem, 2vw, 1rem)' }}>
          View all uploaded images and their labels.
        </p>
      </div>

      {images.length === 0 ? (
        <div className="animate-fadeIn" style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <AlertCircle size={48} style={{ color: 'var(--text-secondary)', opacity: 0.3, marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>No Images in Dataset</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Upload images first.</p>
        </div>
      ) : (
        <>
          {/* Search + stats */}
          <div className="animate-slideDown" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.5rem 0.75rem', flex: '1', minWidth: '150px' }}>
              <Search size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', background: 'transparent', color: 'var(--text)', fontSize: '0.85rem', width: '100%', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {aiLabeled > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '50px', background: darkMode ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.08)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <Brain size={11} /> {aiLabeled} AI
                </span>
              )}
              {manualLabeled > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '50px', background: darkMode ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.08)', color: '#3b82f6', border: '1px solid rgba(37,99,235,0.2)' }}>
                  <Tag size={11} /> {manualLabeled} Manual
                </span>
              )}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Eye size={14} /> {filteredImages.length}/{images.length}
              </span>
            </div>
          </div>

          {/* ===== DESKTOP TABLE (hidden on mobile) ===== */}
          <div className="hidden md:block animate-fadeIn" style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '650px' }}>
                <thead>
                  <tr style={{ background: darkMode ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.04)', borderBottom: '1px solid var(--border)' }}>
                    {[
                      { icon: <Hash size={13} />, label: 'S.No' },
                      { icon: <ImageIcon size={13} />, label: 'Preview' },
                      { icon: <ImageIcon size={13} />, label: 'Image Name' },
                      { icon: <Tag size={13} />, label: 'Label' },
                      { icon: <Brain size={13} />, label: 'Source' },
                      { icon: <HardDrive size={13} />, label: 'File Size' },
                    ].map((col, i) => (
                      <th key={i} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ color: '#3b82f6' }}>{col.icon}</span>{col.label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredImages.map((img, index) => (
                    <tr key={img.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s ease' }}>
                      <td style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{index + 1}</td>
                      <td style={{ padding: '0.65rem 1rem' }}>
                        <img src={img.preview} alt={img.name} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '7px', border: '1px solid var(--border)' }} />
                      </td>
                      <td style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', fontWeight: 500, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={img.name}>{img.name}</td>
                      <td style={{ padding: '0.65rem 1rem' }}>
                        {img.classifying ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#8b5cf6', fontSize: '0.78rem' }}>
                            <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...
                          </span>
                        ) : img.label ? (
                          <span style={{ background: img.autoLabeled ? (darkMode ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.08)') : (darkMode ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.08)'), color: img.autoLabeled ? '#8b5cf6' : '#3b82f6', padding: '0.25rem 0.65rem', borderRadius: '7px', fontSize: '0.78rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            {img.autoLabeled ? <Brain size={11} /> : <Tag size={11} />}{img.label}
                          </span>
                        ) : <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontStyle: 'italic' }}>No label</span>}
                      </td>
                      <td style={{ padding: '0.65rem 1rem' }}>
                        {img.autoLabeled ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.72rem', fontWeight: 600, padding: '0.18rem 0.45rem', borderRadius: '5px', background: darkMode ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.06)', color: '#8b5cf6' }}>
                            <Brain size={10} /> AI {img.predictions.length > 0 && `(${(img.predictions[0].probability * 100).toFixed(0)}%)`}
                          </span>
                        ) : img.label ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.72rem', fontWeight: 600, padding: '0.18rem 0.45rem', borderRadius: '5px', background: darkMode ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.06)', color: '#3b82f6' }}>
                            <Tag size={10} /> Manual
                          </span>
                        ) : <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>—</span>}
                      </td>
                      <td style={{ padding: '0.65rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{img.sizeFormatted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredImages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem', color: 'var(--text-secondary)' }}>
                <Search size={36} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                <p style={{ fontWeight: 600 }}>No matches found</p>
              </div>
            )}
          </div>

          {/* ===== MOBILE CARD LIST (hidden on desktop) ===== */}
          <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredImages.length === 0 ? (
              <div className="animate-fadeIn" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                <Search size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>No matches</p>
              </div>
            ) : (
              filteredImages.map((img, index) => (
                <div
                  key={img.id}
                  className="animate-fadeIn"
                  style={{
                    animationDelay: `${Math.min(index * 0.04, 0.3)}s`, opacity: 0,
                    background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow)', overflow: 'hidden',
                  }}
                >
                  {/* Card header with thumbnail */}
                  <div style={{ display: 'flex', gap: '0.75rem', padding: '0.85rem', alignItems: 'center' }}>
                    {/* Number */}
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', width: '22px', textAlign: 'center', flexShrink: 0 }}>
                      {index + 1}
                    </span>
                    {/* Thumbnail */}
                    <img src={img.preview} alt={img.name}
                      style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '9px', border: '1px solid var(--border)', flexShrink: 0 }} />
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.2rem' }} title={img.name}>
                        {img.name}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {/* Label badge */}
                        {img.classifying ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#8b5cf6', fontSize: '0.72rem', fontWeight: 500 }}>
                            <Loader size={11} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing...
                          </span>
                        ) : img.label ? (
                          <span style={{
                            background: img.autoLabeled ? (darkMode ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.08)') : (darkMode ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.08)'),
                            color: img.autoLabeled ? '#8b5cf6' : '#3b82f6',
                            padding: '0.15rem 0.5rem', borderRadius: '5px', fontSize: '0.72rem', fontWeight: 600,
                            display: 'inline-flex', alignItems: 'center', gap: '0.2rem', maxWidth: '120px',
                          }}>
                            {img.autoLabeled ? <Brain size={10} /> : <Tag size={10} />}
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.label}</span>
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No label</span>
                        )}
                        {/* Size */}
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{img.sizeFormatted}</span>
                        {/* Source badge */}
                        {img.autoLabeled && (
                          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#8b5cf6', background: darkMode ? 'rgba(139,92,246,0.12)' : 'rgba(139,92,246,0.06)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                            AI {img.predictions.length > 0 && `${(img.predictions[0].probability * 100).toFixed(0)}%`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
