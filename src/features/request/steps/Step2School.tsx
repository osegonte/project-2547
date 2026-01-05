import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { RequestFormData } from '../request.types'
import Input from '../../../components/ui/Input'

interface Step2SchoolProps {
  register: UseFormRegister<RequestFormData>
  errors: FieldErrors<RequestFormData>
}

export default function Step2School({ register, errors }: Step2SchoolProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-serif font-semibold text-primary mb-2">
          School Information
        </h3>
        <p className="text-muted-foreground">
          Tell us about your educational institution
        </p>
      </div>

      <Input
        label="School/University Name"
        placeholder="University of Lagos"
        {...register('schoolName')}
        error={errors.schoolName?.message}
        required
      />

      <Input
        label="Program/Course of Study"
        placeholder="Computer Science"
        {...register('program')}
        error={errors.program?.message}
        required
      />

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Study Semester <span className="text-destructive ml-1">*</span>
        </label>
        <select
          {...register('studySemester')}
          className={`w-full h-12 px-4 bg-white border rounded-lg transition-all
            ${errors.studySemester 
              ? 'border-destructive focus:border-destructive' 
              : 'border-border focus:border-accent focus:ring-2 focus:ring-accent/20'
            }
          `}
        >
          <option value="">Select semester</option>
          <option value="1st-semester-year-1">1st Semester - Year 1</option>
          <option value="2nd-semester-year-1">2nd Semester - Year 1</option>
          <option value="1st-semester-year-2">1st Semester - Year 2</option>
          <option value="2nd-semester-year-2">2nd Semester - Year 2</option>
          <option value="1st-semester-year-3">1st Semester - Year 3</option>
          <option value="2nd-semester-year-3">2nd Semester - Year 3</option>
          <option value="1st-semester-year-4">1st Semester - Year 4</option>
          <option value="2nd-semester-year-4">2nd Semester - Year 4</option>
          <option value="1st-semester-year-5">1st Semester - Year 5</option>
          <option value="2nd-semester-year-5">2nd Semester - Year 5</option>
          <option value="postgraduate">Postgraduate</option>
        </select>
        {errors.studySemester && (
          <p className="text-sm text-destructive mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {errors.studySemester.message}
          </p>
        )}
      </div>
    </div>
  )
}