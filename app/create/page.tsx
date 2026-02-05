'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { StyleUniverseId, TimeOfDay, Vibe } from '../../types';

// ============ COLORS ============
const TEXT = '#1e1b4b';
const TEXT2 = '#4f46e5';
const MUTED = '#6366f1';
const BG = '#f0f9ff';
const ACCENT = '#6366f1';

// ============ SHARED COMPONENTS ============

function Confetti() {
  const colors = ['#6366f1', '#f59e0b', '#06b6d4', '#10b981', '#8b5cf6', '#ef4444'];
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50, overflow: 'hidden' }}>
      {[...Array(50)].map((_, i) => {
        const size = 4 + Math.random() * 10;
        return (
          <div key={i} style={{
            position: 'absolute', left: `${Math.random() * 100}%`, top: '-10px',
            width: `${size * (Math.random() > 0.5 ? 1 : 0.6)}px`, height: `${size}px`,
            background: colors[i % colors.length],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animation: `confetti-fall ${2 + Math.random()}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.8}s`, opacity: 0.9,
          }} />
        );
      })}
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '5px', padding: '8px 4px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '7px', height: '7px', borderRadius: '50%', background: ACCENT,
          animation: `bounce 1.4s infinite ease-in-out`, animationDelay: `${i * 0.16}s`,
        }} />
      ))}
      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0) scale(0.8); opacity: 0.4; }
          40% { transform: translateY(-8px) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function CreationOrbs({ message }: { message: string }) {
  const msgs = ['Mixing colors...', 'Crafting textures...', 'Adding magic...', 'Polishing details...', 'Almost there...'];
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(p => (p + 1) % msgs.length), 3000); return () => clearInterval(t); }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', padding: '40px' }}>
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: `linear-gradient(135deg, ${ACCENT}, #f472b6)`, boxShadow: `0 0 30px rgba(139,92,246,0.5)`, animation: 'breathe 2s ease-in-out infinite' }} />
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '9px', height: '9px', borderRadius: '50%', background: ACCENT, animation: 'orbit 2s linear infinite' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '7px', height: '7px', borderRadius: '50%', background: '#f472b6', animation: 'orbit-reverse 2.5s linear infinite' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '17px', fontWeight: 600, color: TEXT, marginBottom: '6px' }}>{message}</p>
        <p key={idx} style={{ color: TEXT2, fontSize: '14px', animation: 'reveal-up 0.4s ease' }}>{msgs[idx]}</p>
      </div>
    </div>
  );
}

function PhoneFrame({ imageUrl }: { imageUrl: string }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '220px', margin: '0 auto' }}>
      <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(30px)', animation: 'breathe 3s ease-in-out infinite' }} />
      <div style={{ position: 'relative', aspectRatio: '9/19.5', borderRadius: '32px', overflow: 'hidden', background: '#111', border: '3px solid rgba(0,0,0,0.12)', boxShadow: '0 25px 60px rgba(0,0,0,0.2)', animation: 'reveal-scale 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', width: '70px', height: '22px', borderRadius: '11px', background: '#000', zIndex: 10 }} />
        <img src={imageUrl} alt="Wallpaper" style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'image-reveal 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both' }} />
      </div>
    </div>
  );
}

async function downloadImage(url: string) {
  try {
    const r = await fetch(url); const b = await r.blob();
    const u = window.URL.createObjectURL(b);
    const a = document.createElement('a'); a.href = u; a.download = `wallpaper-${Date.now()}.png`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); window.URL.revokeObjectURL(u);
  } catch { window.open(url, '_blank'); }
}

