import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import RequestForm from '../../features/request/RequestForm'

interface RequestModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RequestModal({ isOpen, onClose }: RequestModalProps) {
  const [clickCount, setClickCount] = useState(0)
  const [clickTimeout, setClickTimeoutState] = useState<NodeJS.Timeout | null>(null)

  // Handle double-click on backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only trigger if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      setClickCount(prev => prev + 1)

      // Clear existing timeout
      if (clickTimeout) {
        clearTimeout(clickTimeout)
      }

      // Set new timeout to reset click count
      const timeout = setTimeout(() => {
        setClickCount(0)
      }, 500) // 500ms window for double-click

      setClickTimeoutState(timeout)

      // Check if this is the second click
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden cursor-default"
              style={{ maxHeight: '90vh' }}
            >
              {/* Hidden scrollbar but functional scroll */}
              <div 
                className="overflow-y-auto"
                style={{ 
                  maxHeight: '90vh',
                  scrollbarWidth: 'none', /* Firefox */
                  msOverflowStyle: 'none', /* IE and Edge */
                }}
              >
                {/* Hide scrollbar for Chrome, Safari and Opera */}
                <style>{`
                  .overflow-y-auto::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                
                {/* Form Content */}
                <RequestForm onSuccess={onClose} />
              </div>

              {/* Subtle hint text at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
                <p className="text-xs text-center text-muted-foreground py-3">
                  Double-click outside to close • Press ESC to exit
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}