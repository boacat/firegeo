export const defaultLocale = 'zh-CN';

export const locales = [
  {
    code: 'zh-CN',
    name: '简体中文',
    flag: '🇨🇳'
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'ja',
    name: '日本語',
    flag: '🇯🇵'
  },
  {
    code: 'ko',
    name: '한국어',
    flag: '🇰🇷'
  },
  {
    code: 'es',
    name: 'Español',
    flag: '🇪🇸'
  },
  {
    code: 'fr',
    name: 'Français',
    flag: '🇫🇷'
  },
  {
    code: 'de',
    name: 'Deutsch',
    flag: '🇩🇪'
  },
  {
    code: 'pt',
    name: 'Português',
    flag: '🇵🇹'
  },
  {
    code: 'ru',
    name: 'Русский',
    flag: '🇷🇺'
  },
  {
    code: 'ar',
    name: 'العربية',
    flag: '🇸🇦'
  }
] as const;

export type Locale = typeof locales[number]['code'];

export const isValidLocale = (locale: string): locale is Locale => {
  return locales.some(l => l.code === locale);
};

export const getLocaleInfo = (locale: Locale) => {
  return locales.find(l => l.code === locale);
};

export const rtlLocales: Locale[] = ['ar'];

export const isRTL = (locale: Locale): boolean => {
  return rtlLocales.includes(locale);
};

// 日期格式配置
export const dateFormats: Record<Locale, string> = {
  'zh-CN': 'YYYY年MM月DD日',
  'en': 'MMM DD, YYYY',
  'ja': 'YYYY年MM月DD日',
  'ko': 'YYYY년 MM월 DD일',
  'es': 'DD/MM/YYYY',
  'fr': 'DD/MM/YYYY',
  'de': 'DD.MM.YYYY',
  'pt': 'DD/MM/YYYY',
  'ru': 'DD.MM.YYYY',
  'ar': 'DD/MM/YYYY'
};

// 数字格式配置
export const numberFormats: Record<Locale, Intl.NumberFormatOptions> = {
  'zh-CN': { locale: 'zh-CN' },
  'en': { locale: 'en-US' },
  'ja': { locale: 'ja-JP' },
  'ko': { locale: 'ko-KR' },
  'es': { locale: 'es-ES' },
  'fr': { locale: 'fr-FR' },
  'de': { locale: 'de-DE' },
  'pt': { locale: 'pt-PT' },
  'ru': { locale: 'ru-RU' },
  'ar': { locale: 'ar-SA' }
};

// 货币格式配置
export const currencyFormats: Record<Locale, { currency: string; locale: string }> = {
  'zh-CN': { currency: 'CNY', locale: 'zh-CN' },
  'en': { currency: 'USD', locale: 'en-US' },
  'ja': { currency: 'JPY', locale: 'ja-JP' },
  'ko': { currency: 'KRW', locale: 'ko-KR' },
  'es': { currency: 'EUR', locale: 'es-ES' },
  'fr': { currency: 'EUR', locale: 'fr-FR' },
  'de': { currency: 'EUR', locale: 'de-DE' },
  'pt': { currency: 'EUR', locale: 'pt-PT' },
  'ru': { currency: 'RUB', locale: 'ru-RU' },
  'ar': { currency: 'SAR', locale: 'ar-SA' }
};