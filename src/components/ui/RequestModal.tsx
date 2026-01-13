import { useState } from 'react'
import { X } from 'lucide-react'
import Stepper, { Step } from './Stepper'

interface RequestModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RequestModal({ isOpen, onClose }: RequestModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Stepper Component */}
        <Stepper
          initialStep={1}
          onFinalStepCompleted={() => {
            console.log('Form completed!')
            // Handle form submission here
          }}
          nextButtonText="Continue"
          backButtonText="Back"
        >
          {/* Step 1: Personal Information */}
          <Step>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-primary mb-2">
                  Personal Information
                </h2>
                <p className="text-sm text-muted-foreground">
                  Let's start with your basic details
                </p>
              </div>

              <div className="space-y-4">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </Step>

          {/* Step 2: Placeholder for School Information */}
          <Step>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-primary mb-2">
                  School Information
                </h2>
                <p className="text-sm text-muted-foreground">
                  This step will be added next
                </p>
              </div>
            </div>
          </Step>

          {/* Step 3: Placeholder for Payment Details */}
          <Step>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-primary mb-2">
                  Payment Details
                </h2>
                <p className="text-sm text-muted-foreground">
                  This step will be added next
                </p>
              </div>
            </div>
          </Step>

          {/* Step 4: Placeholder for Documents */}
          <Step>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-primary mb-2">
                  Upload Documents
                </h2>
                <p className="text-sm text-muted-foreground">
                  This step will be added next
                </p>
              </div>
            </div>
          </Step>

          {/* Step 5: Placeholder for Review */}
          <Step>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-primary mb-2">
                  Review & Submit
                </h2>
                <p className="text-sm text-muted-foreground">
                  This step will be added next
                </p>
              </div>
            </div>
          </Step>
        </Stepper>
      </div>
    </div>
  )
}