function ResultView({ imageUrl, onRegenerate, onNew }: { imageUrl: string; onRegenerate: () => void; onNew: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', animation: 'reveal-up 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <span style={{ fontSize: '28px' }}>🎉</span>
        <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em', color: '#1e1b4b', margin: 0 }} className="font-display">Your wallpaper!</h1>
      </div>
      <p style={{ color: '#4f46e5', fontSize: '15px', marginBottom: '24px', fontWeight: 500 }}>Here's what we created together</p>
      <PhoneFrame imageUrl={imageUrl} />
      <div style={{ width: '100%', maxWidth: '280px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '28px' }}>
        <button onClick={() => downloadImage(imageUrl)} style={{
          width: '100%', padding: '18px', borderRadius: '18px', border: 'none',
          background: `linear-gradient(135deg, #6366f1, #8b5cf6)`,
          color: 'white', fontSize: '17px', fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
          position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)', animation: 'shimmer 3s ease infinite', backgroundSize: '1000px 100%' }} />
          <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📥</span> Save to Photos
          </span>
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onRegenerate} style={{
            flex: 1, padding: '14px', borderRadius: '14px',
            border: '2px solid rgba(99,102,241,0.15)',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            color: '#4f46e5', fontSize: '14px', cursor: 'pointer', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            <span>🔄</span> Remix
          </button>
          <button onClick={onNew} style={{
            flex: 1, padding: '14px', borderRadius: '14px',
            border: '2px solid rgba(99,102,241,0.15)',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            color: '#4f46e5', fontSize: '14px', cursor: 'pointer', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            <span>✨</span> New
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============
function CreatePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userPrompt = searchParams.get('prompt');
  const isSurprise = searchParams.get('surprise') === 'true';
  const isGuided = searchParams.get('guided') === 'true';
  if (isGuided) return <GuidedFlow />;
  if (userPrompt) return <ConversationalFlow userPrompt={userPrompt} />;
  if (isSurprise) return <SurpriseFlow />;
  router.push('/');
  return null;
}

// ======================================================================
//  GUIDED FLOW — "WISH BUILDER"
//
//  A sentence-based builder: "I want a ___ wallpaper with ___ in ___ colors"
//
//  Each blank is a tappable slot that opens quick-pick pill options.
//  The sentence reads naturally, builds a wish step by step, and works
//  for anyone — a kid wanting "cute characters with sparkles" or an
//  adult wanting "elegant florals in rose gold."
//
//  Once all slots are filled, a "Create" button appears. Optional text
//  slot lets them add custom text to the wallpaper. It's specific,
//  fast, fun, and produces great prompts.
// ======================================================================

interface SlotOption {
  label: string;
  prompt: string; // what goes into the image prompt
}

const STYLE_OPTIONS: SlotOption[] = [
  { label: 'cute', prompt: 'cute kawaii style, adorable, charming illustration' },
  { label: 'elegant', prompt: 'elegant sophisticated style, refined, graceful design' },
  { label: 'bold', prompt: 'bold striking style, high contrast, powerful visual impact' },
  { label: 'dreamy', prompt: 'dreamy ethereal style, soft focus, whimsical atmosphere' },
  { label: 'minimal', prompt: 'minimalist style, clean lines, generous negative space' },
  { label: 'retro', prompt: 'retro vintage style, nostalgic throwback aesthetic' },
  { label: 'dark', prompt: 'dark moody style, deep shadows, mysterious atmosphere' },
  { label: 'playful', prompt: 'playful fun style, bright and cheerful, full of energy' },
];

const SUBJECT_OPTIONS: SlotOption[] = [
  { label: 'characters', prompt: 'illustrated characters, friendly figures' },
  { label: 'flowers', prompt: 'beautiful flowers, floral arrangement, botanical' },
  { label: 'landscape', prompt: 'stunning landscape scenery, nature vista' },
  { label: 'abstract shapes', prompt: 'abstract flowing shapes, geometric forms, artistic composition' },
  { label: 'animals', prompt: 'adorable animals, wildlife illustration' },
  { label: 'space & stars', prompt: 'cosmic space scene, stars, nebula, galaxy' },
  { label: 'ocean & waves', prompt: 'ocean waves, sea, coastal scenery' },
  { label: 'city & buildings', prompt: 'urban cityscape, architecture, skyline' },
  { label: 'food & sweets', prompt: 'delicious food, sweets, desserts illustration' },
  { label: 'patterns', prompt: 'repeating pattern design, decorative motif' },
];

const COLOR_OPTIONS: SlotOption[] = [
  { label: 'pink & purple', prompt: 'pink and purple color palette, rose, magenta, violet tones' },
  { label: 'blue & teal', prompt: 'blue and teal color palette, ocean blues, cyan, aqua tones' },
  { label: 'warm sunset', prompt: 'warm sunset color palette, orange, golden, amber tones' },
  { label: 'pastel', prompt: 'soft pastel color palette, light pink, lavender, baby blue, mint' },
  { label: 'black & gold', prompt: 'black and gold color palette, luxurious dark with metallic gold accents' },
  { label: 'green & earth', prompt: 'green and earth tones, forest green, olive, natural brown' },
  { label: 'rainbow', prompt: 'rainbow color palette, full spectrum of vibrant colors' },
  { label: 'monochrome', prompt: 'monochromatic grayscale, black white and gray tones' },
];

function SlotPicker({ options, selected, onSelect, onClose, accentColor }: {
  options: SlotOption[];
  selected: string | null;
  onSelect: (option: SlotOption) => void;
  onClose: () => void;
  accentColor?: string;
}) {
  const color = accentColor || ACCENT;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 40,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}>
      <div onClick={onClose} style={{ flex: 1, background: 'rgba(30,27,75,0.15)', backdropFilter: 'blur(8px)' }} />
      <div style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(240,249,255,0.98) 100%)',
        borderRadius: '28px 28px 0 0',
        padding: '20px 20px 36px', maxHeight: '55vh', overflowY: 'auto',
        animation: 'slide-up 0.3s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: '0 -12px 50px rgba(99,102,241,0.15)',
        border: '2px solid rgba(99,102,241,0.1)',
        borderBottom: 'none',
      }}>
        <div style={{ width: '40px', height: '5px', borderRadius: '3px', background: 'rgba(99,102,241,0.2)', margin: '0 auto 20px' }} />
        <p style={{ textAlign: 'center', fontSize: '13px', fontWeight: 700, color: '#4f46e5', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>Pick one ✨</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => { onSelect(opt); onClose(); }}
              style={{
                padding: '12px 22px', borderRadius: '16px',
                border: selected === opt.label ? `2.5px solid ${color}` : '2px solid rgba(99,102,241,0.12)',
                background: selected === opt.label ? `linear-gradient(135deg, ${color}18, ${color}08)` : 'rgba(255,255,255,0.95)',
                color: selected === opt.label ? color : '#1e1b4b',
                fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selected === opt.label ? `0 4px 16px ${color}25` : '0 2px 8px rgba(99,102,241,0.06)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes slide-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function SlotButton({ label, value, isActive, onClick, color }: {
  label: string; value: string | null; isActive: boolean; onClick: () => void; color?: string;
}) {
  const baseColor = color || '#6366f1';
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: value ? '6px 16px' : '6px 14px',
        borderRadius: '12px',
        border: isActive ? `2.5px solid ${baseColor}` : value ? `2.5px solid ${baseColor}` : '2.5px dashed rgba(99,102,241,0.4)',
        background: value ? `linear-gradient(135deg, ${baseColor}15, ${baseColor}08)` : 'rgba(99,102,241,0.06)',
        color: value ? baseColor : 'rgba(79,70,229,0.7)',
        fontSize: '20px', fontWeight: 700, cursor: 'pointer',
        transition: 'all 0.2s ease',
        lineHeight: 1.3,
        verticalAlign: 'baseline',
        boxShadow: value ? `0 4px 12px ${baseColor}20` : 'none',
      }}
      className="font-display"
    >
      {value || label}
      {!value && <span style={{ fontSize: '14px', opacity: 0.6 }}>▼</span>}
    </button>
  );
}

function GuidedFlow() {
  const router = useRouter();
  const [styleChoice, setStyleChoice] = useState<SlotOption | null>(null);
  const [subjectChoice, setSubjectChoice] = useState<SlotOption | null>(null);
  const [colorChoice, setColorChoice] = useState<SlotOption | null>(null);
  const [customText, setCustomText] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [activeSlot, setActiveSlot] = useState<'style' | 'subject' | 'color' | null>(null);
  const [phase, setPhase] = useState<'build' | 'generating' | 'result'>('build');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);

  const isReady = styleChoice && subjectChoice && colorChoice;

  const buildPrompt = () => {
    const parts = [
      'A phone wallpaper, vertical 9:16 aspect ratio',
      styleChoice?.prompt,
      subjectChoice?.prompt,
      colorChoice?.prompt,
    ].filter(Boolean).join(', ');

    let prompt = parts;
    if (customText.trim()) {
      prompt += `. IMPORTANT: Include clearly readable text that says exactly "${customText.trim().toUpperCase()}" in large, bold, legible typography prominently displayed in the image`;
    }
    prompt += '. High quality, beautiful composition, visually striking, professional design. Safe for all audiences.';
    return prompt;
  };

  const generateWithPrompt = async (prompt: string, skipCache: boolean = false) => {
    setPhase('generating');
    setProgress(0);
    setError(null);
    const pi = setInterval(() => setProgress(p => Math.min(p + Math.random() * 15, 90)), 400);
    try {
      const requestBody = {
        selections: { styleUniverse: 'custom' as StyleUniverseId, customPrompt: prompt, timeOfDay: 'daylight' as TimeOfDay, vibe: 'serene' as Vibe },
        skipCache: skipCache
      };
      console.log('=== GUIDED FLOW: Sending to /api/generate ===');
      console.log('skipCache parameter:', skipCache);
      console.log('Full request body:', JSON.stringify(requestBody, null, 2));
      const res = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      clearInterval(pi); setProgress(100);
      if (data.success && data.imageUrl) {
        setTimeout(() => { setGeneratedImage(data.imageUrl); setShowConfetti(true); setPhase('result'); setTimeout(() => setShowConfetti(false), 3500); }, 400);
      } else { setError(data.error || 'Failed to generate.'); setPhase('build'); }
    } catch { clearInterval(pi); setError('Something went wrong.'); setPhase('build'); }
  };

  const handleGenerate = async () => {
    if (!isReady) return;
    const prompt = buildPrompt();
    setLastPrompt(prompt);
    generateWithPrompt(prompt);
  };

  const handleRegenerate = () => {
    if (!lastPrompt) return;
    setGeneratedImage(null);
    // Skip cache to force a new generation
    generateWithPrompt(lastPrompt, true);
  };

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(165deg, #f0f9ff 0%, #e0f2fe 20%, #ede9fe 40%, #fef3c7 60%, #ecfdf5 80%, #f0f9ff 100%)',
      color: TEXT,
      position: 'relative', overflow: 'hidden',
    }}>
      {showConfetti && <Confetti />}

      {/* Decorative background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '-5%', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', flexShrink: 0, position: 'relative', zIndex: 10 }}>
        <button onClick={() => router.push('/')} style={{
          background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(99,102,241,0.15)',
          backdropFilter: 'blur(10px)',
          color: '#4f46e5', fontSize: '15px', cursor: 'pointer', padding: '10px 18px', borderRadius: '14px',
          fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
        }}>← Back</button>
        <div style={{ width: '50px' }} />
      </header>

      {phase === 'build' && (
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 24px 40px', maxWidth: '480px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
          {/* The sentence builder */}
          <div style={{ animation: 'reveal-up 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <span style={{ fontSize: '28px' }}>🎨</span>
              <p style={{ color: '#1e1b4b', fontSize: '14px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Build your wallpaper</p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              borderRadius: '28px',
              padding: '28px 24px',
              border: '2px solid rgba(99,102,241,0.1)',
              boxShadow: '0 12px 40px rgba(99,102,241,0.08)',
            }}>
              <div style={{ fontSize: '22px', lineHeight: 2.4, color: TEXT, fontWeight: 600 }}>
                <span>I want a </span>
                <SlotButton label="style..." value={styleChoice?.label || null} isActive={activeSlot === 'style'} onClick={() => setActiveSlot('style')} color="#6366f1" />
                <span> wallpaper</span>
                <br />
                <span>with </span>
                <SlotButton label="subject..." value={subjectChoice?.label || null} isActive={activeSlot === 'subject'} onClick={() => setActiveSlot('subject')} color="#f59e0b" />
                <br />
                <span>in </span>
                <SlotButton label="colors..." value={colorChoice?.label || null} isActive={activeSlot === 'color'} onClick={() => setActiveSlot('color')} color="#06b6d4" />
                <span> colors</span>
              </div>

              {/* Optional text */}
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(99,102,241,0.1)' }}>
                {!showTextInput ? (
                  <button
                    onClick={() => setShowTextInput(true)}
                    style={{
                      padding: '12px 20px', borderRadius: '16px',
                      border: '1.5px dashed rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.05)',
                      color: '#4f46e5', fontSize: '15px', cursor: 'pointer', fontWeight: 600,
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}
                  >
                    <span>✏️</span> Add text to wallpaper
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px' }}>✏️</span>
                    <input
                      type="text"
                      value={customText}
                      onChange={e => setCustomText(e.target.value.slice(0, 20))}
                      placeholder="e.g. DREAM BIG"
                      autoFocus
                      maxLength={20}
                      style={{
                        flex: 1, padding: '12px 16px', borderRadius: '14px',
                        border: '2px solid rgba(99,102,241,0.3)', background: 'rgba(255,255,255,0.9)',
                        color: '#1e1b4b', fontSize: '16px', fontWeight: 600,
                        outline: 'none', fontFamily: 'inherit',
                      }}
                    />
                    <button onClick={() => { setShowTextInput(false); setCustomText(''); }}
                      style={{
                        padding: '10px 14px', background: 'rgba(99,102,241,0.1)',
                        border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '14px',
                        borderRadius: '10px', fontWeight: 600,
                      }}>
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(239,68,68,0.08)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.15)' }}>
                <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Create button */}
            <button
              onClick={handleGenerate}
              disabled={!isReady}
              style={{
                width: '100%', padding: '18px', borderRadius: '20px', border: 'none',
                background: isReady ? `linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)` : 'rgba(99,102,241,0.08)',
                color: isReady ? 'white' : '#a5b4fc',
                fontSize: '17px', fontWeight: 700, cursor: isReady ? 'pointer' : 'not-allowed',
                marginTop: '32px',
                boxShadow: isReady ? '0 8px 32px rgba(99,102,241,0.3)' : 'none',
                transition: 'all 0.3s ease',
                position: 'relative', overflow: 'hidden',
              }}
              className="font-display"
            >
              {isReady && (
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', animation: 'shimmer 3s ease infinite', backgroundSize: '1000px 100%' }} />
              )}
              <span style={{ position: 'relative' }}>
                {isReady ? 'Create my wallpaper ✨' : 'Fill in all the blanks above'}
              </span>
            </button>
          </div>
        </main>
      )}

      {/* GENERATING PHASE */}
      {phase === 'generating' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <CreationOrbs message="Creating your wallpaper" />
          <div style={{ width: '200px', height: '4px', marginTop: '12px', background: 'rgba(0,0,0,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${ACCENT}, #f472b6)`, borderRadius: '2px', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}

      {/* RESULT PHASE */}
      {phase === 'result' && generatedImage && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <ResultView
            imageUrl={generatedImage}
            onRegenerate={handleRegenerate}
            onNew={() => router.push('/')}
          />
        </div>
      )}

      {/* Slot picker modals */}
      {activeSlot === 'style' && (
        <SlotPicker options={STYLE_OPTIONS} selected={styleChoice?.label || null} onSelect={setStyleChoice} onClose={() => setActiveSlot(null)} accentColor="#6366f1" />
      )}
      {activeSlot === 'subject' && (
        <SlotPicker options={SUBJECT_OPTIONS} selected={subjectChoice?.label || null} onSelect={setSubjectChoice} onClose={() => setActiveSlot(null)} accentColor="#f59e0b" />
      )}
      {activeSlot === 'color' && (
        <SlotPicker options={COLOR_OPTIONS} selected={colorChoice?.label || null} onSelect={setColorChoice} onClose={() => setActiveSlot(null)} accentColor="#06b6d4" />
      )}
    </div>
  );
}

// ======================================================================
//  CONVERSATIONAL FLOW — Real AI conversation
//
//  Uses the new API that sends full message history and lets the LLM
//  decide organically when it has enough context. No rigid exchange count.
//  The conversation can be 1 exchange or 6 — whatever feels natural.
// ======================================================================
type Message = { id: string; role: 'user' | 'assistant'; content: string };

function ConversationalFlow({ userPrompt }: { userPrompt: string }) {
  const router = useRouter();
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const mountIdRef = useRef(0);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isThinking]);
  useEffect(() => { if (!isThinking && !isGenerating && !generatedImage) setTimeout(() => inputRef.current?.focus(), 100); }, [isThinking, isGenerating, generatedImage]);

  const sendToAPI = useCallback(async (allMessages: Message[], currentMountId?: number) => {
    setIsThinking(true);
    try {
      const apiMessages = allMessages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();

      // If a mount ID was provided (init call) and it no longer matches, this is a stale response — bail
      if (currentMountId !== undefined && currentMountId !== mountIdRef.current) return;

      if (data.success && data.data) {
        const { reply, finalPrompt } = data.data;

        if (reply) {
          const botMsg: Message = { id: Date.now().toString(), role: 'assistant', content: reply };
          setMessages(prev => [...prev, botMsg]);
        }

        if (finalPrompt) {
          setLastPrompt(finalPrompt);
          setTimeout(() => generate(finalPrompt), 1200);
          return;
        }
      }
    } catch {
      if (currentMountId !== undefined && currentMountId !== mountIdRef.current) return;
      setMessages(prev => [...prev, {
        id: Date.now().toString(), role: 'assistant',
        content: "I'd love to hear more about what you're imagining. What kind of mood or colors are you drawn to?",
      }]);
    }
    setIsThinking(false);
  }, []);

  useEffect(() => {
    const myMountId = ++mountIdRef.current;
    const firstMsg: Message = { id: 'u0', role: 'user', content: userPrompt };
    setMessages([firstMsg]);
    sendToAPI([firstMsg], myMountId);
  }, [userPrompt, sendToAPI]);

  const handleSend = (input: string) => {
    if (!input.trim() || isThinking || isGenerating) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    sendToAPI(updated);
  };

  const generate = async (prompt: string, skipCache: boolean = false) => {
    setIsGenerating(true); setIsThinking(false); setError(null); setProgress(0);
    const pi = setInterval(() => setProgress(p => Math.min(p + Math.random() * 15, 90)), 400);
    try {
      const requestBody = {
        selections: { styleUniverse: 'custom' as StyleUniverseId, customPrompt: prompt, timeOfDay: 'daylight' as TimeOfDay, vibe: 'serene' as Vibe },
        skipCache: skipCache
      };
      console.log('=== FRONTEND: Sending to /api/generate ===');
      console.log('skipCache parameter:', skipCache);
      console.log('Full request body:', JSON.stringify(requestBody, null, 2));
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody) });
      const data = await res.json(); clearInterval(pi); setProgress(100);
      if (data.success && data.imageUrl) { setTimeout(() => { setGeneratedImage(data.imageUrl); setShowConfetti(true); setIsGenerating(false); setTimeout(() => setShowConfetti(false), 3500); }, 400); }
      else { setError(data.error || 'Failed to generate.'); setIsGenerating(false); }
    } catch { clearInterval(pi); setError('Something went wrong.'); setIsGenerating(false); }
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(165deg, #f0f9ff 0%, #e0f2fe 25%, #ede9fe 50%, #fef3c7 75%, #f0f9ff 100%)', color: TEXT, position: 'relative' }}>
      {showConfetti && <Confetti />}

      {/* Subtle background orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '15%', right: '-10%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '30%', left: '-10%', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
      </div>

      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', flexShrink: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(99,102,241,0.08)', position: 'relative', zIndex: 10 }}>
        <button onClick={() => router.push('/')} style={{ background: 'rgba(255,255,255,0.95)', border: '1.5px solid rgba(99,102,241,0.15)', color: '#4f46e5', fontSize: '14px', cursor: 'pointer', padding: '10px 16px', borderRadius: '12px', fontWeight: 600 }}>←</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: `linear-gradient(135deg, #6366f1, #f59e0b)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: 'white', fontFamily: 'Georgia, serif', fontStyle: 'italic', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}>W</div>
          <span style={{ color: '#1e1b4b', fontSize: '16px', fontWeight: 700 }}>Studio</span>
        </div>
        <div style={{ width: '60px' }} />
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', paddingBottom: '90px', overflowY: 'auto', maxWidth: '520px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 5 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '16px', animation: 'reveal-up 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
            {msg.role === 'assistant' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: `linear-gradient(135deg, #6366f1, #f59e0b)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: 'white', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>W</div>
                <span style={{ color: '#4f46e5', fontSize: '13px', fontWeight: 600 }}>Studio</span>
              </div>
            )}
            <div style={{
              maxWidth: '85%', padding: '14px 18px',
              borderRadius: msg.role === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
              background: msg.role === 'user' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255,255,255,0.95)',
              border: msg.role === 'user' ? 'none' : '1px solid rgba(99,102,241,0.1)',
              boxShadow: msg.role === 'user' ? '0 4px 16px rgba(99,102,241,0.25)' : '0 2px 8px rgba(99,102,241,0.06)',
            }}>
              <p style={{ fontSize: '16px', lineHeight: 1.5, margin: 0, color: msg.role === 'user' ? 'white' : '#1e1b4b', fontWeight: 500 }}>{msg.content}</p>
            </div>
          </div>
        ))}

        {isThinking && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '8px', background: `linear-gradient(135deg, #6366f1, #f59e0b)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: 'white', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>W</div>
              <span style={{ color: '#4f46e5', fontSize: '13px', fontWeight: 600 }}>Studio</span>
            </div>
            <div style={{ padding: '14px 18px', borderRadius: '20px 20px 20px 6px', background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(99,102,241,0.1)', boxShadow: '0 2px 8px rgba(99,102,241,0.06)' }}>
              <TypingIndicator />
            </div>
          </div>
        )}

        {isGenerating && (
          <div style={{ padding: '20px 0' }}>
            <div style={{ width: '100%', height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${ACCENT}, #f472b6)`, borderRadius: '2px', transition: 'width 0.4s ease' }} />
            </div>
            <p style={{ color: MUTED, fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>Crafting your wallpaper...</p>
          </div>
        )}

        {error && (
          <div style={{ padding: '14px 16px', background: 'rgba(239,68,68,0.08)', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.15)', marginBottom: '12px' }}>
            <p style={{ color: '#ef4444', fontSize: '14px', margin: 0, marginBottom: '10px' }}>{error}</p>
            <button onClick={() => { if (lastPrompt) generate(lastPrompt); }} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}>Try again</button>
          </div>
        )}

        {generatedImage && (
          <ResultView imageUrl={generatedImage}
            onRegenerate={() => {
              if (lastPrompt) {
                setGeneratedImage(null);
                generate(lastPrompt, true); // Skip cache for regeneration
              }
            }}
            onNew={() => router.push('/')}
          />
        )}
        <div ref={endRef} />
      </main>

      {!isGenerating && !generatedImage && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px 24px', background: 'linear-gradient(to top, #f0f9ff 80%, transparent)', zIndex: 20 }}>
          <div style={{ maxWidth: '520px', margin: '0 auto' }}>
            <ChatInput onSubmit={handleSend} inputRef={inputRef} disabled={isThinking} />
          </div>
        </div>
      )}
    </div>
  );
}

// ============ SURPRISE FLOW ============
function SurpriseFlow() {
  const router = useRouter();
  const [generating, setGenerating] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ideas = [
      'cosmic galaxy with swirling nebula colors, dreamy ethereal style',
      'serene japanese zen garden at golden hour, peaceful atmosphere',
      'magical forest with glowing fireflies at dusk, mystical mood',
      'neon cyberpunk city at night, vibrant colors',
      'underwater coral reef with tropical fish, bright and colorful',
      'northern lights over snowy mountains, dramatic and majestic',
      'cherry blossom trees in spring, soft tones, romantic',
      'abstract geometric patterns, bold colors, modern art style',
    ];
    const idea = ideas[Math.floor(Math.random() * ideas.length)];
    const prompt = `A phone wallpaper, vertical 9:16 aspect ratio, ${idea}. High quality, beautiful composition, visually striking. Safe for all audiences.`;
    const pi = setInterval(() => setProgress(p => Math.min(p + Math.random() * 15, 90)), 400);

    fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ selections: { styleUniverse: 'custom', customPrompt: prompt, timeOfDay: 'daylight', vibe: 'serene' } }) })
      .then(r => r.json())
      .then(d => { clearInterval(pi); setProgress(100);
        if (d.success && d.imageUrl) { setTimeout(() => { setImage(d.imageUrl); setConfetti(true); setGenerating(false); setTimeout(() => setConfetti(false), 3500); }, 400); }
        else { setError(d.error || 'Failed.'); setGenerating(false); }
      })
      .catch(() => { clearInterval(pi); setError('Something went wrong.'); setGenerating(false); });
    return () => clearInterval(pi);
  }, []);

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(165deg, #f0f9ff 0%, #e0f2fe 25%, #ede9fe 50%, #fef3c7 75%, #f0f9ff 100%)', color: TEXT, alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      {confetti && <Confetti />}
      <button onClick={() => router.push('/')} style={{ position: 'absolute', top: '16px', left: '20px', background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(99,102,241,0.15)', color: '#4f46e5', fontSize: '14px', cursor: 'pointer', padding: '10px 16px', borderRadius: '12px', zIndex: 10, fontWeight: 600 }}>← Back</button>
      {generating && (
        <div style={{ zIndex: 10 }}>
          <CreationOrbs message="Cooking up a surprise" />
          <div style={{ width: '200px', height: '4px', margin: '0 auto', background: 'rgba(0,0,0,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${ACCENT}, #f472b6)`, borderRadius: '2px', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      )}
      {error && (
        <div style={{ textAlign: 'center', zIndex: 10 }}>
          <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px' }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '14px 28px', borderRadius: '14px', border: 'none', background: `linear-gradient(135deg, #6366f1, #8b5cf6)`, color: 'white', fontSize: '15px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>Try again</button>
        </div>
      )}
      {image && (
        <div style={{ textAlign: 'center', zIndex: 10, width: '100%', maxWidth: '400px', animation: 'reveal-up 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px', color: '#1e1b4b' }} className="font-display">Surprise! 🎲</h2>
          <p style={{ color: '#4f46e5', fontSize: '14px', marginBottom: '24px' }}>Something random and beautiful</p>
          <PhoneFrame imageUrl={image} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '28px', maxWidth: '280px', margin: '28px auto 0' }}>
            <button onClick={() => downloadImage(image)} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: `linear-gradient(135deg, #6366f1, #8b5cf6)`, color: 'white', fontSize: '16px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 32px rgba(99,102,241,0.3)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)', animation: 'shimmer 3s ease infinite', backgroundSize: '1000px 100%' }} />
              <span style={{ position: 'relative' }}>📥 Save to Photos</span>
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => window.location.reload()} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid rgba(99,102,241,0.15)', background: 'rgba(255,255,255,0.9)', color: '#4f46e5', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}>🎲 Another</button>
              <button onClick={() => router.push('/')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid rgba(99,102,241,0.15)', background: 'rgba(255,255,255,0.9)', color: '#4f46e5', fontSize: '14px', cursor: 'pointer', fontWeight: 600 }}>✨ New</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ CHAT INPUT ============
function ChatInput({ onSubmit, inputRef, disabled = false }: { onSubmit: (v: string) => void; inputRef?: React.RefObject<HTMLInputElement>; disabled?: boolean }) {
  const [value, setValue] = useState('');
  const send = () => { if (value.trim() && !disabled) { onSubmit(value.trim()); setValue(''); } };
  return (
    <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.95)', borderRadius: '18px', border: '1.5px solid rgba(99,102,241,0.12)', padding: '6px', boxShadow: '0 4px 20px rgba(99,102,241,0.08)', opacity: disabled ? 0.6 : 1, transition: 'opacity 0.2s' }}>
      <input ref={inputRef as React.RefObject<HTMLInputElement>} type="text" value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type your reply..." disabled={disabled}
        style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#1e1b4b', fontSize: '16px', padding: '12px 16px', fontFamily: 'inherit', fontWeight: 500 }} />
      <button onClick={send} disabled={!value.trim() || disabled} style={{ padding: '12px 22px', borderRadius: '14px', border: 'none', background: value.trim() && !disabled ? `linear-gradient(135deg, #6366f1, #4f46e5)` : 'rgba(99,102,241,0.08)', color: value.trim() && !disabled ? 'white' : '#a5b4fc', fontSize: '15px', fontWeight: 700, cursor: value.trim() && !disabled ? 'pointer' : 'not-allowed', transition: 'all 0.2s', boxShadow: value.trim() && !disabled ? '0 4px 12px rgba(99,102,241,0.25)' : 'none' }}>Send</button>
    </div>
  );
}

// ============ EXPORT ============
export default function CreatePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG }}>
        <div style={{ position: 'relative', width: '60px', height: '60px' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '14px', height: '14px', borderRadius: '50%', background: `linear-gradient(135deg, ${ACCENT}, #f472b6)`, animation: 'breathe 2s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: '8px', height: '8px', borderRadius: '50%', background: ACCENT, animation: 'orbit 2s linear infinite' }} />
        </div>
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  );
}
