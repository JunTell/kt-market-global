'use server'

import { createClient } from '@/shared/api/supabase/server'
import { revalidatePath } from 'next/cache'

export type ApplicationData = {
    name: string
    dob: string
    model: string
    carrier: string
}

export type ApplicationState = {
    status: 'idle' | 'success' | 'queued' | 'error'
    message: string
    ticketNumber?: number
    savedData?: ApplicationData
}

export async function submitApplication(
    prevState: ApplicationState,
    formData: FormData
): Promise<ApplicationState> {
    const supabase = await createClient()

    // 1. Extract Data
    const name = formData.get('name')?.toString()
    const dob = formData.get('dob')?.toString()
    const model = formData.get('model')?.toString()
    const carrier = formData.get('carrier')?.toString()

    if (!name || !dob || !model || !carrier) {
        return { status: 'error', message: 'All fields are required' }
    }

    // 2. Get Ticket Number (Atomic Increment)
    // This RPC call should be very fast and lightweight.
    const { data: ticketVal, error: ticketError } = await supabase.rpc(
        'get_next_ticket_number'
    )

    if (ticketError || ticketVal === null) {
        console.error('Ticket Error:', ticketError)
        return { status: 'error', message: 'System overloaded (Ticket Alloc failed). Try again.' }
    }

    const ticketNumber = Number(ticketVal)

    // 3. Attempt Insert
    const { error: insertError } = await supabase.from('ticket_applications').insert({
        ticket_number: ticketNumber,
        name,
        dob,
        model,
        carrier,
    })

    // 4. Handle Load / Failure
    // If insert fails (likely due to connection pool limits on free tier),
    // we treat this as "queued". The user has a ticket number, but data isn't saved yet.
    if (insertError) {
        console.error('Insert Error:', insertError)

        // In a real system, we might push this to a Redis queue here.
        // For this test, we tell the client "You are in queue #1234" and let the client retry.
        return {
            status: 'queued',
            message: `Traffic is high. You hold Ticket #${ticketNumber}. Retrying...`,
            ticketNumber,
            savedData: { name, dob, model, carrier }
        }
    }

    revalidatePath('/test')
    return {
        status: 'success',
        message: `Application Successful! Ticket #${ticketNumber}`,
        ticketNumber
    }
}

/**
 * Retry action for when the user has a ticket but insert failed.
 */
export async function retryApplication(
    ticketNumber: number,
    data: ApplicationData
): Promise<ApplicationState> {
    const supabase = await createClient()

    // Just try insert again with the SAME ticket number
    const { error: insertError } = await supabase.from('ticket_applications').insert({
        ticket_number: ticketNumber,
        ...data,
    })

    if (insertError) {
        // Still busy
        return {
            status: 'queued',
            message: `Still processing... Ticket #${ticketNumber}`,
            ticketNumber,
            savedData: data
        }
    }

    return {
        status: 'success',
        message: `Application Successful! Ticket #${ticketNumber}`,
        ticketNumber
    }
}
