import { useContext } from 'react';
import { NotificationContext, NotificationType } from '../contexts/NotificationContext';

export const useError = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  const setError = (message: string) => {
    context.setNotification(message, NotificationType.Error);
  };

  return { setError };
};
