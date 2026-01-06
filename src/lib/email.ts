import { supabase } from './supabase'
import type { RequestSubmission } from '../features/request/request.types'

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`

interface EmailOptions {
  type: 'confirmation' | 'status_update' | 'admin_alert'
  to: string
  requestData: RequestSubmission
}

export const emailService = {
  /**
   * Send confirmation email to student
   */
  async sendConfirmationEmail(request: RequestSubmission): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 Sending confirmation email to:', request.email)

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'confirmation',
          to: request.email,
          requestData: request
        }
      })

      if (error) {
        console.error('❌ Error sending confirmation email:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Confirmation email sent')
      return { success: true }
    } catch (error) {
      console.error('❌ Unexpected error sending confirmation email:', error)
      return { success: false, error: 'Failed to send email' }
    }
  },

  /**
   * Send status update email to student
   */
  async sendStatusUpdateEmail(request: RequestSubmission): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 Sending status update email to:', request.email)

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'status_update',
          to: request.email,
          requestData: request
        }
      })

      if (error) {
        console.error('❌ Error sending status update email:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Status update email sent')
      return { success: true }
    } catch (error) {
      console.error('❌ Unexpected error sending status update email:', error)
      return { success: false, error: 'Failed to send email' }
    }
  },

  /**
   * Send alert to admin about new request
   */
  async sendAdminAlert(request: RequestSubmission, adminEmail: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('📧 Sending admin alert to:', adminEmail)

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          type: 'admin_alert',
          to: adminEmail,
          requestData: request
        }
      })

      if (error) {
        console.error('❌ Error sending admin alert:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Admin alert sent')
      return { success: true }
    } catch (error) {
      console.error('❌ Unexpected error sending admin alert:', error)
      return { success: false, error: 'Failed to send email' }
    }
  }
}