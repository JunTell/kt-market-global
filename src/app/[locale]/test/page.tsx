'use client'

import { submitApplication, type ApplicationState, type ApplicationData } from './actions'
import { Loader2, CheckCircle2, AlertCircle, Ticket } from 'lucide-react'
import { useState } from 'react'

export default function TicketPage() {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'queued' | 'error'>('idle')
    const [result, setResult] = useState<{ ticketNumber?: number; message?: string }>({})
    const [isConnecting, setIsConnecting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const appData: ApplicationData = {
            name: formData.get('name')?.toString() || '',
            dob: formData.get('dob')?.toString() || '',
            model: formData.get('model')?.toString() || '',
            carrier: formData.get('carrier')?.toString() || ''
        }

        // 1. 화면에 "접수 중입니다..." 표시
        setIsConnecting(true)
        setStatus('processing')

        // 2. 랜덤 시간 대기 (0 ~ 15초)
        const randomDelay = Math.random() * 15000 // 0ms ~ 15000ms
        console.log(`Waiting for ${Math.floor(randomDelay)}ms...`)
        await new Promise(r => setTimeout(r, randomDelay))

        // 3. Supabase 요청 전송 (Server Action) & Retry Logic
        await submitWithRetry(formData, appData)
    }

    const submitWithRetry = async (formData: FormData, appData: ApplicationData, retryCount = 0) => {
        try {
            const prevState: ApplicationState = { status: 'idle', message: '' }
            const response = await submitApplication(prevState, formData)

            if (response.status === 'success') {
                setStatus('success')
                setResult({
                    ticketNumber: response.ticketNumber,
                    message: response.message
                })
                setIsConnecting(false)
            } else if (response.status === 'queued') {
                setStatus('queued')
                setResult({
                    ticketNumber: response.ticketNumber,
                    message: response.message
                })
                setIsConnecting(false)
            } else {
                // Failure (e.g. 429 or DB Error) - Check Retry
                if (retryCount < 1) { // 1 retry allowed
                    console.log("Submission failed, retrying once...")
                    await submitWithRetry(formData, appData, retryCount + 1)
                } else {
                    throw new Error(response.message || "Failed to submit")
                }
            }

        } catch (err: unknown) {
            console.error(err)
            if (retryCount < 1) {
                console.log("Detailed error caught, retrying...")
                await submitWithRetry(formData, appData, retryCount + 1)
            } else {
                setStatus('error')
                setResult({ message: err instanceof Error ? err.message : "Application Failed after retry." })
                setIsConnecting(false)
            }
        }
    }

    return (
        <main className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-neutral-800 rounded-2xl shadow-xl overflow-hidden border border-neutral-700">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
                    <Ticket className="w-12 h-12 mx-auto text-white/90 mb-2" />
                    <h1 className="text-2xl font-bold tracking-tight">S26 Pre-Order Global Ticket</h1>
                    <p className="text-white/80 text-sm mt-1">Direct Insert Load Test</p>
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
                                    disabled={status === 'processing' || isConnecting}
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
                                    disabled={status === 'processing' || isConnecting}
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
                                            <input type="radio" name="model" value={m} required className="hidden" disabled={status === 'processing' || isConnecting} />
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
                                    disabled={status === 'processing' || isConnecting}
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
                                disabled={status === 'processing' || isConnecting}
                                className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isConnecting ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> 접수 중입니다... 잠시만 기다려주세요</>
                                ) : (
                                    'Apply for Pre-Order'
                                )}
                            </button>
                        </form>
                    )}

                </div>

                {/* Footer info */}
                <div className="bg-neutral-900/50 p-4 border-t border-neutral-800 text-center text-xs text-neutral-500">
                    Server Load Test Demo | Direct Insert with Random Delay
                </div>
            </div>
        </main>
    )
}
