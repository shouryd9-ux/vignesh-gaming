import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const posts = [
  { title: 'Top 10 FPS Games to Master in 2026', cat: 'Esports', date: 'May 28, 2026', img: 'pc', excerpt: 'From tactical shooters to fast-paced arena battles, here are the titles every competitive player should be grinding right now.' },
  { title: 'How Racing Simulators Make You a Better Driver', cat: 'Sim Racing', date: 'May 20, 2026', img: 'racing', excerpt: 'Force feedback, braking points and racing lines — discover why pros train on sims and how you can too.' },
  { title: 'VR Gaming: Beginner\u2019s Guide to Stepping Inside', cat: 'VR', date: 'May 12, 2026', img: 'vr', excerpt: 'New to virtual reality? Here is everything you need to know before strapping on a headset at our zone.' },
  { title: 'Hosting the Perfect Gaming Birthday Party', cat: 'Events', date: 'May 4, 2026', img: 'ps', excerpt: 'Group bookings, snacks and friendly tournaments — plan an unforgettable celebration at Vignesh Gaming Zone.' },
  { title: 'Building a Pro Gaming Routine', cat: 'Tips', date: 'Apr 26, 2026', img: 'pc', excerpt: 'Practice schedules, aim training and mindset — the habits that separate casuals from champions.' },
  { title: 'Console vs PC: Which Should You Choose?', cat: 'Guides', date: 'Apr 18, 2026', img: 'ps', excerpt: 'The age-old debate settled with honest pros and cons for every type of gamer.' },
];

export default function Blog() {
  return (
    <div className="pt-28 px-5">
      <div className="max-w-7xl mx-auto py-12">
        <SectionHeader eyebrow="The Arena Journal" title="Gaming Insights & News" subtitle="Tips, guides and stories from the Vignesh Gaming community." />
        <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <motion.article key={p.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="group glass clip-corner overflow-hidden hover:shadow-neon-cyan transition-all flex flex-col">
              <div className="relative h-44 overflow-hidden">
                <img src={`/images/${p.img}.jpg`} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1f] to-transparent" />
                <span className="absolute top-3 left-3 font-heading text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-[#050510]/80 border border-cyan-400/30 text-cyan-300 backdrop-blur">{p.cat}</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2"><Calendar className="h-3.5 w-3.5" /> {p.date}</div>
                <h3 className="font-display font-bold text-lg text-white leading-snug group-hover:text-cyan-300 transition">{p.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed flex-1">{p.excerpt}</p>
                <button className="mt-4 inline-flex items-center gap-2 font-heading text-sm uppercase tracking-wider text-cyan-400 hover:text-cyan-300 self-start">Read More <ArrowRight className="h-4 w-4" /></button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
