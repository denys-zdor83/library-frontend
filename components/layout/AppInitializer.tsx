'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchMe } from '@/store/authSlice';
import { fetchCart } from '@/store/cartSlice';

export function AppInitializer() {
  const dispatch = useAppDispatch();
  const { user, initialized } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!initialized) {
      dispatch(fetchMe());
    }
  }, [initialized, dispatch]);

  useEffect(() => {
    if (user?.role === 'user') {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  return null;
}
