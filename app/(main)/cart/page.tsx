'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchCart, removeFromCart, bookAll, removeItemLocally } from '@/store/cartSlice';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import type { CartItem } from '@/types';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((s) => s.auth);
  const { cart, loading } = useAppSelector((s) => s.cart);
  const [bookingAll, setBookingAll] = useState(false);
  const [result, setResult] = useState<{ booked: string[]; errors: { book: string; error: string }[] } | null>(null);
  const [bookingItems, setBookingItems] = useState<Record<number, boolean>>({});
  const [itemErrors, setItemErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    dispatch(fetchCart());
  }, [user, dispatch, router]);

  const handleRemove = (bookId: number) => dispatch(removeFromCart(bookId));

  const handleBookOne = async (item: CartItem) => {
    setBookingItems((prev) => ({ ...prev, [item.book]: true }));
    setItemErrors((prev) => { const next = { ...prev }; delete next[item.book]; return next; });
    try {
      await api.post('/bookings/', { book: item.book });
      dispatch(removeItemLocally(item.book));
      dispatch(removeFromCart(item.book));
    } catch (err) {
      setItemErrors((prev) => ({ ...prev, [item.book]: err instanceof Error ? err.message : 'Failed to book' }));
    } finally {
      setBookingItems((prev) => { const next = { ...prev }; delete next[item.book]; return next; });
    }
  };

  const handleBookAll = async () => {
    setBookingAll(true);
    try {
      const res = await dispatch(bookAll()).unwrap();
      setResult(res);
    } finally {
      setBookingAll(false);
    }
  };

  if (loading && !cart) return <PageSpinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Cart</h1>

      {result && (
        <div className="mb-6 p-5 bg-blue-50 border border-blue-200 rounded-2xl">
          {result.booked.length > 0 && (
            <p className="text-blue-800 font-medium mb-2">
              Booked: {result.booked.join(', ')}
            </p>
          )}
          {result.errors.length > 0 && (
            <div className="space-y-1">
              {result.errors.map((e, i) => (
                <p key={i} className="text-red-600 text-sm">{e.book}: {e.error}</p>
              ))}
            </div>
          )}
          <Link href="/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block">
            View my bookings →
          </Link>
        </div>
      )}

      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="font-medium text-slate-500 mb-1">Your cart is empty</p>
          <p className="text-sm">Browse books and add them to your cart</p>
          <Link href="/books" className="mt-4 inline-block">
            <Button variant="primary" className="mt-3">Browse Books</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-4 items-start animate-fade-in"
              >
                <div className="relative w-16 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
                  {item.book_detail.cover_url ? (
                    <Image src={item.book_detail.cover_url} alt={item.book_detail.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{item.book_detail.title}</h3>
                  <p className="text-sm text-slate-500">{item.book_detail.author} · {item.book_detail.year}</p>
                  <p className="text-xs text-slate-400 mt-1">Status: {item.book_detail.status}</p>
                  {itemErrors[item.book] && (
                    <p className="text-xs text-red-500 mt-1">{itemErrors[item.book]}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/books/${item.book}`}>
                    <Button size="sm" variant="outline">Details</Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleBookOne(item)}
                    loading={bookingItems[item.book]}
                  >
                    To Book
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemove(item.book)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between">
            <p className="text-slate-700 font-medium">
              {cart.item_count} item{cart.item_count !== 1 ? 's' : ''} in cart
            </p>
            <Button onClick={handleBookAll} loading={bookingAll} size="lg">
              Book All
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
