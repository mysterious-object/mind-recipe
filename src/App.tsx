import { useState } from 'react'

const emotions = [
  ['⚡', 'High energy', 'Tense, activated energy', ['Anxious', 'Overwhelmed', 'Irritable']],
  ['🌙', 'Low energy', 'Quiet, inward energy', ['Numb', 'Tired', 'Lonely']],
  ['💧', 'Tender', 'Soft, vulnerable feelings', ['Sad', 'Hurt', 'Disappointed']],
  ['✨', 'Positive', 'Warm, expansive feelings', ['Hopeful', 'Calm', 'Grateful']],
] as const

type Data = { name: string; pronouns: string; emotions: string[]; activation: number; body: string[] }
const initialData: Data = { name: '', pronouns: '', emotions: [], activation: 0, body: [] }

function Footer({ onBack, onNext, nextText = 'Continue', disabled = false }: { onBack?: () => void; onNext: () => void; nextText?: string; disabled?: boolean }) {
  return <div className="footer"><button className="quiet" onClick={onBack}>Skip for now</button><button className="primary" disabled={disabled} onClick={onNext}>{nextText}</button></div>
}

export default function App() {
  if (window.location.hash === '#mind-recipe') return <MindRecipe />
  const [step, setStep] = useState(0)
  const [data, setData] = useState<Data>(initialData)
  const next = () => setStep(s => Math.min(s + 1, 5))
  const back = () => setStep(s => Math.max(s - 1, 0))
  const toggle = (key: 'emotions' | 'body', value: string) => setData(d => ({ ...d, [key]: d[key].includes(value) ? d[key].filter(v => v !== value) : [...d[key], value] }))

  if (step === 0) return <main className="welcome screen"><div className="heart">♡</div><h1>Welcome to Clarity</h1><p>Clarity helps you notice what you're feeling, where you feel it in your body, and what might help next.</p><p className="muted">You're in control. You can skip anything.</p><button className="primary start" onClick={next}>Okay, let's start</button><a className="switch-app" href="#mind-recipe">Open MindRecipe portal →</a><Disclaimer /></main>
  return <main className="app-shell"><header><button className="back" onClick={back}>← Back</button><div className="progress"><span style={{ width: `${(step / 5) * 100}%` }} /></div><button className="home" onClick={() => { setData(initialData); setStep(0) }}>Home</button></header>
    <section className="content">
      {step === 1 && <><Eyebrow>LET'S START GENTLY</Eyebrow><h2>What should I call you?</h2><label>Name / nickname<input autoFocus placeholder="Your name" value={data.name} onChange={e => setData(d => ({ ...d, name: e.target.value }))} /></label><p className="label">Pronouns <span>optional</span></p><div className="pills">{['she/her', 'he/him', 'they/them', 'custom'].map(p => <button className={data.pronouns === p ? 'selected' : ''} onClick={() => setData(d => ({ ...d, pronouns: p }))} key={p}>{p}</button>)}</div><Footer onBack={back} onNext={next} disabled={!data.name.trim()} /></>}
      {step === 2 && <><Eyebrow>CHECKING IN</Eyebrow><h2>How are you feeling?</h2><p className="muted">Choose any feelings that fit right now. There are no wrong answers.</p><div className="emotion-grid">{emotions.map(([icon, title, description, items]) => <article className="emotion-card" key={title}><div><b>{icon} {title}</b><small>{description}</small></div><div className="chips">{items.map(item => <button className={data.emotions.includes(item) ? 'selected' : ''} onClick={() => toggle('emotions', item)} key={item}>{item}</button>)}</div></article>)}</div><Footer onBack={back} onNext={next} nextText={data.emotions.length ? `Continue (${data.emotions.length})` : 'Continue'} /></>}
      {step === 3 && <><Eyebrow>CHECKING IN</Eyebrow><h2>Where is your energy right now?</h2><p className="muted">Notice your level of activation without trying to change it.</p><div className="scale"><div className="scale-value">{data.activation > 0 ? '+' : ''}{data.activation}</div><input type="range" min="-5" max="5" value={data.activation} onChange={e => setData(d => ({ ...d, activation: Number(e.target.value) }))} /><div className="scale-labels"><span>Completely shut down</span><span>Balanced</span><span>Overwhelmed</span></div></div><Footer onBack={back} onNext={next} /></>}
      {step === 4 && <><Eyebrow>CHECKING IN</Eyebrow><h2>Where do you feel it in your body?</h2><p className="muted">Select any areas that stand out to you.</p><div className="body-options">{['Head', 'Jaw & throat', 'Chest', 'Stomach', 'Shoulders', 'Hands', 'Legs'].map(place => <button className={data.body.includes(place) ? 'selected' : ''} onClick={() => toggle('body', place)} key={place}>{place}</button>)}</div><Footer onBack={back} onNext={next} /></>}
      {step === 5 && <Review data={data} onRestart={() => { setData(initialData); setStep(0) }} />}
    </section>
  </main>
}

function Eyebrow({ children }: { children: string }) { return <p className="eyebrow">{children}</p> }
function Disclaimer() { return <p className="disclaimer">Clarity is a wellness support app.<br />Clarity isn't therapy, medical care, or emergency response.<br />If you're in danger or think you might hurt yourself or someone else, please contact emergency services or a crisis hotline.</p> }
function Review({ data, onRestart }: { data: Data; onRestart: () => void }) { return <><Eyebrow>YOUR CHECK-IN</Eyebrow><h2>{data.name ? `${data.name}, here's what you noticed` : 'Here’s what you noticed'}</h2><div className="review"><article><b>Feelings</b><p>{data.emotions.length ? data.emotions.join(', ') : 'Not added'}</p></article><article><b>Activation</b><p>{data.activation === 0 ? 'Balanced' : `${data.activation > 0 ? '+' : ''}${data.activation} on your energy scale`}</p></article><article><b>Body</b><p>{data.body.length ? data.body.join(', ') : 'Not added'}</p></article></div><div className="reflection"><b>A small reflection</b><p>Thank you for checking in. Noticing what is here can be a meaningful first step.</p></div><button className="primary start" onClick={onRestart}>Complete & return home</button></> }

const trackers = [
  ['⌁', 'Boundary', 'Track: limit set/enforced/respected'],
  ['☼', 'Self-Care Engaged', 'Track: rest, nourishment, hydration, movement, replenishing activity (joy/quiet/creative time), etc.'],
  ['↗', 'Values-Aligned Action Taken', 'Track: action you took that was aligned with your values/vision'],
  ['◉', 'Trigger Noticed', 'Track: trigger/cue/stimulus for Zone edge or removal'],
  ['✦', 'Regulation Tool Used', 'Track: breath, grounding, movement, cold water, music, etc.'],
  ['◌', 'Mindful Check-In', 'Track: emotion(s), body sensations, thoughts, surroundings'],
] as const

function MindRecipe() {
  const [page, setPage] = useState<'plans' | 'programs' | 'community' | 'tracking'>('programs')
  const [logged, setLogged] = useState<string[]>([])
  const nav = [['plans', '▤', 'Plans'], ['programs', '▦', 'Programs'], ['community', '◌', 'Community'], ['tracking', '⌁', 'Tracking']] as const
  return <main className="mr-app"><aside className="mr-side"><a href="#" className="mr-brand">mind<span>recipe</span></a><nav>{nav.map(([id, icon, label]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}><i>{icon}</i>{label}</button>)}</nav><a className="mr-profile" href="#">◉ Profile</a></aside><section className="mr-main"><header className="mr-header"><div><p className="mr-kicker">HAVEN HOLISTIC HEALTH</p><h1>{page[0].toUpperCase() + page.slice(1)}</h1></div><a href="#" className="clarity-link">← Clarity</a></header>
    {page === 'plans' && <Plans />}
    {page === 'programs' && <Programs />}
    {page === 'community' && <Community />}
    {page === 'tracking' && <Tracking logged={logged} onToggle={(name) => setLogged(items => items.includes(name) ? items.filter(i => i !== name) : [...items, name])} />}
  </section></main>
}
function Plans() { return <div className="mr-grid plans">{[['MindRecipe Pilot', '99 USD', 'The pilot-course + community & tracking.'], ['MindRecipe Premium', '199 USD', 'The full-course + community & tracking.']].map(([title, price, detail]) => <article className="plan" key={title}><p className="tag">MEMBERSHIP</p><h2>{title}</h2><strong>{price}</strong><p>⭐ {detail}</p><hr /><b>What's included:</b><p>✓ MindRecipe</p><button>Coming soon</button></article>)}</div> }
function Programs() { return <div><article className="course"><div className="course-art">MR</div><div><p className="tag">SELF-DEVELOPMENT PROGRAM · 11 / 50 COMPLETE</p><h2>MindRecipe</h2><p>A self-development program for brain-body awareness & conscious living.</p><div className="course-progress"><span /></div></div><button>Continue learning →</button></article><h2 className="section-title">Your next lesson</h2><article className="lesson"><span>01</span><div><b>Welcome to MindRecipe</b><p>Begin with the foundations of noticing, choice, and conscious living.</p></div><button>Start</button></article></div> }
function Community() { return <div><p className="intro">A place to learn alongside other people practicing more intentional ways of being.</p><div className="mr-grid">{[['MindChefs', '4 channels', 'A community for shared practice, reflection, and real-life experiments.'], ['MindMentor', '2 channels', 'Supportive conversations for navigating your MindRecipe journey.']].map(([name, channels, text]) => <article className="community-card" key={name}><div className="community-icon">◌</div><p className="tag">{channels}</p><h2>{name}</h2><p>{text}</p><button>View community →</button></article>)}</div></div> }
function Tracking({ logged, onToggle }: { logged: string[]; onToggle: (name: string) => void }) { return <div><p className="intro">Build awareness through small, meaningful moments. Your tracking stays on this device in this prototype.</p><div className="tracking-list">{trackers.map(([icon, name, description]) => <article className={logged.includes(name) ? 'tracked' : ''} key={name}><div className="tracker-icon">{icon}</div><div><h2>{name}</h2><p>{description}</p></div><button onClick={() => onToggle(name)}>{logged.includes(name) ? 'Logged ✓' : 'Log now'}</button></article>)}</div></div> }
