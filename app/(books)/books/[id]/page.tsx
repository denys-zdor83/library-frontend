'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { addToCart } from '@/store/cartSlice';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { clsx, statusLabel, statusColor } from '@/lib/utils';
import type { Book } from '@/types';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { cart } = useAppSelector((s) => s.cart);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<Book>(`/books/${id}/`);
        setBook(data);
        setUserRating(data.user_rating ?? 0);
      } catch {}
      setLoading(false);
    }
    load();
  }, [id]);

  const inCart = cart?.items.some((i) => i.book === book?.id) ?? false;

  const handleAddToCart = async () => {
    if (!book || !user || user.role !== 'user') return;
    setAdding(true);
    try {
      await dispatch(addToCart(book.id));
    } finally {
      setAdding(false);
    }
  };

  const handleRate = async (value: number) => {
    if (!book || !user) return;
    setRatingLoading(true);
    try {
      const res = await api.post<{ rating: number; average: number }>(`/books/${book.id}/rate/`, { value });
      setUserRating(res.rating);
      setBook((b) => b ? { ...b, average_rating: res.average } : b);
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!book) return (
    <div className="text-center py-20 text-slate-400">
      <p className="text-lg font-medium">Book not found</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row gap-0">
          {/* Cover */}
          <div className="relative w-full md:w-72 h-96 md:h-auto shrink-0 bg-slate-100">
            {book.cover_url ? (
              <Image
                src={book.cover_url}
                alt={book.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 288px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <svg className="w-24 h-24 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 p-8">
            <div className="flex items-start justify-between gap-4 mb-2">
              <span className="text-sm text-blue-600 font-medium">{book.genre_name}</span>
              <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', statusColor(book.status))}>
                {statusLabel(book.status)}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">{book.title}</h1>
            <p className="text-lg text-slate-600 mb-1">{book.author}</p>
            <p className="text-sm text-slate-400 mb-5">{book.year}</p>

            <div className="flex items-center gap-3 mb-6">
              <StarRating value={Math.round(book.average_rating)} readonly size="md" />
              <span className="text-sm text-slate-500">
                {book.average_rating.toFixed(1)} · {book.borrow_count} borrows
              </span>
            </div>

            {book.description && (
              <p className="text-slate-600 leading-relaxed mb-6 text-sm">{book.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-xl text-sm">
              <div>
                <span className="text-slate-400">Available copies</span>
                <p className="font-semibold text-slate-900">{book.available_copies} / {book.total_copies}</p>
              </div>
              <div>
                <span className="text-slate-400">Times borrowed</span>
                <p className="font-semibold text-slate-900">{book.borrow_count}</p>
              </div>
            </div>

            {user?.role === 'user' && (
              <Button
                onClick={handleAddToCart}
                loading={adding}
                disabled={inCart || book.status === 'borrowed'}
                variant={inCart ? 'secondary' : 'primary'}
                size="lg"
              >
                {inCart ? 'Already in Cart' : 'Add to Cart'}
              </Button>
            )}

            {user && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  {userRating ? 'Your rating' : 'Rate this book'}
                </p>
                <div className={clsx(ratingLoading && 'opacity-50 pointer-events-none')}>
                  <StarRating value={userRating} onChange={handleRate} size="lg" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
