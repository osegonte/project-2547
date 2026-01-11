import { motion } from 'framer-motion'
import { FileText, Search, Building2, CheckCircle } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const steps = [
  {
    icon: FileText,
    number: '01',
    title: 'Submit Your Request',
    description: 'Fill out a simple form with your school details, amount needed, and upload required documents.'
  },
  {
    icon: Search,
    number: '02',
    title: 'We Review & Verify',
    description: 'Our team reviews your application, verifies your documents, and confirms payment details with your institution.'
  },
  {
    icon: Building2,
    number: '03',
    title: 'Payment to School',
    description: 'Once approved, we send payment directly to your school\'s official account. You never handle the money.'
  },
  {
    icon: CheckCircle,
    number: '04',
    title: 'Confirmation',
    description: 'You receive confirmation once payment is complete. Your school confirms receipt and processes your enrollment.'
  }
]

interface HowItWorksProps {
  onOpenModal: () => void
}

export default function HowItWorks({ onOpenModal }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-8 lg:px-12">
        
        {/* Section Header - Simplified */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <h2 className="text-sm font-bold text-accent tracking-widest uppercase">
            How It Works
          </h2>
        </motion.div>

        {/* Steps - Single Background Panel */}
        <div className="relative mb-16">
          {/* Unified Background Panel */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/30 via-muted/20 to-transparent rounded-3xl" />
          
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 p-8 lg:p-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.15 }}
                  variants={fadeInUp}
                  className="relative"
                >
                  {/* Connecting Line - Desktop Only */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-[calc(50%+30px)] w-[calc(100%+24px-60px)] h-[2px] bg-gradient-to-r from-accent/40 via-accent/20 to-transparent z-0" />
                  )}

                  <div className="relative z-10 text-center">
                    {/* Number Badge */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center justify-center w-10 h-10 bg-accent text-white rounded-full font-bold text-sm shadow-medium mb-5"
                    >
                      {step.number}
                    </motion.div>

                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-soft text-accent mb-4 border border-border/30">
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <h3 className="text-base font-semibold text-primary mb-2">
                      {step.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed px-2">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
          variants={fadeInUp}
          className="text-center"
        >
          <button
            onClick={onOpenModal}
            className="inline-flex items-center gap-2 h-14 px-10 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg shadow-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Get Started Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}