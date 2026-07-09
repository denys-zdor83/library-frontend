'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PageSpinner } from '@/components/ui/Spinner';
import type { LibrarianUser } from '@/types';

const AVAILABLE_PERMISSIONS = [
  { key: 'add_books', label: 'Add Books' },
  { key: 'edit_books', label: 'Edit Books' },
  { key: 'delete_books', label: 'Delete Books' },
  { key: 'view_bookings', label: 'View Bookings' },
];

export default function LibrariansPage() {
  const router = useRouter();
  const { user, initialized } = useAppSelector((s) => s.auth);
  const [librarians, setLibrarians] = useState<LibrarianUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [permModal, setPermModal] = useState<LibrarianUser | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [savingPerms, setSavingPerms] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ email: '', first_name: '', last_name: '', password: '', password2: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [deleteModal, setDeleteModal] = useState<LibrarianUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (initialized && (!user || user.role !== 'admin')) {
      router.push('/');
      return;
    }
    if (!user) return;
    loadLibrarians();
  }, [user, initialized, router]);

  const loadLibrarians = async () => {
    setLoading(true);
    try {
      const data = await api.get<LibrarianUser[]>('/auth/librarians/');
      setLibrarians(data);
    } catch {}
    setLoading(false);
  };

  const openPermModal = (lib: LibrarianUser) => {
    setPermModal(lib);
    setPermissions(lib.librarian_profile?.permissions ?? []);
  };

  const savePermissions = async () => {
    if (!permModal) return;
    setSavingPerms(true);
    try {
      const updated = await api.patch<LibrarianUser>(`/auth/librarians/${permModal.id}/`, { permissions });
      setLibrarians((prev) =>
        prev.map((l) => l.id === permModal.id ? updated : l)
      );
      setPermModal(null);
    } catch {}
    setSavingPerms(false);
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/auth/librarians/${deleteModal.id}/`);
      setLibrarians((prev) => prev.filter((l) => l.id !== deleteModal.id));
      setDeleteModal(null);
    } catch {}
    setDeleteLoading(false);
  };

  const handleAddLibrarian = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addForm.password !== addForm.password2) {
      setAddError('Passwords do not match');
      return;
    }
    setAddLoading(true);
    setAddError('');
    try {
      const newLib = await api.post<LibrarianUser>('/auth/librarians/', addForm);
      setLibrarians((prev) => [...prev, newLib]);
      setAddModal(false);
      setAddForm({ email: '', first_name: '', last_name: '', password: '', password2: '' });
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to create librarian');
    } finally {
      setAddLoading(false);
    }
  };

  if (!initialized || loading) return <PageSpinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Librarians</h1>
        <Button onClick={() => setAddModal(true)}>
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Librarian
        </Button>
      </div>

      {librarians.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="font-medium">No librarians yet</p>
          <p className="text-sm mt-1">Add a librarian to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {librarians.map((lib) => (
            <div key={lib.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                {lib.first_name?.[0] ?? lib.email[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900">{lib.full_name}</h3>
                <p className="text-sm text-slate-500">{lib.email}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(lib.librarian_profile?.permissions ?? []).map((p) => (
                    <span key={p} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                      {AVAILABLE_PERMISSIONS.find((ap) => ap.key === p)?.label ?? p}
                    </span>
                  ))}
                  {!lib.librarian_profile?.permissions?.length && (
                    <span className="text-xs text-slate-400">No permissions assigned</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => openPermModal(lib)}>
                  Permissions
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeleteModal(lib)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Permissions Modal */}
      <Modal
        open={!!permModal}
        onClose={() => setPermModal(null)}
        title={`Permissions — ${permModal?.full_name}`}
      >
        <div className="space-y-3">
          {AVAILABLE_PERMISSIONS.map((perm) => (
            <label key={perm.key} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={permissions.includes(perm.key)}
                onChange={(e) =>
                  setPermissions(e.target.checked
                    ? [...permissions, perm.key]
                    : permissions.filter((p) => p !== perm.key)
                  )
                }
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">{perm.label}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100">
          <Button onClick={savePermissions} loading={savingPerms} fullWidth>Save Permissions</Button>
          <Button variant="ghost" onClick={() => setPermModal(null)} fullWidth>Cancel</Button>
        </div>
      </Modal>

      {/* Delete Librarian Modal */}
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Librarian">
        <p className="text-slate-600 text-sm mb-1">Are you sure you want to delete</p>
        <p className="font-semibold text-slate-900 mb-5">"{deleteModal?.full_name}"?</p>
        <p className="text-xs text-slate-400 mb-6">This action cannot be undone. The librarian will lose access to the system.</p>
        <div className="flex gap-2">
          <Button variant="danger" onClick={confirmDelete} loading={deleteLoading} fullWidth>
            Yes, Delete
          </Button>
          <Button variant="ghost" onClick={() => setDeleteModal(null)} fullWidth>
            Cancel
          </Button>
        </div>
      </Modal>

      {/* Add Librarian Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Librarian">
        <form onSubmit={handleAddLibrarian} className="space-y-4">
          {addError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{addError}</div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Input label="First name" value={addForm.first_name} onChange={(e) => setAddForm({ ...addForm, first_name: e.target.value })} required />
            <Input label="Last name" value={addForm.last_name} onChange={(e) => setAddForm({ ...addForm, last_name: e.target.value })} required />
          </div>
          <Input label="Email" type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} required />
          <Input label="Password" type="password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} required />
          <Input label="Confirm password" type="password" value={addForm.password2} onChange={(e) => setAddForm({ ...addForm, password2: e.target.value })} required />
          <div className="flex gap-2 pt-2">
            <Button type="submit" loading={addLoading} fullWidth>Create Librarian</Button>
            <Button type="button" variant="ghost" onClick={() => setAddModal(false)} fullWidth>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
