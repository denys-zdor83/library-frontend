'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Pagination } from '@/components/ui/Pagination';
import { PageSpinner } from '@/components/ui/Spinner';
import { formatDateTime } from '@/lib/utils';
import type { Event, PaginatedResponse } from '@/types';

export default function EventsPage() {
  const [data, setData] = useState<PaginatedResponse<Event> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const result = await api.get<PaginatedResponse<Event>>(`/events/?page=${page}&page_size=9`);
        setData(result);
      } catch {}
      setLoading(false);
    }
    load();
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Events</h1>

      {loading ? (
        <PageSpinner />
      ) : data?.results.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="font-medium">No events scheduled</p>
          <p className="text-sm mt-1">Check back soon for upcoming events</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.results.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow animate-fade-in"
              >
                {event.image_url ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <svg className="w-16 h-16 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 mb-2">{event.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-blue-600 font-medium mb-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatDateTime(event.date)}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {event.location}
                    </div>
                  )}
                  <p className="text-sm text-slate-600 line-clamp-3">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
          {data && (
            <Pagination page={page} totalPages={data.total_pages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
