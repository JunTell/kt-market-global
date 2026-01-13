'use client'

import { createClient } from '@/shared/api/supabase/client'
import { Loader2, CheckCircle2, AlertCircle, Ticket } from 'lucide-react'
import { useState, useEffect } from 'react'

type FormDataCache = {
    name: FormDataEntryValue | null
    dob: FormDataEntryValue | null
    model: FormDataEntryValue | null
    carrier: FormDataEntryValue | null
}

export default function TicketPage() {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'queued' | 'error'>('idle')
    const [result, setResult] = useState<{ ticketNumber?: number; message?: string }>({})
    const [isConnecting, setIsConnecting] = useState(false)
    const [formDataCache, setFormDataCache] = useState<FormDataCache | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name'),
            dob: formData.get('dob'),
            model: formData.get('model'),
            carrier: formData.get('carrier')
        }
        setFormDataCache(data) // Cache for retry
        await handleSubmission(data)
    }

    const handleSubmission = async (data: FormDataCache) => {
        setIsConnecting(true)
        setStatus('processing')

        // 1. Frontend Jitter (1-3s)
        const delay = 1000 + Math.random() * 2000
        await new Promise(r => setTimeout(r, delay))
        setIsConnecting(false)

        try {
            const supabase = createClient()

            // 2. Call Edge Function
            // Note: The user specified the function name is 'bright-api'.
            // Ensure the body format matches what the function expects.
            const { data: responseData, error } = await supabase.functions.invoke('bright-api', {
                body: data
            })

            if (error) throw error

            if (responseData.status === 'queued') {
                setStatus('queued')
                setResult({
                    ticketNumber: responseData.ticketNumber,
                    message: responseData.message || "High traffic. You are in queue."
                })
            } else {
                setStatus('success')
                setResult({
                    ticketNumber: responseData.ticketNumber,
                    message: responseData.message
                })
            }

        } catch (err: unknown) {
            console.error(err)
            setStatus('error')
            setResult({ message: err instanceof Error ? err.message : "Failed to submit application" })
        }
    }

    // Auto-Retry Effect for Queued State
    useEffect(() => {
        if (status === 'queued' && formDataCache) {
            const timer = setTimeout(() => {
                handleSubmission(formDataCache)
            }, 2000 + Math.random() * 1000)
            return () => clearTimeout(timer)
        }
    }, [status, formDataCache])


    return (
        <main className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-neutral-800 rounded-2xl shadow-xl overflow-hidden border border-neutral-700">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
                    <Ticket className="w-12 h-12 mx-auto text-white/90 mb-2" />
                    <h1 className="text-2xl font-bold tracking-tight">S26 Pre-Order Global Ticket</h1>
                    <p className="text-white/80 text-sm mt-1">Edge Function Powered</p>
                </div>

                <div className="p-6 space-y-6">

                    {/* Status Display */}
                    {(status === 'success') && (
                        <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-center gap-3 animate-in fade-in zoom-in">
                            <CheckCircle2 className="text-green-400 w-6 h-6 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-green-400">Application Confirmed!</h3>
                                <p className="text-sm text-green-200">Ticket Number: <span className="text-xl font-mono font-bold bg-green-900/50 px-2 rounded ml-1">#{result.ticketNumber}</span></p>
                            </div>
                        </div>
                    )}

                    {(status === 'queued') && (
                        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 animate-pulse">
                            <div className="flex items-center gap-3">
                                <Loader2 className="text-yellow-400 w-6 h-6 animate-spin flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-yellow-400">High Traffic - In Queue</h3>
                                    <p className="text-sm text-yellow-200">Processing Ticket <span className="font-mono font-bold">#{result.ticketNumber}</span>...</p>
                                    <p className="text-xs text-yellow-500/80 mt-1">Please do not close this page.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    {status !== 'success' && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    disabled={status === 'processing' || status === 'queued' || isConnecting}
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Date of Birth</label>
                                <input
                                    name="dob"
                                    type="text"
                                    pattern="\d{8}"
                                    required
                                    placeholder="YYYYMMDD"
                                    disabled={status === 'processing' || status === 'queued' || isConnecting}
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Model Selection</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['S26', 'S26 Ultra', 'S26 Plus'].map(m => (
                                        <label key={m} className={`
                        cursor-pointer border rounded-lg p-2 text-center text-xs font-medium transition-all
                        hover:bg-neutral-700 has-[:checked]:bg-blue-600 has-[:checked]:border-blue-500 has-[:checked]:text-white
                        ${(status === 'processing' || isConnecting) ? 'opacity-50 cursor-not-allowed' : 'border-neutral-700 bg-neutral-900'}
                      `}>
                                            <input type="radio" name="model" value={m} required className="hidden" disabled={status === 'processing' || status === 'queued' || isConnecting} />
                                            {m}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Carrier</label>
                                <select
                                    name="carrier"
                                    required
                                    disabled={status === 'processing' || status === 'queued' || isConnecting}
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                                >
                                    <option value="">Select Carrier</option>
                                    <option value="KT">KT</option>
                                    <option value="SKT">SKT</option>
                                    <option value="LGU+">LG U+</option>
                                    <option value="MVNO">Budget Phone (A-Mobile)</option>
                                </select>
                            </div>

                            {result.message && status === 'error' && (
                                <div className="text-red-400 text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {result.message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'processing' || status === 'queued' || isConnecting}
                                className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isConnecting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</>
                                ) : status === 'processing' || status === 'queued' ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                ) : (
                                    'Apply for Pre-Order'
                                )}
                            </button>
                        </form>
                    )}

                </div>

                {/* Footer info */}
                <div className="bg-neutral-900/50 p-4 border-t border-neutral-800 text-center text-xs text-neutral-500">
                    Server Load Test Demo | Powered by Supabase Edge Functions
                </div>
            </div>
        </main>
    )
}
