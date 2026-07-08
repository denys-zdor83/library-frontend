'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
};

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <>
      {/* Backdrop — rendered directly in <body>, immune to ancestor stacking contexts */}
      <div
        className="fixed inset-0 bg-black/40"
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />

      {/* Scroll container */}
      <div
        className="fixed inset-0 flex items-start justify-center overflow-y-auto pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        <div className="w-full flex justify-center p-4 pt-20 pointer-events-none">
          <div
            className={clsx(
              'relative bg-white rounded-2xl shadow-xl w-full animate-fade-in pointer-events-auto',
              sizes[size]
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
