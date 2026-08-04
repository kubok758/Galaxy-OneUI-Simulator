import { beforeEach, describe, expect, it } from 'vitest';
import { usePhoneStore } from '../state/usePhoneStore';

beforeEach(() => {
  localStorage.clear();
  usePhoneStore.setState({ locked: true, currentApp: null, runningApps: [], appHistory: [], homePage: 0 });
});

describe('Zustand phone store', () => {
  it('unlocks only with the configured PIN', () => {
    expect(usePhoneStore.getState().verifyPin('0000')).toBe(false);
    expect(usePhoneStore.getState().locked).toBe(true);
    expect(usePhoneStore.getState().verifyPin('2580')).toBe(true);
    expect(usePhoneStore.getState().locked).toBe(false);
  });

  it('opens apps and tracks recents', () => {
    usePhoneStore.getState().openApp('phone');
    expect(usePhoneStore.getState().currentApp).toBe('phone');
    expect(usePhoneStore.getState().runningApps).toContain('phone');
  });

  it('sends a message into a chat', () => {
    const before = usePhoneStore.getState().chats[0].messages.length;
    usePhoneStore.getState().sendMessage('chat1', { text: 'Тестовое сообщение' });
    expect(usePhoneStore.getState().chats[0].messages).toHaveLength(before + 1);
    expect(usePhoneStore.getState().chats[0].messages.at(-1)?.text).toBe('Тестовое сообщение');
  });

  it('moves an app between home pages', () => {
    usePhoneStore.getState().moveAppToPage('phone', 1);
    expect(usePhoneStore.getState().homePages[0]).not.toContain('phone');
    expect(usePhoneStore.getState().homePages[1]).toContain('phone');
  });

  it('updates persisted settings', () => {
    usePhoneStore.getState().updateSetting('brightness', 45);
    expect(usePhoneStore.getState().settings.brightness).toBe(45);
  });
});
