import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, FileText, Trash2 } from 'lucide-react'
import Stepper, { Step } from './Stepper'

/* ─── Schema ─── */

const requestSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  schoolName: z.string().min(2, 'School name is required'),
  program: z.string().min(2, 'Program is required'),
  studySemester: z.string().min(1, 'Please select your year of study'),
  amount: z.string().min(1, 'Amount is required'),
  currency: z.string().default('NGN'),
  schoolAccountName: z.string().min(2, 'Account name is required'),
  schoolAccountNumber: z.string().min(5, 'Account number is required'),
  schoolBankName: z.string().min(2, 'Bank name is required'),
  additionalNotes: z.string().optional(),
})

type FormData = z.infer<typeof requestSchema>

const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
  1: ['fullName', 'email', 'phone'],
  2: ['schoolName', 'program', 'studySemester'],
  3: ['amount', 'currency', 'schoolAccountName', 'schoolAccountNumber', 'schoolBankName'],
  4: [],
  5: [],
}

/* ─── Input Component ─── */

function FormInput({
  label,
  error,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        className={`w-full h-12 px-4 rounded-xl border bg-white text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all ${
          error ? 'border-red-400' : 'border-border/60'
        }`}
      />
      {error && <p className="text-sm text-red-500 mt-1.5">{error}</p>}
    </div>
  )
}

function FormSelect({
  label,
  error,
  required,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...props}
        className={`w-full h-12 px-4 rounded-xl border bg-white text-foreground focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all ${
          error ? 'border-red-400' : 'border-border/60'
        }`}
      >
        {children}
      </select>
      {error && <p className="text-sm text-red-500 mt-1.5">{error}</p>}
    </div>
  )
}

/* ─── Modal ─── */

