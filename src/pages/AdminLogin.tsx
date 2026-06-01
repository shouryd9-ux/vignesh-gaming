import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Lock, Mail, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import supabase from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@vigneshgaming.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => { if (user) navigate('/admin'); }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    let { error } = await supabase.auth.signInWithPassword({ email, password });
    // If the demo admin doesn't exist yet (first run), self-provision it.
    if (error && /invalid login credentials/i.test(error.message) && email === 'admin@vigneshgaming.com') {
      const { error: signErr } = await supabase.auth.signUp({ email, password });
      if (!signErr) {
        const retry = await supabase.auth.signInWithPassword({ email, password });
        error = retry.error;
      }
    }
    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-25 cyber-grid-fade" />
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-cyan-500/15 blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md glass clip-corner p-8 scanline overflow-hidden">
        <Link to="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition text-sm mb-6"><ArrowLeft className="h-4 w-4" /> Back to site</Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center">
            <Gamepad2 className="h-6 w-6 text-[#050510]" />
          </div>
          <div>
            <div className="font-display font-extrabold text-white tracking-wider">VIGNESH</div>
            <div className="font-heading text-[10px] tracking-[0.3em] text-cyan-400 uppercase">Admin Console</div>
          </div>
        </div>
        <h1 className="font-display font-black text-2xl text-white mt-5">Welcome Back</h1>
        <p className="text-slate-400 text-sm mt-1">Sign in to manage your gaming zone.</p>

        {error && (
          <div className="mt-5 flex items-center gap-3 bg-red-500/10 border border-red-500/30 clip-corner p-3.5 text-red-300 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 font-heading text-xs uppercase tracking-widest text-slate-400 mb-1.5"><Mail className="h-3.5 w-3.5 text-cyan-400" /> Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="ainp" required />
          </div>
          <div>
            <label className="flex items-center gap-1.5 font-heading text-xs uppercase tracking-widest text-slate-400 mb-1.5"><Lock className="h-3.5 w-3.5 text-cyan-400" /> Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="ainp" placeholder="••••••••" required />
          </div>
          <button disabled={loading} className="w-full clip-corner bg-gradient-to-r from-cyan-400 to-violet-500 text-[#050510] font-display font-bold uppercase tracking-wider px-6 py-3.5 hover:shadow-neon-cyan transition disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-500 border-t border-white/5 pt-4">
          Demo: <span className="text-cyan-400">admin@vigneshgaming.com</span> / <span className="text-cyan-400">admin12345</span>
        </div>
      </motion.div>

      <style>{`.ainp{width:100%;background:rgba(5,5,16,0.6);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.7rem 0.9rem;color:#e8e8f5;font-family:'Rajdhani',sans-serif;outline:none;transition:.2s}.ainp:focus{border-color:rgba(0,240,255,0.5);box-shadow:0 0 0 3px rgba(0,240,255,0.1)}.ainp::placeholder{color:#64748b}`}</style>
    </div>
  );
}
