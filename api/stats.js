import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

    const { data: bookings, error: bErr } = await supabase.from('bookings').select('*');
    if (bErr) throw bErr;
    const { data: inquiries, error: iErr } = await supabase.from('inquiries').select('*');
    if (iErr) throw iErr;
    const { data: devices, error: dErr } = await supabase.from('devices').select('*');
    if (dErr) throw dErr;

    const today = new Date().toISOString().slice(0, 10);
    const confirmed = bookings.filter((b) => b.status === 'confirmed');
    const revenue = confirmed.reduce((s, b) => s + (b.total_price || 0), 0);
    const todayBookings = bookings.filter((b) => b.booking_date === today);
    const todayRevenue = todayBookings.filter((b) => b.status === 'confirmed')
      .reduce((s, b) => s + (b.total_price || 0), 0);

    // Revenue per device
    const perDevice = devices.map((d) => {
      const db = confirmed.filter((b) => b.device_id === d.id);
      return { name: d.name, revenue: db.reduce((s, b) => s + (b.total_price || 0), 0), count: db.length };
    });

    // Bookings per last 7 days
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayB = bookings.filter((b) => b.booking_date === key);
      last7.push({
        date: key,
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count: dayB.length,
        revenue: dayB.filter((b) => b.status === 'confirmed').reduce((s, b) => s + (b.total_price || 0), 0),
      });
    }

    return res.status(200).json({
      totalBookings: bookings.length,
      confirmedBookings: confirmed.length,
      totalRevenue: revenue,
      todayBookings: todayBookings.length,
      todayRevenue,
      totalInquiries: inquiries.length,
      newInquiries: inquiries.filter((i) => i.status === 'new').length,
      perDevice,
      last7,
    });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
