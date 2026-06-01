import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gamepad2, LayoutDashboard, CalendarCheck, MessageSquare, LogOut, TrendingUp,
  IndianRupee, Users, Trash2, Loader2, AlertTriangle, Inbox, Mail, Phone, CheckCircle2, Clock, X, Eye
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { formatHourRange, rupees, todayISO } from '../lib/utils';

export default function AdminDashboard() {
  const { user, signOut, session } = useAuth();
  const [tab, setTab] = useState<'overview' | 'bookings' | 'inquiries'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [showClear, setShowClear] = useState(false);
  const [clearing, setClearing] = useState(false);

  const token = session?.access_token;
  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const loadAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [s, b, i] = await Promise.all([
        fetch('/api/stats', { headers: authHeaders }).then((r) => r.json()),
        fetch('/api/bookings').then((r) => r.json()),
        fetch('/api/inquiries', { headers: authHeaders }).then((r) => r.json()),
      ]);
      setStats(s);
      setBookings(Array.isArray(b) ? b : []);
      setInquiries(Array.isArray(i) ? i : []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const clearAll = async () => {
    setClearing(true);
    try {
      await fetch('/api/bookings?all=true', { method: 'DELETE', headers: authHeaders });
      setShowClear(false);
      await loadAll();
    } finally { setClearing(false); }
  };

  const deleteBooking = async (id: number) => {
    await fetch(`/api/bookings?id=${id}`, { method: 'DELETE', headers: authHeaders });
    loadAll();
  };

  const cancelBooking = async (id: number) => {
    await fetch('/api/bookings', { method: 'PUT', headers: authHeaders, body: JSON.stringify({ id, status: 'cancelled' }) });
    loadAll();
  };

  const updateInquiry = async (id: number, status: string) => {
    await fetch('/api/inquiries', { method: 'PUT', headers: authHeaders, body: JSON.stringify({ id, status }) });
    loadAll();
  };

  const deleteInquiry = async (id: number) => {
    await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE', headers: authHeaders });
    loadAll();
  };

  const filteredBookings = filterDate ? bookings.filter((b) => b.booking_date === filterDate) : bookings;
  const maxBar = stats ? Math.max(1, ...stats.last7.map((d: any) => d.count)) : 1;

  return (
    <div className="min-h-screen bg-[#050510] text-[#e8e8f5]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-[#070711]/90 backdrop-blur-xl border-b border-cyan-400/15">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center">
              <Gamepad2 className="h-5 w-5 text-[#050510]" />
            </div>
            <div>
              <div className="font-display font-extrabold text-white tracking-wider text-sm">VIGNESH</div>
              <div className="font-heading text-[9px] tracking-[0.3em] text-cyan-400 uppercase">Admin Console</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-slate-400">{user?.email}</span>
            <button onClick={signOut} className="flex items-center gap-1.5 text-sm clip-corner border border-white/10 px-3.5 py-2 text-slate-300 hover:text-red-300 hover:border-red-400/40 transition">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
            { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex items-center gap-2 font-heading text-sm uppercase tracking-wider px-5 py-2.5 clip-corner transition whitespace-nowrap ${
                tab === t.id ? 'bg-gradient-to-r from-cyan-400 to-violet-500 text-[#050510] font-bold' : 'glass text-slate-300 hover:border-cyan-400/40'
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
              {t.id === 'inquiries' && stats?.newInquiries > 0 && (
                <span className="ml-1 h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-[10px] grid place-items-center">{stats.newInquiries}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="h-10 w-10 text-cyan-400 animate-spin" /></div>
        ) : (
          <>
            {/* OVERVIEW */}
            {tab === 'overview' && stats && (
              <div className="space-y-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { icon: IndianRupee, label: 'Total Revenue', val: rupees(stats.totalRevenue), sub: `${rupees(stats.todayRevenue)} today`, color: 'from-lime-400/20 to-cyan-400/20 border-lime-400/30 text-lime-400' },
                    { icon: CalendarCheck, label: 'Total Bookings', val: stats.totalBookings, sub: `${stats.todayBookings} today`, color: 'from-cyan-400/20 to-violet-500/20 border-cyan-400/30 text-cyan-400' },
                    { icon: TrendingUp, label: 'Confirmed', val: stats.confirmedBookings, sub: 'active sessions', color: 'from-violet-500/20 to-fuchsia-500/20 border-violet-400/30 text-violet-400' },
                    { icon: Inbox, label: 'Inquiries', val: stats.totalInquiries, sub: `${stats.newInquiries} new`, color: 'from-fuchsia-500/20 to-pink-500/20 border-fuchsia-400/30 text-fuchsia-400' },
                  ].map((c, i) => (
                    <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass clip-corner p-5">
                      <div className={`h-11 w-11 rounded-lg bg-gradient-to-br ${c.color} border grid place-items-center mb-4`}>
                        <c.icon className="h-5 w-5" />
                      </div>
                      <div className="font-display font-black text-2xl text-white">{c.val}</div>
                      <div className="font-heading text-xs uppercase tracking-wider text-slate-400 mt-1">{c.label}</div>
                      <div className="text-xs text-cyan-400 mt-0.5">{c.sub}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {/* 7-day chart */}
                  <div className="glass clip-corner p-6">
                    <h3 className="font-display font-bold text-white mb-5 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-cyan-400" /> Bookings — Last 7 Days</h3>
                    <div className="flex items-end justify-between gap-2 h-44">
                      {stats.last7.map((d: any) => (
                        <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                          <div className="text-xs text-cyan-300 font-bold">{d.count}</div>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(d.count / maxBar) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className="w-full bg-gradient-to-t from-cyan-400/40 to-violet-500/80 rounded-t min-h-1"
                          />
                          <div className="text-[10px] text-slate-400 font-heading uppercase">{d.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* per device */}
                  <div className="glass clip-corner p-6">
                    <h3 className="font-display font-bold text-white mb-5 flex items-center gap-2"><Gamepad2 className="h-5 w-5 text-cyan-400" /> Revenue By Station</h3>
                    <div className="space-y-4">
                      {stats.perDevice.map((d: any) => {
                        const max = Math.max(1, ...stats.perDevice.map((x: any) => x.revenue));
                        return (
                          <div key={d.name}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-300">{d.name} <span className="text-slate-500">({d.count})</span></span>
                              <span className="text-cyan-400 font-semibold">{rupees(d.revenue)}</span>
                            </div>
                            <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${(d.revenue / max) * 100}%` }} transition={{ duration: 0.6 }} className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* End of day action */}
                <div className="glass clip-corner p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-amber-400/20">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-lg bg-amber-400/15 border border-amber-400/30 grid place-items-center">
                      <Clock className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-white">End of Day Reset</h4>
                      <p className="text-sm text-slate-400">Clear all bookings to start fresh for the next day.</p>
                    </div>
                  </div>
                  <button onClick={() => setShowClear(true)} className="clip-corner border border-red-400/40 text-red-300 font-display font-bold uppercase tracking-wider px-5 py-2.5 hover:bg-red-500/10 transition flex items-center gap-2">
                    <Trash2 className="h-4 w-4" /> Clear All Bookings
                  </button>
                </div>
              </div>
            )}

            {/* BOOKINGS */}
            {tab === 'bookings' && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="glass clip-corner px-4 py-2 bg-transparent text-white outline-none [color-scheme:dark] font-heading text-sm" />
                    {filterDate && <button onClick={() => setFilterDate('')} className="text-sm text-slate-400 hover:text-cyan-400">Clear filter</button>}
                    <button onClick={() => setFilterDate(todayISO())} className="text-sm text-cyan-400 hover:text-cyan-300">Today</button>
                  </div>
                  <button onClick={() => setShowClear(true)} className="clip-corner border border-red-400/40 text-red-300 text-sm font-heading uppercase tracking-wider px-4 py-2 hover:bg-red-500/10 transition flex items-center gap-2">
                    <Trash2 className="h-4 w-4" /> Clear All
                  </button>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="glass clip-corner p-12 text-center text-slate-400"><Inbox className="h-10 w-10 mx-auto mb-3 opacity-50" /> No bookings found.</div>
                ) : (
                  <div className="glass clip-corner overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-left font-heading text-xs uppercase tracking-wider text-slate-400">
                          <th className="p-4">ID</th><th className="p-4">Customer</th><th className="p-4">Station</th>
                          <th className="p-4">Date / Slot</th><th className="p-4">Ppl</th><th className="p-4">Total</th>
                          <th className="p-4">Status</th><th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((b) => (
                          <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                            <td className="p-4 text-cyan-400 font-mono">#{String(b.id).padStart(4, '0')}</td>
                            <td className="p-4"><div className="text-white font-semibold">{b.customer_name}</div><div className="text-slate-500 text-xs">{b.contact}</div></td>
                            <td className="p-4 text-slate-300">{b.device_name}</td>
                            <td className="p-4 text-slate-300"><div>{new Date(b.booking_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</div><div className="text-xs text-slate-500">{formatHourRange(b.start_hour, b.num_hours)}</div></td>
                            <td className="p-4 text-slate-300">{b.num_people}</td>
                            <td className="p-4 text-lime-400 font-semibold">{rupees(b.total_price)}</td>
                            <td className="p-4">
                              <span className={`text-[10px] font-heading uppercase tracking-wider px-2 py-1 rounded border ${b.status === 'confirmed' ? 'bg-lime-400/15 border-lime-400/30 text-lime-300' : 'bg-red-500/15 border-red-500/30 text-red-300'}`}>{b.status}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-2">
                                {b.status === 'confirmed' && <button onClick={() => cancelBooking(b.id)} title="Cancel" className="text-slate-400 hover:text-amber-400"><X className="h-4 w-4" /></button>}
                                <button onClick={() => deleteBooking(b.id)} title="Delete" className="text-slate-400 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* INQUIRIES */}
            {tab === 'inquiries' && (
              <div className="grid gap-4 md:grid-cols-2">
                {inquiries.length === 0 ? (
                  <div className="glass clip-corner p-12 text-center text-slate-400 md:col-span-2"><Inbox className="h-10 w-10 mx-auto mb-3 opacity-50" /> No inquiries yet.</div>
                ) : inquiries.map((q) => (
                  <motion.div key={q.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass clip-corner p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center font-display font-bold text-[#050510] text-sm">{q.name[0]}</div>
                          <div>
                            <div className="font-semibold text-white">{q.name}</div>
                            <div className="text-xs text-slate-500">{new Date(q.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-heading uppercase tracking-wider px-2 py-1 rounded border ${q.status === 'new' ? 'bg-cyan-400/15 border-cyan-400/30 text-cyan-300' : q.status === 'resolved' ? 'bg-lime-400/15 border-lime-400/30 text-lime-300' : 'bg-white/5 border-white/10 text-slate-400'}`}>{q.status}</span>
                    </div>
                    {q.subject && <div className="mt-3 font-display font-bold text-cyan-300 text-sm">{q.subject}</div>}
                    <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">{q.message}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                      {q.email && <a href={`mailto:${q.email}`} className="flex items-center gap-1 hover:text-cyan-400"><Mail className="h-3.5 w-3.5" /> {q.email}</a>}
                      {q.phone && <a href={`tel:${q.phone}`} className="flex items-center gap-1 hover:text-cyan-400"><Phone className="h-3.5 w-3.5" /> {q.phone}</a>}
                    </div>
                    <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3">
                      {q.status !== 'read' && q.status !== 'resolved' && <button onClick={() => updateInquiry(q.id, 'read')} className="flex items-center gap-1 text-xs text-slate-300 hover:text-cyan-400"><Eye className="h-3.5 w-3.5" /> Mark Read</button>}
                      {q.status !== 'resolved' && <button onClick={() => updateInquiry(q.id, 'resolved')} className="flex items-center gap-1 text-xs text-lime-400 hover:text-lime-300"><CheckCircle2 className="h-3.5 w-3.5" /> Resolve</button>}
                      <button onClick={() => deleteInquiry(q.id)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 ml-auto"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Clear confirm modal */}
      {showClear && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm px-5" onClick={() => setShowClear(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="glass clip-corner p-7 max-w-md w-full">
            <div className="h-12 w-12 rounded-lg bg-red-500/15 border border-red-500/30 grid place-items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="font-display font-bold text-xl text-white">Clear All Bookings?</h3>
            <p className="text-slate-400 mt-2 text-sm">This permanently deletes <strong className="text-white">every booking</strong> in the system. Use this at the end of the day. This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowClear(false)} className="flex-1 clip-corner border border-white/10 text-slate-300 font-heading uppercase tracking-wider text-sm px-5 py-3 hover:border-white/20">Cancel</button>
              <button onClick={clearAll} disabled={clearing} className="flex-1 clip-corner bg-red-500 text-white font-display font-bold uppercase tracking-wider text-sm px-5 py-3 hover:bg-red-600 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {clearing ? <><Loader2 className="h-4 w-4 animate-spin" /> Clearing...</> : <><Trash2 className="h-4 w-4" /> Clear All</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
