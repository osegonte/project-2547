import { motion } from 'framer-motion'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

interface CTASectionProps {
  onOpenModal: () => void
}

export default function CTASection({ onOpenModal }: CTASectionProps) {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-[1200px] mx-auto px-8 lg:px-12 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4 leading-tight">
            Ready to Submit Your Request?
          </h2>
          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            Start your verified school fee payment process today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenModal}
              className="h-14 px-10 bg-white hover:bg-white/95 text-primary font-semibold rounded-lg shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              Start Now
            </button>

            <a
              href="mailto:support@hopecatalyst.com"
              className="text-white/90 hover:text-white font-medium text-sm transition-colors underline decoration-white/40 hover:decoration-white underline-offset-4"
            >
              Contact Support
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}