import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      yes: 'Yes',
      no: 'No',
      email: 'Email address',
      name: 'Name',
      surname: 'Surname',
      password: 'Password',
      login: 'Login',
      register: 'Register',
      student: 'Student',
      teacher: 'Teacher',
      welcomeMessage: 'Welcome to the Dwengo learningplatform!',
      registerAs: 'Register as',
      alreadyHaveAccount: 'Already have an account?',
    },
  },
  nl: {
    translation: {
      yes: 'Ja',
      no: 'Nee',
      email: 'Email adres',
      name: 'Naam',
      surname: 'Achternaam',
      password: 'Wachtwoord',
      login: 'Inloggen',
      register: 'Registreren',
      student: 'Student',
      teacher: 'Leraar',
      welcomeMessage: 'Welkom op het Dwengo leerplatform!',
      registerAs: 'Registreer als',
      alreadyHaveAccount: 'Heb je al een account?',
    },
  },
  fr: {
    translation: {
      yes: 'Oui',
      no: 'Non',
      email: 'Adresse email',
      name: 'Nom',
      surname: 'Nom de famille',
      password: 'Mot de passe',
      login: 'Connexion',
      register: "S'inscrire",
      student: 'Étudiant',
      teacher: 'Professeur',
      welcomeMessage: "Bienvenue sur la plateforme d'apprentissage Dwengo!",
      registerAs: 'S’inscrire en tant que',
      alreadyHaveAccount: 'Vous avez déjà un compte?',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'nl',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
