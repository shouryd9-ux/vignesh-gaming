import { motion } from 'framer-motion';
import { Target, Eye, Heart, Cpu, Wifi, ShieldCheck, Coffee } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

export default function About() {
  return (
    <div className="pt-28">
      {/* Hero */}
      <section className="px-5 py-16 relative">
        <div className="absolute inset-0 cyber-grid opacity-20 cyber-grid-fade" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="font-heading text-xs uppercase tracking-[0.35em] text-cyan-400">Our Story</span>
            <h1 className="font-display font-black text-4xl md:text-6xl text-white mt-3 leading-tight">
              Where Passion Meets <span className="text-gradient-neon">Performance</span>
            </h1>
            <p className="mt-6 text-slate-300 text-lg leading-relaxed">
              Vignesh Gaming Zone was born from a simple obsession — giving gamers the ultimate place to play.
              No compromise on hardware, no compromise on atmosphere. From casual sessions to competitive grinds,
              we built a sanctuary for every kind of player.
            </p>
            <p className="mt-4 text-slate-400 leading-relaxed">
              Today, our floor packs 10 high-end gaming PCs, 3 next-gen PlayStations, 2 full-motion racing simulators
              and 2 premium VR setups — all maintained to esports standards and open from 10 AM to 11 PM, every single day.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative">
            <div className="absolute -inset-2 bg-gradient-to-br from-cyan-400/30 to-fuchsia-500/30 blur-2xl" />
            <img src="/images/about.jpg" alt="Gaming arena" className="relative clip-corner w-full h-80 object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="px-5 py-20">
        <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: 'Our Mission', desc: 'Deliver the most immersive, lag-free and affordable gaming experience in the city — for everyone.' },
            { icon: Eye, title: 'Our Vision', desc: 'To become the regional home of esports culture, nurturing the next generation of pro gamers.' },
            { icon: Heart, title: 'Our Values', desc: 'Fair play, community first, relentless quality, and a genuine love for games at our core.' },
          ].map((v, i) => (
            <motion.div key={v.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass clip-corner p-7 hover:border-cyan-400/40 transition">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border border-cyan-400/30 grid place-items-center mb-5">
                <v.icon className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">{v.title}</h3>
              <p className="text-slate-400 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Specs */}
      <section className="px-5 py-20 relative">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative max-w-7xl mx-auto">
          <SectionHeader eyebrow="The Experience" title="Engineered To Win" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Cpu, title: 'Elite Hardware', desc: 'RTX GPUs, high-refresh panels, mechanical decks.' },
              { icon: Wifi, title: 'Fiber Network', desc: 'Ultra-low ping fiber for flawless online play.' },
              { icon: ShieldCheck, title: 'Hygienic & Safe', desc: 'Sanitized peripherals and a clean, secure space.' },
              { icon: Coffee, title: 'Snacks & Chill', desc: 'Energy drinks, snacks and comfy zones to recharge.' },
            ].map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass clip-corner p-6 text-center hover:shadow-neon-cyan transition">
                <s.icon className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
                <h4 className="font-display font-bold text-white">{s.title}</h4>
                <p className="text-sm text-slate-400 mt-2">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
