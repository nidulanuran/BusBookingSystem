import React, { useState, useEffect, useCallback } from 'react';
import '../App.css';

/**
 * Toast Notification System
 * 
 * Usage:
 *   import { useToast, ToastContainer } from './components/Toast';
 *   const { showToast } = useToast();
 *   showToast('Booking successful!', 'success');
 *   showToast('Something went wrong.', 'error');
 *   showToast('Please fill all fields.', 'warning');
 */

// Global event emitter so any component can trigger toasts without prop drilling
const toastListeners = new Set();

export function showToast(message, type = 'success') {
  toastListeners.forEach(listener => listener({ message, type, id: Date.now() + Math.random() }));
}

export function useToast() {
  return { showToast };
}

const TOAST_ICONS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
};

const TOAST_DURATION = 3500;

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, TOAST_DURATION);
  }, []);

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    toastListeners.add(addToast);
    return () => toastListeners.delete(addToast);
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`} role="alert" aria-live="polite">
          <span className="toast-icon">{TOAST_ICONS[toast.type] || 'ℹ️'}</span>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-dismiss"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
