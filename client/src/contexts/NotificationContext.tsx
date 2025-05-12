import { createContext, useState } from 'react';
import AlertSnackBar from '../components/AlertSnackBar';

export enum NotificationType {
  Error,
  Success,
}

export interface NotificationContextType {
  setNotification: (message: string, type: NotificationType) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<NotificationType>(
    NotificationType.Success,
  );
  const [open, setOpen] = useState<boolean>(false);

  const triggerNotification = (message: string, type: NotificationType) => {
    setNotification(message);
    setNotificationType(type);
    setOpen(true);
  };

  return (
    <NotificationContext.Provider value={{ setNotification: triggerNotification }}>
      {children}
      <AlertSnackBar
        severity={notificationType === NotificationType.Error ? 'error' : 'success'}
        open={open}
        setOpen={setOpen}
        message={notification || ''}
      />
    </NotificationContext.Provider>
  );
}
