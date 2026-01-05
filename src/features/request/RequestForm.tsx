import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import type { RequestFormData } from './request.types'
import { fullRequestSchema } from './request.schema'
import { requestService } from './request.service'
import Step1Personal from './steps/Step1Personal'
import Step2School from './steps/Step2School'
import Step3Payment from './steps/Step3Payment'
import Step4Documents from './steps/Step4Documents'
import Step5Confirm from './steps/Step5Confirm'
import Button from '../../components/ui/Button'
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'

const TOTAL_STEPS = 5

// Define which fields to validate for each step
const STEP_FIELDS = {
  1: ['fullName', 'email', 'phone'] as const,
  2: ['schoolName', 'program', 'studySemester'] as const,
  3: ['amount', 'currency', 'schoolAccountName', 'schoolAccountNumber', 'schoolBankName'] as const,
  4: [] as const, // Documents are optional
  5: [] as const, // Additional notes are optional
}

interface RequestFormProps {
  onSuccess?: () => void // Optional callback for modal usage
}

export default function RequestForm({ onSuccess }: RequestFormProps) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors }
  } = useForm<RequestFormData>({
    resolver: zodResolver(fullRequestSchema),
    mode: 'onChange',
    defaultValues: {
      currency: 'NGN'
    }
  })

  const handleNext = async () => {
    // Validate only the fields for the current step
    const fieldsToValidate = STEP_FIELDS[currentStep as keyof typeof STEP_FIELDS]
    
    let isValid = true
    if (fieldsToValidate.length > 0) {
      isValid = await trigger(fieldsToValidate as any)
    }
    
    console.log(`Step ${currentStep} validation:`, isValid)
    console.log('Current form data:', watch())
    
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const onSubmit = async (data: RequestFormData) => {
    console.log('=== FORM SUBMISSION DEBUG ===')
    console.log('📋 Full form data:', data)
    console.log('📋 Data keys:', Object.keys(data))
    console.log('📋 Personal Info:', {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone
    })
    console.log('📋 School Info:', {
      schoolName: data.schoolName,
      program: data.program,
      studySemester: data.studySemester
    })
    console.log('📋 Payment Info:', {
      amount: data.amount,
      currency: data.currency,
      schoolAccountName: data.schoolAccountName,
      schoolAccountNumber: data.schoolAccountNumber,
      schoolBankName: data.schoolBankName
    })
    console.log('📋 Files:', {
      admissionLetter: data.admissionLetter,
      feeInvoice: data.feeInvoice
    })
    console.log('============================')
    
    setIsSubmitting(true)
    
    try {
      // Validate all fields before submission
      const isValid = await trigger()
      
      if (!isValid) {
        console.error('❌ Form validation failed:', errors)
        alert('Please check all fields and try again.')
        setIsSubmitting(false)
        return
      }
      
      console.log('✅ Form validation passed, submitting to Supabase...')
      
      // Submit to Supabase
      const result = await requestService.submitRequest(data)
      
      if (result.success) {
        console.log('✅ Request submitted successfully! ID:', result.id)
        
        // If onSuccess callback is provided (modal usage), call it
        // Otherwise navigate to success page (standalone page usage)
        if (onSuccess) {
          onSuccess()
        }
        navigate('/submitted')
      } else {
        console.error('❌ Submission failed:', result.error)
        alert(`Submission failed: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('❌ Submission error:', error)
      alert('There was an error submitting your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Personal register={register} errors={errors} />
      case 2:
        return <Step2School register={register} errors={errors} />
      case 3:
        return <Step3Payment register={register} errors={errors} />
      case 4:
        return <Step4Documents register={register} errors={errors} setValue={setValue} />
      case 5:
        return <Step5Confirm watch={watch} register={register} errors={errors} />
      default:
        return null
    }
  }

  return (
    <div className="py-12">
      <div className="container-custom max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span className="text-sm font-medium text-accent">
              {Math.round((currentStep / TOTAL_STEPS) * 100)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                transition-all duration-300
                ${currentStep >= step 
                  ? 'bg-accent text-white shadow-medium' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {step}
              </div>
              <span className={`
                text-xs mt-2 hidden md:block
                ${currentStep >= step ? 'text-accent font-medium' : 'text-muted-foreground'}
              `}>
                {step === 1 && 'Personal'}
                {step === 2 && 'School'}
                {step === 3 && 'Payment'}
                {step === 4 && 'Documents'}
                {step === 5 && 'Review'}
              </span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-2xl border border-border/50 shadow-soft p-6 md:p-8 mb-8">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request
                    <Send className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at{' '}
            <a href="mailto:support@hopecatalyst.com" className="text-accent hover:underline">
              support@hopecatalyst.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}