'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import SectionContainer from '@/components/common/SectionContainer';
import type { AboutContent } from '@/types/content';
import { useLocale } from '@/contexts/LocaleContext';

export interface AboutSectionData extends Partial<AboutContent> {
  title?: string;
  description?: string;
}

interface AboutSectionProps {
  data?: AboutSectionData | null;
  isLoading: boolean;
}

const HIGHLIGHT_VARIANTS = {
  primary: {
    backgroundColor: 'var(--agro-primary-100)',
    color: 'var(--agro-primary-700)',
  },
  secondary: {
    backgroundColor: 'var(--agro-secondary-100)',
    color: 'var(--agro-secondary-700)',
  },
  bronze: {
    backgroundColor: 'var(--agro-accent-bronze-400)',
    color: 'var(--agro-accent-bronze-600)',
  },
  neutral: {
    backgroundColor: 'var(--agro-neutral-100)',
    color: 'var(--agro-neutral-700)',
  },
  forest: {
    backgroundColor: 'var(--agro-primary-200)',
    color: 'var(--agro-primary-800)',
  },
} as const;

const ABOUT_LABELS = {
  en: {
    mission: 'Our Mission',
    vision: 'Our Vision',
    ourStory: 'Our Story',
    coreValues: 'Core Values',
    whyChoose: 'Why Choose AgroVentia Inc.?',
  },
  fr: {
    mission: 'Notre mission',
    vision: 'Notre vision',
    ourStory: 'Notre histoire',
    coreValues: 'Nos valeurs fondamentales',
    whyChoose: 'Pourquoi choisir AgroVentia Inc. ?',
  },
  esp: {
    mission: 'Nuestra misión',
    vision: 'Nuestra visión',
    ourStory: 'Nuestra historia',
    coreValues: 'Nuestros valores fundamentales',
    whyChoose: '¿Por qué elegir AgroVentia Inc.?',
  },
} as const;

