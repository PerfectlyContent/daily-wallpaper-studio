'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
      background: 'linear-gradient(180deg, #f0f4ff 0%, #e8ecf8 50%, #f5f0ff 100%)',
      color: '#1a1a2e',
      position: 'relative',
    }}>
      {/* Main content */}
      <main style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '40px 24px', position: 'relative', zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '24px',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '28px',
          boxShadow: '0 16px 48px rgba(139, 92, 246, 0.3), 0 0 80px rgba(236, 72, 153, 0.1)',
          animation: 'reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both, float-slow 4s ease-in-out 0.6s infinite',
        }}>
          <span style={{ fontSize: '36px', color: 'white', fontWeight: 700 }}>W</span>
        </div>

        <h1 style={{
          fontSize: '36px', fontWeight: 700, textAlign: 'center',
          marginBottom: '8px', lineHeight: 1.1, letterSpacing: '-0.02em',
          animation: 'reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
        }} className="font-display">
          Wallpaper Studio
        </h1>

        <p style={{
          color: '#6b7280', fontSize: '16px', textAlign: 'center',
          marginBottom: '52px', maxWidth: '260px', lineHeight: 1.5,
          animation: 'reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
        }}>
          Your daily dose of AI-powered phone art
        </p>

        {!showInput ? (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '14px',
            width: '100%', maxWidth: '360px', marginBottom: '24px',
            animation: 'reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
          }}>
            {/* Guide Me */}
            <button
              onClick={() => router.push('/create?guided=true')}
              style={{
                width: '100%', padding: '22px 24px', borderRadius: '20px', border: 'none',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                animation: 'shimmer 3s ease infinite', backgroundSize: '1000px 100%',
              }} />
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, position: 'relative',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div style={{ textAlign: 'left', position: 'relative' }}>
                <span style={{ color: 'white', fontSize: '17px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>Guide me</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'block' }}>Pick a style, vibe & mood in seconds</span>
              </div>
              <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: '20px', position: 'relative' }}>&rarr;</div>
            </button>

            {/* I Have an Idea */}
            <button
              onClick={() => setShowInput(true)}
              style={{
                width: '100%', padding: '22px 24px', borderRadius: '20px',
                border: '1px solid rgba(0,0,0,0.06)',
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.12), rgba(251, 146, 60, 0.12))',
                border: '1px solid rgba(244, 114, 182, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ color: '#1a1a2e', fontSize: '17px', fontWeight: 600, display: 'block', marginBottom: '2px' }}>I have an idea</span>
                <span style={{ color: '#6b7280', fontSize: '13px', display: 'block' }}>Describe it and we'll build it together</span>
              </div>
              <div style={{ marginLeft: 'auto', color: '#9ca3af', fontSize: '20px' }}>&rarr;</div>
            </button>

            {/* Surprise me */}
            <button
              onClick={() => router.push('/create?surprise=true')}
              style={{
                width: '100%', padding: '16px 24px', borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.04)', background: 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '10px', transition: 'all 0.3s ease',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="1" width="22" height="22" rx="4"/>
                <circle cx="8" cy="8" r="1.5" fill="#9ca3af"/><circle cx="16" cy="8" r="1.5" fill="#9ca3af"/>
                <circle cx="8" cy="16" r="1.5" fill="#9ca3af"/><circle cx="16" cy="16" r="1.5" fill="#9ca3af"/>
                <circle cx="12" cy="12" r="1.5" fill="#9ca3af"/>
              </svg>
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: 500 }}>Surprise me</span>
            </button>
          </div>
        ) : (
          <div style={{
            width: '100%', maxWidth: '400px', marginBottom: '32px',
            animation: 'reveal-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #8b5cf6, #f472b6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', flexShrink: 0, color: 'white', fontWeight: 700,
              }}>W</div>
              <div style={{
                padding: '12px 16px', borderRadius: '18px 18px 18px 4px',
                background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.06)',
                backdropFilter: 'blur(10px)',
              }}>
                <p style={{ color: '#1a1a2e', fontSize: '15px', margin: 0 }}>What are you imagining? Tell me everything.</p>
              </div>
            </div>

            <div style={{
              position: 'relative', background: 'white', borderRadius: '20px',
              border: '1px solid rgba(139, 92, 246, 0.2)', padding: '4px',
              marginBottom: '14px', boxShadow: '0 4px 24px rgba(139, 92, 246, 0.08)',
            }}>
              <textarea
                value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="A dreamy sunset with warm oranges and soft clouds..."
                autoFocus rows={3}
                style={{
                  width: '100%', background: 'transparent', border: 'none', outline: 'none',
                  color: '#1a1a2e', fontSize: '16px', padding: '14px 18px',
                  resize: 'none', fontFamily: 'inherit', lineHeight: 1.5,
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setShowInput(false); setInput(''); }} style={{
                padding: '14px 20px', borderRadius: '14px',
                border: '1px solid rgba(0,0,0,0.06)', background: 'transparent',
                color: '#6b7280', fontSize: '15px', cursor: 'pointer', fontWeight: 500,
              }}>Back</button>
              <button onClick={handleCreate} disabled={!input.trim()} style={{
                flex: 1, padding: '14px 24px', borderRadius: '14px', border: 'none',
                background: input.trim() ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'rgba(0,0,0,0.04)',
                color: input.trim() ? 'white' : '#9ca3af',
                fontSize: '15px', fontWeight: 600,
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                boxShadow: input.trim() ? '0 8px 32px rgba(139, 92, 246, 0.3)' : 'none',
                transition: 'all 0.3s ease',
              }}>Let's go &rarr;</button>
            </div>
          </div>
        )}
      </main>

      <footer style={{
        padding: '16px', textAlign: 'center', color: '#a0aec0',
        fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase',
      }}>Powered by AI</footer>
    </div>
  );
}
