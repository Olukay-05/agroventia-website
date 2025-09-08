'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface PreviewWrapperProps {
  children: ReactNode;
}

function FallbackComponent({ error }: { error: Error }) {
  return <div>Something went wrong: {error.message}</div>;
}

export default function PreviewWrapper({ children }: PreviewWrapperProps) {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ErrorBoundary>
  );
}
