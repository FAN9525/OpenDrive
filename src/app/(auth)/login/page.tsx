'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onLogin = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.success) {
        window.location.href = '/'
      } else {
        setMessage(data.error || 'Login failed')
      }
    } catch {
      setMessage('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-500 p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl w-full max-w-md">
        <h1 className="text-xl font-bold text-slate-800 mb-4 text-center">Sign in to OpenDrive</h1>
        {message && (
          <div className="mb-3 p-3 rounded text-sm bg-red-100 border border-red-400 text-red-700">{message}</div>
        )}
        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
        <input className="w-full p-3 border-2 border-gray-200 rounded-lg mb-3" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
        <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
        <input className="w-full p-3 border-2 border-gray-200 rounded-lg mb-3" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password" />
        <button onClick={onLogin} disabled={loading} className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold">{loading? 'Signing in...' : 'Sign In'}</button>
        <div className="flex items-center justify-between text-sm mt-4">
          <Link className="text-slate-700 underline" href="/register">Create account</Link>
          <Link className="text-slate-700 underline" href="/forgot">Forgot password?</Link>
        </div>
      </div>
    </div>
  )
}


