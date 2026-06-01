import { Link } from 'react-router-dom';
import { Gamepad2, MapPin, Phone, Mail, Clock, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-cyan-400/15 bg-[#070711] mt-20">
      <div className="absolute inset-0 cyber-grid opacity-30 cyber-grid-fade" />
      <div className="relative max-w-7xl mx-auto px-5 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 grid place-items-center">
              <Gamepad2 className="h-5 w-5 text-[#050510]" />
            </div>
            <div className="font-display font-extrabold text-white tracking-wider">VIGNESH</div>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            The ultimate gaming destination. Premium PCs, consoles, racing simulators and VR — all under one neon roof.
          </p>
          <div className="flex gap-3 mt-5">
            {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-white text-sm uppercase tracking-wider mb-4">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            {[['Home','/'],['About','/about'],['Services','/services'],['Booking','/booking'],['Blog','/blog']].map(([l,p]) => (
              <li key={p}><Link to={p} className="text-slate-400 hover:text-cyan-400 transition">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-white text-sm uppercase tracking-wider mb-4">Pricing</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li className="flex justify-between"><span>Gaming PC</span><span className="text-cyan-400">₹40/hr</span></li>
            <li className="flex justify-between"><span>PlayStation</span><span className="text-cyan-400">₹60/hr</span></li>
            <li className="flex justify-between"><span>Racing Sim</span><span className="text-cyan-400">₹120/hr</span></li>
            <li className="flex justify-between"><span>VR Set</span><span className="text-cyan-400">₹100/hr</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-white text-sm uppercase tracking-wider mb-4">Visit Us</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex gap-2.5"><MapPin className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" /> Main Road, Tech City, Tamil Nadu</li>
            <li className="flex gap-2.5"><Phone className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" /> +91 98765 43210</li>
            <li className="flex gap-2.5"><Mail className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" /> hello@vigneshgaming.com</li>
            <li className="flex gap-2.5"><Clock className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" /> Open daily 10:00 AM – 11:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/5 py-5 px-5 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
        <span>© {new Date().getFullYear()} Vignesh Gaming Zone. All rights reserved.</span>
        <Link to="/admin/login" className="hover:text-cyan-400 transition">Admin Login</Link>
      </div>
    </footer>
  );
}
