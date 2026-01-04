import { motion } from 'framer-motion'
import { CheckCircle, Home, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function Submitted() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent/5 to-white flex items-center justify-center py-20 px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: 'easeOut' }}
        variants={fadeInUp}
        className="max-w-2xl w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeInUp}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl lg:text-5xl font-serif font-bold text-primary mb-4"
        >
          Request Submitted Successfully!
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeInUp}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg text-muted-foreground mb-8"
        >
          Thank you for submitting your school fee request. We've received your application and our team will review it shortly.
        </motion.p>

        {/* Info Card */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white border border-border/50 rounded-2xl p-8 mb-8 shadow-soft text-left"
        >
          <h2 className="text-xl font-semibold text-primary mb-4">What Happens Next?</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-accent">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  You'll receive a confirmation email at the address you provided within the next few minutes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-accent">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Document Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Our team will verify your documents and contact your school to confirm the payment details.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-accent">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Status Update</h3>
                <p className="text-sm text-muted-foreground">
                  We'll notify you via email once your request has been approved or if we need additional information.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-accent">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Payment Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Once approved, we'll process the payment directly to your school and send you confirmation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-accent/5 border border-accent/20 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-primary">Need to make changes?</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            If you need to update any information in your request, please contact us at:
          </p>
          <a 
            href="mailto:support@hopecatalyst.com" 
            className="text-accent hover:underline font-medium"
          >
            support@hopecatalyst.com
          </a>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={fadeInUp}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}