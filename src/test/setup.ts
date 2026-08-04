import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

Object.defineProperty(navigator, 'mediaDevices', {
  configurable: true,
  value: { getUserMedia: vi.fn().mockRejectedValue(new Error('Camera disabled in tests')) },
});

class MockAudioContext {
  destination = {};
  createOscillator() { return { type: 'sine', frequency: { value: 0 }, connect: () => this.createGain(), start: vi.fn(), stop: vi.fn() }; }
  createGain() { return { gain: { value: 0 }, connect: vi.fn() }; }
}
Object.defineProperty(window, 'AudioContext', { configurable: true, value: MockAudioContext });
