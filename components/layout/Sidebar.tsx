'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Select, Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { Genre } from '@/types';

export interface BookFilters {
  genre: string;
  author: string;
  year_from: string;
  year_to: string;
  status: string;
  sort: string;
}

const defaultFilters: BookFilters = {
  genre: '',
  author: '',
  year_from: '',
  year_to: '',
  status: '',
  sort: 'newest',
};

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'least_popular', label: 'Least Popular' },
];

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'borrowed', label: 'Borrowed' },
];

interface SidebarProps {
  filters: BookFilters;
  onChange: (filters: BookFilters) => void;
}

export function Sidebar({ filters, onChange }: SidebarProps) {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    api.get<Genre[]>('/books/genres/').then(setGenres).catch(() => {});
  }, []);

  const update = (key: keyof BookFilters, value: string) =>
    onChange({ ...filters, [key]: value });

  const reset = () => onChange(defaultFilters);

  const hasFilters = Object.entries(filters).some(
    ([k, v]) => k !== 'sort' && v !== ''
  );

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-900">Filters</h2>
          {hasFilters && (
            <button
              onClick={reset}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-4">
          <Select
            label="Sort by"
            value={filters.sort}
            onChange={(e) => update('sort', e.target.value)}
            options={sortOptions}
          />

          <Select
            label="Genre"
            value={filters.genre}
            onChange={(e) => update('genre', e.target.value)}
            options={genres.map((g) => ({ value: String(g.id), label: g.name }))}
            placeholder="All genres"
          />

          <Input
            label="Author"
            value={filters.author}
            onChange={(e) => update('author', e.target.value)}
            placeholder="Filter by author"
          />

          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => update('status', e.target.value)}
            options={statusOptions}
            placeholder="All statuses"
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Year from"
              type="number"
              value={filters.year_from}
              onChange={(e) => update('year_from', e.target.value)}
              placeholder="1900"
              min="1800"
              max="2100"
            />
            <Input
              label="Year to"
              type="number"
              value={filters.year_to}
              onChange={(e) => update('year_to', e.target.value)}
              placeholder="2025"
              min="1800"
              max="2100"
            />
          </div>

          {hasFilters && (
            <Button variant="outline" size="sm" fullWidth onClick={reset}>
              Reset filters
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
