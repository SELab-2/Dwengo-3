import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locale/en';
import { nl } from './locale/nl';
import { fr } from './locale/fr';

const resources = {
  en: en,
  nl: nl,
  fr: fr,
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'nl',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
