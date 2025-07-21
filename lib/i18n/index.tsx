'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { zhCN } from './locales/zh-CN';
import { en } from './locales/en';

// 支持的语言
export const locales = ['zh-CN', 'en'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'zh-CN';

// 语言信息
const localeInfo = {
  'zh-CN': {
    name: '简体中文',
    nativeName: '简体中文',
    flag: '🇨🇳',
    dir: 'ltr'
  },
  'en': {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    dir: 'ltr'
  }
} as const;

// 工具函数
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleInfo(locale: Locale) {
  return localeInfo[locale];
}

export function isRTL(locale: Locale): boolean {
  return localeInfo[locale].dir === 'rtl';
}

// 翻译资源
const translations = {
  'zh-CN': zhCN,
  'en': en
} as const;

type TranslationKey = keyof typeof zhCN;
type NestedTranslationKey<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${string & K}.${NestedTranslationKey<T[K]>}`
        : string & K;
    }[keyof T]
  : never;

type AllTranslationKeys = NestedTranslationKey<typeof zhCN>;

// 国际化上下文
interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: AllTranslationKeys, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  localeInfo: ReturnType<typeof getLocaleInfo>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// 获取嵌套对象的值
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

// 翻译函数
function createTranslator(locale: Locale) {
  return function t(key: AllTranslationKeys, params?: Record<string, string | number>): string {
    const translation = translations[locale] || translations[defaultLocale];
    let text = getNestedValue(translation, key);
    
    // 如果当前语言没有翻译，回退到默认语言
    if (!text && locale !== defaultLocale) {
      text = getNestedValue(translations[defaultLocale], key);
    }
    
    // 如果仍然没有翻译，返回 key
    if (!text) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    // 参数替换
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`{{${param}}}`, 'g'), String(value));
      });
    }
    
    return text;
  };
}

// 国际化提供者组件
interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (initialLocale && isValidLocale(initialLocale)) {
      return initialLocale;
    }
    
    // 强制使用默认语言（中文）
    return defaultLocale;
  });

  const setLocale = useCallback((newLocale: Locale) => {
    if (isValidLocale(newLocale)) {
      setLocaleState(newLocale);
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', newLocale);
        // 设置 HTML lang 属性
        document.documentElement.lang = newLocale;
        // 设置 RTL 方向
        document.documentElement.dir = isRTL(newLocale) ? 'rtl' : 'ltr';
      }
    }
  }, []);

  const t = useMemo(() => createTranslator(locale), [locale]);
  const localeInfo = useMemo(() => getLocaleInfo(locale), [locale]);
  const isRTLValue = useMemo(() => isRTL(locale), [locale]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = isRTL(locale) ? 'rtl' : 'ltr';
    }
  }, [locale]);

  const value: I18nContextType = useMemo(() => ({
    locale,
    setLocale,
    t,
    isRTL: isRTLValue,
    localeInfo
  }), [locale, setLocale, t, isRTLValue, localeInfo]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

// 使用国际化的 Hook
export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// 翻译 Hook（简化版）
export function useTranslation() {
  const { t, locale } = useI18n();
  return { t, locale };
}

// 格式化日期
export function formatDate(date: Date, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
}

// 格式化数字
export function formatNumber(number: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(number);
}

// 格式化货币
export function formatCurrency(amount: number, locale: Locale, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
}

// 格式化相对时间
export function formatRelativeTime(date: Date, locale: Locale): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
}

// 导出类型
export type { Locale, I18nContextType, AllTranslationKeys };