// src/lib/legal-i18n.ts
/**
 * Localization dictionary and helper functions for Legal Pages and Cookie Consent.
 * Adheres strictly to CAP-7 anti-slop guidelines, Canadian French (fr-CA), and B2B Spanish (es).
 */

export interface LegalUiLabels {
  backToHome: string;
  lastUpdated: string;
  loading: string;
  unavailable: string;
  defaultTitles: {
    privacy: string;
    terms: string;
    cookies: string;
  };
  cookieBanner: {
    title: string;
    description: string;
    privacyLinkText: string;
    descriptionSuffix: string;
    necessary: string;
    analytics: string;
    marketing: string;
    functional: string;
    acceptAll: string;
    acceptSelection: string;
    rejectAll: string;
    close: string;
    footerNote: string;
  };
  cookiePage: {
    preferencesHeading: string;
    necessaryTitle: string;
    necessaryDesc: string;
    analyticsTitle: string;
    analyticsDesc: string;
    marketingTitle: string;
    marketingDesc: string;
    functionalTitle: string;
    functionalDesc: string;
    acceptAll: string;
    rejectAll: string;
    savePreferences: string;
  };
}

export const LEGAL_UI: Record<'en' | 'fr' | 'esp', LegalUiLabels> = {
  en: {
    loading: 'Loading localized legal content…',
    unavailable: 'Localized legal content is temporarily unavailable.',
    backToHome: 'Back to Home',
    lastUpdated: 'Last updated:',
    defaultTitles: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      cookies: 'Cookie Policy',
    },
    cookieBanner: {
      title: 'Cookie Consent',
      description:
        'We use cookies to improve your experience, analyze traffic, and for marketing purposes. You can choose which cookies to allow. Read our ',
      privacyLinkText: 'Privacy Policy',
      descriptionSuffix: ' for more information.',
      necessary: 'Necessary (always required)',
      analytics: 'Analytics',
      marketing: 'Marketing',
      functional: 'Functional',
      acceptAll: 'Accept All',
      acceptSelection: 'Save Preferences',
      rejectAll: 'Reject All',
      close: 'Close cookie preferences',
      footerNote:
        'Your privacy is important to us. You can change your cookie preferences at any time.',
    },
    cookiePage: {
      preferencesHeading: 'Your Current Cookie Preferences',
      necessaryTitle: 'Necessary Cookies',
      necessaryDesc: 'These cookies are essential for the website to function properly.',
      analyticsTitle: 'Analytics Cookies',
      analyticsDesc: 'Help us understand how visitors interact with the website.',
      marketingTitle: 'Marketing Cookies',
      marketingDesc: 'Used to deliver relevant advertisements and track marketing effectiveness.',
      functionalTitle: 'Functional Cookies',
      functionalDesc: 'Enable enhanced functionality and personalization.',
      acceptAll: 'Accept All',
      rejectAll: 'Reject All',
      savePreferences: 'Save Preferences',
    },
  },
  fr: {
    loading: 'Chargement du contenu juridique localisé…',
    unavailable: 'Le contenu juridique localisé est temporairement indisponible.',
    backToHome: 'Retour à l’accueil',
    lastUpdated: 'Dernière mise à jour :',
    defaultTitles: {
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d’utilisation',
      cookies: 'Politique relative aux témoins',
    },
    cookieBanner: {
      title: 'Consentement relatif aux témoins',
      description:
        'Nous utilisons des témoins pour améliorer votre expérience, analyser la fréquentation et à des fins commerciales. Consultez notre ',
      privacyLinkText: 'politique de confidentialité',
      descriptionSuffix: ' pour en savoir plus.',
      necessary: 'Requis (toujours actifs)',
      analytics: 'Analytique',
      marketing: 'Marketing',
      functional: 'Fonctionnels',
      acceptAll: 'Tout accepter',
      acceptSelection: 'Enregistrer les préférences',
      rejectAll: 'Tout refuser',
      close: 'Fermer les préférences de témoins',
      footerNote:
        'Votre confidentialité est essentielle. Vous pouvez modifier vos préférences de témoins en tout temps.',
    },
    cookiePage: {
      preferencesHeading: 'Vos préférences actuelles de témoins',
      necessaryTitle: 'Témoins requis',
      necessaryDesc: 'Ces témoins sont essentiels au bon fonctionnement du site web.',
      analyticsTitle: 'Témoins analytiques',
      analyticsDesc: 'Nous aident à comprendre comment les visiteurs interagissent avec le site.',
      marketingTitle: 'Témoins publicitaires',
      marketingDesc: 'Utilisés pour diffuser des communications ciblées et mesurer les performances.',
      functionalTitle: 'Témoins fonctionnels',
      functionalDesc: 'Permettent une navigation enrichie et des réglages personnalisés.',
      acceptAll: 'Tout accepter',
      rejectAll: 'Tout refuser',
      savePreferences: 'Enregistrer les préférences',
    },
  },
  esp: {
    loading: 'Cargando contenido legal localizado…',
    unavailable: 'El contenido legal localizado no está disponible temporalmente.',
    backToHome: 'Volver al inicio',
    lastUpdated: 'Última actualización:',
    defaultTitles: {
      privacy: 'Política de privacidad',
      terms: 'Términos de servicio',
      cookies: 'Política de cookies',
    },
    cookieBanner: {
      title: 'Consentimiento de cookies',
      description:
        'Utilizamos cookies para optimizar su experiencia de navegación, analizar el tráfico y con fines comerciales. Consulte nuestra ',
      privacyLinkText: 'política de privacidad',
      descriptionSuffix: ' para obtener más detalles.',
      necessary: 'Necesarias (siempre requeridas)',
      analytics: 'Analítica',
      marketing: 'Marketing',
      functional: 'Funcionales',
      acceptAll: 'Aceptar todas',
      acceptSelection: 'Guardar preferencias',
      rejectAll: 'Rechazar todas',
      close: 'Cerrar preferencias de cookies',
      footerNote:
        'Su privacidad es fundamental para nosotros. Puede modificar sus preferencias de cookies en cualquier momento.',
    },
    cookiePage: {
      preferencesHeading: 'Sus preferencias actuales de cookies',
      necessaryTitle: 'Cookies necesarias',
      necessaryDesc: 'Estas cookies son indispensables para el correcto funcionamiento del portal.',
      analyticsTitle: 'Cookies de análisis',
      analyticsDesc: 'Nos permiten comprender cómo interactúan los usuarios en el sitio.',
      marketingTitle: 'Cookies comerciales',
      marketingDesc: 'Se utilizan para mostrar ofertas relevantes y evaluar la eficacia de campañas.',
      functionalTitle: 'Cookies funcionales',
      functionalDesc: 'Proporcionan una funcionalidad mejorada y ajustes personalizados.',
      acceptAll: 'Aceptar todas',
      rejectAll: 'Rechazar todas',
      savePreferences: 'Guardar preferencias',
    },
  },
};

export function getLegalUiLabels(locale?: string): LegalUiLabels {
  if (!locale) return LEGAL_UI.en;
  const clean = locale.toLowerCase().trim();
  if (clean.startsWith('fr')) return LEGAL_UI.fr;
  if (clean.startsWith('es') || clean === 'esp') return LEGAL_UI.esp;
  return LEGAL_UI.en;
}

export function formatLegalDate(dateString?: string, locale?: string): string {
  const date = dateString ? new Date(dateString) : new Date();
  const clean = (locale || 'en').toLowerCase().trim();
  const dateLocale = clean.startsWith('fr')
    ? 'fr-CA'
    : clean.startsWith('es') || clean === 'esp'
      ? 'es-ES'
      : 'en-US';

  return date.toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
