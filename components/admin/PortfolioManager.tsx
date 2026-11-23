'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  Trash2,
  Plus,
  Tag,
  Check,
  Loader2,
  ImagePlus,
  X,
  FileImage,
} from 'lucide-react';
import type { PortfolioCategory, PortfolioItem } from '@/lib/queries';
import {
  saveCategoryAction,
  deleteCategoryAction,
  uploadPhotosAction,
  movePhotoAction,
  deletePhotoAction,
} from '@/app/admin/actions';

const MAX_BYTES = 12 * 1024 * 1024;
const OK_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export default function PortfolioManager({
  categories,
  items,
}: {
  categories: PortfolioCategory[];
  items: PortfolioItem[];
}) {
  const router = useRouter();
  const [newCategory, setNewCategory] = useState('');
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [picked, setPicked] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const countByCategory = new Map<number, number>();
  for (const item of items) countByCategory.set(item.category_id, (countByCategory.get(item.category_id) ?? 0) + 1);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function flash(kind: 'ok' | 'error', text: string) {
    setNotice({ kind, text });
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setNotice(null), 4500);
  }

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list);
    const accepted: File[] = [];
    let rejected = 0;
    for (const file of incoming) {
      if (!OK_TYPES.has(file.type) || file.size > MAX_BYTES) {
        rejected += 1;
        continue;
      }
      accepted.push(file);
    }
    if (accepted.length) setPicked((prev) => [...prev, ...accepted]);
    if (rejected > 0) flash('error', `Пропущено файлов: ${rejected}. Только JPG, PNG, WebP до 12 МБ.`);
  }

  function removePicked(index: number) {
    setPicked((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleAddCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = newCategory.trim();
    if (name.length < 2) {
      flash('error', 'Название категории от 2 символов.');
      return;
    }
    const fd = new FormData();
    fd.set('name', name);
    const result = await saveCategoryAction(fd);
    if (result.ok) {
      setNewCategory('');
      flash('ok', `Категория «${name}» добавлена.`);
      router.refresh();
    } else {
      flash('error', result.error ?? 'Не удалось добавить категорию.');
    }
  }

  async function handleRenameCategory(id: number, name: string) {
    const trimmed = name.trim();
    if (trimmed.length < 2) return;
    const fd = new FormData();
    fd.set('id', String(id));
    fd.set('name', trimmed);
    await saveCategoryAction(fd);
    router.refresh();
  }

  async function handleDeleteCategory(cat: PortfolioCategory) {
    const n = countByCategory.get(cat.id) ?? 0;
    const msg =
      n > 0
        ? `Удалить категорию «${cat.name}» вместе с ${n} фото? Фотографии будут безвозвратно удалены.`
        : `Удалить пустую категорию «${cat.name}»?`;
    if (!window.confirm(msg)) return;
    await deleteCategoryAction(cat.id);
    flash('ok', 'Категория удалена.');
    router.refresh();
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (picked.length === 0) {
      flash('error', 'Сначала выберите фотографии.');
      return;
    }
    const categoryId = String(new FormData(e.currentTarget).get('category_id') ?? '');
    const fd = new FormData();
    fd.set('category_id', categoryId);
    for (const file of picked) fd.append('photos', file);

    setUploading(true);
    const result = await uploadPhotosAction(fd);
    setUploading(false);
    if (result.ok) {
      flash('ok', `Загружено фотографий: ${result.uploaded}.`);
      setPicked([]);
      if (fileRef.current) fileRef.current.value = '';
      router.refresh();
    } else {
      flash('error', result.error ?? 'Не удалось загрузить файлы.');
    }
  }

  async function handleMove(itemId: number, categoryId: number) {
    setBusy(true);
    await movePhotoAction(itemId, categoryId);
    setBusy(false);
    router.refresh();
  }

  async function handleDeletePhoto(item: PortfolioItem) {
    if (!window.confirm('Удалить это фото из портфолио?')) return;
    await deletePhotoAction(item.id);
    flash('ok', 'Фото удалено.');
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-5">
      {/* ===== Левая колонка ===== */}
      <div className="space-y-6 xl:col-span-2">
        {/* Загрузка фото */}
        <form onSubmit={handleUpload} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <ImagePlus size={20} className="text-golddeep" />
            Загрузить фотографии
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-mute">
            JPG, PNG или WebP до 12 МБ каждый. Можно выбрать сразу несколько файлов.
          </p>

          <label htmlFor="category_id" className="label mt-5">Категория</label>
          <select id="category_id" name="category_id" required className="input" defaultValue={categories[0]?.id ?? ''}>
            {categories.length === 0 && <option value="">Сначала создайте категорию</option>}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Dropzone */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Выбрать фотографии для загрузки"
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
            className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
              dragging ? 'border-gold bg-gold/10' : 'border-ink/15 bg-sand/40 hover:border-gold hover:bg-gold/5'
            }`}
          >
            <UploadCloud size={34} strokeWidth={1.6} className="text-golddeep" />
            <span className="text-sm font-semibold text-ink/85">Нажмите или перетащите файлы сюда</span>
            <span className="text-[11px] text-mute">изображения до 12 МБ</span>
            <input
              ref={fileRef}
              id="photos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(e) => {
                if (e.target.files?.length) addFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </div>

          {/* Очередь выбранных файлов */}
          {picked.length > 0 && (
            <ul className="mt-4 space-y-2">
              {picked.map((file, i) => (
                <li key={`${file.name}-${i}`} className="flex items-center gap-2 rounded-xl border border-ink/10 bg-sand/30 px-3 py-2 text-xs">
                  <FileImage size={16} className="shrink-0 text-golddeep" />
                  <span className="min-w-0 flex-1 truncate font-medium">{file.name}</span>
                  <span className="shrink-0 text-mute">{(file.size / 1024 / 1024).toFixed(1)} МБ</span>
                  <button type="button" onClick={() => removePicked(i)} className="shrink-0 text-mute transition-colors hover:text-red-800" aria-label="Убрать из списка">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button type="submit" disabled={uploading || categories.length === 0 || picked.length === 0} className="btn-gold mt-4 w-full !py-3.5 text-sm">
            {uploading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Загружаю…
              </>
            ) : (
              <>
                <UploadCloud size={17} />
                Загрузить{picked.length > 0 ? ` (${picked.length})` : ''}
              </>
            )}
          </button>
        </form>

        {/* Категории */}
        <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <Tag size={19} className="text-golddeep" />
            Категории
          </h2>
          <ul className="mt-4 divide-y divide-ink/[0.08]">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-2 py-2.5">
                <input
                  defaultValue={cat.name}
                  aria-label={`Переименовать категорию ${cat.name}`}
                  onBlur={(e) => handleRenameCategory(cat.id, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                  className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-3 py-2 text-sm font-semibold transition-colors hover:border-ink/15 focus:border-gold focus:bg-white focus:outline-none"
                />
                <span className="w-12 text-center text-[10px] font-bold text-mute" title="Фотографий в категории">
                  {countByCategory.get(cat.id) ?? 0} фото
                </span>
                <button
                  onClick={() => handleDeleteCategory(cat)}
                  className="icon-btn hover:!border-red-800/40 hover:!text-red-800"
                  aria-label={`Удалить категорию ${cat.name}`}
                  title="Удалить категорию"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddCategory} className="mt-4 flex gap-2">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Новая категория…"
              aria-label="Название новой категории"
              className="input"
            />
            <button type="submit" className="btn-ink shrink-0 !px-5 text-[13px]" aria-label="Добавить категорию">
              <Plus size={17} />
              Добавить
            </button>
          </form>
        </div>
      </div>

      {/* ===== Правая колонка: все фото ===== */}
      <div className="xl:col-span-3">
        <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-bold">Фотографии <span className="text-mute">· {items.length}</span></h2>
            {busy && <Loader2 size={18} className="animate-spin text-golddeep" />}
          </div>

          {notice && (
            <p
              role="status"
              className={`mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
                notice.kind === 'ok' ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'
              }`}
            >
              {notice.kind === 'ok' ? <Check size={16} /> : null}
              {notice.text}
            </p>
          )}

          {items.length === 0 ? (
            <div className="py-16 text-center text-sm text-mute">
              Фотографий пока нет — загрузите первые через форму слева.
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {items.map((item) => (
                <figure key={item.id} className="overflow-hidden rounded-xl border border-ink/10 bg-sand/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_path}
                    alt={item.title || item.category_name}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <figcaption className="space-y-2 p-2.5">
                    <select
                      value={item.category_id}
                      onChange={(e) => handleMove(item.id, Number(e.target.value))}
                      aria-label="Переместить в категорию"
                      className="w-full rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-[11px] font-medium focus:border-gold focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDeletePhoto(item)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-900/15 bg-red-50 px-2 py-1.5 text-[11px] font-bold text-red-900 transition-colors hover:bg-red-100"
                    >
                      <Trash2 size={13} />
                      Удалить
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
