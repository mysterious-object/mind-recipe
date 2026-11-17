import type { Snapshot } from './state';

declare global {
  interface Window {
    MindRecipeHost?: { postMessage: (message: string) => void };
    mindRecipeReply?: (id: number, ok: boolean, value: unknown) => void;
    mindRecipeBack?: () => void;
  }
}

let sequence = 0;
const pending = new Map<number, { resolve: (value: any) => void; reject: (error: Error) => void }>();
window.mindRecipeReply = (id, ok, value) => {
  const request = pending.get(id);
  if (!request) return;
  pending.delete(id);
  if (ok) request.resolve(value);
  else request.reject(new Error(String(value)));
};

export const isNative = () => Boolean(window.MindRecipeHost);

export function nativeRequest<T = unknown>(type: string, payload?: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!window.MindRecipeHost) {
      reject(new Error('This action is available in the MindRecipe mobile app.'));
      return;
    }
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    window.MindRecipeHost.postMessage(JSON.stringify({ id, type, payload }));
  });
}

const previewKey = 'mindrecipe-clarity-preview-v1';
export async function loadSnapshot(): Promise<Partial<Snapshot> | null> {
  if (isNative()) return nativeRequest('load');
  const saved = localStorage.getItem(previewKey);
  return saved ? JSON.parse(saved) : null;
}

export async function saveSnapshot(snapshot: Snapshot): Promise<void> {
  if (isNative()) await nativeRequest('save', snapshot);
  else localStorage.setItem(previewKey, JSON.stringify(snapshot));
}

export async function openExternal(url: string): Promise<void> {
  if (isNative()) await nativeRequest('openUrl', url);
  else window.location.assign(url);
}

export async function shareText(text: string): Promise<void> {
  if (isNative()) await nativeRequest('share', text);
  else if (navigator.share) await navigator.share({ text });
  else {
    const a = document.createElement('a');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    a.href = url;
    a.download = 'MindRecipe-insights.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export function haptic() {
  if (isNative()) void nativeRequest('haptic').catch(() => {});
  else navigator.vibrate?.(20);
}
