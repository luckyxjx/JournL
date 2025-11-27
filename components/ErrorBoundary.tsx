'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, retry }: { error?: Error; retry: () => void }) {
  return (
    <div className="min-h-screen bg-peaceful-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-peaceful-warm backdrop-blur-md border border-peaceful rounded-3xl p-8 max-w-md w-full shadow-glass text-center"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-peaceful-text mb-2">Something went wrong</h2>
        <p className="text-peaceful-text/70 mb-6">
          Don't worry, your journal entries are safe. Let's try to get you back on track.
        </p>
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={retry}
            className="w-full bg-peaceful-accent text-white py-3 rounded-xl font-medium hover:bg-peaceful-accent/90 transition-colors"
          >
            Try Again
          </motion.button>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-peaceful-card text-peaceful-text py-3 rounded-xl font-medium hover:bg-peaceful-hover transition-colors"
          >
            Refresh Page
          </button>
        </div>
        {error && (
          <details className="mt-4 text-left">
            <summary className="text-sm text-peaceful-text/50 cursor-pointer">Technical Details</summary>
            <pre className="text-xs text-peaceful-text/50 mt-2 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </motion.div>
    </div>
  );
}