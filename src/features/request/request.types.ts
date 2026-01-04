export interface RequestFormData {
  // Step 1: Personal Information
  fullName: string
  email: string
  phone: string
  
  // Step 2: School Information
  schoolName: string
  program: string
  yearOfStudy: string
  
  // Step 3: Payment Details
  amount: string
  currency: 'NGN' | 'USD'
  schoolAccountName: string
  schoolAccountDetails: string
  schoolBankName: string
  
  // Step 4: Documents
  admissionLetter?: File | null
  feeInvoice?: File | null
  
  // Additional
  additionalNotes?: string
}

export interface RequestSubmission extends Omit<RequestFormData, 'admissionLetter' | 'feeInvoice'> {
  id?: string
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  createdAt?: string
  documentUrls?: {
    admissionLetter?: string
    feeInvoice?: string
  }
}