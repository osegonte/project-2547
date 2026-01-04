import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import { RequestFormData } from '../request.types'
import Input from '../../../components/ui/Input'
import TextArea from '../../../components/ui/TextArea'

interface Step3PaymentProps {
  register: UseFormRegister<RequestFormData>
  errors: FieldErrors<RequestFormData>
}

export default function Step3Payment({ register, errors }: Step3PaymentProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-serif font-semibold text-primary mb-2">
          Payment Details
        </h3>
        <p className="text-muted-foreground">
          School fee amount and payment information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Amount Needed"
          type="number"
          placeholder="150000"
          {...register('amount')}
          error={errors.amount?.message}
          required
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Currency <span className="text-destructive ml-1">*</span>
          </label>
          <select
            {...register('currency')}
            className={`w-full h-12 px-4 bg-white border rounded-lg transition-all
              ${errors.currency 
                ? 'border-destructive focus:border-destructive' 
                : 'border-border focus:border-accent focus:ring-2 focus:ring-accent/20'
              }
            `}
          >
            <option value="NGN">Nigerian Naira (NGN)</option>
            <option value="USD">US Dollar (USD)</option>
          </select>
          {errors.currency && (
            <p className="text-sm text-destructive mt-1">{errors.currency.message}</p>
          )}
        </div>
      </div>

      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
        <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          School Bank Account Information
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Provide your school's official bank account details where the payment should be sent.
        </p>

        <div className="space-y-4">
          <Input
            label="Account Name"
            placeholder="University of Lagos - Fees Account"
            {...register('schoolAccountName')}
            error={errors.schoolAccountName?.message}
            required
          />

          <Input
            label="Bank Name"
            placeholder="First Bank of Nigeria"
            {...register('schoolBankName')}
            error={errors.schoolBankName?.message}
            required
          />

          <TextArea
            label="Account Number / Details"
            placeholder="Account Number: 0123456789&#10;Sort Code (if applicable): 123456"
            {...register('schoolAccountDetails')}
            error={errors.schoolAccountDetails?.message}
            required
            rows={3}
          />
        </div>
      </div>
    </div>
  )
}