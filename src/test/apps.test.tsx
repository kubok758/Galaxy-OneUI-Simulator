import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { SettingsApp } from '../apps/SettingsApp';
import { PhoneApp } from '../apps/PhoneApp';
import { MessagesApp } from '../apps/MessagesApp';
import { CameraApp } from '../apps/CameraApp';
import { GalleryApp } from '../apps/GalleryApp';
import { ClockApp } from '../apps/ClockApp';
import { CalculatorApp } from '../apps/CalculatorApp';
import { FilesApp } from '../apps/FilesApp';
import { InternetApp } from '../apps/InternetApp';
import { MusicApp } from '../apps/MusicApp';
import { ContactsApp } from '../apps/ContactsApp';
import { NotesApp } from '../apps/NotesApp';
import { usePhoneStore } from '../state/usePhoneStore';

beforeEach(() => usePhoneStore.setState({ locked: false, currentApp: null, shadeLevel: 0, recentsOpen: false }));

const cases = [
  ['Настройки', SettingsApp], ['Телефон', PhoneApp], ['Сообщения', MessagesApp],
  ['Камера', CameraApp], ['Галерея', GalleryApp], ['Часы', ClockApp],
  ['Калькулятор', CalculatorApp], ['Мои файлы', FilesApp], ['Samsung Internet', InternetApp],
  ['Samsung Music', MusicApp], ['Контакты', ContactsApp], ['Samsung Notes', NotesApp],
] as const;

describe.each(cases)('%s app', (title, Component) => {
  it('renders an accessible application surface', () => {
    render(<Component />);
    expect(screen.getByLabelText(title)).toBeInTheDocument();
  });
});
