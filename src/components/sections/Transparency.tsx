import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const weDo = [
  'Review every request carefully',
  'Verify all documents and school details',
  'Pay directly to educational institutions',
  'Track and confirm all payments',
  'Provide status updates on your request',
  'Maintain complete transparency'
]

const weDont = [
  'Give money directly to students',
  'Process payments without verification',
  'Accept incomplete documentation',
  'Handle donations or escrow services',
  'Provide loans or credit facilities',
  'Process international school fees (Nigeria only)'
]

export default function Transparency() {
  return (
    <section id="transparency" className="py-24 lg:py-32 bg-gradient-to-b from-muted/30 to-white">
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
            Our Commitment
          </p>
          <h2 className="text-4xl lg:text-5xl font-serif font-semibold text-primary leading-tight mb-6">
            Complete Transparency
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            We believe in absolute clarity about what we do and don't do. No hidden processes, no surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* WE DO Column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            variants={fadeInUp}
          >
            <div className="bg-white border-2 border-accent/20 rounded-2xl p-8 h-full shadow-soft hover:shadow-medium transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-primary">
                  What We Do
                </h3>
              </div>

              <ul className="space-y-4">
                {weDo.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-accent" />
                    </div>
                    <span className="text-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* WE DON'T Column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            variants={fadeInUp}
          >
            <div className="bg-white border-2 border-border/50 rounded-2xl p-8 h-full shadow-soft hover:shadow-medium transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                  <X className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-primary">
                  What We Don't Do
                </h3>
              </div>

              <ul className="space-y-4">
                {weDont.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Trust Badge */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          variants={fadeInUp}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent/5 border border-accent/20 rounded-full">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium text-accent">
              Your trust is our priority
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}