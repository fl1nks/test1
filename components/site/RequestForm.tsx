'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { SendHorizontal, CheckCircle2, AlertCircle, User, Phone, MessageSquare, Sparkles } from 'lucide-react';
import { submitRequest, type RequestFormState } from '@/app/actions/request';
import type { Service } from '@/lib/queries';

const initialState: RequestFormState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-gold w-full !py-4 text-base">
      {pending ? (
        <>
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-paper/40 border-t-paper" aria-hidden="true" />
          Отправляю…
        </>
      ) : (
        <>
          Отправить заявку
          <SendHorizontal size={18} />
        </>
      )}
    </button>
  );
}

export default function RequestForm({
  services,
  preselectedServiceId,
}: {
  services: Service[];
  preselectedServiceId: number | null;
}) {
  const [state, formAction] = useFormState(submitRequest, initialState);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (state.ok) setSent(true);
  }, [state.ok]);

  if (sent) {
    return (
      <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-3xl border border-gold/40 bg-gold/5 p-8 text-center">
        <CheckCircle2 size={64} strokeWidth={1.4} className="text-golddeep" />
        <h3 className="display-h mt-6 text-3xl">Заявка отправлена!</h3>
        <p className="mt-3 max-w-sm text-mute">
          Спасибо! Я лично отвечу вам в ближайшее рабочее время — обычно в течение дня.
        </p>
        <button onClick={() => setSent(false)} className="btn-ghost mt-8 !py-2.5 text-[13px]">
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8" noValidate>
      <h2 className="font-display text-2xl font-bold sm:text-3xl">Заявка на фотосессию</h2>
      <p className="mt-2 flex items-center gap-2 text-sm text-mute">
        <Sparkles size={14} className="text-gold" />
        Отвечаю лично в рабочее время — обычно в течение дня
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">Ваше имя *</label>
          <div className="relative">
            <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
            <input id="name" name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder="Как к вам обращаться" className="input !pl-11" />
          </div>
        </div>
        <div>
          <label htmlFor="contact" className="label">Телефон или Telegram *</label>
          <div className="relative">
            <Phone size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mute" />
            <input id="contact" name="contact" required minLength={5} maxLength={200} autoComplete="tel" placeholder="+7 (___) ___-__-__ или @username" className="input !pl-11" />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="service_id" className="label">Услуга</label>
        <select id="service_id" name="service_id" defaultValue={preselectedServiceId ?? ''} className="input">
          <option value="">Консультация — нужна помощь с выбором</option>
          {services.map((svc) => (
            <option key={svc.id} value={svc.id}>{svc.title}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="comment" className="label">Комментарий</label>
        <div className="relative">
          <MessageSquare size={17} className="pointer-events-none absolute left-4 top-4 text-mute" />
          <textarea id="comment" name="comment" maxLength={2000} placeholder="Дата, место, пожелания по съёмке…" className="input !pl-11" />
        </div>
      </div>

      {/* honeypot против ботов — скрыто от людей */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {state.error && (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-900/15 bg-red-50 px-4 py-3 text-sm text-red-900">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}

      <div className="mt-6">
        <SubmitButton />
      </div>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-mute">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных
        в соответствии с политикой конфиденциальности.
      </p>
    </form>
  );
}
