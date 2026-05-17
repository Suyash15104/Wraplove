'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { MapPin, Mail, Phone, Clock, Loader2, MessageCircle } from 'lucide-react'
import { Footer } from '@/components/layout/Footer'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type Form = z.infer<typeof schema>

const CONTACT_INFO = [
  { icon: MapPin, title: 'Our Studio', detail: 'Chennai, Tamil Nadu, India' },
  { icon: Mail, title: 'Email Us', detail: 'hello@wraplove.in' },
  { icon: Phone, title: 'WhatsApp', detail: '+91 98765 43210' },
  { icon: Clock, title: 'Hours', detail: 'Mon-Sat: 9am to 7pm IST' },
]

const FAQS = [
  { q: 'How long does delivery take?', a: 'Most orders ship within 24 hours and arrive within 2 to 5 business days.' },
  { q: 'Can I customize the gift message?', a: 'Yes! Every order can include a personalized message card, printed beautifully.' },
  { q: 'Do you ship pan-India?', a: 'Yes, we ship to all major cities and most PIN codes across India.' },
  { q: 'What if I am not happy with my order?', a: 'We offer easy exchanges within 7 days. Contact us and we will make it right.' },
]

export default function ContactPage() {
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (_data: Form) => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    toast.success('Message sent! We will reply within 24 hours.')
    reset()
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">

        <div className="text-center mb-14">
          <div className="section-tag">Get In Touch</div>
          <h1 className="font-display text-display-md font-semibold mt-3 mb-3">
            We would Love to Hear From You
          </h1>
          <p className="text-brand-muted max-w-md mx-auto">
            Have a question, custom order request, or just want to say hi? We respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

          <div className="bg-white rounded-3xl p-8 shadow-soft">
            <h2 className="font-display text-xl font-semibold mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-medium text-brand-muted block mb-1.5">Your Name</label>
                  <input
                    {...register('name')}
                    className={cn('input', errors.name && 'border-rose-DEFAULT')}
                    placeholder="Priya Sharma"
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-DEFAULT mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-muted block mb-1.5">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className={cn('input', errors.email && 'border-rose-DEFAULT')}
                    placeholder="hello@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-DEFAULT mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-brand-muted block mb-1.5">Subject</label>
                <input
                  {...register('subject')}
                  className={cn('input', errors.subject && 'border-rose-DEFAULT')}
                  placeholder="Custom order enquiry"
                />
                {errors.subject && (
                  <p className="text-xs text-rose-DEFAULT mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-brand-muted block mb-1.5">Message</label>
                <textarea
                  {...register('message')}
                  className={cn('input resize-none', errors.message && 'border-rose-DEFAULT')}
                  rows={5}
                  placeholder="Tell us what you are looking for..."
                />
                {errors.message && (
                  <p className="text-xs text-rose-DEFAULT mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary btn-lg w-full disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>

            </form>
          </div>

          <div className="space-y-5">
            {CONTACT_INFO.map(({ icon: Icon, title, detail }) => (
              <div key={title} className="flex gap-4 bg-white rounded-2xl p-5 shadow-soft">
                <div className="w-11 h-11 bg-blush-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-rose-DEFAULT" />
                </div>
                <div>
                  <p className="font-medium text-brand-dark text-sm mb-0.5">{title}</p>
                  <p className="text-sm text-brand-muted">{detail}</p>
                </div>
              </div>
            ))}

            <div className="bg-sage-100 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle size={20} className="text-sage-400" />
                <p className="font-semibold text-brand-dark">Instant Response</p>
              </div>
              <p className="text-sm text-brand-muted mb-4">
                For custom orders or urgent enquiries, WhatsApp us. We typically reply within 1 hour!
              </p>
              
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center block"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div>
          <div className="text-center mb-10">
            <div className="section-tag">FAQs</div>
            <h2 className="font-display text-display-sm font-semibold mt-3">Common Questions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl p-5 shadow-soft">
                <p className="font-medium text-brand-dark mb-2 text-sm">{faq.q}</p>
                <p className="text-sm text-brand-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}