import { useEffect, useState } from 'react';

const formatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Kolkata',
});

/** The current time in India, refreshed every half minute. */
export function LocalTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return <time dateTime={now.toISOString()}>{formatter.format(now)} IST</time>;
}
