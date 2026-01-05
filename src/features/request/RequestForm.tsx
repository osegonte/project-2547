import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import type { RequestFormData } from './request.types'
import { step1Schema, step2Schema, step3Schema, step4Schema, step5Schema } from './request.schema'
import { requestService } from './request.service'
import Step1Personal from './steps/Step1Personal'
import Step2School from './steps/Step2School'
import Step3Payment from './steps/Step3Payment'
import Step4Documents from './steps/Step4Documents'
import Step5Confirm from './steps/Step5Confirm'
import Button from '../../components/ui/Button'
import { ChevronLeft, ChevronRight, Send } from 'lucide-react'

const TOTAL_STEPS = 5

export default function RequestForm() {
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
    resolver: zodResolver(
      currentStep === 1 ? step1Schema :
      currentStep === 2 ? step2Schema :
      currentStep === 3 ? step3Schema :
      currentStep === 4 ? step4Schema :
      step5Schema
    ),
    mode: 'onChange',
    defaultValues: {
      currency: 'NGN'
    }
  })

  const handleNext = async () => {
    const isValid = await trigger()
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
    setIsSubmitting(true)
    
    try {
      console.log('Submitting form data:', data)
      
      // Submit to Supabase
      const result = await requestService.submitRequest(data)
      
      if (result.success) {
        console.log('Request submitted successfully! ID:', result.id)
        navigate('/submitted')
      } else {
        alert(`Submission failed: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Submission error:', error)
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
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-white py-12">
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