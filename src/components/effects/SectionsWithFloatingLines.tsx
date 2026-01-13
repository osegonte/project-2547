import React from 'react'
import FloatingLines from '../effects/FloatingLines'

interface SectionsWithFloatingLinesProps {
  children: React.ReactNode
}

export default function SectionsWithFloatingLines({ children }: SectionsWithFloatingLinesProps) {
  return (
    <div className="relative bg-white">
      {/* Single Unified FloatingLines Background - Spans Both Sections */}
      <div className="absolute inset-0 z-0" style={{ minHeight: '100vh' }}>
        <FloatingLines
          linesGradient={[
            '#1E40AF',
            '#2563EB',
            '#3B82F6',
            '#60A5FA',
            '#93C5FD'
          ]}
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[12, 18, 15]}
          lineDistance={[8, 6, 7]}
          animationSpeed={0.8}
          interactive={true}
          parallax={true}
          parallaxStrength={0.15}
          bendRadius={5.0}
          bendStrength={-0.5}
          mixBlendMode="normal"
        />
      </div>

      {/* Content (HowItWorks + Transparency sections) */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}