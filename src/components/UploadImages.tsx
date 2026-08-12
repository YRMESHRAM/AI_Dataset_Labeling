import { useCallback, useRef, useState } from 'react';
import {
  Upload,
  X,
  Trash2,
  Tag,
  ImagePlus,
  Search,
  AlertTriangle,
  Sparkles,
  Loader,
  CheckCircle,
  Zap,
  Brain,
  RotateCcw,
} from 'lucide-react';
import type { ImageItem } from '../types';
import type { ModelStatus } from '../hooks/useImageClassifier';

interface Props {
  images: ImageItem[];
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
  addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  darkMode: boolean;
  modelStatus: ModelStatus;
  statusMessage: string;
  classifyImage: (el: HTMLImageElement | HTMLCanvasElement) => Promise<{ className: string; probability: number }[]>;
  loadModel: () => Promise<void>;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export default function UploadImages({
  images, setImages, addNotification, darkMode,
  modelStatus, statusMessage, classifyImage, loadModel,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoLabelEnabled, setAutoLabelEnabled] = useState(true);
  const [classifyingAll, setClassifyingAll] = useState(false);

  const labelSuggestions = ['Cat', 'Dog', 'Car', 'Tree', 'Person', 'Building', 'Animal', 'Food'];

  /* ---------- Classify a single image ---------- */
  const classifySingleImage = useCallback(
    async (imageId: string, dataUrl: string) => {
      if (modelStatus !== 'ready') return;
      setImages((prev) => prev.map((img) => img.id === imageId ? { ...img, classifying: true } : img));
      try {
        const imgEl = new Image();
        imgEl.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          imgEl.onload = () => resolve();
          imgEl.onerror = reject;
          imgEl.src = dataUrl;
        });
        const predictions = await classifyImage(imgEl);
        if (predictions.length > 0) {
          const topLabel = predictions[0].className.split(',')[0].trim().replace(/\b\w/g, (l) => l.toUpperCase());
          setImages((prev) => prev.map((img) =>
            img.id === imageId ? { ...img, label: topLabel, predictions, classifying: false, autoLabeled: true } : img
          ));
        } else {
          setImages((prev) => prev.map((img) => img.id === imageId ? { ...img, classifying: false } : img));
        }
      } catch {
        setImages((prev) => prev.map((img) => img.id === imageId ? { ...img, classifying: false } : img));
      }
    },
    [modelStatus, classifyImage, setImages]
  );

  /* ---------- Process files ---------- */
  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const fileArray = Array.from(files);
      let validCount = 0;
      fileArray.forEach((file) => {
        if (!validTypes.includes(file.type)) {
          addNotification(`"${file.name}" — unsupported format`, 'warning');
          return;
        }
        validCount++;
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const newId = uid();
          const newImage: ImageItem = {
            id: newId, file, name: file.name, size: file.size,
            sizeFormatted: formatFileSize(file.size), label: '', preview: dataUrl,
            uploadedAt: new Date(), classifying: false, predictions: [], autoLabeled: false,
          };
          setImages((prev) => [...prev, newImage]);
          if (autoLabelEnabled && modelStatus === 'ready') {
            setTimeout(() => classifySingleImage(newId, dataUrl), 100);
          }
        };
        reader.readAsDataURL(file);
      });
      if (validCount > 0) {
        setTimeout(() => {
          addNotification(
            `${validCount} image${validCount > 1 ? 's' : ''} uploaded${autoLabelEnabled && modelStatus === 'ready' ? ' — AI labeling...' : '!'}`,
            'success'
          );
        }, 200);
      }
    },
    [setImages, addNotification, autoLabelEnabled, modelStatus, classifySingleImage]
  );

  /* ---------- Classify all ---------- */
  const classifyAllImages = useCallback(async () => {
    if (modelStatus !== 'ready') { addNotification('Load the AI model first', 'warning'); return; }
    const unlabeled = images.filter((img) => !img.label.trim());
    if (unlabeled.length === 0) { addNotification('All images already labeled!', 'info'); return; }
    setClassifyingAll(true);
    addNotification(`Auto-labeling ${unlabeled.length} image${unlabeled.length > 1 ? 's' : ''}...`, 'info');
    for (const img of unlabeled) {
      await classifySingleImage(img.id, img.preview);
      await new Promise((r) => setTimeout(r, 50));
    }
    setClassifyingAll(false);
    addNotification('AI auto-labeling complete!', 'success');
  }, [images, modelStatus, classifySingleImage, addNotification]);

  const reclassifyImage = useCallback(
    (img: ImageItem) => {
      if (modelStatus !== 'ready') { addNotification('Load the AI model first', 'warning'); return; }
      classifySingleImage(img.id, img.preview);
    },
    [modelStatus, classifySingleImage, addNotification]
  );

  /* ---------- Drag & Drop ---------- */
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  }, [processFiles]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) { processFiles(e.target.files); e.target.value = ''; }
  };

  const deleteImage = (id: string) => { setImages((prev) => prev.filter((img) => img.id !== id)); addNotification('Image removed', 'info'); };
  const clearAll = () => { if (images.length === 0) { addNotification('No images to clear', 'warning'); return; } setImages([]); addNotification('All images cleared', 'info'); };
  const updateLabel = (id: string, label: string) => { setImages((prev) => prev.map((img) => img.id === id ? { ...img, label, autoLabeled: false } : img)); };
  const applyQuickLabel = (id: string, label: string) => { updateLabel(id, label); addNotification(`Label "${label}" applied`, 'success'); };

  const filteredImages = images.filter(
    (img) => img.name.toLowerCase().includes(searchTerm.toLowerCase()) || img.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = () => {
    switch (modelStatus) {
      case 'ready': return '#10b981';
      case 'loading': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.25rem 1rem 2.5rem' }}>
      {/* Header */}
      <div className="animate-fadeIn" style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
          <span className="gradient-text">Upload & Label</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.82rem, 2vw, 1rem)' }}>
          Upload images — AI labels them automatically.
        </p>
      </div>

      {/* ====== AI Control Panel (responsive) ====== */}
      <div
        className="animate-fadeIn"
        style={{
          background: 'var(--bg-card)',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          padding: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        {/* Top row: icon, status, toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              padding: '0.5rem', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', flexShrink: 0,
            }}
          >
            <Brain size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>AI Auto-Label</span>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                  fontSize: '0.65rem', fontWeight: 600, padding: '0.1rem 0.45rem',
                  borderRadius: '50px', background: `${getStatusColor()}18`, color: getStatusColor(),
                  border: `1px solid ${getStatusColor()}30`,
                }}
              >
                {modelStatus === 'ready' ? <CheckCircle size={11} /> : modelStatus === 'loading' ? <Loader size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <AlertTriangle size={11} />}
                {modelStatus === 'ready' ? 'Ready' : modelStatus === 'loading' ? 'Loading' : modelStatus === 'error' ? 'Error' : 'Off'}
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>{statusMessage}</p>
          </div>
        </div>

        {/* Bottom row: toggle + button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)', userSelect: 'none' }}>
            <div
              onClick={() => setAutoLabelEnabled(!autoLabelEnabled)}
              style={{
                width: '38px', height: '21px', borderRadius: '11px', position: 'relative', cursor: 'pointer', flexShrink: 0,
                background: autoLabelEnabled ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : darkMode ? '#334155' : '#cbd5e1',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{
                position: 'absolute', top: '2px', left: autoLabelEnabled ? '19px' : '2px',
                width: '17px', height: '17px', borderRadius: '50%', background: 'white',
                transition: 'left 0.3s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </div>
            Auto-label
          </label>

          {/* Action button */}
          {modelStatus !== 'ready' ? (
            <button
              onClick={loadModel} disabled={modelStatus === 'loading'}
              style={{
                background: modelStatus === 'loading' ? (darkMode ? '#334155' : '#e2e8f0') : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                color: modelStatus === 'loading' ? 'var(--text-secondary)' : 'white',
                border: 'none', padding: '0.5rem 1rem', borderRadius: '10px',
                fontSize: '0.8rem', fontWeight: 600, cursor: modelStatus === 'loading' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.2s ease',
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              {modelStatus === 'loading' ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Loading...</> : <><Zap size={14} /> Load AI Model</>}
            </button>
          ) : (
            <button
              onClick={classifyAllImages} disabled={classifyingAll || images.length === 0}
              style={{
                background: (classifyingAll || images.length === 0) ? (darkMode ? '#334155' : '#e2e8f0') : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                color: (classifyingAll || images.length === 0) ? 'var(--text-secondary)' : 'white',
                border: 'none', padding: '0.5rem 1rem', borderRadius: '10px',
                fontSize: '0.8rem', fontWeight: 600, cursor: (classifyingAll || images.length === 0) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.2s ease',
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >
              {classifyingAll ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Classifying...</> : <><Sparkles size={14} /> Label All</>}
            </button>
          )}
        </div>
      </div>

      {/* Upload area */}
      <div
        className="animate-fadeIn"
        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          background: dragOver ? (darkMode ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.06)') : 'var(--bg-card)',
          border: `2px dashed ${dragOver ? '#3b82f6' : 'var(--border)'}`,
          borderRadius: '16px', padding: 'clamp(1.5rem, 4vw, 3rem) 1.5rem',
          textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s ease', marginBottom: '1.25rem',
        }}
      >
        <input ref={fileInputRef} type="file" multiple accept=".jpg,.jpeg,.png" onChange={handleFileChange} style={{ display: 'none' }} />
        <div style={{
          background: 'linear-gradient(135deg, #2563eb, #06b6d4)', width: '52px', height: '52px',
          borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 0.75rem', color: 'white', boxShadow: '0 6px 20px rgba(37,99,235,0.3)',
        }}>
          <ImagePlus size={24} />
        </div>
        <h3 style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)', fontWeight: 700, marginBottom: '0.35rem' }}>
          {dragOver ? 'Drop here!' : 'Tap to Upload Images'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>or drag & drop files</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.4rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: darkMode ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.06)', padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            <AlertTriangle size={11} /> JPG, JPEG, PNG
          </span>
          {modelStatus === 'ready' && autoLabelEnabled && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: darkMode ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.06)', padding: '0.3rem 0.65rem', borderRadius: '6px', fontSize: '0.72rem', color: '#8b5cf6', fontWeight: 500 }}>
              <Brain size={11} /> AI auto-label on
            </span>
          )}
        </div>
      </div>

      {/* Controls bar */}
      {images.length > 0 && (
        <div className="animate-slideDown" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.5rem 0.75rem', flex: '1', minWidth: '150px', maxWidth: '100%' }}>
            <Search size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', color: 'var(--text)', fontSize: '0.85rem', width: '100%', fontFamily: 'inherit' }} />
          </div>
          {/* Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', border: 'none', padding: '0.5rem 0.9rem', borderRadius: '9px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'inherit' }}
            >
              <Upload size={14} /> Add
            </button>
            <button
              onClick={clearAll}
              style={{ background: darkMode ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '0.5rem 0.9rem', borderRadius: '9px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'inherit' }}
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>
      )}

      {/* Count */}
      {images.length > 0 && (
        <div style={{ marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {filteredImages.length} of {images.length} image{images.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* ===== IMAGES GRID — 1 col mobile, 2 col tablet, 3 col desktop ===== */}
      {filteredImages.length > 0 ? (
        <div
          style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(1, 1fr)' }}
          className="sm:!grid-cols-2 lg:!grid-cols-3"
        >
          {filteredImages.map((img, index) => (
            <div
              key={img.id}
              className="animate-scaleIn"
              style={{
                animationDelay: `${Math.min(index * 0.04, 0.4)}s`, opacity: 0,
                background: 'var(--bg-card)', borderRadius: '14px', overflow: 'hidden',
                border: `1px solid ${img.classifying ? '#8b5cf6' : img.autoLabeled ? 'rgba(139,92,246,0.3)' : 'var(--border)'}`,
                boxShadow: img.classifying ? '0 0 15px rgba(139,92,246,0.15)' : 'var(--shadow)',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Thumbnail */}
              <div style={{ height: 'clamp(140px, 30vw, 180px)', overflow: 'hidden', position: 'relative', background: darkMode ? '#1a2332' : '#f8fafc' }}>
                <img src={img.preview} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: img.classifying ? 'brightness(0.7)' : 'none' }} />
                {/* Classifying overlay */}
                {img.classifying && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: 'white', gap: '0.4rem' }}>
                    <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Analyzing...</span>
                  </div>
                )}
                {/* Action buttons */}
                <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', gap: '4px', zIndex: 2 }}>
                  {modelStatus === 'ready' && !img.classifying && (
                    <button onClick={() => reclassifyImage(img)} style={{ background: 'rgba(139,92,246,0.9)', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Re-classify">
                      <RotateCcw size={13} />
                    </button>
                  )}
                  <button onClick={() => deleteImage(img.id)} style={{ background: 'rgba(239,68,68,0.9)', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title="Delete">
                    <X size={14} />
                  </button>
                </div>
                {/* Label badge */}
                {img.label && !img.classifying && (
                  <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: img.autoLabeled ? 'rgba(139,92,246,0.9)' : 'rgba(37,99,235,0.9)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', maxWidth: 'calc(100% - 12px)' }}>
                    {img.autoLabeled ? <Brain size={11} /> : <Tag size={11} />}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.label}</span>
                  </div>
                )}
              </div>

              {/* Card info */}
              <div style={{ padding: '0.85rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={img.name}>{img.name}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>{img.sizeFormatted}</p>

                {/* Label input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: darkMode ? 'rgba(30,41,59,0.5)' : '#f8fafc', borderRadius: '9px', padding: '0.45rem 0.65rem', border: `1px solid ${img.autoLabeled ? 'rgba(139,92,246,0.3)' : 'var(--border)'}`, marginBottom: '0.45rem' }}>
                  {img.autoLabeled ? <Brain size={13} style={{ color: '#8b5cf6', flexShrink: 0 }} /> : <Tag size={13} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />}
                  <input type="text" placeholder="Enter label..." value={img.label} onChange={(e) => updateLabel(img.id, e.target.value)}
                    style={{ border: 'none', outline: 'none', background: 'transparent', color: 'var(--text)', fontSize: '0.85rem', width: '100%', fontFamily: 'inherit' }} />
                  {img.autoLabeled && <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#8b5cf6', background: darkMode ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)', padding: '0.08rem 0.35rem', borderRadius: '4px', flexShrink: 0 }}>AI</span>}
                </div>

                {/* AI Predictions */}
                {img.predictions.length > 0 && (
                  <div style={{ marginBottom: '0.45rem' }}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>AI Predictions</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      {img.predictions.slice(0, 3).map((pred, pi) => (
                        <div
                          key={pi}
                          onClick={() => applyQuickLabel(img.id, pred.className.split(',')[0].trim().replace(/\b\w/g, (l) => l.toUpperCase()))}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem',
                            padding: '0.25rem 0.4rem', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease',
                            background: darkMode ? 'rgba(139,92,246,0.06)' : 'rgba(139,92,246,0.04)',
                          }}
                        >
                          <span style={{ fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: pi === 0 ? 600 : 400 }}>
                            {pred.className.split(',')[0].trim()}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                            <div style={{ width: '30px', height: '3px', borderRadius: '2px', background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${Math.round(pred.probability * 100)}%`, borderRadius: '2px', background: pred.probability > 0.5 ? '#10b981' : pred.probability > 0.2 ? '#f59e0b' : '#ef4444' }} />
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: pred.probability > 0.5 ? '#10b981' : pred.probability > 0.2 ? '#f59e0b' : '#ef4444', minWidth: '30px', textAlign: 'right' }}>
                              {(pred.probability * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick labels */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                  {labelSuggestions.slice(0, 4).map((s) => (
                    <button key={s} onClick={() => applyQuickLabel(img.id, s)}
                      style={{ background: darkMode ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.06)', color: '#3b82f6', border: '1px solid rgba(37,99,235,0.15)', padding: '0.18rem 0.45rem', borderRadius: '5px', fontSize: '0.68rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : images.length > 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }} className="animate-fadeIn">
          <Search size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
          <p style={{ fontSize: '1rem', fontWeight: 600 }}>No matches found</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }} className="animate-fadeIn">
          <ImagePlus size={48} style={{ opacity: 0.2, marginBottom: '0.75rem' }} />
          <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.35rem' }}>No images yet</p>
          <p style={{ fontSize: '0.85rem' }}>Tap the upload area above to get started</p>
        </div>
      )}
    </div>
  );
}
