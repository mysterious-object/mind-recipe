import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { isNative, nativeRequest } from '../host';
import { AppShell } from './AppShell';
import { Button } from './ui/button';
export function Learn() {
  const { reportError, setScreen } = useApp();
  const opening = useRef(false);
  const open = async () => {
    if (opening.current) return;
    opening.current = true;
    try { await nativeRequest('openLessons'); setScreen('home'); }
    catch (error) { reportError(error); }
    finally { opening.current = false; }
  };
  useEffect(() => { if (isNative()) void open(); }, []);
  return <AppShell title="Mind Recipe"><div className="max-w-2xl mx-auto p-6 space-y-6">
    <h2 className="text-3xl">Mind Recipe</h2>
    <p>Your lessons, reflections, and saved practices.</p>
    {isNative() ? <Button onClick={() => void open()}>Open my lessons</Button> : <p>The mobile app opens your existing Mind Recipe library here.</p>}
  </div></AppShell>;
}
