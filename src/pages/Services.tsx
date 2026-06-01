import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Monitor, Gamepad2, Car, Glasses, Check, ArrowRight } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const iconFor: Record<string, any> = { monitor: Monitor, gamepad: Gamepad2, car: Car, glasses: Glasses };
const imgFor: Record<string, string> = { monitor: 'pc', gamepad: 'ps', car: 'racing', glasses: 'vr' };
const featuresFor: Record<string, string[]> = {
  monitor: ['RTX graphics & 240Hz', 'Mechanical keyboards', 'Pro gaming mice', 'AAA + esports titles'],
  gamepad: ['4K big-screen TVs', 'Latest exclusives', 'Couch co-op ready', 'Sports & fighting games'],
  car: ['Force-feedback wheel', 'Full pedal set', 'Triple-screen view', 'Realistic physics'],
  glasses: ['Room-scale tracking', 'Premium headsets', 'Immersive titles', 'Guided sessions'],
};

export default function Services() {
  const [devices, setDevices] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/devices').then((r) => r.json()).then((d) => { if (Array.isArray(d)) setDevices(d); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...Array.from(new Set(devices.map((d) => d.category)))];
  const filtered = filter === 'all' ? devices : devices.filter((d) => d.category === filter);

  return (
    <div className="pt-28 px-5">
      <div className="max-w-7xl mx-auto py-12">
        <SectionHeader eyebrow="Our Services" title="Choose Your Weapon" subtitle="Premium gaming stations priced per hour. All sessions run between 10 AM and 11 PM." />

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`font-heading text-sm uppercase tracking-wider px-5 py-2 clip-corner transition ${
                filter === c ? 'bg-gradient-to-r from-cyan-400 to-violet-500 text-[#050510] font-bold' : 'border border-white/10 text-slate-300 hover:border-cyan-400/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="h-12 w-12 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" /></div>
        ) : (
          <div className="mt-12 grid gap-7 md:grid-cols-2">
            {filtered.map((d, i) => {
              const Icon = iconFor[d.icon] || Monitor;
              return (
                <motion.div key={d.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="group glass clip-corner overflow-hidden hover:shadow-neon-cyan transition-all">
                  <div className="grid sm:grid-cols-2">
                    <div className="relative h-52 sm:h-full overflow-hidden">
                      <img src={`/images/${imgFor[d.icon]}.jpg`} alt={d.name} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d1f]/80" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-cyan-400/20 to-violet-500/20 border border-cyan-400/30 grid place-items-center">
                          <Icon className="h-5 w-5 text-cyan-400" />
                        </div>
                        <span className="font-heading text-[10px] uppercase tracking-widest px-2 py-1 rounded border border-cyan-400/30 text-cyan-300">{d.category}</span>
                      </div>
                      <h3 className="font-display font-bold text-2xl text-white mt-4">{d.name}</h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="font-display font-black text-3xl text-gradient-neon">₹{d.price_per_hour}</span>
                        <span className="text-slate-400">/ hour</span>
                      </div>
                      <ul className="mt-4 space-y-1.5">
                        {(featuresFor[d.icon] || []).map((f) => (
                          <li key={f} className="flex items-center gap-2 text-sm text-slate-300"><Check className="h-4 w-4 text-lime-400 shrink-0" /> {f}</li>
                        ))}
                      </ul>
                      <Link to="/booking" className="mt-5 inline-flex items-center gap-2 font-heading text-sm uppercase tracking-wider text-cyan-400 hover:text-cyan-300">
                        Book this <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
