import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import RequestForm from '../../features/request/RequestForm'
import { X } from 'lucide-react'

interface RequestModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RequestModal({ isOpen, onClose }: RequestModalProps) {
  const [clickCount, setClickCount] = useState(0)
  const [clickTimeout, setClickTimeoutState] = useState<NodeJS.Timeout | null>(null)

  // Handle double-click on backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setClickCount(prev => prev + 1)

      if (clickTimeout) {
        clearTimeout(clickTimeout)
      }

      const timeout = setTimeout(() => {
        setClickCount(0)
      }, 500)

      setClickTimeoutState(timeout)

      if (clickCount === 1) {
        onClose()
        setClickCount(0)
      }
    }
  }

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Reset click count when modal closes
  useEffect(() => {
    if (!isOpen) {
      setClickCount(0)
      if (clickTimeout) {
        clearTimeout(clickTimeout)
      }
    }
  }, [isOpen, clickTimeout])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Darker + Soft Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            {/* Modal Container - Apple HIG sizing */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[720px] bg-white rounded-2xl shadow-2xl overflow-hidden cursor-default"
              style={{ maxHeight: '85vh' }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-muted/80 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>

              {/* Scrollable Content */}
              <div 
                className="overflow-y-auto"
                style={{ 
                  maxHeight: '85vh',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'hsl(214, 32%, 91%) transparent'
                }}
              >
                <style>{`
                  .overflow-y-auto::-webkit-scrollbar {
                    width: 6px;
                  }
                  .overflow-y-auto::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: hsl(214, 32%, 91%);
                    border-radius: 3px;
                  }
                  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: hsl(214, 32%, 85%);
                  }
                `}</style>
                
                {/* Form Content */}
                <RequestForm onSuccess={onClose} />
              </div>

              {/* Subtle hint text at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pointer-events-none py-3">
                <p className="text-xs text-center text-muted-foreground">
                  Press ESC or double-click outside to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}