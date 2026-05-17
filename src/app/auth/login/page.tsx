'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const schema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type Form = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [googleLoad, setGoogleLoad] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: Form) => {
    setLoading(true)
    const res = await signIn('credentials', { ...data, redirect: false })
    setLoading(false)
    if (res?.error) {
      toast.error(res.error === 'CredentialsSignin' ? 'Invalid email or password' : res.error)
    } else {
      toast.success('Welcome back! 💗')
      router.push('/')
      router.refresh()
    }
  }

  const handleGoogle = async () => {
    setGoogleLoad(true)
    await signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-16">
      {/* Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="blob w-80 h-80 bg-blush-300 opacity-20 -top-20 -right-20" />
        <div className="blob w-64 h-64 bg-lavender-300 opacity-15 bottom-0 -left-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-display text-3xl font-semibold text-brand-dark">
              Wrap<span className="text-rose">Love</span>
            </span>
            <span className="text-gold ml-1">✦</span>
          </Link>
          <p className="text-brand-muted text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-4xl p-8 shadow-hover border border-white/40">
          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoad}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border-2
                       border-beige-200 hover:border-blush-300 transition-all text-sm font-medium
                       text-brand-dark mb-6 disabled:opacity-60"
          >
            {googleLoad ? <Loader2 size={16} className="animate-spin" /> : (
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
            )}
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-beige-200" /></div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-brand-muted">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-brand-muted block mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="hello@example.com"
                className={cn('input', errors.email && 'border-rose')}
              />
              {errors.email && <p className="text-xs text-rose mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-brand-muted block mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={cn('input pr-10', errors.password && 'border-rose')}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose mt-1">{errors.password.message}</p>}
            </div>
            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-xs text-rose hover:underline">
                Forgot password?
              </Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full btn-lg disabled:opacity-60">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In ✦'}
            </button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-6">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-rose font-medium hover:underline">
              Create one ✦
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
