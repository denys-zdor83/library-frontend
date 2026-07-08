'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useAppDispatch';
import { fetchMe } from '@/store/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, loading, initialized } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!initialized) {
      dispatch(fetchMe());
    }
  }, [initialized, dispatch]);

  return { user, loading, initialized };
}
