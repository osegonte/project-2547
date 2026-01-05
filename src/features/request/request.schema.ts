import { z } from 'zod'

// Step 1: Personal Information
export const step1Schema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
})

// Step 2: School Information
export const step2Schema = z.object({
  schoolName: z.string().min(3, 'School name is required'),
  program: z.string().min(3, 'Program/course is required'),
  studySemester: z.string().min(1, 'Study semester is required'),
})

// Step 3: Payment Details
export const step3Schema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  currency: z.enum(['NGN', 'USD']),
  schoolAccountName: z.string().min(3, 'School account name is required'),
  schoolAccountNumber: z.string().min(5, 'Account number is required'),
  schoolSortCode: z.string().optional(),
  schoolBankName: z.string().min(2, 'Bank name is required'),
})

// Step 4: Documents
export const step4Schema = z.object({
  admissionLetter: z.any().optional(),
  feeInvoice: z.any().optional(),
})

// Step 5: Additional Notes
export const step5Schema = z.object({
  additionalNotes: z.string().optional(),
})

// Combined schema
export const fullRequestSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema)

export type Step1Data = z.infer<typeof step1Schema>
export type Step2Data = z.infer<typeof step2Schema>
export type Step3Data = z.infer<typeof step3Schema>
export type Step4Data = z.infer<typeof step4Schema>
export type Step5Data = z.infer<typeof step5Schema>