interface RequestModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RequestModal({ isOpen, onClose }: RequestModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(requestSchema),
    mode: 'onChange',
    defaultValues: { currency: 'NGN' },
  })

  const handleClose = () => {
    reset()
    setUploadedFiles([])
    onClose()
  }

  /* Validate current step before allowing forward navigation */
  const validateStep = useCallback(
    async (nextStep: number, currentStep: number): Promise<boolean> => {
      if (nextStep <= currentStep) return true
      const fields = STEP_FIELDS[currentStep]
      if (!fields || fields.length === 0) return true
      return trigger(fields)
    },
    [trigger]
  )

  /* File handling */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles((prev) => [...prev, ...newFiles])
    }
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  /* Submit */
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      // Placeholder for actual submission logic
      console.log('Submitting:', { ...data, files: uploadedFiles })
      await new Promise((r) => setTimeout(r, 1500))
      handleClose()
    } catch {
      alert('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formValues = watch()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Center container */}
          <div className="relative z-10 flex items-end sm:items-center justify-center min-h-full sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full sm:max-w-2xl"
            >
              {/* Close — desktop (above card) */}
              <div className="hidden sm:flex justify-end mb-3">
                <button
                  onClick={handleClose}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable card */}
              <div className="max-h-[100dvh] sm:max-h-[82vh] overflow-y-auto scrollbar-hide sm:rounded-2xl rounded-t-2xl relative">
                {/* Close — mobile (inside card) */}
                <button
                  onClick={handleClose}
                  className="sm:hidden absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-muted/80 hover:bg-muted text-muted-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stepper
                    initialStep={1}
                    onFinalStepCompleted={() => handleSubmit(onSubmit)()}
                    nextButtonText="Continue"
                    backButtonText="Back"
                    validateStep={validateStep}
                    isSubmitting={isSubmitting}
                  >
                    {/* ───────── Step 1: Personal Information ───────── */}
                    <Step>
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-serif font-semibold text-primary mb-1.5">
                            Personal Information
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Let's start with your basic details
                          </p>
                        </div>

                        <div className="space-y-5">
                          <FormInput
                            label="Full Name"
                            placeholder="Enter your full name"
                            required
                            error={errors.fullName?.message}
                            {...register('fullName')}
                          />
                          <FormInput
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            required
                            error={errors.email?.message}
                            {...register('email')}
                          />
                          <FormInput
                            label="Phone Number"
                            type="tel"
                            placeholder="+234 800 000 0000"
                            required
                            error={errors.phone?.message}
                            {...register('phone')}
                          />
                        </div>
                      </div>
                    </Step>

                    {/* ───────── Step 2: School Information ───────── */}
                    <Step>
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-serif font-semibold text-primary mb-1.5">
                            School Information
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Tell us about your institution and program
                          </p>
                        </div>

                        <div className="space-y-5">
                          <FormInput
                            label="School Name"
                            placeholder="e.g. University of Lagos"
                            required
                            error={errors.schoolName?.message}
                            {...register('schoolName')}
                          />
                          <FormInput
                            label="Program / Course of Study"
                            placeholder="e.g. Computer Science"
                            required
                            error={errors.program?.message}
                            {...register('program')}
                          />
                          <FormSelect
                            label="Year of Study"
                            required
                            error={errors.studySemester?.message}
                            {...register('studySemester')}
                          >
                            <option value="">Select year</option>
                            <option value="1">Year 1</option>
                            <option value="2">Year 2</option>
                            <option value="3">Year 3</option>
                            <option value="4">Year 4</option>
                            <option value="5">Year 5</option>
                            <option value="postgraduate">Postgraduate</option>
                          </FormSelect>
                        </div>
                      </div>
                    </Step>

                    {/* ───────── Step 3: Payment Details ───────── */}
                    <Step>
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-serif font-semibold text-primary mb-1.5">
                            Payment Details
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            School fee amount and payment information
                          </p>
                        </div>

                        <div className="space-y-5">
                          <div className="grid grid-cols-2 gap-4">
                            <FormInput
                              label="Amount Needed"
                              type="number"
                              placeholder="150000"
                              required
                              error={errors.amount?.message}
                              {...register('amount')}
                            />
                            <FormSelect
                              label="Currency"
                              required
                              error={errors.currency?.message}
                              {...register('currency')}
                            >
                              <option value="NGN">NGN (₦)</option>
                              <option value="USD">USD ($)</option>
                              <option value="GBP">GBP (£)</option>
                              <option value="EUR">EUR (€)</option>
                            </FormSelect>
                          </div>
                          <FormInput
                            label="School Account Name"
                            placeholder="Account name for school fees"
                            required
                            error={errors.schoolAccountName?.message}
                            {...register('schoolAccountName')}
                          />
                          <FormInput
                            label="School Account Number"
                            placeholder="0123456789"
                            required
                            error={errors.schoolAccountNumber?.message}
                            {...register('schoolAccountNumber')}
                          />
                          <FormInput
                            label="School Bank Name"
                            placeholder="e.g. First Bank"
                            required
                            error={errors.schoolBankName?.message}
                            {...register('schoolBankName')}
                          />
                        </div>
                      </div>
                    </Step>

                    {/* ───────── Step 4: Documents ───────── */}
                    <Step>
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-serif font-semibold text-primary mb-1.5">
                            Upload Documents
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Upload supporting documents (admission letter, fee breakdown, etc.)
                          </p>
                        </div>

                        {/* Upload zone */}
                        <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-border/60 rounded-xl cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all">
                          <Upload className="w-8 h-8 text-muted-foreground/60 mb-2" />
                          <span className="text-sm font-medium text-muted-foreground">
                            Click to upload files
                          </span>
                          <span className="text-xs text-muted-foreground/60 mt-1">
                            PDF, JPG, PNG — max 5MB each
                          </span>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>

                        {/* File list */}
                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2">
                            {uploadedFiles.map((file, i) => (
                              <div
                                key={`${file.name}-${i}`}
                                className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30 border border-border/30"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <FileText className="w-5 h-5 text-accent flex-shrink-0" />
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {(file.size / 1024).toFixed(0)} KB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(i)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Step>

                    {/* ───────── Step 5: Review & Submit ───────── */}
                    <Step>
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-serif font-semibold text-primary mb-1.5">
                            Review & Submit
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Please review your information before submitting
                          </p>
                        </div>

                        <div className="space-y-4">
                          <ReviewSection title="Personal">
                            <ReviewRow label="Name" value={formValues.fullName} />
                            <ReviewRow label="Email" value={formValues.email} />
                            <ReviewRow label="Phone" value={formValues.phone} />
                          </ReviewSection>

                          <ReviewSection title="School">
                            <ReviewRow label="School" value={formValues.schoolName} />
                            <ReviewRow label="Program" value={formValues.program} />
                            <ReviewRow label="Year" value={formValues.studySemester ? `Year ${formValues.studySemester}` : ''} />
                          </ReviewSection>

                          <ReviewSection title="Payment">
                            <ReviewRow label="Amount" value={formValues.amount ? `${formValues.currency} ${Number(formValues.amount).toLocaleString()}` : ''} />
                            <ReviewRow label="Account" value={formValues.schoolAccountName} />
                            <ReviewRow label="Account #" value={formValues.schoolAccountNumber} />
                            <ReviewRow label="Bank" value={formValues.schoolBankName} />
                          </ReviewSection>

                          {uploadedFiles.length > 0 && (
                            <ReviewSection title="Documents">
                              {uploadedFiles.map((f, i) => (
                                <ReviewRow key={i} label={`File ${i + 1}`} value={f.name} />
                              ))}
                            </ReviewSection>
                          )}
                        </div>

                        {/* Additional notes */}
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Additional Notes (optional)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Anything else you'd like us to know?"
                            {...register('additionalNotes')}
                            className="w-full px-4 py-3 rounded-xl border border-border/60 bg-white text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all resize-none"
                          />
                        </div>
                      </div>
                    </Step>
                  </Stepper>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

/* ─── Review Helpers ─── */

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/30 overflow-hidden">
      <div className="px-4 py-2.5 bg-muted/30 border-b border-border/20">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
      </div>
      <div className="divide-y divide-border/20">{children}</div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between px-4 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value || '—'}</span>
    </div>
  )
}