import { supabase } from '../../lib/supabase'
import type { RequestFormData, RequestSubmission } from './request.types'

export const requestService = {
  /**
   * Submit a new request with file uploads
   */
  async submitRequest(data: RequestFormData): Promise<{ success: boolean; error?: string; id?: string }> {
    try {
      console.log('🚀 SERVICE: Starting submission with data:', data)
      console.log('🚀 SERVICE: Data validation check:')
      console.log('  - fullName:', data.fullName, typeof data.fullName)
      console.log('  - email:', data.email, typeof data.email)
      console.log('  - phone:', data.phone, typeof data.phone)
      console.log('  - schoolName:', data.schoolName, typeof data.schoolName)
      console.log('  - amount:', data.amount, typeof data.amount)

      // 1. Upload admission letter if provided
      let admissionLetterUrl: string | undefined
      if (data.admissionLetter) {
        console.log('📄 SERVICE: Uploading admission letter...')
        console.log('📄 SERVICE: File details:', {
          name: data.admissionLetter.name,
          size: data.admissionLetter.size,
          type: data.admissionLetter.type
        })
        
        const admissionResult = await this.uploadDocument(
          data.admissionLetter,
          'admission-letter'
        )
        
        if (!admissionResult.success) {
          console.error('❌ SERVICE: Failed to upload admission letter:', admissionResult.error)
          console.error('❌ SERVICE: Stopping submission - file upload required')
          return { 
            success: false, 
            error: `Failed to upload admission letter: ${admissionResult.error}` 
          }
        }
        admissionLetterUrl = admissionResult.url
        console.log('✅ SERVICE: Admission letter uploaded:', admissionLetterUrl)
      } else {
        console.log('⚠️ SERVICE: No admission letter provided')
      }

      // 2. Upload fee invoice if provided
      let feeInvoiceUrl: string | undefined
      if (data.feeInvoice) {
        console.log('📄 SERVICE: Uploading fee invoice...')
        console.log('📄 SERVICE: File details:', {
          name: data.feeInvoice.name,
          size: data.feeInvoice.size,
          type: data.feeInvoice.type
        })
        
        const invoiceResult = await this.uploadDocument(
          data.feeInvoice,
          'fee-invoice'
        )
        
        if (!invoiceResult.success) {
          console.error('❌ SERVICE: Failed to upload fee invoice:', invoiceResult.error)
          console.error('❌ SERVICE: Stopping submission - file upload required')
          return { 
            success: false, 
            error: `Failed to upload fee invoice: ${invoiceResult.error}` 
          }
        }
        feeInvoiceUrl = invoiceResult.url
        console.log('✅ SERVICE: Fee invoice uploaded:', feeInvoiceUrl)
      } else {
        console.log('⚠️ SERVICE: No fee invoice provided')
      }

      // 3. Prepare database payload
      const dbPayload = {
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
        admission_letter_url: admissionLetterUrl || null,
        fee_invoice_url: feeInvoiceUrl || null,
        additional_notes: data.additionalNotes || null,
        status: 'pending'
      }

      console.log('💾 SERVICE: Database payload:', dbPayload)

      // 4. Insert request into database
      console.log('💾 SERVICE: Inserting into Supabase...')
      const { data: requestData, error } = await supabase
        .from('requests')
        .insert(dbPayload)
        .select()
        .single()

      if (error) {
        console.error('❌ SERVICE: Database insert error:', error)
        console.error('❌ SERVICE: Error details:', JSON.stringify(error, null, 2))
        return { success: false, error: error.message }
      }

      console.log('✅ SERVICE: Successfully inserted into database!')
      console.log('✅ SERVICE: Request ID:', requestData.id)
      
      return { success: true, id: requestData.id }
    } catch (error) {
      console.error('❌ SERVICE: Unexpected error:', error)
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
      console.log(`📤 UPLOAD: Starting upload for ${prefix}`)
      console.log(`📤 UPLOAD: File name: ${file.name}`)
      console.log(`📤 UPLOAD: File size: ${file.size} bytes (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
      console.log(`📤 UPLOAD: File type: ${file.type}`)

      // Check file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxSize) {
        console.error(`❌ UPLOAD: File too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Max size is 5MB`)
        return { success: false, error: 'File size exceeds 5MB limit' }
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(7)
      const fileName = `${prefix}-${timestamp}-${random}.${fileExt}`
      const filePath = `${fileName}`

      console.log(`📤 UPLOAD: Generated file path: ${filePath}`)

      // Test bucket access first
      console.log('📤 UPLOAD: Testing bucket access...')
      const { data: bucketTest, error: bucketError } = await supabase.storage
        .from('request-documents')
        .list('', { limit: 1 })

      if (bucketError) {
        console.error('❌ UPLOAD: Cannot access bucket:', bucketError)
        return { 
          success: false, 
          error: `Storage bucket access denied: ${bucketError.message}. Check RLS policies.` 
        }
      }
      console.log('✅ UPLOAD: Bucket accessible')

      // Upload file to Supabase Storage
      console.log('📤 UPLOAD: Starting file upload...')
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('request-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('❌ UPLOAD: Upload error:', uploadError)
        console.error('❌ UPLOAD: Error code:', uploadError.message)
        console.error('❌ UPLOAD: Error name:', uploadError.name)
        
        // Provide helpful error messages
        if (uploadError.message.includes('row-level security')) {
          return { 
            success: false, 
            error: 'Storage permissions error. Please run the SQL policy fix script.' 
          }
        } else if (uploadError.message.includes('Bucket not found')) {
          return { 
            success: false, 
            error: 'Storage bucket "request-documents" does not exist. Please create it in Supabase dashboard.' 
          }
        }
        
        return { success: false, error: uploadError.message }
      }

      console.log('✅ UPLOAD: File uploaded successfully!')
      console.log('✅ UPLOAD: Upload data:', uploadData)

      // Get public URL (even though bucket is private, we store the path)
      const { data } = supabase.storage
        .from('request-documents')
        .getPublicUrl(filePath)

      console.log(`✅ UPLOAD: Public URL generated: ${data.publicUrl}`)

      return { success: true, url: data.publicUrl }
    } catch (error) {
      console.error('❌ UPLOAD: Unexpected error:', error)
      if (error instanceof Error) {
        return { success: false, error: error.message }
      }
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