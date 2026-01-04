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
    description: 'Fill out a simple form with your school details, amount needed, and upload required documents (admission letter, fee invoice).'
  },
  {
    icon: Search,
    number: '02',
    title: 'We Review & Verify',
    description: 'Our team reviews your application, verifies your documents, and confirms the payment details with your institution.'
  },
  {
    icon: Building2,
    number: '03',
    title: 'Payment to School',
    description: 'Once approved, we send the payment directly to your school\'s official account. You never handle the money.'
  },
  {
    icon: CheckCircle,
    number: '04',
    title: 'Confirmation',
    description: 'You receive confirmation once payment is complete. Your school confirms receipt and processes your enrollment.'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-white">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-4xl lg:text-5xl font-serif font-semibold text-primary leading-tight mb-6">
            Simple, Transparent Process
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From submission to payment confirmation, we handle everything with complete transparency.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.1 }}
                variants={fadeInUp}
                className="relative"
              >
                {/* Connecting Line - Desktop Only */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-accent/30 to-transparent -translate-x-1/2 z-0" />
                )}

                <div className="relative bg-white border border-border/50 rounded-2xl p-6 hover:shadow-medium transition-all duration-300 hover:-translate-y-1 z-10">
                  {/* Number Badge */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center font-bold text-sm shadow-medium">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-4">
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-primary mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
          variants={fadeInUp}
          className="text-center mt-16"
        >
          <a
            href="/request"
            className="inline-flex items-center gap-2 h-14 px-10 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg shadow-medium transition-all hover:shadow-strong"
          >
            Get Started Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}