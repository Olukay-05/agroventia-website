// src/lib/blog-i18n.ts
/**
 * Localization strings and helpers for the AgroVentia Blog system (/blog & /blog/[slug])
 * Adheres strictly to CAP-7 anti-slop guidelines, no em-dashes, and Canadian French / B2B Spanish standards.
 */

export interface BlogTranslations {
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  backToBlog: string;
  readTime: (mins?: number) => string;
  readArticle: string;
  viewAllArticles: string;
  shareTitle: string;
  keepReading: string;
  moreInsights: string;
  defaultCategory: string;
  defaultAuthor: string;
  relatedExcerptFallback: string;
  shareLabels: {
    twitter: string;
    facebook: string;
    linkedin: string;
    copyLink: string;
  };
  emptyState: {
    title: string;
    description: string;
  };
}

export const BLOG_UI: Record<'en' | 'fr' | 'esp', BlogTranslations> = {
  en: {
    eyebrow: 'Our Blog',
    heroTitle: 'Latest Insights & News',
    heroSubtitle:
      'Stay updated with the latest trends, expert advice, and stories from the world of agriculture and global trade.',
    backToBlog: 'Back to Blog',
    readTime: (mins = 5) => `${mins} min read`,
    readArticle: 'Read Article',
    viewAllArticles: 'View All Articles',
    shareTitle: 'Share this article',
    keepReading: 'Keep Reading',
    moreInsights: 'More Insights from AgroVentia',
    defaultCategory: 'Trade Insights',
    defaultAuthor: 'AgroVentia Editorial',
    relatedExcerptFallback:
      'Explore expert analysis and trade strategies in this detailed commodity briefing.',
    shareLabels: {
      twitter: 'Share on Twitter',
      facebook: 'Share on Facebook',
      linkedin: 'Share on LinkedIn',
      copyLink: 'Copy Link',
    },
    emptyState: {
      title: 'No articles found',
      description: 'Check back soon for new articles and market updates.',
    },
  },
  fr: {
    eyebrow: 'Notre Blogue',
    heroTitle: 'Actualités et perspectives du marché',
    heroSubtitle:
      'Restez informé des tendances récentes, des analyses sectorielles et de l\'actualité du commerce agricole mondial.',
    backToBlog: 'Retour au blogue',
    readTime: (mins = 5) => `Lecture ${mins} min`,
    readArticle: 'Lire l\'article',
    viewAllArticles: 'Voir tous les articles',
    shareTitle: 'Partager cet article',
    keepReading: 'Poursuivre la lecture',
    moreInsights: 'Plus d\'analyses d\'AgroVentia',
    defaultCategory: 'Perspectives commerciales',
    defaultAuthor: 'Équipe éditoriale AgroVentia',
    relatedExcerptFallback:
      'Consultez les analyses approfondies et nos stratégies commerciales dans cette fiche détaillée.',
    shareLabels: {
      twitter: 'Partager sur Twitter',
      facebook: 'Partager sur Facebook',
      linkedin: 'Partager sur LinkedIn',
      copyLink: 'Copier le lien',
    },
    emptyState: {
      title: 'Aucun article trouvé',
      description: 'Revenez bientôt pour de nouvelles publications et veilles de marché.',
    },
  },
  esp: {
    eyebrow: 'Nuestro Blog',
    heroTitle: 'Últimas perspectivas y noticias',
    heroSubtitle:
      'Manténgase al día con las tendencias clave, análisis comerciales y novedades del comercio agrícola internacional.',
    backToBlog: 'Volver al blog',
    readTime: (mins = 5) => `Lectura ${mins} min`,
    readArticle: 'Leer artículo',
    viewAllArticles: 'Ver todos los artículos',
    shareTitle: 'Compartir este artículo',
    keepReading: 'Continuar leyendo',
    moreInsights: 'Más análisis de AgroVentia',
    defaultCategory: 'Perspectivas del sector',
    defaultAuthor: 'Equipo editorial AgroVentia',
    relatedExcerptFallback:
      'Explore análisis de mercado y estrategias de suministro en este informe especializado.',
    shareLabels: {
      twitter: 'Compartir en Twitter',
      facebook: 'Compartir en Facebook',
      linkedin: 'Compartir en LinkedIn',
      copyLink: 'Copiar enlace',
    },
    emptyState: {
      title: 'No se encontraron artículos',
      description: 'Vuelva pronto para consultar nuevas publicaciones y análisis de mercado.',
    },
  },
};

/**
 * Normalizes locale into an accessor key for BLOG_UI
 */
export function getBlogUiLabels(locale?: string): BlogTranslations {
  if (!locale) return BLOG_UI.en;
  const clean = locale.toLowerCase().trim();
  if (clean.startsWith('fr')) return BLOG_UI.fr;
  if (clean.startsWith('es') || clean === 'esp') return BLOG_UI.esp;
  return BLOG_UI.en;
}
