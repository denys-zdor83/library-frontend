'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { BookCard } from '@/components/books/BookCard';
import { HeroSection } from '@/components/home/HeroSection';
import { ContactForm } from '@/components/home/ContactForm';
import { SkeletonCards } from '@/components/ui/SkeletonCard';
import { formatDateTime } from '@/lib/utils';
import type { Book, Event } from '@/types';

export default function HomePage() {
  const [newestBooks, setNewestBooks] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [newest, popular] = await Promise.all([
          api.get<Book[]>('/books/newest/'),
          api.get<Book[]>('/books/popular/'),
        ]);
        setNewestBooks(newest);
        setPopularBooks(popular);
      } catch {}
      setLoadingBooks(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await api.get<Event[]>('/events/upcoming/');
        setEvents(data);
      } catch {}
      setLoadingEvents(false);
    }
    loadEvents();
  }, []);

  return (
    <div className="flex flex-col">
      <HeroSection />

      {/* Upcoming Events */}
      {(events.length > 0 || loadingEvents) && (
        <section className="py-14 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Upcoming Events</h2>
              <Link href="/events" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all →
              </Link>
            </div>
            {loadingEvents ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-pulse">
                    <div className="h-40 bg-slate-200 rounded-xl mb-4" />
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href="/events"
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow group animate-fade-in"
                  >
                    {event.image_url ? (
                      <div className="relative h-40 overflow-hidden">
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <svg className="w-12 h-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                      <p className="text-xs text-blue-600 font-medium mb-2">{formatDateTime(event.date)}</p>
                      <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Newest Books */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Newest Books</h2>
            <Link href="/books?sort=newest" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </Link>
          </div>
          {loadingBooks ? (
            <SkeletonCards count={4} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {newestBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Books */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Most Popular</h2>
            <Link href="/books?sort=popular" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </Link>
          </div>
          {loadingBooks ? (
            <SkeletonCards count={4} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {popularBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ContactForm />
    </div>
  );
}
