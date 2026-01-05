import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function DebugPage() {
  const [results, setResults] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const log = (message: string) => {
    setResults(prev => [...prev, message])
    console.log(message)
  }

  const runDiagnostics = async () => {
    setIsRunning(true)
    setResults([])
    
    log('=== SUPABASE DIAGNOSTICS ===')
    log(`Date: ${new Date().toISOString()}`)
    log('')

    // 1. Check connection
    log('1️⃣ Testing Supabase Connection...')
    const { error: healthError } = await supabase
      .from('requests')
      .select('count')
      .limit(1)
    
    if (healthError) {
      log(`❌ Connection failed: ${healthError.message}`)
      setIsRunning(false)
      return
    }
    log('✅ Connection successful!')
    log('')

    // 2. Check all requests in database
    log('2️⃣ Fetching all requests from database...')
    const { data: requests, error: requestsError } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (requestsError) {
      log(`❌ Error fetching requests: ${requestsError.message}`)
    } else {
      log(`✅ Found ${requests?.length || 0} requests in database`)
      log('')
      
      if (requests && requests.length > 0) {
        log('📋 Latest Request Details:')
        const latest = requests[0]
        log(`  ID: ${latest.id}`)
        log(`  Created: ${latest.created_at}`)
        log(`  Full Name: ${latest.full_name}`)
        log(`  Email: ${latest.email}`)
        log(`  Phone: ${latest.phone}`)
        log(`  School: ${latest.school_name}`)
        log(`  Program: ${latest.program}`)
        log(`  Amount: ${latest.amount} ${latest.currency}`)
        log(`  Admission Letter: ${latest.admission_letter_url || 'NOT UPLOADED'}`)
        log(`  Fee Invoice: ${latest.fee_invoice_url || 'NOT UPLOADED'}`)
        log(`  Status: ${latest.status}`)
        log('')
        
        log('📋 All Requests:')
        requests.forEach((req, idx) => {
          log(`  ${idx + 1}. ${req.full_name} - ${req.email} - ${req.status} - ${new Date(req.created_at).toLocaleString()}`)
        })
      } else {
        log('⚠️ No requests found in database')
      }
    }
    log('')

    // 3. Check storage bucket
    log('3️⃣ Checking Storage Buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      log(`❌ Error fetching buckets: ${bucketsError.message}`)
    } else {
      log('✅ Available buckets:')
      buckets?.forEach(bucket => {
        log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
      })
    }
    log('')

    // 4. Check files in request-documents bucket
    log('4️⃣ Checking files in request-documents bucket...')
    const { data: files, error: filesError } = await supabase.storage
      .from('request-documents')
      .list('', { limit: 100 })
    
    if (filesError) {
      log(`❌ Error listing files: ${filesError.message}`)
      log('❌ This is likely the upload issue!')
    } else {
      log(`✅ Found ${files?.length || 0} files in bucket`)
      if (files && files.length > 0) {
        files.forEach(file => {
          log(`  - ${file.name}`)
        })
      }
    }
    log('')

    // 5. Test upload permissions
    log('5️⃣ Testing Upload Permissions...')
    const testFile = new Blob(['test content'], { type: 'text/plain' })
    const testFileName = `test-${Date.now()}.txt`
    
    const { error: uploadError } = await supabase.storage
      .from('request-documents')
      .upload(testFileName, testFile)
    
    if (uploadError) {
      log(`❌ Upload test FAILED: ${uploadError.message}`)
      log('')
      log('🔧 REQUIRED FIX:')
      log('1. Go to Supabase Dashboard → SQL Editor')
      log('2. Run the fix-storage-policies.sql script')
      log('3. This will create proper RLS policies for file uploads')
    } else {
      log('✅ Upload test successful!')
      // Clean up test file
      await supabase.storage.from('request-documents').remove([testFileName])
      log('✅ Test file cleaned up')
    }

    log('')
    log('=== DIAGNOSTICS COMPLETE ===')
    setIsRunning(false)
  }

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-2xl border border-border shadow-soft p-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-4">
            Supabase Diagnostics
          </h1>
          <p className="text-muted-foreground mb-8">
            This page will test your Supabase connection, check the database, and verify file upload permissions.
          </p>

          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="h-12 px-8 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg shadow-medium transition-all disabled:opacity-50"
          >
            {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}
          </button>

          {results.length > 0 && (
            <div className="mt-8 bg-gray-900 rounded-lg p-6 font-mono text-sm text-green-400 overflow-auto max-h-[600px]">
              {results.map((result, idx) => (
                <div key={idx} className="whitespace-pre-wrap">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}