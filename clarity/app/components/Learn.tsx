import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Check, ChevronRight, Search, Heart, BookMarked, FileText, Activity, Brain, Users, Dumbbell, Sparkles, Home } from 'lucide-react';
import curriculum from '../data/curriculum.json';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import { isNative, nativeRequest } from '../host';
import { AppShell } from './AppShell';

type Lesson = typeof curriculum[number];
type Practice = { id: string; name: string; description: string; category: string };
interface Library {
  saved?: Lesson[];
  practices?: Practice[];
  progress?: { completed_lesson_ids?: string[]; current_lesson_id?: string };
  reflections?: Record<string, string>;
  legacyAvailable?: boolean;
  practicesOffline?: boolean;
}
type Resource = { id: string; title: string; summary: string; practice?: string; source: string; group: string };
type Action = 'refreshLibrary' | 'loadLibrary' | 'importLibrary' | 'completeLesson' | 'saveReflection';
const previewKey = 'mindrecipe-preview-library-v1';

// Editorial topic tags refer to the actual curriculum texts.
const topicLessons = [
  { name: 'Emotional', icon: Heart, ids: [1,2,4,5,8,9,10,12] },
  { name: 'Intellectual', icon: Brain, ids: [3,7,12,15] },
  { name: 'Physical', icon: Dumbbell, ids: [1,3,4,5,6,9] },
  { name: 'Spiritual', icon: Sparkles, ids: [11] },
  { name: 'Social', icon: Users, ids: [7,13,14] },
  { name: 'Environmental', icon: Home, ids: [1,3,6,7] },
].map(t => ({ ...t, ids: t.ids.map(n => 'lesson-' + n) }));
const formats = [
  { name: 'All', icon: null }, { name: 'Curriculum', icon: FileText },
  { name: 'Saved lessons', icon: BookMarked }, { name: 'Practices', icon: Activity }, { name: 'Favorites', icon: Heart },
];

async function request(action: Action, payload: Record<string, string> = {}): Promise<Library> {
  if (isNative()) return nativeRequest(action, payload);
  const data: Library = JSON.parse(localStorage.getItem(previewKey) || '{}');
  if (action === 'saveReflection') data.reflections = { ...data.reflections, [payload.id]: payload.text };
  if (action === 'completeLesson') {
    data.progress = { current_lesson_id: payload.next, completed_lesson_ids: [...new Set([...(data.progress?.completed_lesson_ids ?? []), payload.id])] };
  }
  if (action !== 'loadLibrary') localStorage.setItem(previewKey, JSON.stringify(data));
  return data;
}

