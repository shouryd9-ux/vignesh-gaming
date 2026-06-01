import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', honeypot: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.message.trim()) e.message = 'Message is required';
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Invalid email';
    if (form.phone && !/^[0-9+\-\s]{7,15}$/.test(form.phone)) e.phone = 'Invalid phone';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '', honeypot: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="pt-28 px-5">
      <div className="max-w-7xl mx-auto py-12">
        <SectionHeader eyebrow="Get In Touch" title="Drop Us A Line" subtitle="Questions, group bookings, tournaments or feedback — we'd love to hear from you." />

        <div className="mt-14 grid lg:grid-cols-5 gap-8">
          {/* Info */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: MapPin, label: 'Location', val: 'Main Road, Tech City, Tamil Nadu' },
              { icon: Phone, label: 'Phone', val: '+91 98765 43210' },
              { icon: Mail, label: 'Email', val: 'hello@vigneshgaming.com' },
              { icon: Clock, label: 'Hours', val: 'Open daily 10:00 AM – 11:00 PM' },
            ].map((c) => (
              <div key={c.label} className="glass clip-corner p-5 flex items-start gap-4">
                <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border border-cyan-400/30 grid place-items-center shrink-0">
                  <c.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <div className="font-heading text-xs uppercase tracking-widest text-cyan-400">{c.label}</div>
                  <div className="text-slate-200 mt-1">{c.val}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 glass clip-corner p-7 space-y-4"
          >
            {status === 'success' && (
              <div className="flex items-center gap-3 bg-lime-400/10 border border-lime-400/30 clip-corner p-4 text-lime-300">
                <CheckCircle2 className="h-5 w-5 shrink-0" /> Thanks! Your message has been received. We'll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 clip-corner p-4 text-red-300">
                <AlertCircle className="h-5 w-5 shrink-0" /> Something went wrong. Please try again.
              </div>
            )}

            {/* Honeypot */}
            <input type="text" tabIndex={-1} autoComplete="off" value={form.honeypot} onChange={(e) => setForm({ ...form, honeypot: e.target.value })} className="hidden" aria-hidden />

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name *" error={errors.name}>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="inp" placeholder="Your name" />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="inp" placeholder="+91 98765 43210" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Email" error={errors.email}>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="inp" placeholder="you@email.com" />
              </Field>
              <Field label="Subject">
                <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="inp" placeholder="What's this about?" />
              </Field>
            </div>
            <Field label="Message *" error={errors.message}>
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="inp resize-none" placeholder="Tell us more..." />
            </Field>

            <button disabled={status === 'loading'} className="w-full clip-corner bg-gradient-to-r from-cyan-400 to-violet-500 text-[#050510] font-display font-bold uppercase tracking-wider px-6 py-3.5 hover:shadow-neon-cyan transition disabled:opacity-60 flex items-center justify-center gap-2">
              {status === 'loading' ? 'Sending...' : <>Send Message <Send className="h-4 w-4" /></>}
            </button>
          </motion.form>
        </div>
      </div>

      <style>{`.inp{width:100%;background:rgba(5,5,16,0.6);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.7rem 0.9rem;color:#e8e8f5;font-family:'Rajdhani',sans-serif;outline:none;transition:.2s}.inp:focus{border-color:rgba(0,240,255,0.5);box-shadow:0 0 0 3px rgba(0,240,255,0.1)}.inp::placeholder{color:#64748b}`}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-heading text-xs uppercase tracking-widest text-slate-400 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
