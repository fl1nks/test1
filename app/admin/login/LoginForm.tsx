'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { LockKeyhole, AlertCircle } from 'lucide-react';
import { loginAction, type LoginState } from '../actions';

const initialState: LoginState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-gold w-full !py-4 text-base">
      {pending ? (
        <>
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
          Проверяю…
        </>
      ) : (
        <>
          <LockKeyhole size={18} />
          Войти
        </>
      )}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form action={formAction} className="rounded-3xl border border-white/10 bg-inksoft p-6 shadow-soft sm:p-8">
      <label htmlFor="password" className="label !text-paper/60">Пароль</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        placeholder="Введите пароль администратора"
        className="input !border-white/15 !bg-white/5 !text-paper placeholder:!text-paper/30 focus:!ring-gold/40"
      />
      {state.error && (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          {state.error}
        </p>
      )}
      <div className="mt-6">
        <SubmitButton />
      </div>
      <p className="mt-5 text-center text-[11px] leading-relaxed text-paper/40">
        Пароль по умолчанию: <span className="font-mono text-paper/60">olga2026</span> —<br />
        смените его через переменную окружения <span className="font-mono">ADMIN_PASSWORD</span>
      </p>
    </form>
  );
}
