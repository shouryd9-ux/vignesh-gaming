import supabase from './db-client.js';

// Slots are full hours from 10:00 to 23:00 (last slot starts 22:00, ends 23:00)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      // Optional filters: ?date=YYYY-MM-DD
      let query = supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (req.query.date) query = query.eq('booking_date', req.query.date);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const {
        customer_name, contact, num_people, num_hours,
        start_hour, booking_date, device_id, device_name, price_per_hour,
      } = req.body;

      if (!customer_name || !contact || !num_people || !num_hours || start_hour == null || !booking_date || !device_id) {
        return res.status(400).json({ error: 'Missing required booking fields' });
      }

      const start = parseInt(start_hour, 10);
      const hours = parseInt(num_hours, 10);
      const end = start + hours;
      if (start < 10 || end > 23) {
        return res.status(400).json({ error: 'Booking must be within 10:00 AM - 11:00 PM' });
      }

      // Fetch device to know quantity
      const { data: device, error: devErr } = await supabase
        .from('devices').select('*').eq('id', device_id).single();
      if (devErr || !device) return res.status(400).json({ error: 'Invalid device' });

      // Fetch existing active bookings for this device on this date
      const { data: existing, error: exErr } = await supabase
        .from('bookings')
        .select('*')
        .eq('device_id', device_id)
        .eq('booking_date', booking_date)
        .eq('status', 'confirmed');
      if (exErr) throw exErr;

      // For each hour in requested range, count overlapping bookings.
      // If any hour reaches device.quantity, it's fully booked.
      for (let h = start; h < end; h++) {
        let occupied = 0;
        for (const b of existing) {
          const bStart = b.start_hour;
          const bEnd = b.start_hour + b.num_hours;
          if (h >= bStart && h < bEnd) occupied++;
        }
        if (occupied >= device.quantity) {
          return res.status(409).json({
            error: `Already booked — no ${device.name} available at ${h}:00 on ${booking_date}.`,
            conflictHour: h,
          });
        }
      }

      const total_price = hours * (price_per_hour || device.price_per_hour);

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          customer_name, contact,
          num_people: parseInt(num_people, 10),
          num_hours: hours,
          start_hour: start,
          booking_date,
          device_id,
          device_name: device_name || device.name,
          price_per_hour: price_per_hour || device.price_per_hour,
          total_price,
          status: 'confirmed',
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, status } = req.body;
      const { data, error } = await supabase
        .from('bookings').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      // ?id=X deletes one. ?all=true clears all (end of day).
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
      if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

      if (req.query.all === 'true') {
        const { error } = await supabase.from('bookings').delete().neq('id', 0);
        if (error) throw error;
        return res.status(200).json({ ok: true, cleared: true });
      }
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const { error } = await supabase.from('bookings').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