const AboutSection: React.FC<AboutSectionProps> = ({
  data,
  isLoading,
}) => {
  const { locale } = useLocale();
  const cleanLocale = (locale || 'en').toLowerCase().trim();
  const langKey = cleanLocale.startsWith('fr')
    ? 'fr'
    : cleanLocale.startsWith('es') || cleanLocale === 'esp'
      ? 'esp'
      : 'en';
  const labels = ABOUT_LABELS[langKey];

  if (isLoading) {
    return (
      <SectionContainer
        id="about"
        background="muted"
        className="bg-[var(--agro-neutral-50)] py-16 md:py-24"
      >
        <div
          className="mx-auto max-w-6xl animate-pulse space-y-12"
          aria-hidden="true"
        >
          <div className="space-y-4 text-center">
            <div className="mx-auto h-10 w-2/3 max-w-md rounded bg-[var(--agro-neutral-200)]" />
            <div className="mx-auto h-5 w-3/4 max-w-2xl rounded bg-[var(--agro-neutral-200)]" />
            <div className="mx-auto h-5 w-2/3 max-w-xl rounded bg-[var(--agro-neutral-200)]" />
          </div>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="h-80 rounded-xl bg-[var(--agro-neutral-200)]" />
            <div className="h-80 rounded-xl bg-[var(--agro-neutral-200)]" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4].map(item => (
              <div
                key={item}
                className="h-28 rounded-xl bg-[var(--agro-neutral-200)]"
              />
            ))}
          </div>
        </div>
      </SectionContainer>
    );
  }

  const sectionTitle = data?.sectionTitle || data?.title;
  const highlights = data?.highlights?.filter(
    highlight => highlight.title || highlight.description || highlight.metric
  );
  const coreValues = data?.coreValues?.filter(
    value => value.title || value.description
  );
  const hasStory = Boolean(data?.story);
  const hasHighlights = Boolean(highlights?.length);
  const PanelHeading = sectionTitle ? 'h3' : 'h2';
  const ItemHeading = sectionTitle ? 'h4' : 'h3';

  return (
    <SectionContainer
      id="about"
      background="muted"
      className="bg-[var(--agro-neutral-50)] py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl text-[var(--agro-neutral-900)]">
        {(sectionTitle || data?.mission || data?.vision) && (
          <header className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
            {sectionTitle && (
              <h2 className="heading-section mb-7 text-[var(--agro-neutral-900)]">
                {sectionTitle}
              </h2>
            )}

            <div className="space-y-6">
              {data?.mission && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--agro-neutral-700)]">
                    {labels.mission}
                  </p>
                  <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-[var(--agro-neutral-800)] sm:text-lg md:text-xl">
                    {data.mission}
                  </p>
                </div>
              )}

              {data?.vision && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--agro-neutral-700)]">
                    {labels.vision}
                  </p>
                  <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-[var(--agro-neutral-800)] sm:text-lg md:text-xl">
                    {data.vision}
                  </p>
                </div>
              )}
            </div>
          </header>
        )}

        {(data?.story || (highlights && highlights.length > 0)) && (
          <div
            className={`mb-16 grid grid-cols-1 items-stretch gap-10 md:mb-20 lg:gap-12 ${
              hasStory && hasHighlights ? 'lg:grid-cols-2' : ''
            }`}
          >
            {data?.story && (
              <article className="flex min-w-0 flex-col justify-center rounded-xl border border-[rgba(40,25,9,0.08)] bg-[var(--agro-neutral-25)] p-6 shadow-[0_12px_32px_-4px_rgba(40,25,9,0.08)] sm:p-8 md:p-9">
                <PanelHeading className="heading-subsection mb-6 text-[var(--agro-neutral-900)]">
                  {labels.ourStory}
                </PanelHeading>
                <p className="whitespace-pre-line break-words text-base leading-relaxed text-[var(--agro-neutral-800)] sm:text-lg">
                  {data.story}
                </p>
              </article>
            )}

            {highlights && highlights.length > 0 && (
              <section
                aria-labelledby="why-choose-heading"
                className="min-w-0 rounded-xl border border-[rgba(40,25,9,0.08)] bg-[var(--agro-neutral-25)] p-6 shadow-[0_12px_32px_-4px_rgba(40,25,9,0.08)] sm:p-8 md:p-9"
              >
                <PanelHeading
                  id="why-choose-heading"
                  className="heading-subsection mb-8 text-[var(--agro-neutral-900)]"
                >
                  {data?.whyChooseTitle || labels.whyChoose}
                </PanelHeading>
                <ul className="space-y-6" role="list">
                  {highlights.map((highlight, index) => {
                    const variant = highlight.colorVariant || 'forest';
                    const badgeStyles = HIGHLIGHT_VARIANTS[variant];

                    return (
                      <li
                        key={highlight._key || `${highlight.title}-${index}`}
                        className="flex min-w-0 items-start gap-4"
                      >
                        {highlight.metric && (
                          <span
                            className="flex min-h-12 min-w-12 max-w-28 flex-shrink-0 items-center justify-center break-words rounded-full border border-current/20 px-3 py-2 text-center text-xs font-bold leading-tight tracking-tight sm:text-sm"
                            style={badgeStyles}
                          >
                            {highlight.metric}
                          </span>
                        )}
                        <div className="min-w-0 space-y-1">
                          {highlight.title && (
                            <ItemHeading className="break-words text-base font-bold text-[var(--agro-neutral-900)]">
                              {highlight.title}
                            </ItemHeading>
                          )}
                          {highlight.description && (
                            <p className="break-words text-sm leading-relaxed text-[var(--agro-neutral-700)]">
                              {highlight.description}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>
        )}

        {coreValues && coreValues.length > 0 && (
          <section aria-labelledby="core-values-heading">
            <PanelHeading
              id="core-values-heading"
              className="heading-subsection mb-10 text-center text-[var(--agro-neutral-900)]"
            >
              {labels.coreValues}
            </PanelHeading>
            <ul
              className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2"
              role="list"
            >
              {coreValues.map((value, index) => (
                <li
                  key={value._id || `${value.title}-${index}`}
                  className="flex min-w-0 items-start gap-4 rounded-xl border border-[rgba(40,25,9,0.08)] bg-[var(--agro-neutral-25)] p-5 lg:p-6"
                >
                  <CheckCircle
                    aria-hidden="true"
                    focusable="false"
                    className="mt-0.5 h-6 w-6 flex-shrink-0 text-[var(--agro-primary-600)]"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    {value.title && (
                      <ItemHeading className="break-words font-[var(--font-heading)] text-[19px] font-bold leading-snug text-[var(--agro-neutral-900)]">
                        {value.title}
                      </ItemHeading>
                    )}
                    {value.description && (
                      <p className="break-words text-base leading-relaxed text-[var(--agro-neutral-800)]">
                        {value.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </SectionContainer>
  );
};

export default AboutSection;
