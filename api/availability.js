import supabase from './db-client.js';

// Returns availability matrix for a date: per device, per hour, available count.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const date = req.query.date;
    if (!date) return res.status(400).json({ error: 'Missing date' });

    const { data: devices, error: devErr } = await supabase
      .from('devices').select('*').order('id', { ascending: true });
    if (devErr) throw devErr;

    const { data: bookings, error: bErr } = await supabase
      .from('bookings').select('*')
      .eq('booking_date', date).eq('status', 'confirmed');
    if (bErr) throw bErr;

    const HOURS = [];
    for (let h = 10; h < 23; h++) HOURS.push(h);

    const result = devices.map((d) => {
      const hourMap = {};
      for (const h of HOURS) {
        let occupied = 0;
        for (const b of bookings) {
          if (b.device_id !== d.id) continue;
          if (h >= b.start_hour && h < b.start_hour + b.num_hours) occupied++;
        }
        hourMap[h] = { available: Math.max(0, d.quantity - occupied), total: d.quantity };
      }
      return { ...d, hourMap };
    });

    return res.status(200).json({ date, devices: result, hours: HOURS });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
