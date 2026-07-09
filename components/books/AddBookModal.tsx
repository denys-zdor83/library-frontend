'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { clsx } from '@/lib/utils';
import type { Book, Genre } from '@/types';

interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
  onAdded: (book: Book) => void;
}

interface FormErrors {
  title?: string;
  author?: string;
  year?: string;
  genre?: string;
}

const currentYear = new Date().getFullYear();

export function AddBookModal({ open, onClose, onAdded }: AddBookModalProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [form, setForm] = useState({ title: '', author: '', year: '', genre: '', description: '' });
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get<Genre[]>('/books/genres/').then(setGenres).catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) {
      setForm({ title: '', author: '', year: '', genre: '', description: '' });
      setCover(null);
      setCoverPreview(null);
      setErrors({});
      setSubmitError('');
    }
  }, [open]);

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCover(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeCover = () => {
    setCover(null);
    setCoverPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.author.trim()) errs.author = 'Author is required';
    if (!form.year) {
      errs.year = 'Year is required';
    } else if (!/^\d{4}$/.test(form.year) || +form.year < 1000 || +form.year > currentYear) {
      errs.year = `Enter a valid year (1000–${currentYear})`;
    }
    if (!form.genre) errs.genre = 'Genre is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError('');
    try {
      const fd = new FormData();
      fd.append('title', form.title.trim());
      fd.append('author', form.author.trim());
      fd.append('year', form.year);
      fd.append('genre', form.genre);
      fd.append('description', form.description.trim());
      if (cover) fd.append('cover', cover);
      const book = await api.post<Book>('/books/', fd);
      onAdded(book);
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Book" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              error={errors.title}
              placeholder="Book title"
            />
          </div>
          <Input
            label="Author"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            error={errors.author}
            placeholder="Author name"
          />
          <Input
            label="Year of publishing"
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            error={errors.year}
            placeholder={`e.g. ${currentYear}`}
            min={1000}
            max={currentYear}
          />
        </div>

        {/* Genre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Genre</label>
          <select
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
            className={clsx(
              'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5',
              'text-sm text-slate-900',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'transition-colors duration-200',
              errors.genre && 'border-red-400'
            )}
          >
            <option value="">Select a genre</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          {errors.genre && <p className="text-xs text-red-500">{errors.genre}</p>}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Book description (optional)"
            rows={4}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
          />
        </div>

        {/* Cover image */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Cover image</label>
          <div className="flex items-start gap-4">
            {coverPreview ? (
              <div className="relative w-20 h-28 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                <Image src={coverPreview} alt="Cover preview" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <div className="w-20 h-28 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 shrink-0">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="flex flex-col gap-2 pt-1">
              <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                {cover ? 'Change image' : 'Choose image'}
              </Button>
              {cover && (
                <button
                  type="button"
                  onClick={removeCover}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors text-left"
                >
                  Remove
                </button>
              )}
              <p className="text-xs text-slate-400">JPG, PNG, WebP — max 5 MB</p>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCover} className="hidden" />
        </div>

        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <Button type="submit" loading={loading} fullWidth>Add Book</Button>
          <Button type="button" variant="ghost" onClick={onClose} fullWidth>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}
