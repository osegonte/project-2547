// Supabase Edge Function: send-email
// This function sends emails using Resend API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

interface EmailPayload {
  type: 'confirmation' | 'status_update' | 'admin_alert'
  to: string
  requestData: {
    id: string
    full_name: string
    email: string
    school_name: string
    amount: string
    currency: string
    status: string
    admin_notes?: string
    created_at: string
  }
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: EmailPayload = await req.json()
    
    console.log('📧 Sending email:', payload.type, 'to:', payload.to)

    // Generate email content based on type
    let subject = ''
    let html = ''

    if (payload.type === 'confirmation') {
      subject = '✅ Scholarship Request Received - Hope Catalyst'
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2B5A8E 0%, #4F86C6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
            .info-box { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .info-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #4F86C6; }
            .button { display: inline-block; background: #4F86C6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Request Received!</h1>
            </div>
            <div class="content">
              <p>Dear ${payload.requestData.full_name},</p>
              
              <p>Thank you for submitting your scholarship request to Hope Catalyst. We have successfully received your application and our team will begin reviewing it shortly.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #2B5A8E;">Your Request Details</h3>
                <div class="info-row">
                  <span class="label">Request ID:</span>
                  <span>${payload.requestData.id}</span>
                </div>
                <div class="info-row">
                  <span class="label">School:</span>
                  <span>${payload.requestData.school_name}</span>
                </div>
                <div class="info-row">
                  <span class="label">Amount:</span>
                  <span>${payload.requestData.currency} ${Number(payload.requestData.amount).toLocaleString()}</span>
                </div>
                <div class="info-row">
                  <span class="label">Date Submitted:</span>
                  <span>${new Date(payload.requestData.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <p><strong>What happens next?</strong></p>
              <ol>
                <li>Our team will verify your documents and school details</li>
                <li>We'll contact your school to confirm payment information</li>
                <li>You'll receive an email update once we make a decision</li>
                <li>If approved, payment will be sent directly to your school</li>
              </ol>

              <p style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <strong>⚠️ Important:</strong> Save this email! Your Request ID is needed to check your status online.
              </p>

              <div style="text-align: center;">
                <a href="https://your-domain.com/check-status" class="button">Check Request Status</a>
              </div>

              <div class="footer">
                <p>Need help? Contact us at support@hopecatalyst.com</p>
                <p>Hope Catalyst Scholarship © 2025</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    } else if (payload.type === 'status_update') {
      const statusEmoji = {
        approved: '✅',
        rejected: '❌',
        paid: '💵'
      }[payload.requestData.status] || '📋'

      const statusColor = {
        approved: '#3b82f6',
        rejected: '#ef4444',
        paid: '#10b981'
      }[payload.requestData.status] || '#6b7280'

      subject = `${statusEmoji} Request Status Update - Hope Catalyst`
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${statusColor}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
            .status-badge { display: inline-block; background: ${statusColor}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 15px 0; }
            .info-box { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .button { display: inline-block; background: #4F86C6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">${statusEmoji} Status Update</h1>
            </div>
            <div class="content">
              <p>Dear ${payload.requestData.full_name},</p>
              
              <p>Your scholarship request status has been updated.</p>
              
              <div style="text-align: center;">
                <span class="status-badge">${payload.requestData.status.toUpperCase()}</span>
              </div>

              ${payload.requestData.status === 'approved' ? `
                <p style="background: #dbeafe; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                  <strong>Great news!</strong> Your request has been approved. We will process the payment to your school shortly.
                </p>
              ` : ''}

              ${payload.requestData.status === 'rejected' ? `
                <p style="background: #fee2e2; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0;">
                  Unfortunately, we were unable to approve your request at this time.
                </p>
              ` : ''}

              ${payload.requestData.status === 'paid' ? `
                <p style="background: #d1fae5; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
                  <strong>Payment Complete!</strong> The funds have been sent directly to your school.
                </p>
              ` : ''}

              ${payload.requestData.admin_notes ? `
                <div class="info-box">
                  <h3 style="margin-top: 0; color: #2B5A8E;">Message from Admin</h3>
                  <p>${payload.requestData.admin_notes}</p>
                </div>
              ` : ''}

              <div style="text-align: center;">
                <a href="https://your-domain.com/check-status" class="button">View Full Details</a>
              </div>

              <div class="footer">
                <p>Your Request ID: ${payload.requestData.id}</p>
                <p>Need help? Contact us at support@hopecatalyst.com</p>
                <p>Hope Catalyst Scholarship © 2025</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    } else if (payload.type === 'admin_alert') {
      subject = '🔔 New Scholarship Request - Action Required'
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
            .info-box { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .button { display: inline-block; background: #4F86C6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🔔 New Request Submitted</h1>
            </div>
            <div class="content">
              <p><strong>A new scholarship request has been submitted and requires review.</strong></p>
              
              <div class="info-box">
                <p><strong>Student:</strong> ${payload.requestData.full_name}</p>
                <p><strong>School:</strong> ${payload.requestData.school_name}</p>
                <p><strong>Amount:</strong> ${payload.requestData.currency} ${Number(payload.requestData.amount).toLocaleString()}</p>
                <p><strong>Submitted:</strong> ${new Date(payload.requestData.created_at).toLocaleString()}</p>
              </div>

              <div style="text-align: center;">
                <a href="https://your-domain.com/admin/dashboard" class="button">Review Request</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Hope Catalyst <onboarding@resend.dev>',
        to: [payload.to],
        subject,
        html
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email')
    }

    console.log('✅ Email sent successfully:', data.id)

    return new Response(
      JSON.stringify({ success: true, messageId: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Error sending email:', error)
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
