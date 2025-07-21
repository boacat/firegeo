'use client';

import { useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { locales, type Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function LanguageSwitcher({
  variant = 'ghost',
  size = 'default',
  showLabel = true,
  className
}: LanguageSwitcherProps) {
  const { locale, setLocale, localeInfo, t } = useI18n();
  const [open, setOpen] = useState(false);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2',
          size === 'sm' && 'h-8 px-2',
          className
        )}
      >
        <Globe className="h-4 w-4" />
        {showLabel && (
          <>
            <span className="hidden sm:inline">
              {localeInfo?.name || locale}
            </span>
            <span className="sm:hidden">
              {localeInfo?.flag || '🌐'}
            </span>
          </>
        )}
        <ChevronDown className="h-3 w-3 opacity-50" />
      </Button>
      {open && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
            <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
              {t('nav.language')}
            </div>
            {locales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => handleLocaleChange(loc.code)}
                className="relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{loc.flag}</span>
                  <span>{loc.name}</span>
                </div>
                {locale === loc.code && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// 简化版语言切换器（只显示图标）
export function LanguageSwitcherCompact({ className }: { className?: string }) {
  return (
    <LanguageSwitcher
      variant="ghost"
      size="sm"
      showLabel={false}
      className={className}
    />
  );
}

// 移动端语言切换器
export function LanguageSwitcherMobile({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setOpen(false);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="text-sm font-medium text-muted-foreground px-3">
        {t('nav.language')}
      </div>
      <div className="grid grid-cols-2 gap-2 px-3">
        {locales.map((loc) => (
          <Button
            key={loc.code}
            variant={locale === loc.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleLocaleChange(loc.code)}
            className="justify-start gap-2"
          >
            <span className="text-base">{loc.flag}</span>
            <span className="text-xs">{loc.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

// 内联语言切换器（用于设置页面）
export function LanguageSwitcherInline({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className={cn('space-y-3', className)}>
      <label className="text-sm font-medium">
        {t('settings.language')}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {locales.map((loc) => (
          <Button
            key={loc.code}
            variant={locale === loc.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLocale(loc.code)}
            className="justify-start gap-2 h-auto py-3"
          >
            <span className="text-lg">{loc.flag}</span>
            <div className="text-left">
              <div className="font-medium">{loc.name}</div>
              <div className="text-xs text-muted-foreground">{loc.code}</div>
            </div>
            {locale === loc.code && (
              <Check className="h-4 w-4 ml-auto text-primary" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}