//NOTIFICATION
import { ToastType } from '../hooks/useToast'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContainerProps {
  toasts: ToastItem[]
  onRemove: (id: number) => void
}

const icons: Record<ToastType, string> = {
  error: '✕',
  success: '✓',
  info: 'ℹ',
}

const colors: Record<ToastType, { bg: string; border: string; icon: string; text: string }> = {
  error:   { bg: '#fff0f0', border: '#fac0c0', icon: '#e74c3c', text: '#c0392b' },
  success: { bg: '#f0faf4', border: '#b7e4c7', icon: '#2d6a4f', text: '#1b4332' },
  info:    { bg: '#f0f4ff', border: '#c0cffa', icon: '#3b5bdb', text: '#2c42a8' },
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <>
      <div style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem',
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
        zIndex: 9999, maxWidth: '340px', width: '100%',
      }}>
        {toasts.map(t => {
          const c = colors[t.type]
          return (
            <div
              key={t.id}
              style={{
                background: c.bg, border: `1px solid ${c.border}`,
                borderRadius: '12px', padding: '0.75rem 1rem',
                display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                animation: 'slideIn 0.2s ease',
                fontFamily: 'DM Sans, Segoe UI, sans-serif',
              }}
            >
              <span style={{
                width: 20, height: 20, borderRadius: '50%',
                background: c.icon, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700, flexShrink: 0, marginTop: 1,
              }}>
                {icons[t.type]}
              </span>
              <span style={{ fontSize: '0.85rem', color: c.text, flex: 1, lineHeight: 1.5 }}>
                {t.message}
              </span>
              <button
                onClick={() => onRemove(t.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: c.text, opacity: 0.5, fontSize: '0.8rem', padding: '0 2px',
                  flexShrink: 0,
                }}
              >✕</button>
            </div>
          )
        })}
      </div>
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </>
  )
}
