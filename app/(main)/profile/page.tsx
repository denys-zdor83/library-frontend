'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setUser } from '@/store/authSlice';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { formatDate } from '@/lib/utils';
import type { User } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, initialized } = useAppSelector((s) => s.auth);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    country: '',
    city: '',
    postal_code: '',
    bio: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [changingPw, setChangingPw] = useState(false);
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '', new_password2: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    if (initialized && !user) router.push('/login');
    if (user) {
      setForm({
        first_name: user.first_name,
        last_name: user.last_name,
        country: user.country,
        city: user.city,
        postal_code: user.postal_code,
        bio: user.bio,
      });
    }
  }, [user, initialized, router]);

  if (!initialized) return <PageSpinner />;
  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      const updated = await api.patch<User>('/auth/me/', form);
      dispatch(setUser(updated));
      setEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.new_password2) {
      setPwError('Passwords do not match');
      return;
    }
    setPwLoading(true);
    setPwError('');
    try {
      await api.post('/auth/me/change-password/', pwForm);
      setPwSuccess(true);
      setPwForm({ old_password: '', new_password: '', new_password2: '' });
      setChangingPw(false);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Profile</h1>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 mb-5">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {user.first_name?.[0] ?? user.email[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user.full_name}</h2>
            <p className="text-slate-500 text-sm">{user.email}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 mt-1 capitalize">
              {user.role}
            </span>
          </div>
        </div>

        {user.role === 'user' && (
          <div className="text-sm text-slate-500 mb-6">
            Member since {formatDate(user.registered_at)}
          </div>
        )}

        {!editing ? (
          <>
            {user.role === 'user' && (
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div><span className="text-slate-400">Country</span><p className="font-medium text-slate-700 mt-0.5">{user.country || '—'}</p></div>
                <div><span className="text-slate-400">City</span><p className="font-medium text-slate-700 mt-0.5">{user.city || '—'}</p></div>
                <div><span className="text-slate-400">Postal code</span><p className="font-medium text-slate-700 mt-0.5">{user.postal_code || '—'}</p></div>
                {user.bio && <div className="col-span-2"><span className="text-slate-400">Bio</span><p className="font-medium text-slate-700 mt-0.5">{user.bio}</p></div>}
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={() => setEditing(true)} variant="outline">Edit Profile</Button>
              <Button onClick={() => setChangingPw(true)} variant="ghost">Change Password</Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {saveError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{saveError}</div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Input label="First name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
              <Input label="Last name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
            </div>
            {user.role === 'user' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                  <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <Input label="Postal code" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </>
            )}
            <div className="flex gap-2 pt-2">
              <Button type="submit" loading={saving}>Save</Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </form>
        )}
      </div>

      {changingPw && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Change Password</h2>
          {pwSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              Password changed successfully!
            </div>
          )}
          {pwError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{pwError}</div>
          )}
          <form onSubmit={handleChangePw} className="space-y-4">
            <Input label="Current password" type="password" value={pwForm.old_password} onChange={(e) => setPwForm({ ...pwForm, old_password: e.target.value })} required />
            <Input label="New password" type="password" value={pwForm.new_password} onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })} required />
            <Input label="Confirm new password" type="password" value={pwForm.new_password2} onChange={(e) => setPwForm({ ...pwForm, new_password2: e.target.value })} required />
            <div className="flex gap-2 pt-2">
              <Button type="submit" loading={pwLoading}>Change Password</Button>
              <Button type="button" variant="ghost" onClick={() => setChangingPw(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
