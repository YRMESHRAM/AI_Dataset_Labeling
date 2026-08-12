/* ========================================
   Export Dataset Component
   Mobile: stacked layout, full-width button
   ======================================== */

import {
  Download, FileSpreadsheet, Image, Tag, HardDrive,
  CheckCircle, AlertCircle, FileText, Brain, BarChart3,
} from 'lucide-react';
import type { ImageItem } from '../types';

interface Props {
  images: ImageItem[];
  addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  darkMode: boolean;
}

export default function ExportDataset({ images, addNotification, darkMode }: Props) {
  const totalImages = images.length;
  const labeledImages = images.filter((img) => img.label.trim() !== '').length;
  const unlabeledImages = totalImages - labeledImages;
  const aiLabeledCount = images.filter((img) => img.autoLabeled).length;
  const manualLabeledCount = images.filter((img) => img.label.trim() && !img.autoLabeled).length;
  const totalSize = images.reduce((sum, img) => sum + img.size, 0);

  function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  const exportCSV = () => {
    if (images.length === 0) { addNotification('No images to export!', 'warning'); return; }
    const headers = ['Image Name', 'Label', 'Label Source', 'AI Confidence', 'File Size'];
    const rows = images.map((img) => [
      `"${img.name}"`,
      `"${img.label || 'N/A'}"`,
      `"${img.autoLabeled ? 'AI (MobileNet)' : img.label ? 'Manual' : 'None'}"`,
      `"${img.autoLabeled && img.predictions.length > 0 ? (img.predictions[0].probability * 100).toFixed(1) + '%' : 'N/A'}"`,
      `"${img.sizeFormatted}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dataset_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addNotification('CSV downloaded!', 'success');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.25rem 1rem 2.5rem' }}>
      <div className="animate-fadeIn" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
          <span className="gradient-text">Export Dataset</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.82rem, 2vw, 1rem)' }}>
          Download your dataset as CSV with AI labels.
        </p>
      </div>

      {images.length === 0 ? (
        <div className="animate-fadeIn" style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <AlertCircle size={48} style={{ color: 'var(--text-secondary)', opacity: 0.3, marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Nothing to Export</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Upload images first.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }} className="md:!grid-cols-2">
          {/* Export card */}
          <div className="animate-fadeIn" style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', padding: 'clamp(1.25rem, 3vw, 2rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1.25rem', boxShadow: '0 6px 25px rgba(16,185,129,0.3)' }}>
              <FileSpreadsheet size={28} />
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.6rem' }}>Export as CSV</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Includes AI labels, confidence scores, and metadata.
            </p>
            {/* Columns */}
            <div style={{ width: '100%', background: darkMode ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.04)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { icon: <Image size={14} />, text: 'Image Name' },
                { icon: <Tag size={14} />, text: 'Label' },
                { icon: <Brain size={14} />, text: 'Label Source' },
                { icon: <BarChart3 size={14} />, text: 'AI Confidence' },
                { icon: <HardDrive size={14} />, text: 'File Size' },
              ].map((col, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0', fontSize: '0.82rem', fontWeight: 500, borderBottom: i < 4 ? `1px solid ${darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` : 'none' }}>
                  <span style={{ color: '#10b981' }}>{col.icon}</span>{col.text}
                </div>
              ))}
            </div>
            {/* Button */}
            <button onClick={exportCSV}
              style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', color: 'white', border: 'none', padding: '0.85rem 1.5rem', borderRadius: '12px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 6px 20px rgba(16,185,129,0.3)', width: '100%', justifyContent: 'center', fontFamily: 'inherit', transition: 'all 0.3s ease' }}>
              <Download size={18} /> Download CSV
            </button>
          </div>

          {/* Summary card */}
          <div className="animate-fadeIn delay-200" style={{ opacity: 0, background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', padding: 'clamp(1.25rem, 3vw, 2rem)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={18} style={{ color: '#3b82f6' }} /> Export Summary
            </h3>
            {[
              { label: 'Total Images', value: totalImages, icon: <Image size={16} />, color: '#3b82f6' },
              { label: 'AI-Labeled', value: aiLabeledCount, icon: <Brain size={16} />, color: '#8b5cf6' },
              { label: 'Manual Labels', value: manualLabeledCount, icon: <Tag size={16} />, color: '#06b6d4' },
              { label: 'Unlabeled', value: unlabeledImages, icon: <AlertCircle size={16} />, color: unlabeledImages > 0 ? '#f59e0b' : '#10b981' },
              { label: 'Total Labeled', value: labeledImages, icon: <CheckCircle size={16} />, color: '#10b981' },
              { label: 'Dataset Size', value: formatSize(totalSize), icon: <HardDrive size={16} />, color: '#f59e0b' },
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.75rem', borderRadius: '10px', marginBottom: '0.4rem', background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ color: stat.color }}>{stat.icon}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{stat.label}</span>
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: stat.color }}>{stat.value}</span>
              </div>
            ))}

            {/* Progress bar */}
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.78rem', fontWeight: 500 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Labeling Progress</span>
                <span style={{ color: '#3b82f6' }}>{totalImages > 0 ? Math.round((labeledImages / totalImages) * 100) : 0}%</span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex' }}>
                <div style={{ height: '100%', width: `${totalImages > 0 ? (aiLabeledCount / totalImages) * 100 : 0}%`, background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)', transition: 'width 0.5s ease' }} />
                <div style={{ height: '100%', width: `${totalImages > 0 ? (manualLabeledCount / totalImages) * 100 : 0}%`, background: 'linear-gradient(90deg, #2563eb, #3b82f6)', transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: '#8b5cf6', display: 'inline-block' }} /> AI
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: '#3b82f6', display: 'inline-block' }} /> Manual
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