export function Learn() {
  const { setScreen, userProfile, updateUserProfile, reportError } = useApp();
  const { getSolidCardClasses, getTextClasses, getSubtextClasses, getActiveClasses, getCardClasses } = useTheme();
  const [data, setData] = useState<Library>({});
  const [busy, setBusy] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [dimensions, setDimensions] = useState<string[]>([]);
  const [group, setGroup] = useState('All');
  const [detail, setDetail] = useState<Resource>();
  const [note, setNote] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    let active = true;
    request('loadLibrary').then(async value => {
      if (!active) return;
      setData(value); setLoaded(true); setBusy(false);
      if (isNative()) {
        const refreshed = await request('refreshLibrary');
        if (active) setData(refreshed);
      }
    })
      .catch(error => { if (active) reportError(error); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, []);
  const perform = async (action: Action, payload?: Record<string, string>) => {
    setBusy(true);
    try {
      setData(await request(action, payload));
      setLoaded(true);
      setNotice(action === 'saveReflection' ? 'Reflection saved on this device.' : '');
    } catch (error) { reportError(error); } finally { setBusy(false); }
  };
  const resources: Resource[] = [
    ...curriculum.map(item => ({ ...item, group: 'Curriculum' })),
    ...(data.saved ?? []).map(item => ({ ...item, group: 'Saved lessons', source: 'Saved lesson' })),
    ...(data.practices ?? []).map(item => ({
      id: 'practice-' + item.id, title: item.name, summary: item.description, source: item.category, group: 'Practices',
    })),
  ];
  const favorites = userProfile.favoriteResources ?? [];
  const completed = data.progress?.completed_lesson_ids ?? [];
  const toggle = (id: string) => updateUserProfile({ favoriteResources: favorites.includes(id)
    ? favorites.filter(item => item !== id) : [...favorites, id] });
  const visible = resources.filter(item => (group === 'All' || group === item.group ||
    (group === 'Favorites' && favorites.includes(item.id))) &&
    [item.title, item.summary, item.practice, item.source].join(' ').toLowerCase().includes(query.trim().toLowerCase()) &&
    (!dimensions.length || dimensions.some(d => topicLessons.find(t => t.name === d)?.ids.includes(item.id))));
  const open = (item: Resource) => { setDetail(item); setNote(data.reflections?.[item.id] ?? ''); setNotice(''); window.scrollTo(0, 0); };
  const card = 'rounded-2xl border p-5 shadow-sm ' + getSolidCardClasses();
  const favorite = (item: Resource) => <button type="button" onClick={() => toggle(item.id)}
    aria-label={'Favorite ' + item.title} aria-pressed={favorites.includes(item.id)} className="p-2 -m-2 rounded-full">
    <Heart className={'w-5 h-5 ' + (favorites.includes(item.id) ? 'fill-pink-500 text-pink-500' : getSubtextClasses())} />
  </button>;

  const section = (title: string, items: Resource[], progress = false) => items.length > 0 && <section className="space-y-4">
    <h2 className="text-xl">{title}</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{items.map(item =>
      <article key={item.id} className={getCardClasses() + ' rounded-xl p-5 border backdrop-blur-sm transition-all hover:shadow-lg'}>
        <div className="flex items-start justify-between mb-3"><span className="px-2.5 py-1 rounded-md flex items-center gap-1.5 text-xs bg-blue-100 text-blue-800">
          <BookOpen size={14}/>{item.group}</span>{favorite(item)}</div>
        <h3 className="mb-2">{item.title}</h3><p className={'text-sm mb-3 line-clamp-2 ' + getSubtextClasses()}>{item.summary}</p>
        <p className={'text-xs mb-4 ' + getSubtextClasses()}>{item.source}</p>
        {progress && <div className="mb-4"><progress className="w-full h-1.5 accent-purple-600" max={curriculum.length}
          value={curriculum.filter(lesson => completed.includes(lesson.id)).length}/><p className="text-xs">{curriculum.filter(lesson => completed.includes(lesson.id)).length} of {curriculum.length} curriculum lessons completed</p></div>}
        <button aria-label={'View ' + item.title} disabled={!loaded} onClick={() => open(item)} className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
          {completed.includes(item.id) && <Check size={14}/>}View <ChevronRight size={16}/></button>
      </article>)}</div></section>;
  const browsing = group === 'All' && !query && !dimensions.length;
  return <AppShell title="Mind Recipe" onBack={() => detail ? setDetail(undefined) : setScreen('home')} backLabel={detail ? 'Resources' : 'Home'}><main className={'max-w-4xl mx-auto px-6 py-8 pb-32 space-y-6 ' + getTextClasses()}>
    {detail ? <>
      <button onClick={() => setDetail(undefined)} className="inline-flex items-center gap-2 py-2"><ArrowLeft size={18} /> All resources</button>
      <article className={card + ' space-y-4'}>
        <div className="flex items-center justify-between"><span className="text-sm">{detail.group}</span>{favorite(detail)}</div>
        <h2 className="text-2xl font-semibold">{detail.title}</h2><p>{detail.summary}</p>
        {detail.practice && <><h3 className="font-semibold">Try this practice</h3><p>{detail.practice}</p></>}
        <p className={'text-sm ' + getSubtextClasses()}>{detail.source}</p>
        {detail.group !== 'Practices' && <button disabled={busy || !loaded || completed.includes(detail.id)}
          className="rounded-full bg-purple-600 text-white px-5 py-3 disabled:opacity-60"
          onClick={() => void perform('completeLesson', { id: detail.id, next: resources.find(r => r.group !== 'Practices' && r.id !== detail.id && !completed.includes(r.id))?.id ?? detail.id })}>
          {completed.includes(detail.id) ? 'Completed' : 'Mark complete'}</button>}
      </article>
      <div className={card + ' space-y-3'}><label htmlFor="reflection" className="block font-semibold">Private reflection</label>
        <textarea id="reflection" value={note} onChange={e => { setNote(e.target.value); setNotice(''); }} rows={4}
          className={'w-full rounded-xl border p-3 ' + getSolidCardClasses()} />
        <button disabled={busy || !loaded} onClick={() => void perform('saveReflection', { id: detail.id, text: note })}
          className="rounded-full bg-purple-600 text-white px-5 py-3">Save reflection</button><p role="status">{notice}</p></div>
    </> : <>
      <header className="space-y-3"><div className="flex items-center gap-3"><div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white"><BookOpen size={20}/></div>
        <h1 className="text-2xl">Explore Resources</h1></div><p className={getSubtextClasses()}>Explore MindRecipe lessons and saved practices to support your daily life.</p></header>
      <label className={'flex items-center gap-3 rounded-xl border px-4 py-3 ' + getCardClasses()}><Search size={20}/>
        <input aria-label="Search resources" placeholder="Search resources..." className="min-w-0 w-full bg-transparent" value={query} onChange={e => setQuery(e.target.value)}/></label>
      <div aria-label="Resource filters" className={getCardClasses() + ' rounded-xl p-1.5 border backdrop-blur-sm grid grid-cols-5 gap-1.5'}>{formats.map(({name, icon: Icon}) =>
        <button key={name} title={name} aria-label={name} onClick={() => setGroup(name)} aria-pressed={group === name}
          className={'py-2.5 rounded-lg text-sm flex items-center justify-center gap-1 ' + (group === name ? 'bg-white dark:bg-gray-800 shadow-sm' : getSubtextClasses())}>
          {Icon && <Icon size={16}/>}<span className={Icon ? 'hidden sm:inline' : ''}>{name}</span></button>)}</div>
      <div className="space-y-3"><p className={'text-sm ' + getSubtextClasses()}>Filter by wellness dimension</p><div className="flex flex-wrap gap-2">
        {topicLessons.map(({name,icon: Icon}) => <button key={name} aria-pressed={dimensions.includes(name)}
          onClick={() => setDimensions(previous => previous.includes(name) ? previous.filter(d => d !== name) : [...previous,name])}
          className={'px-3 py-2 rounded-full border text-sm flex items-center gap-1.5 ' + (dimensions.includes(name) ? getActiveClasses() : getCardClasses())}><Icon size={14}/>{name}</button>)}
      </div></div>
      {busy && <p role="status">Loading your library…</p>}
      {!busy && !loaded && <button onClick={() => void perform('loadLibrary')}>Retry loading library</button>}
      {data.legacyAvailable && <button disabled={busy} className={card} onClick={() => void perform('importLibrary')}>Unlock to import this device’s older lessons and reflections</button>}
      {data.practicesOffline && group === 'Practices' && <p>Saved practices are offline. <button onClick={() => void perform('refreshLibrary')}>Retry</button></p>}
      {browsing && section('Continue where you left off', resources.filter(r => r.id === data.progress?.current_lesson_id && !completed.includes(r.id)), true)}
      {browsing && section('Your favorites', visible.filter(item => favorites.includes(item.id)))}
      {section(group === 'Favorites' ? 'Your favorites' : 'All resources', visible)}
      {!visible.length && !busy && <p>{group === 'Favorites' && !query ? 'Tap the heart on a resource to keep it here.' : 'No matching resources.'}</p>}
    </>}
  </main></AppShell>;
}
