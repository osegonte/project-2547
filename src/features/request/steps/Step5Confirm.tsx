import type { UseFormWatch, UseFormRegister, FieldErrors } from 'react-hook-form'
import type { RequestFormData } from '../request.types'
import TextArea from '../../../components/ui/TextArea'

interface Step5ConfirmProps {
  watch: UseFormWatch<RequestFormData>
  register: UseFormRegister<RequestFormData>
  errors: FieldErrors<RequestFormData>
}

export default function Step5Confirm({ watch, register, errors }: Step5ConfirmProps) {
  const formData = watch()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-serif font-semibold text-primary mb-2">
          Review Your Information
        </h3>
        <p className="text-muted-foreground">
          Please review all details before submitting
        </p>
      </div>

      {/* Personal Information */}
      <div className="bg-white border border-border/50 rounded-xl p-6">
        <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-accent">1</span>
          </div>
          Personal Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Full Name</p>
            <p className="font-medium text-foreground">{formData.fullName || '-'}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Email</p>
            <p className="font-medium text-foreground">{formData.email || '-'}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Phone</p>
            <p className="font-medium text-foreground">{formData.phone || '-'}</p>
          </div>
        </div>
      </div>

      {/* School Information */}
      <div className="bg-white border border-border/50 rounded-xl p-6">
        <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-accent">2</span>
          </div>
          School Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">School Name</p>
            <p className="font-medium text-foreground">{formData.schoolName || '-'}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Program</p>
            <p className="font-medium text-foreground">{formData.program || '-'}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Study Semester</p>
            <p className="font-medium text-foreground">{formData.studySemester || '-'}</p>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white border border-border/50 rounded-xl p-6">
        <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-accent">3</span>
          </div>
          Payment Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Amount</p>
            <p className="font-medium text-foreground">
              {formData.currency} {formData.amount ? Number(formData.amount).toLocaleString() : '-'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Bank Name</p>
            <p className="font-medium text-foreground">{formData.schoolBankName || '-'}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Account Name</p>
            <p className="font-medium text-foreground">{formData.schoolAccountName || '-'}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Account Number</p>
            <p className="font-medium text-foreground font-mono">{formData.schoolAccountNumber || '-'}</p>
          </div>
          {formData.schoolSortCode && (
            <div>
              <p className="text-muted-foreground mb-1">Sort Code / Additional Info</p>
              <p className="font-medium text-foreground">{formData.schoolSortCode}</p>
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white border border-border/50 rounded-xl p-6">
        <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-accent">4</span>
          </div>
          Documents
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            {formData.admissionLetter ? (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={formData.admissionLetter ? 'text-foreground font-medium' : 'text-muted-foreground'}>
              Admission Letter {formData.admissionLetter ? '✓' : '(Not uploaded)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {formData.feeInvoice ? (
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={formData.feeInvoice ? 'text-foreground font-medium' : 'text-muted-foreground'}>
              Fee Invoice {formData.feeInvoice ? '✓' : '(Not uploaded)'}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <TextArea
        label="Additional Notes (Optional)"
        placeholder="Any additional information you'd like to share..."
        {...register('additionalNotes')}
        error={errors.additionalNotes?.message}
        rows={4}
      />

      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-accent">By submitting this request:</strong> You confirm that all information provided is accurate 
          and that you authorize Hope Catalyst Scholarship to verify your documents with your educational institution.
        </p>
      </div>
    </div>
  )
}