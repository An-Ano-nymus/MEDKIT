import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchWithCredentials } from '../utils/api';

type Doctor = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  specialty?: string;
};

type DoctorAuthContextType = {
  doctor: Doctor | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
};

export const DoctorAuthContext = createContext<DoctorAuthContextType | undefined>(undefined);

export function DoctorAuthProvider({ children }: { children: ReactNode }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On mount, check doctor session
    (async () => {
      try {
        const res = await fetchWithCredentials('/doctor/me');
        if (res.loggedIn && res.doctor) {
          setDoctor(res.doctor);
        } else {
          setDoctor(null);
        }
      } catch {
        setDoctor(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

    const login = async (email: string, password: string) => {
    try {
      const res = await fetchWithCredentials('/doctor/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.success && res.doctor) {
        setDoctor(res.doctor);
        return { success: true };
      }
      return { success: false, error: res.error || 'Login failed' };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Login failed';
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await fetchWithCredentials('/doctor/logout', { method: 'POST' });
    } finally {
      setDoctor(null);
    }
  };

  const value: DoctorAuthContextType = {
    doctor,
    isLoading,
    isAuthenticated: !!doctor,
    login,
    logout,
  };

  return (
    <DoctorAuthContext.Provider value={value}>{children}</DoctorAuthContext.Provider>
  );
}

// Hook moved to separate file to avoid fast refresh issue
