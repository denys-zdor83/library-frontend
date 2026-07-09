import type { User } from '@/types';

function hasPermission(user: User | null, perm: string): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'librarian') return (user.permissions ?? []).includes(perm);
  return false;
}

export const canAddBooks = (user: User | null) => hasPermission(user, 'add_books');
export const canEditBooks = (user: User | null) => hasPermission(user, 'edit_books');
export const canDeleteBooks = (user: User | null) => hasPermission(user, 'delete_books');
