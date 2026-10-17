import { useState } from 'react';
import type { FormEvent } from 'react';

// ---- Settings ----
const NAME = 'Liam Cooper';
// Form endpoint (e.g. a Formspree address like https://formspree.io/f/xxxxxxx). Without it the form cannot send anything.
const FORM_ENDPOINT = '';

const STORY = {
  hero: {
    title: 'Liam Cooper: from a Barnsley working-class street to Melbourne, and a life built on numbers',
    lead: 'This is not a story about overnight riches. It is a chronicle of ironclad discipline and mathematical grit.',
  },
  chapters: [
    { num: '01', title: 'The roots: Barnsley and the hard school of life', photo: 0,
      paras: [
        'I was born in Barnsley, a classic working-class mining town in South Yorkshire, UK. Ours was an ordinary family, the kind where every loaf of bread is earned through hard graft.',
        'Money never hung around the house. Every pound was budgeted to the cent. But my parents hammered home the essentials: respect for hard work, resilience and honesty.',
        'Since I was a kid, I had two passions: football and numbers. I did not just kick a ball around the yard. I sat for hours with a notebook, logging English league results and trying to decode the logic behind them. On my dad\u2019s old, battered computer I wrote my first scripts in BASIC.',
      ],
      list: ['My dad worked the floor at a local metalworks factory from dawn till dusk, swapping out machinery.', 'My mum worked as a cleaner at the district hospital, pulling night shifts.'] },
    { num: '02', title: 'Melbourne: years of backbreaking work', photo: 0,
      paras: [
        'At 18, I packed a bag and flew to the other side of the world: Melbourne, Australia. No benefactors, no connections, no safety net. Just a hunger to turn my life around.',
        'I enrolled at the University of Melbourne to study Quantitative Finance & Data Science. Days were lectures and mathematical modelling. Nights were work. To pay for tuition and specialised coding and database courses, I took whatever work I could get:',
      ],
      list: ['Loading freight at distribution terminals on night shifts.', 'Standing behind the bar in noisy Melbourne pubs.', 'Waiting tables on weekends.'],
      after: 'I slept four to five hours a night. Every dollar I earned went into two things: my education and my obsession, building football statistics models.' },
    { num: '03', title: 'Building the models: mistakes and rewrites', photo: 3,
      paras: [
        'The early versions of my code were miles off the mark. There were costly setbacks when I misjudged variance and expected goals (xG).',
        'Each time I sat back down, rewrote the Poisson distribution logic from scratch and went back to testing my ideas. It was a war of attrition.',
        'By 29, I had a system I trusted enough to keep building on.',
      ], list: [] },
    { num: '04', title: 'What I took from it', photo: 5,
      paras: [
        'That is the story, and it is not one about overnight riches. If it shows anything, it is that discipline, curiosity and honesty, the things my parents taught me in Barnsley, carry you further than any shortcut.',
      ], list: [] },
  ],
  form: {
    title: 'Get in touch',
    text: 'Leave your name and phone number and we will get back to you.',
    name: 'Your name', phone: 'Phone number', send: 'Send',
    consent: 'I agree that my name and phone number are used to contact me.',
    note: 'We use your details only to reply to you.',
    ok: 'Thank you! We will be in touch soon.', error: 'Something went wrong. Please try again later.',
    unconfigured: 'The form is not connected yet.',
  },
  footer: 'Betting involves risk. 18+ only. This page tells a personal story and is not betting advice.',
};
const ALTS = {
  1: 'Liam standing in front of the Acropolis in Athens at sunset',
  2: 'Liam stepping out of a hotel swimming pool',
  3: 'Liam sitting by a pond with the Sagrada Fam\u00edlia behind him',
  4: 'Liam smiling in a white linen shirt',
  5: 'Liam raising a glass on a rooftop terrace with a domed church behind him',
};

const photo = (n: number) => `${import.meta.env.BASE_URL}photos/liam-${n}.jpg`;
const POS: Record<number, string> = { 1: '50% 40%', 2: '55% 40%', 3: '60% 70%', 4: '40% 15%', 5: '75% 55%' };

function Img({ n, className = '' }: { n: number; className?: string }) {
  return <img src={photo(n)} alt={(ALTS as Record<number, string>)[n]} loading="lazy" style={{ objectPosition: POS[n] }} className={`w-full h-full object-cover ${className}`} />;
}

export default function App() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error' | 'unconfigured'>('idle');

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !agree) return;
    if (!FORM_ENDPOINT) { setStatus('unconfigured'); return; }
    setStatus('sending');
    try {
      const r = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ name, phone, consent: true }) });
      setStatus(r.ok ? 'ok' : 'error');
    } catch { setStatus('error'); }
  }

  const f = STORY.form;
  const input = 'w-full rounded-xl bg-[#0A0E17] border border-white/15 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C9A24B]';
  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#E2E8F0]">
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <span className="font-display font-bold uppercase tracking-wide text-white">{NAME}</span>
          <span className="text-xs text-slate-400 border border-white/20 rounded-full px-2 py-0.5">18+</span>
        </div>
      </header>

      <main>
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl leading-[1.1] text-white">{STORY.hero.title}</h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed">{STORY.hero.lead}</p>
          </div>
          <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10"><Img n={1} /></div>
        </section>

        {STORY.chapters.map((c) => (
          <section key={c.num} className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-[1fr_300px] items-start">
            <div>
              <div className="font-mono-num text-[#C9A24B] text-sm mb-2">{c.num}</div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-5">{c.title}</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed text-lg">
                {c.paras.map((p) => <p key={p}>{p}</p>)}
                {c.list.length > 0 && (
                  <ul className="space-y-2 border-l-2 border-[#C9A24B]/60 pl-4">{c.list.map((li) => <li key={li}>{li}</li>)}</ul>
                )}
                {c.after && <p>{c.after}</p>}
              </div>
            </div>
            {c.photo > 0 && <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10"><Img n={c.photo} /></div>}
          </section>
        ))}

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[4, 2, 5].map((n) => <div key={n} className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10"><Img n={n} /></div>)}
          </div>
        </section>

        <section className="max-w-xl mx-auto px-4 sm:px-6 py-14">
          <div className="rounded-3xl bg-[#0E141D] border border-white/10 p-6 sm:p-8">
            <h2 className="font-display font-bold text-2xl text-white mb-2">{f.title}</h2>
            <p className="text-slate-400 mb-6">{f.text}</p>
            <form onSubmit={submit} className="space-y-4">
              <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder={f.name} aria-label={f.name} autoComplete="name" required />
              <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={f.phone} aria-label={f.phone} type="tel" autoComplete="tel" pattern="[+()0-9 \-]{7,20}" required />
              <label className="flex gap-3 text-sm text-slate-300 cursor-pointer">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 accent-[#C9A24B]" required />
                <span>{f.consent}</span>
              </label>
              <button type="submit" disabled={status === 'sending'} className="w-full rounded-xl bg-[#C9A24B] hover:bg-[#b48e3f] text-black font-bold py-3 transition-colors cursor-pointer disabled:opacity-60">{f.send}</button>
              <p className="text-xs text-slate-500">{f.note}</p>
              {status === 'ok' && <p className="text-[#7fd6a0]" role="status">{f.ok}</p>}
              {status === 'error' && <p className="text-red-300" role="alert">{f.error}</p>}
              {status === 'unconfigured' && <p className="text-amber-300" role="alert">{f.unconfigured}</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500 px-4">
        <p>&copy; {new Date().getFullYear()} {NAME}. {STORY.footer}</p>
      </footer>
    </div>
  );
}
