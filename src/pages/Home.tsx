import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Monitor, Gamepad2, Car, Glasses, Zap, Trophy, Clock, Users, ArrowRight, Star } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const iconFor: Record<string, any> = { monitor: Monitor, gamepad: Gamepad2, car: Car, glasses: Glasses };

export default function Home() {
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/devices').then((r) => r.json()).then((d) => Array.isArray(d) && setDevices(d)).catch(() => {});
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero.jpg" alt="Gaming Zone" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/70 via-[#050510]/85 to-[#050510]" />
          <div className="absolute inset-0 cyber-grid opacity-40 cyber-grid-fade" />
        </div>

        {/* Floating neon orbs */}
        <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-20 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-[100px] animate-pulse-glow" />

        <div className="relative max-w-7xl mx-auto px-5 pt-28 pb-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 px-4 py-1.5 mb-6"
          >
            <span className="h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
            <span className="font-heading text-xs uppercase tracking-[0.25em] text-cyan-300">Now Open · 10 AM – 11 PM</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-black text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-4xl"
          >
            <span className="text-white">ENTER THE</span><br />
            <span className="text-gradient-neon glow-cyan">GAME ZONE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 max-w-xl font-body"
          >
            Vignesh Gaming Zone is where legends are made. Battle on elite PCs, dominate on consoles,
            burn rubber in racing rigs, and dive into VR worlds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link to="/booking" className="group clip-corner bg-gradient-to-r from-cyan-400 to-violet-500 text-[#050510] font-display font-bold uppercase tracking-wider px-7 py-3.5 hover:shadow-neon-cyan transition-all flex items-center gap-2">
              Book Your Slot <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/services" className="clip-corner border border-cyan-400/40 text-cyan-300 font-display font-bold uppercase tracking-wider px-7 py-3.5 hover:bg-cyan-400/10 transition-all">
              View Pricing
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl"
          >
            {[
              { icon: Monitor, val: '10', label: 'Gaming PCs' },
              { icon: Gamepad2, val: '3', label: 'PlayStations' },
              { icon: Car, val: '2', label: 'Racing Sims' },
              { icon: Glasses, val: '2', label: 'VR Sets' },
            ].map((s) => (
              <div key={s.label} className="glass clip-corner p-4">
                <s.icon className="h-6 w-6 text-cyan-400 mb-2" />
                <div className="font-display font-black text-3xl text-white">{s.val}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-heading">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 px-5">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Why Vignesh" title="Built For Champions" subtitle="Pro-grade hardware, lightning networks and an atmosphere engineered to win." />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: Zap, title: 'Zero Lag Setup', desc: 'High-refresh monitors, fiber internet and top-tier rigs tuned for competitive play.' },
              { icon: Trophy, title: 'Tournaments', desc: 'Regular in-house tournaments with cash prizes, leaderboards and bragging rights.' },
              { icon: Users, title: 'Squad Friendly', desc: 'Plenty of stations for the whole crew. Co-op, LAN parties and group bookings welcome.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative glass clip-corner p-7 hover:border-cyan-400/40 transition-all scanline overflow-hidden"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border border-cyan-400/30 grid place-items-center mb-5">
                  <f.icon className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-24 px-5 relative">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative max-w-7xl mx-auto">
          <SectionHeader eyebrow="Our Arsenal" title="Pick Your Battle Station" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {devices.map((d, i) => {
              const Icon = iconFor[d.icon] || Monitor;
              return (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group glass clip-corner overflow-hidden hover:shadow-neon-cyan transition-all"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={`/images/${d.icon === 'monitor' ? 'pc' : d.icon === 'gamepad' ? 'ps' : d.icon === 'car' ? 'racing' : 'vr'}.jpg`} alt={d.name} className="w-full h-full object-cover opacity-70 group-hover:scale-110 group-hover:opacity-90 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1f] to-transparent" />
                    <div className="absolute top-3 left-3 h-9 w-9 rounded-lg bg-[#050510]/80 border border-cyan-400/30 grid place-items-center backdrop-blur">
                      <Icon className="h-4.5 w-4.5 text-cyan-400" />
                    </div>
                    <div className="absolute bottom-3 right-3 font-display font-black text-cyan-400 glow-cyan">₹{d.price_per_hour}<span className="text-xs text-slate-400 font-body">/hr</span></div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-white">{d.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-heading">{d.quantity} stations available</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link to="/services" className="inline-flex items-center gap-2 font-heading uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition">
              Explore All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto relative glass clip-corner p-10 md:p-16 text-center overflow-hidden scanline">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-96 bg-cyan-500/20 blur-[80px]" />
          <Clock className="h-10 w-10 text-cyan-400 mx-auto mb-5" />
          <h2 className="font-display font-black text-3xl md:text-5xl text-white">Ready to <span className="text-gradient-neon">Level Up?</span></h2>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto text-lg">Slots fill fast. Reserve your station now and skip the queue.</p>
          <div className="flex items-center justify-center gap-1 mt-6 text-amber-400">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
            <span className="text-slate-400 ml-2 text-sm">Rated 4.9 by 2,000+ gamers</span>
          </div>
          <Link to="/booking" className="mt-8 inline-flex items-center gap-2 clip-corner bg-gradient-to-r from-cyan-400 to-violet-500 text-[#050510] font-display font-bold uppercase tracking-wider px-8 py-4 hover:shadow-neon-cyan transition-all">
            Book Now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
