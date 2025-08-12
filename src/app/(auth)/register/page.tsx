'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/utils/supabase'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onRegister = async () => {
    setLoading(true)
    setMessage(null)
    try {
      if (!supabase) {
        setMessage('Supabase not configured')
        return
      }
      const { data: signUpData, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Check your email to confirm your account')
      }
    } catch {
      setMessage('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-500 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl w-full max-w-md">
        <h1 className="text-xl font-bold text-slate-800 mb-4 text-center">Create your account</h1>
        {message && (
          <div className="mb-3 p-3 rounded text-sm bg-red-100 border border-red-400 text-red-700">{message}</div>
        )}
        <label className="block text-sm font-medium text-slate-700 mb-2">Full name</label>
        <input className="w-full p-3 border-2 border-gray-200 rounded-lg mb-3" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="First Last" />
        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
        <input className="w-full p-3 border-2 border-gray-200 rounded-lg mb-3" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
        <input className="w-full p-3 border-2 border-gray-200 rounded-lg mb-3" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Choose a strong password" />
        <button onClick={onRegister} disabled={loading} className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold">{loading? 'Creating...' : 'Create account'}</button>
        <div className="text-center text-sm mt-4">
          <Link className="text-slate-700 underline" href="/login">Back to sign in</Link>
        </div>
      </div>
    </div>
  )
}


