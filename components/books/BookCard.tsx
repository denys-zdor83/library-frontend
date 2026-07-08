'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { addToCart } from '@/store/cartSlice';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { clsx, statusLabel, statusColor } from '@/lib/utils';
import type { Book } from '@/types';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const { cart } = useAppSelector((s) => s.cart);
  const [adding, setAdding] = useState(false);

  const inCart = cart?.items.some((i) => i.book === book.id) ?? false;

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'user') return;
    setAdding(true);
    try {
      await dispatch(addToCart(book.id));
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200 flex flex-col animate-fade-in">
      <Link href={`/books/${book.id}`} className="relative block overflow-hidden">
        <div className="relative h-56 bg-slate-100">
          {book.cover_url ? (
            <Image
              src={book.cover_url}
              alt={book.title}
              fill
              className="object-cover object-top hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
              <svg className="w-16 h-16 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
        </div>
        <span className={clsx(
          'absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium',
          statusColor(book.status)
        )}>
          {statusLabel(book.status)}
        </span>
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex-1">
          <Link href={`/books/${book.id}`}>
            <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-blue-600 transition-colors">
              {book.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 mt-1 truncate">{book.author}</p>
        </div>

        <StarRating value={Math.round(book.average_rating)} readonly size="sm" />

        <div className="flex gap-2 mt-1">
          {user?.role !== 'librarian' && user?.role !== 'admin' && (
            <Button
              size="sm"
              variant={inCart ? 'secondary' : 'primary'}
              onClick={handleAddToCart}
              loading={adding}
              disabled={inCart || book.status === 'borrowed'}
              className="flex-1 text-xs"
            >
              {inCart ? 'In Cart' : 'Add to Cart'}
            </Button>
          )}
          <Link href={`/books/${book.id}`} className="flex-1">
            <Button size="sm" variant="outline" fullWidth className="text-xs">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
