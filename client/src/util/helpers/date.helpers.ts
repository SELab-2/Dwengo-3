import i18n from '../i18n';

export function formatDate(date: Date): string {
  return Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
