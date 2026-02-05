'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Sample wallpaper previews for visual interest
const SAMPLE_WALLPAPERS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

export default function HomePage() {
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleCreate = () => {
    if (input.trim()) {
      router.push(`/create?prompt=${encodeURIComponent(input.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
      e.preventDefault();
      handleCreate();
    }
    if (e.key === 'Escape') {
      setShowInput(false);
      setInput('');
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(165deg, #f0f9ff 0%, #e0f2fe 20%, #faf5ff 40%, #fef3c7 60%, #ecfdf5 80%, #f0f9ff 100%)',
      color: '#1a1a2e',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Floating wallpaper previews */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '8%', left: '-8%',
          width: '120px', height: '200px', borderRadius: '24px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          transform: 'rotate(-12deg)',
          opacity: 0.5,
          boxShadow: '0 20px 60px rgba(99, 102, 241, 0.3)',
        }} />
        <div style={{
          position: 'absolute', top: '5%', right: '-5%',
          width: '100px', height: '170px', borderRadius: '20px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
          transform: 'rotate(15deg)',
          opacity: 0.5,
          boxShadow: '0 20px 60px rgba(245, 158, 11, 0.3)',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', left: '-3%',
          width: '90px', height: '150px', borderRadius: '18px',
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
          transform: 'rotate(8deg)',
          opacity: 0.45,
          boxShadow: '0 20px 60px rgba(6, 182, 212, 0.3)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-6%',
          width: '110px', height: '180px', borderRadius: '22px',
          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
          transform: 'rotate(-10deg)',
          opacity: 0.5,
          boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)',
        }} />
        {/* Glow orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '20%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '30%', right: '10%',
          width: '250px', height: '250px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
        }} />
      </div>

      {/* Main content */}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '40px 24px', position: 'relative', zIndex: 10,
      }}>
        {/* Logo with sparkle - only show when NOT in input mode */}
        {!showInput && (
          <>
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '32px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 35%, #f59e0b 70%, #ef4444 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 24px 64px rgba(99, 102, 241, 0.4), 0 0 0 1px rgba(255,255,255,0.2) inset',
                animation: 'float-slow 4s ease-in-out infinite',
              }}>
                <span style={{
                  fontSize: '48px', color: 'white', fontWeight: 800,
                  textShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                }}>W</span>
              </div>
              {/* Sparkles */}
              <div style={{
                position: 'absolute', top: '-8px', right: '-8px',
                fontSize: '24px', animation: 'sparkle 2s ease-in-out infinite',
              }}>✨</div>
            </div>

            <h1 style={{
              fontSize: '38px', fontWeight: 800, textAlign: 'center',
              marginBottom: '12px', lineHeight: 1,
              letterSpacing: '-0.03em',
              color: '#2d1b4e',
            }}>
              Wallpaper Studio
            </h1>

            <p style={{
              fontSize: '17px', textAlign: 'center',
              marginBottom: '44px', maxWidth: '300px', lineHeight: 1.4,
              fontWeight: 600,
              color: '#4f46e5',
            }}>
              Your daily dose of phone art
            </p>
          </>
        )}

        {!showInput ? (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '16px',
            width: '100%', maxWidth: '340px',
          }}>
            {/* I Have an Idea - now first */}
            <button
              onClick={() => setShowInput(true)}
              style={{
                width: '100%', padding: '0', borderRadius: '28px',
                border: '2px solid rgba(99, 102, 241, 0.15)',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '20px 22px',
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(245, 158, 11, 0.15)',
                }}>
                  <span style={{ fontSize: '24px' }}>💬</span>
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <span style={{
                    color: '#1e1b4b', fontSize: '18px', fontWeight: 700,
                    display: 'block', letterSpacing: '-0.01em',
                  }}>I have an idea</span>
                  <span style={{
                    color: '#6366f1', fontSize: '14px', fontWeight: 500,
                  }}>Describe your vision</span>
                </div>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: '#6366f1', fontSize: '16px' }}>→</span>
                </div>
              </div>
            </button>

            {/* Guide Me - now secondary, same style */}
            <button
              onClick={() => router.push('/create?guided=true')}
              style={{
                width: '100%', padding: '0', borderRadius: '28px',
                border: '2px solid rgba(99, 102, 241, 0.15)',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '20px 22px',
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '16px',
                  background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                }}>
                  <span style={{ fontSize: '24px' }}>⭐</span>
                </div>
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <span style={{
                    color: '#1e1b4b', fontSize: '18px', fontWeight: 700,
                    display: 'block', letterSpacing: '-0.01em',
                  }}>Guide me</span>
                  <span style={{
                    color: '#6366f1', fontSize: '14px', fontWeight: 500,
                  }}>We'll build it together</span>
                </div>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: '#6366f1', fontSize: '16px' }}>→</span>
                </div>
              </div>
            </button>

            {/* Surprise me */}
            <button
              onClick={() => router.push('/create?surprise=true')}
              style={{
                width: '100%', padding: '16px 24px', borderRadius: '20px',
                border: '1.5px dashed rgba(99, 102, 241, 0.3)',
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '10px', transition: 'all 0.3s ease',
                marginTop: '4px',
              }}
            >
              <span style={{ fontSize: '20px' }}>🎲</span>
              <span style={{
                color: '#4f46e5', fontSize: '16px', fontWeight: 600,
                letterSpacing: '-0.01em',
              }}>Surprise me!</span>
            </button>
          </div>
        ) : (
          /* Input mode - clean, focused layout */
          <div style={{
            width: '100%', maxWidth: '420px',
            animation: 'reveal-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {/* Compact header with back button */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '32px',
            }}>
              <button onClick={() => { setShowInput(false); setInput(''); }} style={{
                padding: '12px 18px', borderRadius: '14px',
                border: '2px solid rgba(99, 102, 241, 0.15)',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                color: '#4f46e5', fontSize: '15px', cursor: 'pointer', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                ← Back
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #f59e0b 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
                }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'white', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>W</span>
                </div>
                <span style={{ fontSize: '17px', fontWeight: 700, color: '#1e1b4b' }}>Studio</span>
              </div>
              <div style={{ width: '80px' }} /> {/* Spacer for centering */}
            </div>

            {/* Main prompt area */}
            <div style={{
              textAlign: 'center', marginBottom: '28px',
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(12px)',
              padding: '20px 24px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.9)',
            }}>
              <h2 style={{
                fontSize: '26px', fontWeight: 800, color: '#1e1b4b',
                marginBottom: '6px', letterSpacing: '-0.02em',
              }}>
                Describe your vision ✨
              </h2>
              <p style={{ fontSize: '14px', color: '#6366f1', fontWeight: 500, margin: 0 }}>
                The more details, the better!
              </p>
            </div>

            {/* Input card */}
            <div style={{
              position: 'relative',
              background: 'rgba(255,255,255,0.98)',
              borderRadius: '24px',
              border: '2px solid rgba(99, 102, 241, 0.12)',
              padding: '4px',
              marginBottom: '20px',
              boxShadow: '0 12px 40px rgba(99, 102, 241, 0.1)',
            }}>
              <textarea
                value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="A dreamy sunset over mountains with warm oranges, soft clouds, and silhouetted trees..."
                autoFocus rows={5}
                style={{
                  width: '100%', background: 'transparent', border: 'none', outline: 'none',
                  color: '#1e1b4b', fontSize: '16px', padding: '20px',
                  resize: 'none', fontFamily: 'inherit', lineHeight: 1.6,
                  fontWeight: 500,
                }}
              />
            </div>

            {/* Quick ideas - horizontal scroll */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '12px', color: '#6366f1', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                💡 Quick ideas
              </p>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {[
                  '🌅 Warm sunset',
                  '🌸 Cherry blossoms',
                  '🌌 Galaxy stars',
                  '🏔️ Mountains',
                  '🌊 Ocean waves',
                  '🌿 Tropical'
                ].map((idea) => (
                  <button
                    key={idea}
                    onClick={() => setInput(idea.slice(2) + ' themed wallpaper, beautiful and aesthetic')}
                    style={{
                      padding: '10px 16px', borderRadius: '12px',
                      border: '1.5px solid rgba(99, 102, 241, 0.15)',
                      background: 'rgba(255,255,255,0.9)',
                      color: '#4f46e5', fontSize: '14px', cursor: 'pointer', fontWeight: 600,
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            {/* Create button */}
            <button onClick={handleCreate} disabled={!input.trim()} style={{
              width: '100%', padding: '20px 24px', borderRadius: '20px', border: 'none',
              background: input.trim()
                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)'
                : 'rgba(99, 102, 241, 0.1)',
              color: input.trim() ? 'white' : '#a5b4fc',
              fontSize: '18px', fontWeight: 700,
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              boxShadow: input.trim() ? '0 16px 48px rgba(99, 102, 241, 0.35)' : 'none',
              transition: 'all 0.3s ease',
              position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            }}>
              {input.trim() && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
                  borderRadius: '20px 20px 0 0',
                }} />
              )}
              <span style={{ position: 'relative' }}>Create magic</span>
              <span style={{ position: 'relative', fontSize: '20px' }}>✨</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer removed */}

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes reveal-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-message {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.6; transform: scale(1.2) rotate(10deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.5); }
        }
        button:hover {
          transform: translateY(-2px);
        }
        button:active {
          transform: translateY(0px);
        }
        textarea::placeholder {
          color: #c4b5fd;
        }
      `}</style>
    </div>
  );
}
