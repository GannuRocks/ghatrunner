export function getConfig() {
  const BRAND = process.env.NEXT_PUBLIC_BRAND || "GhatRunner";
  const WHATSAPP_E164 = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918261963374";
  const UPI = { pa: process.env.NEXT_PUBLIC_UPI_ID || "8605657016-2@ybl", pn: process.env.NEXT_PUBLIC_UPI_NAME || "GhatRunner" };
  const SOCIAL = {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "https://instagram.com/ghatrunner",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK || "https://facebook.com/ghatrunner",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE || "https://youtube.com/@ghatrunner",
    website: process.env.NEXT_PUBLIC_WEBSITE || "https://ghatrunner.in",
  };
  return { BRAND, WHATSAPP_E164, UPI, SOCIAL };
}
export function upiUri({ pa, pn, amount, note }) {
  const p = new URLSearchParams({ pa, pn, am: String(amount || 0), cu: "INR", tn: note || "Booking" });
  return `upi://pay?${p.toString()}`;
}
export function toYYYYMMDD(label) {
  const d = new Date(label);
  if (!isNaN(d)) {
    const y = d.getFullYear(); const m = String(d.getMonth()+1).padStart(2,'0'); const da = String(d.getDate()).padStart(2,'0');
    return `${y}${m}${da}`;
  }
  const t = new Date();
  return `${t.getFullYear()}${String(t.getMonth()+1).padStart(2,'0')}${String(t.getDate()).padStart(2,'0')}`;
}
export function makeRefId(slug, dateLabel) {
  const ymd = toYYYYMMDD(dateLabel || new Date());
  const short = (Date.now().toString(36).toUpperCase()).slice(-4) + Math.random().toString(36).slice(2,4).toUpperCase();
  return `GR-${ymd}-${(slug||'TREK').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,8)}-${short}`;
}
