'use client';

import { useEffect, useRef, useState } from 'react';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';
import { saveSettingsAction } from '@/app/admin/actions';

function Field({
  label,
  name,
  defaultValue,
  textarea = false,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue: string;
  textarea?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      {textarea ? (
        <textarea id={name} name={name} defaultValue={defaultValue} placeholder={placeholder} className="input" />
      ) : (
        <input id={name} name={name} defaultValue={defaultValue} placeholder={placeholder} className="input" />
      )}
      {hint && <p className="mt-1.5 text-[11px] leading-snug text-mute">{hint}</p>}
    </div>
  );
}

export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const fd = new FormData(e.currentTarget);
    await saveSettingsAction(fd);
    setSaving(false);
    setSaved(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setSaved(false), 3500);
  }

  const s = (key: string) => settings[key] ?? '';

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {/* Плавающая кнопка сохранения */}
      <div className="sticky top-14 z-20 -mx-4 flex items-center justify-between gap-3 border-b border-ink/10 bg-[#F2EFE9]/90 px-4 py-3 backdrop-blur sm:top-4 sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
        <p className="text-xs text-mute sm:text-sm">Изменения применяются на сайте сразу после сохранения.</p>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 sm:text-sm">
              <CheckCircle2 size={16} />
              Сохранено
            </span>
          )}
          <button type="submit" disabled={saving} className="btn-ink !py-2.5 text-[13px]">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Сохранить
          </button>
        </div>
      </div>

      {/* Профиль и главная */}
      <fieldset className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
        <legend className="px-2 font-display text-lg font-bold">Профиль и главная страница</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Имя фотографа" name="photographer_name" defaultValue={s('photographer_name')} />
          <Field label="Подпись (профессия)" name="profession" defaultValue={s('profession')} />
          <Field label="Надзаголовок на первом экране" name="hero_kicker" defaultValue={s('hero_kicker')} hint="Мелкий текст над большим заголовком, например «Фотограф · Кемерово»." />
          <div className="sm:col-span-2">
            <Field label="Подзаголовок на первом экране" name="hero_subtitle" defaultValue={s('hero_subtitle')} textarea />
          </div>
          <div className="sm:col-span-2">
            <Field label="Текст «Обо мне»" name="about_text" defaultValue={s('about_text')} textarea hint="Абзац на главной странице в блоке «Привет, я — …»." />
          </div>
          <Field label="Лет в профессии (число)" name="stat_years" defaultValue={s('stat_years')} />
          <Field label="Съёмок проведено" name="stat_shoots" defaultValue={s('stat_shoots')} />
          <Field label="Средняя оценка" name="stat_rating" defaultValue={s('stat_rating')} />
        </div>
      </fieldset>

      {/* Связь */}
      <fieldset className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
        <legend className="px-2 font-display text-lg font-bold">Связь с вами</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Телефон" name="phone" defaultValue={s('phone')} placeholder="+7 (913) 000-00-00" />
          <Field label="Почта" name="email" defaultValue={s('email')} placeholder="olga@example.com" />
          <Field label="Telegram (логин)" name="telegram" defaultValue={s('telegram')} placeholder="@username" />
          <Field label="WhatsApp (номер)" name="whatsapp" defaultValue={s('whatsapp')} placeholder="+7 (913) 000-00-00" />
          <Field label="ВКонтакте" name="vk" defaultValue={s('vk')} placeholder="vk.com/username" />
          <Field label="Instagram*" name="instagram" defaultValue={s('instagram')} placeholder="@username" hint="* Instagram — продукт компании Meta, деятельность которой признана экстремистской и запрещена на территории РФ." />
        </div>
      </fieldset>

      {/* Адрес, режим, выезд */}
      <fieldset className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
        <legend className="px-2 font-display text-lg font-bold">Где приём и куда выезжаете</legend>
        <div className="grid gap-4">
          <Field label="Адрес студии / как вас найти" name="address" defaultValue={s('address')} />
          <Field
            label="Режим работы"
            name="work_hours"
            defaultValue={s('work_hours')}
            textarea
            hint="Перенос строки сохраняется: каждый с новой строки будет с новой строки на сайте."
          />
          <Field
            label="Зона выездной съёмки"
            name="visit_zone"
            defaultValue={s('visit_zone')}
            textarea
            hint="Условия бесплатного выезда и доплаты — посетители видят этот текст в блоке «Контакты»."
          />
        </div>
      </fieldset>
    </form>
  );
}
