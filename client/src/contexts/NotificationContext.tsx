import { createContext, useState } from 'react';
import AllertSnackBar from '../components/AllertSnackBar';

export interface NotificationContextType {
  setNotification: (message: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const triggerNotification = (message: string) => {
    setNotification(message);
    setOpen(true);
  };

  return (
    <NotificationContext.Provider value={{ setNotification: triggerNotification }}>
      {children}
      <AllertSnackBar
        severity="success"
        open={open}
        setOpen={setOpen}
        message={notification || ''}
      />
    </NotificationContext.Provider>
  );
}
