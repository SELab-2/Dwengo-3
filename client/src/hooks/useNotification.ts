import { useContext } from 'react';
import {
  NotificationContext,
  NotificationContextType,
  NotificationType,
} from '../contexts/NotificationContext';

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within an NotificationProvider');
  }
  const setNotification = (message: string) => {
    context.setNotification(message, NotificationType.Success);
  };

  return { setNotification };
};
