import type { AppId } from '../types';
import { usePhoneStore } from '../state/usePhoneStore';

/** Captures the current phone DOM into an SVG foreignObject data URL for Recents. */
export function capturePhoneSnapshot(appId: AppId | null) {
  if (!appId) return;
  const screen = document.querySelector<HTMLElement>('[data-phone-display]');
  if (!screen) return;
  try {
    const clone = screen.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('video, iframe').forEach((node) => {
      const replacement = document.createElement('div');
      replacement.setAttribute('style', 'width:100%;height:100%;background:#202126;display:grid;place-items:center;color:white');
      replacement.textContent = node.tagName === 'VIDEO' ? 'Камера' : 'Веб-страница';
      node.replaceWith(replacement);
    });
    const styles = Array.from(document.querySelectorAll('style')).map((node) => node.textContent ?? '').join('\n');
    const width = Math.max(360, screen.clientWidth);
    const height = Math.max(780, screen.clientHeight);
    const markup = new XMLSerializer().serializeToString(clone);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><style>${styles}</style><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${markup}</div></foreignObject></svg>`;
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    usePhoneStore.getState().setSnapshot(appId, dataUrl);
  } catch {
    // Recents still renders a live semantic preview if DOM serialization is blocked.
  }
}
