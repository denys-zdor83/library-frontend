'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { clsx, statusLabel, statusColor, formatDateTime } from '@/lib/utils';
import { canViewBookings } from '@/lib/permissions';
import type { Booking, User } from '@/types';

export default function BookingsPage() {
  const router = useRouter();
  const { user, initialized } = useAppSelector((s) => s.auth);
  const [loading, setLoading] = useState(true);

  // User view
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  // Staff view
  const [bookingUsers, setBookingUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [staffBookings, setStaffBookings] = useState<Booking[]>([]);
  const [staffBookingsLoading, setStaffBookingsLoading] = useState(false);

  useEffect(() => {
    if (initialized && !user) { router.push('/login'); return; }
    if (initialized && user?.role === 'librarian' && !canViewBookings(user)) {
      router.push('/');
      return;
    }
    if (!user) return;

    async function load() {
      setLoading(true);
      try {
        if (user!.role === 'user') {
          const data = await api.get<Booking[]>('/bookings/');
          setUserBookings(data);
        } else {
          const users = await api.get<User[]>('/bookings/users/');
          setBookingUsers(users);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [user, initialized, router]);

  const loadStaffBookings = async (u: User) => {
    setSelectedUser(u);
    setStaffBookingsLoading(true);
    try {
      const data = await api.get<Booking[]>(`/bookings/all/?user_id=${u.id}`);
      setStaffBookings(data);
    } catch {}
    setStaffBookingsLoading(false);
  };

  const handleCancel = async (id: number) => {
    try {
      const updated = await api.post<Booking>(`/bookings/${id}/cancel/`);
      setUserBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch {}
  };

  const handleApprove = async (id: number) => {
    try {
      const updated = await api.post<Booking>(`/bookings/${id}/approve/`);
      setStaffBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch {}
  };

  const handleReject = async (id: number) => {
    try {
      const updated = await api.post<Booking>(`/bookings/${id}/reject/`);
      setStaffBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch {}
  };

  if (!initialized || loading) return <PageSpinner />;
  if (!user) return null;

  if (user.role === 'user') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Bookings</h1>
        {userBookings.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="font-medium">No bookings yet</p>
            <p className="text-sm mt-1">Browse books and add them to your cart to make a booking</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userBookings.map((booking) => (
              <BookingItem
                key={booking.id}
                booking={booking}
                onCancel={() => handleCancel(booking.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">All Bookings</h1>
      <div className="flex gap-6">
        {/* Users list */}
        <div className="w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900 text-sm">Active Borrowers</h2>
            </div>
            {bookingUsers.length === 0 ? (
              <p className="p-4 text-sm text-slate-400">No active borrowers</p>
            ) : (
              <ul>
                {bookingUsers.map((u) => (
                  <li key={u.id}>
                    <button
                      onClick={() => loadStaffBookings(u)}
                      className={clsx(
                        'w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors',
                        selectedUser?.id === u.id ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.first_name?.[0] ?? u.email[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{u.full_name}</p>
                        <p className="text-xs text-slate-400 truncate">{u.email}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bookings for selected user */}
        <div className="flex-1">
          {!selectedUser ? (
            <div className="text-center py-20 text-slate-400">
              <p>Select a user to view their bookings</p>
            </div>
          ) : staffBookingsLoading ? (
            <PageSpinner />
          ) : (
            <div className="space-y-4">
              {staffBookings.map((booking) => (
                <BookingItem
                  key={booking.id}
                  booking={booking}
                  isStaff
                  onApprove={() => handleApprove(booking.id)}
                  onReject={() => handleReject(booking.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface BookingItemProps {
  booking: Booking;
  isStaff?: boolean;
  onCancel?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

function BookingItem({ booking, isStaff, onCancel, onApprove, onReject }: BookingItemProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-4 items-start animate-fade-in">
      <div className="relative w-14 h-18 shrink-0 rounded-lg overflow-hidden bg-slate-100" style={{ height: '72px' }}>
        {booking.book_detail?.cover_url ? (
          <Image src={booking.book_detail.cover_url} alt={booking.book_detail.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 truncate">{booking.book_detail?.title}</h3>
        <p className="text-sm text-slate-500">{booking.book_detail?.author}</p>
        <p className="text-xs text-slate-400 mt-1">Requested: {formatDateTime(booking.requested_at)}</p>
        {booking.approved_at && (
          <p className="text-xs text-green-600 mt-0.5">Approved: {formatDateTime(booking.approved_at)}</p>
        )}
        {booking.rejected_at && (
          <p className="text-xs text-red-500 mt-0.5">Rejected: {formatDateTime(booking.rejected_at)}</p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className={clsx('px-2.5 py-1 rounded-full text-xs font-medium', statusColor(booking.status))}>
          {statusLabel(booking.status)}
        </span>

        {!isStaff && booking.status === 'requested' && onCancel && (
          <Button size="sm" variant="danger" onClick={onCancel}>Cancel</Button>
        )}

        {isStaff && booking.status === 'requested' && (
          <div className="flex gap-1.5">
            {onApprove && <Button size="sm" onClick={onApprove}>Approve</Button>}
            {onReject && <Button size="sm" variant="danger" onClick={onReject}>Reject</Button>}
          </div>
        )}
      </div>
    </div>
  );
}
