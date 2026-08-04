import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppIcon } from '../components/AppIcon';
import { Switch } from '../components/Switch';
import { StatusBar } from '../components/StatusBar';
import { NavigationBar } from '../components/NavigationBar';
import { usePhoneStore } from '../state/usePhoneStore';

beforeEach(() => usePhoneStore.setState({ locked: false, currentApp: null, recentsOpen: false, shadeLevel: 0 }));

describe('core components', () => {
  it('opens an app from AppIcon', () => {
    const open = vi.fn();
    render(<AppIcon id="phone" onOpen={open} />);
    fireEvent.click(screen.getByLabelText('Открыть приложение Телефон'));
    expect(open).toHaveBeenCalledWith('phone');
  });

  it('toggles a Switch', () => {
    const change = vi.fn();
    render(<Switch checked={false} onChange={change} label="Wi-Fi" />);
    fireEvent.click(screen.getByRole('switch'));
    expect(change).toHaveBeenCalled();
  });

  it('opens notifications from the status bar', () => {
    const open = vi.fn();
    render(<StatusBar onOpenShade={open} />);
    fireEvent.click(screen.getByLabelText('Открыть панель уведомлений'));
    expect(open).toHaveBeenCalled();
  });

  it('renders all navigation controls', () => {
    render(<NavigationBar />);
    expect(screen.getByLabelText('Назад')).toBeInTheDocument();
    expect(screen.getByLabelText('Домой')).toBeInTheDocument();
    expect(screen.getByLabelText('Недавние приложения')).toBeInTheDocument();
  });
});
