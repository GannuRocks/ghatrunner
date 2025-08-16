'use client';
import { useMemo, useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { MapPin, Mountain, CalendarDays, Users, Wallet, Search, Phone, ChevronRight, Info, Clock, CheckCircle2, XCircle, Backpack, HelpCircle, Instagram, Facebook, Youtube, Globe, Copy } from 'lucide-react';
import { TREKS } from '@/lib/data';
import { getConfig, upiUri, makeRefId } from '@/lib/utils';

export default function TrekApp() {
  const { BRAND, WHATSAPP_E164, UPI, SOCIAL } = getConfig();
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [detail, setDetail] = useState(null);
  const [people, setPeople] = useState(1);
  const [date, setDate] = useState('');
  const [qr, setQr] = useState('');

  const filtered = useMemo(() => {
    return TREKS.filter((t) => {
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || t.name.toLowerCase().includes(q) || t.location.toLowerCase().includes(q);
      const matchesDiff = difficulty === 'All' || t.difficulty === difficulty;
      return matchesQuery && matchesDiff;
    });
  }, [query, difficulty]);

  const refId = detail ? makeRefId(detail.slug, date || detail?.upcomingDates?.[0]) : '';
  const total = detail ? people * detail.pricePerPerson : 0;
  const upi = detail ? upiUri({ pa: UPI.pa, pn: UPI.pn, amount: total, note: `${detail.slug}-${date || detail?.upcomingDates?.[0] || 'date'}-${refId}` }) : '';
  const waText = detail ? `Hi! I want to book *${detail.name}* on *${date || detail?.upcomingDates?.[0]}* for *${people}* people. Total: ₹${total}.\n\nReference: ${refId}\nI will share the payment screenshot here.` : '';

  useEffect(() => {
    let active = true;
    async function gen() {
      if (!upi) return setQr('');
      try {
        const url = await QRCode.toDataURL(upi, { margin: 1, width: 240 });
        if (active) setQr(url);
      } catch (_) { if (active) setQr(''); }
    }
    gen();
    return () => { active = false; };
  }, [upi]);

  function copy(text) { try { navigator.clipboard.writeText(text); } catch {} }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 text-gray-900">
      {/* Header */}
      <header className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="GhatRunner" className="h-10 w-10 rounded-xl" />
          <div className="text-xl font-extrabold">{BRAND}</div>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#treks" className="hover:text-sky-600">Treks</a>
          <a href="#why" className="hover:text-sky-600">Why us</a>
          <div className="flex items-center gap-3">
            <a href={SOCIAL.instagram} target="_blank" aria-label="Instagram" className="opacity-80 hover:opacity-100"><Instagram className="h-5 w-5"/></a>
            <a href={SOCIAL.facebook} target="_blank" aria-label="Facebook" className="opacity-80 hover:opacity-100"><Facebook className="h-5 w-5"/></a>
            <a href={SOCIAL.youtube} target="_blank" aria-label="YouTube" className="opacity-80 hover:opacity-100"><Youtube className="h-5 w-5"/></a>
            <a href={SOCIAL.website} target="_blank" aria-label="Website" className="opacity-80 hover:opacity-100"><Globe className="h-5 w-5"/></a>
          </div>
          <a
            className="inline-flex items-center gap-2 rounded-lg border border-sky-200 px-4 py-2 text-sky-700 hover:bg-sky-50"
            href={`https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent('Hi! I want to know about upcoming treks.')}`}
            target="_blank"
          >
            <Phone className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Trek the Sahyadris with <span className="text-sky-600">{BRAND}</span>
            </h1>
            <p className="mt-3 text-gray-600">
              Curated weekend & monsoon treks near Pune and across Maharashtra. Check dates, pickup points, inclusions, pricing and pay via UPI. Share the payment screenshot on WhatsApp for instant confirmation.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex w-full items-center gap-2 rounded-xl border px-3 py-2">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  className="w-full outline-none"
                  placeholder="Search treks (e.g., Kalsubai, Rajmachi, Andharban)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="rounded-xl border px-3 py-2"
              >
                <option>All</option>
                <option>Easy</option>
                <option>Moderate</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1592503251121-d6f1db5f7f69?q=80&w=1600&auto=format&fit=crop"
              alt="Sahyadri mountains"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Treks grid */}
      <section id="treks" className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Treks</h2>
          <a href="#treks" className="text-sky-700 hover:underline">Browse all</a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <button
              key={t.slug}
              onClick={() => { setDetail(t); setPeople(1); setDate(t.upcomingDates?.[0] || ''); }}
              className="group rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <img src={t.images[0]} alt={t.name} className="h-full w-full object-cover group-hover:scale-105 transition" />
              </div>
              <div className="p-3">
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {t.location}</span>
                  <span className="inline-flex items-center gap-1"><Mountain className="h-4 w-4" /> {t.difficulty}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-sky-700">₹{t.pricePerPerson} <span className="font-normal text-gray-500">/person</span></span>
                  <span className="inline-flex items-center text-sky-700">View <ChevronRight className="h-4 w-4" /></span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section id="why" className="mt-14 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <h2 className="text-2xl font-bold">Why trek with us?</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          <li className="rounded-xl border p-4"><h3 className="font-semibold">Curated Sahyadri roster</h3><p className="text-gray-600">From beginner-friendly fort hikes to Kalsubai—the state’s highest peak.</p></li>
          <li className="rounded-xl border p-4"><h3 className="font-semibold">Transparent pricing</h3><p className="text-gray-600">Upfront per-person cost. No hidden charges.</p></li>
          <li className="rounded-xl border p-4"><h3 className="font-semibold">Simple WhatsApp booking</h3><p className="text-gray-600">Pay via UPI and share screenshot on WhatsApp for quick confirmation.</p></li>
        </ul>
      </section>

      {/* Detail Drawer */}
      {detail && (
        <div className="fixed inset-0 z-50 grid place-items-end bg-black/40" onClick={() => setDetail(null)}>
          <div className="h-[94vh] w-full max-w-4xl rounded-t-3xl bg-white p-5 shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Gallery */}
            <div className="grid gap-4">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                <img src={detail.images[0]} alt={detail.name} className="h-full w-full object-cover" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {detail.images.slice(1, 7).map((src, i) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <img src={src} alt={`${detail.name} ${i+2}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Title & Stats */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold">{detail.name}</h1>
              <div className="mt-1 text-gray-600">{detail.tagline}</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm text-gray-700">
                <div className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {detail.location} • {detail.distanceFromPuneKm} km from Pune</div>
                <div>Height: {detail.heightM} m ({detail.altitudeFt?.toLocaleString()} ft)</div>
                <div>Difficulty: {detail.difficulty}</div>
                <div>Duration: {detail.duration}</div>
                <div>Best season: {detail.bestSeason}</div>
              </div>
            </div>

            {/* About */}
            <section className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-gray-100">
              <div className="flex items-center gap-2 font-semibold"><Info className="h-5 w-5" /> About</div>
              <p className="mt-2 text-gray-700">{detail.description}</p>
              {detail.longAbout && <p className="mt-2 text-gray-700">{detail.longAbout}</p>}
            </section>

            {/* Join From & Dates */}
            <section className="mt-5 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 ring-1 ring-gray-100 lg:col-span-2">
                <div className="flex items-center gap-2 font-semibold"><Clock className="h-5 w-5" /> Upcoming Dates</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {detail.upcomingDates.map((d) => (
                    <button key={d} onClick={() => setDate(d)} className={`rounded-full border px-3 py-1 text-sm ${date === d ? 'border-sky-500 text-sky-700' : 'border-gray-300 text-gray-700'}`}>{d}</button>
                  ))}
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700"><Users className="h-4 w-4" />
                    <input type="number" min={1} value={people} onChange={(e) => setPeople(parseInt(e.target.value) || 1)} className="ml-2 w-24 rounded-lg border px-2 py-1" />
                  </label>
                  <div className="flex items-center justify-between text-sm">
                    <span>Price / person</span>
                    <span className="font-semibold">₹{detail.pricePerPerson}</span>
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="text-xl font-bold text-sky-700">₹{(people * detail.pricePerPerson).toLocaleString()}</span>
                </div>

                <div className="mt-4 grid gap-2">
                  <div className="font-semibold">Join Us From</div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {detail.joinOptions?.map((o, i) => (
                      <div key={i} className="rounded-xl border p-3 text-sm">
                        <div className="font-semibold">{o.from}</div>
                        <div>₹ {o.price} • {o.duration}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Card */}
              <aside className="rounded-2xl bg-white p-4 ring-1 ring-gray-100">
                <div className="text-lg font-semibold">Book / Pay</div>
                <div className="mt-1 text-xs text-gray-600">Reference ID</div>
                <div className="flex items-center gap-2">
                  <div className="select-all rounded-lg bg-gray-50 px-2 py-1 text-xs font-mono">{refId}</div>
                  <button className="rounded border px-2 py-1 text-xs" onClick={() => copy(refId)}><Copy className="h-3 w-3" /></button>
                </div>
                <a
                  className="mt-3 block w-full rounded-xl bg-sky-600 px-4 py-3 text-center font-semibold text-white hover:bg-sky-700"
                  href={`https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(waText)}`}
                  target="_blank"
                >
                  Chat on WhatsApp (sends ref)
                </a>
                <div className="mt-3 rounded-xl border p-3">
                  <div className="mb-2 inline-flex items-center gap-2 font-semibold"><Wallet className="h-5 w-5" /> Pay via UPI</div>
                  <div className="grid place-items-center gap-3 rounded-lg border p-4">
                    <div className="text-xs text-gray-500">Scan UPI QR</div>
                    {qr && <img src={qr} alt="UPI QR" className="h-48 w-48" />}
                    <div className="text-xs text-gray-500">or copy link</div>
                    <div className="select-all break-words rounded bg-gray-50 p-2 text-center text-xs">{upi}</div>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">After payment, share a screenshot on WhatsApp and mention <span className="font-semibold">{refId}</span> to confirm your booking.</p>
                </div>
              </aside>
            </section>

            {/* Itinerary */}
            <section className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-gray-100">
              <div className="flex items-center gap-2 font-semibold"><CalendarDays className="h-5 w-5" /> Itinerary</div>
              <div className="mt-3 grid gap-3">
                {detail.itinerary?.map((d, i) => (
                  <div key={i} className="rounded-xl border p-3">
                    <div className="font-semibold">{d.day} – {d.title}</div>
                    <ul className="mt-2 list-disc pl-5 text-gray-700">
                      {d.steps.map((s, j) => <li key={j}>{s}</li>)}
                    </ul>
                    <div className="mt-2 text-xs text-gray-600">Meals: {d.meals}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500">Note: Timings are approximate and may vary due to weather/traffic/group pace.</div>
            </section>

            {/* Things to Carry */}
            <section className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-gray-100">
              <div className="flex items-center gap-2 font-semibold"><Backpack className="h-5 w-5" /> Things to Carry</div>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2 list-disc pl-5 text-gray-700">
                {detail.thingsToCarry?.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </section>

            {/* FAQ */}
            <section className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-gray-100">
              <div className="flex items-center gap-2 font-semibold"><HelpCircle className="h-5 w-5" /> FAQ</div>
              <div className="mt-2 grid gap-3">
                {detail.faq?.map((f, i) => (
                  <div key={i}>
                    <div className="font-semibold">{f.q}</div>
                    <p className="text-gray-700">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Similar Treks */}
            {detail.similar?.length > 0 && (
              <section className="mt-5 rounded-2xl bg-white p-4 ring-1 ring-gray-100">
                <div className="font-semibold">Similar Treks</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {detail.similar.map((s, i) => <span key={i} className="rounded-full border px-3 py-1 text-sm">{s}</span>)}
                </div>
              </section>
            )}

            <div className="mt-6 text-center">
              <button onClick={() => setDetail(null)} className="rounded-lg border px-4 py-2">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 border-t pt-6 text-sm text-gray-600">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p>© {new Date().getFullYear()} {BRAND}</p>
          <div className="flex items-center gap-4">
            <a className="hover:underline" href="#">Privacy</a>
            <a className="hover:underline" href="#">Terms</a>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">Follow us:</span>
            <a href={SOCIAL.instagram} target="_blank" aria-label="Instagram" className="opacity-80 hover:opacity-100"><Instagram className="h-5 w-5"/></a>
            <a href={SOCIAL.facebook} target="_blank" aria-label="Facebook" className="opacity-80 hover:opacity-100"><Facebook className="h-5 w-5"/></a>
            <a href={SOCIAL.youtube} target="_blank" aria-label="YouTube" className="opacity-80 hover:opacity-100"><Youtube className="h-5 w-5"/></a>
          </div>
          <a
            className="inline-flex items-center gap-2 rounded-lg border border-sky-200 px-4 py-2 text-sky-700 hover:bg-sky-50"
            href={`https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent('Hi! I want to know about upcoming treks.')}`}
            target="_blank"
          >
            <Phone className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </footer>
    </div>
  );
}
