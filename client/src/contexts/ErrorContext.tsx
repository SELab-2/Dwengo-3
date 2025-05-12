import React, { createContext, useState } from 'react';
import AllertSnackBar from '../components/AllertSnackBar';

export interface ErrorContextType {
  setError: (message: string) => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const triggerError = (message: string) => {
    setError(message);
    setOpen(true);
  };

  return (
    <ErrorContext.Provider value={{ setError: triggerError }}>
      {children}
      {/* Render the ErrorSnackBar globally */}
      <AllertSnackBar severity="error" open={open} setOpen={setOpen} message={error || ''} />
    </ErrorContext.Provider>
  );
}
