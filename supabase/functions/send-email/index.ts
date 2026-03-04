// Supabase Edge Function: send-email
// This function sends emails using Resend API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://hopecatalyst.org'

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
      subject = 'We received your request — Hope Catalyst'
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Georgia, serif; line-height: 1.8; color: #1a1a1a; margin: 0; padding: 0; background: #f9f9f9; }
            .wrapper { max-width: 600px; margin: 40px auto; background: white; border: 1px solid #e5e7eb; border-radius: 4px; overflow: hidden; }
            .top-bar { height: 4px; background: linear-gradient(90deg, #2B5A8E, #4F86C6); }
            .header { padding: 32px 48px; border-bottom: 1px solid #f0f0f0; }
            .logo { font-family: Georgia, serif; font-size: 13px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; color: #2B5A8E; }
            .content { padding: 40px 48px; }
            .greeting { font-size: 22px; font-weight: bold; color: #1a1a1a; margin: 0 0 20px; }
            .body-text { font-size: 15px; color: #444; margin: 0 0 20px; line-height: 1.8; }
            .details-box { background: #f8fafc; border-left: 3px solid #2B5A8E; padding: 20px 24px; margin: 28px 0; }
            .details-box p { margin: 6px 0; font-size: 14px; color: #555; font-family: Arial, sans-serif; }
            .details-box span { font-weight: bold; color: #1a1a1a; }
            .step-row { display: flex; gap: 14px; margin-bottom: 14px; align-items: flex-start; }
            .step-num { width: 22px; height: 22px; min-width: 22px; background: #2B5A8E; color: white; border-radius: 50%; font-size: 11px; font-family: Arial, sans-serif; text-align: center; line-height: 22px; margin-top: 1px; }
            .step-text { font-size: 14px; color: #555; font-family: Arial, sans-serif; line-height: 1.6; }
            .cta { display: inline-block; background: #2B5A8E; color: white !important; padding: 14px 32px; text-decoration: none; font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; letter-spacing: 0.08em; text-transform: uppercase; margin: 12px 0 32px; }
            .footer { padding: 24px 48px; border-top: 1px solid #f0f0f0; background: #fafafa; }
            .footer p { font-family: Arial, sans-serif; font-size: 12px; color: #9ca3af; margin: 4px 0; }
            a { color: #2B5A8E; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="top-bar"></div>
            <div class="header">
              <div class="logo">Hope Catalyst</div>
            </div>
            <div class="content">
              <p class="greeting">Hi \${payload.requestData.full_name},</p>

              <p class="body-text">
                Thank you for reaching out to Hope Catalyst. We have received your school fee assistance request and our team will begin reviewing it as soon as possible.
              </p>
              <p class="body-text">
                We know how much this matters. Every request we receive is reviewed with care, and we will be in touch if we need anything further from you.
              </p>

              <div class="details-box">
                <p>School: <span>\${payload.requestData.school_name}</span></p>
                <p>Amount Requested: <span>\${payload.requestData.currency} \${Number(payload.requestData.amount).toLocaleString()}</span></p>
                <p>Date Submitted: <span>\${new Date(payload.requestData.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                <p>Reference: <span>\${payload.requestData.id.slice(0, 8).toUpperCase()}</span></p>
              </div>

              <p class="body-text"><strong>What happens next?</strong></p>

              <div style="margin: 20px 0 28px;">
                <div class="step-row">
                  <div class="step-num">1</div>
                  <div class="step-text">Our team reviews your documents and verifies your school details.</div>
                </div>
                <div class="step-row">
                  <div class="step-num">2</div>
                  <div class="step-text">We may reach out if we need additional information or results from you.</div>
                </div>
                <div class="step-row">
                  <div class="step-num">3</div>
                  <div class="step-text">A decision will be made and you can track the status on your dashboard at any time.</div>
                </div>
                <div class="step-row">
                  <div class="step-num">4</div>
                  <div class="step-text">If approved, payment goes directly to your institution — transparent, no cash.</div>
                </div>
              </div>

              <a href="\${SITE_URL}" class="cta">Check Your Dashboard</a>

              <p class="body-text" style="font-size: 14px; color: #888; margin-top: 8px;">
                Questions? Reach us at <a href="mailto:support@hopecatalyst.net">support@hopecatalyst.net</a>
              </p>

              <p class="body-text" style="margin-top: 32px;">
                With hope,<br/>
                <strong>The Hope Catalyst Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>© \${new Date().getFullYear()} Hope Catalyst &nbsp;·&nbsp; <a href="\${SITE_URL}/privacy" style="color: #9ca3af;">Privacy Policy</a></p>
              <p>You are receiving this because you submitted a request on hopecatalyst.net</p>
            </div>
          </div>
        </body>
        </html>
      `
    } else if (payload.type === 'status_update') {
      const statusEmoji = {
        approved: '✅',
        rejected: '❌',
        paid: '💵',
        awaiting_results: '📋'
      }[payload.requestData.status] || '📋'

      const statusColor = {
        approved: '#3b82f6',
        rejected: '#ef4444',
        paid: '#10b981',
        awaiting_results: '#9333ea'
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

              ${payload.requestData.status === 'awaiting_results' ? `
                <p style="background: #f3e8ff; padding: 15px; border-left: 4px solid #9333ea; margin: 20px 0;">
                  <strong>Action Required!</strong> Our team needs your academic results before we can proceed. Please log in to your dashboard and upload them in the Documents tab.
                </p>
              ` : ''}

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
                <a href="${SITE_URL}/check-status" class="button">View Full Details</a>
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
                <a href="${SITE_URL}/admin/dashboard" class="button">Review Request</a>
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