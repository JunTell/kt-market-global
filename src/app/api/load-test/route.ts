import { NextResponse } from 'next/server'
import { createClient } from '@/shared/api/supabase/server'

// Force dynamic to ensure we don't cache executions
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    // 1. Setup
    const supabase = await createClient()
    const body = await request.json()
    const { name, dob, model, carrier } = body

    // 2. Call Edge Function
    // We proxy to the Edge Function to simulate the real architecture
    const { data: responseData, error: funcError } = await supabase.functions.invoke('bright-api', {
        body: { name, dob, model, carrier }
    })

    // 3. Return result
    if (funcError || (responseData && responseData.error)) {
        return NextResponse.json({
            status: 'queued',
            error: funcError?.message || responseData?.error
        }, { status: 200 })
    }

    // Assuming Edge Function returns { status: 'success'|'queued', ticketNumber: ... }
    return NextResponse.json(responseData, { status: 200 })
}
