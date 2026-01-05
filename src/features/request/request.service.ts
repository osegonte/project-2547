import { supabase } from '../../lib/supabase'
import type { RequestFormData, RequestSubmission } from './request.types'

export const requestService = {
  /**
   * Submit a new request with file uploads
   */
  async submitRequest(data: RequestFormData): Promise<{ success: boolean; error?: string; id?: string }> {
    try {
      console.log('Starting submission with data:', data)

      // 1. Upload admission letter if provided
      let admissionLetterUrl: string | undefined
      if (data.admissionLetter) {
        const admissionResult = await this.uploadDocument(
          data.admissionLetter,
          'admission-letter'
        )
        if (!admissionResult.success) {
          return { success: false, error: 'Failed to upload admission letter' }
        }
        admissionLetterUrl = admissionResult.url
      }

      // 2. Upload fee invoice if provided
      let feeInvoiceUrl: string | undefined
      if (data.feeInvoice) {
        const invoiceResult = await this.uploadDocument(
          data.feeInvoice,
          'fee-invoice'
        )
        if (!invoiceResult.success) {
          return { success: false, error: 'Failed to upload fee invoice' }
        }
        feeInvoiceUrl = invoiceResult.url
      }

      // 3. Insert request into database
      const { data: requestData, error } = await supabase
        .from('requests')
        .insert({
          full_name: data.fullName,
          email: data.email,
          phone: data.phone,
          school_name: data.schoolName,
          program: data.program,
          study_semester: data.studySemester,
          amount: data.amount,
          currency: data.currency,
          school_account_name: data.schoolAccountName,
          school_account_number: data.schoolAccountNumber,
          school_sort_code: data.schoolSortCode || null,
          school_bank_name: data.schoolBankName,
          admission_letter_url: admissionLetterUrl,
          fee_invoice_url: feeInvoiceUrl,
          additional_notes: data.additionalNotes || null,
          status: 'pending'
        })
        .select()
        .single()

      if (error) {
        console.error('Database insert error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, id: requestData.id }
    } catch (error) {
      console.error('Submission error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  },

  /**
   * Upload a document to Supabase Storage
   */
  async uploadDocument(
    file: File,
    prefix: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('request-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return { success: false, error: uploadError.message }
      }

      // Get public URL (even though bucket is private, we store the path)
      const { data } = supabase.storage
        .from('request-documents')
        .getPublicUrl(filePath)

      return { success: true, url: data.publicUrl }
    } catch (error) {
      console.error('Upload error:', error)
      return { success: false, error: 'Failed to upload file' }
    }
  },

  /**
   * Get all requests (for admin dashboard later)
   */
  async getAllRequests(): Promise<RequestSubmission[]> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching requests:', error)
      return []
    }

    return data || []
  },

  /**
   * Get a single request by ID
   */
  async getRequestById(id: string): Promise<RequestSubmission | null> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching request:', error)
      return null
    }

    return data
  },

  /**
   * Update request status (for admin)
   */
  async updateRequestStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected' | 'paid',
    adminNotes?: string
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('requests')
      .update({
        status,
        admin_notes: adminNotes || null
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating status:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  }
}