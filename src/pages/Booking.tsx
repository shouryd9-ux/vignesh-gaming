import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Gamepad2, Car, Glasses, Calendar, Clock, Users, User, Phone, CheckCircle2, AlertTriangle, PartyPopper, ArrowRight, Loader2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { HOURS, formatHour, formatHourRange, todayISO, rupees } from '../lib/utils';

const iconFor: Record<string, any> = { monitor: Monitor, gamepad: Gamepad2, car: Car, glasses: Glasses };

type Avail = { date: string; devices: any[]; hours: number[] };

export default function Booking() {
  const [date, setDate] = useState(todayISO());
  const [avail, setAvail] = useState<Avail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', contact: '', people: 1, hours: 1, startHour: 10 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [conflict, setConflict] = useState('');
  const [confirmed, setConfirmed] = useState<any | null>(null);

  const loadAvail = useCallback(async (d: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/availability?date=${d}`);
      const data = await res.json();
      setAvail(data);
    } catch { setAvail(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAvail(date); }, [date, loadAvail]);

  // availability for selected device across requested range
  const rangeAvailable = (() => {
    if (!selectedDevice || !avail) return null;
    const dev = avail.devices.find((x) => x.id === selectedDevice.id);
    if (!dev) return null;
    let minAvail = dev.quantity;
    for (let h = form.startHour; h < form.startHour + form.hours; h++) {
      const cell = dev.hourMap[h];
      if (!cell) return 0;
      minAvail = Math.min(minAvail, cell.available);
    }
    return minAvail;
  })();

  const endHour = form.startHour + form.hours;
  const validRange = endHour <= 23;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!/^[0-9+\-\s]{7,15}$/.test(form.contact)) e.contact = 'Valid contact required';
    if (form.people < 1) e.people = 'At least 1 person';
    if (form.hours < 1) e.hours = 'At least 1 hour';
    if (!validRange) e.hours = 'Booking must end by 11:00 PM';
    if (!selectedDevice) e.device = 'Select a device';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setConflict('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          contact: form.contact,
          num_people: form.people,
          num_hours: form.hours,
          start_hour: form.startHour,
          booking_date: date,
          device_id: selectedDevice.id,
          device_name: selectedDevice.name,
          price_per_hour: selectedDevice.price_per_hour,
        }),
      });
      const data = await res.json();
      if (res.status === 409) { setConflict(data.error); await loadAvail(date); return; }
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      setConfirmed(data);
      await loadAvail(date);
    } catch (err: any) {
      setConflict(err.message || 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setConfirmed(null);
    setSelectedDevice(null);
    setForm({ name: '', contact: '', people: 1, hours: 1, startHour: 10 });
    setConflict('');
  };

  // THANK YOU SCREEN
  if (confirmed) {
    return (
      <div className="pt-28 px-5 min-h-screen">
        <div className="max-w-2xl mx-auto py-12">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass clip-corner p-8 md:p-10 text-center relative overflow-hidden scanline">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-72 bg-lime-400/20 blur-[70px]" />
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="relative h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-lime-400 to-cyan-400 grid place-items-center mb-5">
              <PartyPopper className="h-10 w-10 text-[#050510]" />
            </motion.div>
            <h2 className="font-display font-black text-3xl md:text-4xl text-white">Thank You, <span className="text-gradient-neon">{confirmed.customer_name.split(' ')[0]}!</span></h2>
            <p className="text-slate-300 mt-3">Your slot is locked in. Here are your booking details:</p>

            <div className="mt-7 text-left glass clip-corner p-6 space-y-3">
              {[
                ['Booking ID', `#VGZ${String(confirmed.id).padStart(4, '0')}`],
                ['Name', confirmed.customer_name],
                ['Contact', confirmed.contact],
                ['Station', confirmed.device_name],
                ['Date', new Date(confirmed.booking_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
                ['Time Slot', formatHourRange(confirmed.start_hour, confirmed.num_hours)],
                ['People', confirmed.num_people],
                ['Duration', `${confirmed.num_hours} hour(s)`],
                ['Rate', `${rupees(confirmed.price_per_hour)}/hr`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-white/5 pb-2 last:border-0">
                  <span className="text-slate-400 font-heading text-sm uppercase tracking-wider">{k}</span>
                  <span className="text-white font-semibold">{v}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2">
                <span className="text-cyan-400 font-display font-bold uppercase tracking-wider">Total</span>
                <span className="font-display font-black text-2xl text-gradient-neon">{rupees(confirmed.total_price)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-5">📩 A confirmation has been recorded. Please arrive 5 minutes early. Payment on arrival.</p>

            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <button onClick={resetBooking} className="flex-1 clip-corner bg-gradient-to-r from-cyan-400 to-violet-500 text-[#050510] font-display font-bold uppercase tracking-wider px-6 py-3.5 hover:shadow-neon-cyan transition">Book Another</button>
              <Link to="/" className="flex-1 clip-corner border border-cyan-400/40 text-cyan-300 font-display font-bold uppercase tracking-wider px-6 py-3.5 hover:bg-cyan-400/10 transition grid place-items-center">Back Home</Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 px-5">
      <div className="max-w-7xl mx-auto py-12">
        <SectionHeader eyebrow="Reserve Your Station" title="Book A Slot" subtitle="Pick a date, choose your station and lock in your time. Slots run 10 AM – 11 PM." />

        {/* Date picker */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <div className="glass clip-corner px-5 py-3 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-cyan-400" />
            <input
              type="date"
              value={date}
              min={todayISO()}
              onChange={(e) => { setDate(e.target.value); setSelectedDevice(null); }}
              className="bg-transparent text-white outline-none font-heading [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Availability grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 text-cyan-400 animate-spin" /></div>
        ) : avail ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {avail.devices.map((d) => {
              const Icon = iconFor[d.icon] || Monitor;
              const totalAvailNow = HOURS.reduce((s, h) => s + (d.hourMap[h]?.available || 0), 0);
              const fullyBooked = HOURS.every((h) => (d.hourMap[h]?.available || 0) === 0);
              const isSel = selectedDevice?.id === d.id;
              return (
                <motion.div
                  key={d.id}
                  layout
                  onClick={() => !fullyBooked && setSelectedDevice(d)}
                  className={`glass clip-corner p-5 transition-all cursor-pointer ${isSel ? 'border-cyan-400/60 shadow-neon-cyan' : 'hover:border-cyan-400/30'} ${fullyBooked ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-11 w-11 rounded-lg border grid place-items-center ${isSel ? 'bg-cyan-400/20 border-cyan-400/50' : 'bg-white/5 border-white/10'}`}>
                        <Icon className={`h-5 w-5 ${isSel ? 'text-cyan-300' : 'text-cyan-400'}`} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-white">{d.name}</h3>
                        <p className="text-xs text-slate-400 font-heading uppercase tracking-wider">{d.quantity} units · {rupees(d.price_per_hour)}/hr</p>
                      </div>
                    </div>
                    {fullyBooked ? (
                      <span className="font-heading text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-red-500/15 border border-red-500/30 text-red-300">Fully Booked</span>
                    ) : (
                      <span className="font-heading text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-lime-400/15 border border-lime-400/30 text-lime-300">Available</span>
                    )}
                  </div>

                  {/* hourly slots */}
                  <div className="mt-4 grid grid-cols-7 sm:grid-cols-13 gap-1.5">
                    {d.hourMap && HOURS.map((h) => {
                      const cell = d.hourMap[h];
                      const free = cell?.available || 0;
                      const total = cell?.total || d.quantity;
                      const ratio = free / total;
                      let cls = 'bg-lime-400/20 text-lime-300 border-lime-400/30';
                      if (free === 0) cls = 'bg-red-500/15 text-red-400 border-red-500/30';
                      else if (ratio <= 0.34) cls = 'bg-amber-400/15 text-amber-300 border-amber-400/30';
                      return (
                        <div key={h} title={`${formatHour(h)} — ${free}/${total} free`} className={`text-[9px] font-heading text-center py-1 rounded border ${cls}`}>
                          <div className="font-bold">{h}</div>
                          <div>{free}</div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-heading uppercase tracking-wider">{totalAvailNow} unit-hours free today · top number = hour, bottom = free units</p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-slate-400 py-12">Could not load availability. Please refresh.</p>
        )}

        {/* Booking form */}
        <AnimatePresence>
          {selectedDevice && (
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-10 glass clip-corner p-7 max-w-3xl mx-auto overflow-hidden"
            >
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                Booking: <span className="text-gradient-neon">{selectedDevice.name}</span>
              </h3>

              {conflict && (
                <div className="mt-4 flex items-center gap-3 bg-red-500/10 border border-red-500/30 clip-corner p-4 text-red-300">
                  <AlertTriangle className="h-5 w-5 shrink-0" /> {conflict}
                </div>
              )}

              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <BField label="Full Name" icon={User} error={errors.name}>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="binp" placeholder="Your name" />
                </BField>
                <BField label="Contact Number" icon={Phone} error={errors.contact}>
                  <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="binp" placeholder="+91 98765 43210" />
                </BField>
                <BField label="Number of People" icon={Users} error={errors.people}>
                  <input type="number" min={1} max={20} value={form.people} onChange={(e) => setForm({ ...form, people: Math.max(1, +e.target.value) })} className="binp" />
                </BField>
                <BField label="Start Time" icon={Clock}>
                  <select value={form.startHour} onChange={(e) => setForm({ ...form, startHour: +e.target.value })} className="binp [color-scheme:dark]">
                    {HOURS.map((h) => <option key={h} value={h}>{formatHour(h)}</option>)}
                  </select>
                </BField>
                <BField label="Number of Hours" icon={Clock} error={errors.hours}>
                  <select value={form.hours} onChange={(e) => setForm({ ...form, hours: +e.target.value })} className="binp [color-scheme:dark]">
                    {[1, 2, 3, 4, 5, 6].map((h) => <option key={h} value={h} disabled={form.startHour + h > 23}>{h} hour{h > 1 ? 's' : ''}</option>)}
                  </select>
                </BField>
                <BField label="Date" icon={Calendar}>
                  <input value={new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} disabled className="binp opacity-70" />
                </BField>
              </div>

              {/* Summary */}
              <div className="mt-5 glass clip-corner p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-slate-300">
                  <span className="text-slate-400">Slot:</span> {validRange ? formatHourRange(form.startHour, form.hours) : <span className="text-red-400">Exceeds 11 PM</span>}
                  <span className="mx-2 text-white/20">|</span>
                  <span className={rangeAvailable === 0 ? 'text-red-400' : 'text-lime-400'}>
                    {rangeAvailable === null ? '' : rangeAvailable === 0 ? 'No units free for this slot' : `${rangeAvailable} unit(s) free`}
                  </span>
                </div>
                <div className="font-display font-black text-2xl text-gradient-neon">{rupees(form.hours * selectedDevice.price_per_hour)}</div>
              </div>

              <button
                disabled={submitting || rangeAvailable === 0 || !validRange}
                className="mt-5 w-full clip-corner bg-gradient-to-r from-cyan-400 to-violet-500 text-[#050510] font-display font-bold uppercase tracking-wider px-6 py-3.5 hover:shadow-neon-cyan transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Booking...</> : <><CheckCircle2 className="h-4 w-4" /> Confirm Booking <ArrowRight className="h-4 w-4" /></>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <style>{`.binp{width:100%;background:rgba(5,5,16,0.6);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.65rem 0.85rem;color:#e8e8f5;font-family:'Rajdhani',sans-serif;outline:none;transition:.2s}.binp:focus{border-color:rgba(0,240,255,0.5);box-shadow:0 0 0 3px rgba(0,240,255,0.1)}.binp::placeholder{color:#64748b}@media(min-width:640px){.sm\\:grid-cols-13{grid-template-columns:repeat(13,minmax(0,1fr))}}`}</style>
    </div>
  );
}

function BField({ label, icon: Icon, error, children }: { label: string; icon: any; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 font-heading text-xs uppercase tracking-widest text-slate-400 mb-1.5">
        <Icon className="h-3.5 w-3.5 text-cyan-400" /> {label}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
