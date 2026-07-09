'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { BookCard } from '@/components/books/BookCard';
import { AddBookModal } from '@/components/books/AddBookModal';
import { Sidebar, type BookFilters } from '@/components/layout/Sidebar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { SkeletonCards } from '@/components/ui/SkeletonCard';
import { useDebounce } from '@/hooks/useDebounce';
import type { Book, PaginatedResponse } from '@/types';

const defaultFilters: BookFilters = {
  genre: '',
  author: '',
  year_from: '',
  year_to: '',
  status: '',
  sort: 'newest',
};

function BooksContent() {
  const searchParams = useSearchParams();
  const { user } = useAppSelector((s) => s.auth);
  const canManageBooks = user?.role === 'admin' || user?.role === 'librarian';
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [filters, setFilters] = useState<BookFilters>({
    ...defaultFilters,
    sort: searchParams.get('sort') ?? 'newest',
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedResponse<Book> | null>(null);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(search, 400);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (filters.genre) params.set('genre', filters.genre);
      if (filters.author) params.set('author', filters.author);
      if (filters.year_from) params.set('year_from', filters.year_from);
      if (filters.year_to) params.set('year_to', filters.year_to);
      if (filters.status) params.set('status', filters.status);
      params.set('sort', filters.sort);
      params.set('page', String(page));
      params.set('page_size', '12');
      const result = await api.get<PaginatedResponse<Book>>(`/books/?${params}`);
      setData(result);
    } catch {}
    setLoading(false);
  }, [filters, debouncedSearch, page]);

  useEffect(() => {
    setPage(1);
  }, [filters, debouncedSearch]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar filters={filters} onChange={setFilters} />

        <div className="flex-1 min-w-0">
          {/* Search bar */}
          <div className="mb-6">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author..."
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>

          {/* Results header */}
          <div className="flex items-center justify-between mb-5">
            {data ? (
              <p className="text-sm text-slate-500">
                {data.count} book{data.count !== 1 ? 's' : ''} found
              </p>
            ) : (
              <span />
            )}
            {canManageBooks && (
              <Button size="sm" onClick={() => setAddModalOpen(true)}>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add a book
              </Button>
            )}
          </div>

          {/* Books grid */}
          {loading ? (
            <SkeletonCards count={12} />
          ) : data?.results.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium text-slate-500">No books found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {data?.results.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
              {data && (
                <Pagination
                  page={page}
                  totalPages={data.total_pages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>
      </div>
      <AddBookModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdded={() => { setAddModalOpen(false); fetchBooks(); }}
      />
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><SkeletonCards count={12} /></div>}>
      <BooksContent />
    </Suspense>
  );
}
