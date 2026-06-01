import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const reviews = [
  { name: 'Arjun K.', role: 'Valorant Player', text: 'Best gaming zone in town hands down. The PCs are insane — zero lag, buttery 240Hz. I practically live here on weekends.', rating: 5 },
  { name: 'Priya S.', role: 'Casual Gamer', text: 'Booked the PlayStation for my brother\u2019s birthday. The staff set everything up and it was an absolute blast. Highly recommend!', rating: 5 },
  { name: 'Karthik R.', role: 'Sim Racer', text: 'The racing simulators are next level. Full motion, real pedals, triple screens — it feels exactly like the real track.', rating: 5 },
  { name: 'Sneha R.', role: 'VR Enthusiast', text: 'First time trying VR here and I was blown away. Clean headsets, helpful guides and seriously immersive games.', rating: 5 },
  { name: 'Mohammed A.', role: 'Esports Captain', text: 'We host our team scrims here every week. Reliable fiber, great atmosphere and fair pricing. Perfect esports venue.', rating: 5 },
  { name: 'Divya N.', role: 'Regular Member', text: 'Affordable per-hour rates and the booking system is so easy. I love that I can reserve my slot before I even leave home.', rating: 5 },
];

export default function Testimonials() {
  return (
    <div className="pt-28 px-5 relative">
      <div className="absolute inset-0 cyber-grid opacity-15 cyber-grid-fade" />
      <div className="relative max-w-7xl mx-auto py-12">
        <SectionHeader eyebrow="Player Reviews" title="Loved By Gamers" subtitle="Don\u2019t just take our word for it — here\u2019s what the community says." />

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
          <div><div className="font-display font-black text-5xl text-gradient-neon">4.9</div><div className="text-slate-400 text-sm uppercase tracking-wider">Average Rating</div></div>
          <div className="hidden sm:block h-12 w-px bg-white/10" />
          <div><div className="font-display font-black text-5xl text-gradient-neon">2,000+</div><div className="text-slate-400 text-sm uppercase tracking-wider">Happy Gamers</div></div>
          <div className="hidden sm:block h-12 w-px bg-white/10" />
          <div><div className="font-display font-black text-5xl text-gradient-neon">50K+</div><div className="text-slate-400 text-sm uppercase tracking-wider">Hours Played</div></div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="glass clip-corner p-7 hover:border-cyan-400/40 transition relative">
              <Quote className="h-8 w-8 text-cyan-400/30 absolute top-5 right-5" />
              <div className="flex gap-0.5 text-amber-400 mb-4">{[...Array(r.rating)].map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}</div>
              <p className="text-slate-300 leading-relaxed">“{r.text}”</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center font-display font-bold text-[#050510]">{r.name[0]}</div>
                <div>
                  <div className="font-display font-bold text-white text-sm">{r.name}</div>
                  <div className="text-xs text-cyan-400 uppercase tracking-wider font-heading">{r.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
