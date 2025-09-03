'use client';

import React from 'react';
import ContactSection from '@/components/sections/ContactSection';

export default function ContactFormPage() {
  return (
    <main className="min-h-screen">
      <ContactSection isLoading={false} />
    </main>
  );
}
