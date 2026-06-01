export const HOURS = (() => {
  const arr = [];
  for (let h = 10; h < 23; h++) arr.push(h);
  return arr;
})();

export function formatHour(h) {
  const period = h >= 12 ? 'PM' : 'AM';
  let display = h % 12;
  if (display === 0) display = 12;
  return `${display}:00 ${period}`;
}

export function formatHourRange(start, hours) {
  const end = start + hours;
  return `${formatHour(start)} – ${formatHour(end)}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function rupees(n) {
  return `₹${n}`;
}

export const DEVICE_ICONS = {
  monitor: 'Monitor',
  gamepad: 'Gamepad2',
  car: 'Car',
  glasses: 'Glasses',
};
