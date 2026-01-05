import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { RequestFormData } from '../request.types'
import Input from '../../../components/ui/Input'

interface Step1PersonalProps {
  register: UseFormRegister<RequestFormData>
  errors: FieldErrors<RequestFormData>
}

export default function Step1Personal({ register, errors }: Step1PersonalProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-serif font-semibold text-primary mb-2">
          Personal Information
        </h3>
        <p className="text-muted-foreground">
          Let's start with your basic details
        </p>
      </div>

      <Input
        label="Full Name"
        placeholder="John Doe"
        {...register('fullName')}
        error={errors.fullName?.message}
        required
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="john.doe@example.com"
        {...register('email')}
        error={errors.email?.message}
        required
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+234 800 000 0000"
        {...register('phone')}
        error={errors.phone?.message}
        required
      />
    </div>
  )
}