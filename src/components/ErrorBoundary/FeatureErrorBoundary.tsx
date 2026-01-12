import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface Props {
  children: ReactNode;
  featureName?: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Feature-specific error boundary that provides graceful degradation
 * without crashing the entire application
 */
export class FeatureErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { featureName = 'Unknown Feature', onError } = this.props;
    
    // Log to console with feature context
    console.error(`[${featureName}] Error caught by boundary:`, {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // TODO: Send to error tracking service (Sentry)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     contexts: {
    //       react: {
    //         componentStack: errorInfo.componentStack,
    //       },
    //     },
    //     tags: {
    //       feature: featureName,
    //     },
    //   });
    // }

    this.setState({ errorInfo });
  }

  private handleReset = () => {
    const { onReset } = this.props;
    
    if (onReset) {
      onReset();
    }
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { featureName = 'This feature' } = this.props;
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div className="w-full p-6">
          <Card className="border-amber-200 bg-amber-50">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 bg-amber-100 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-amber-600" aria-hidden="true" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {featureName} encountered an error
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Don't worry - the rest of the application is still working.
                    </p>
                  </div>

                  {this.state.error && isDevelopment && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-medium text-amber-700 hover:text-amber-800">
                        Technical Details (Development Only)
                      </summary>
                      <div className="mt-2 p-3 bg-white rounded border border-amber-200 overflow-auto max-h-48">
                        <div className="text-xs font-mono text-slate-700 space-y-2">
                          <div>
                            <strong>Error:</strong> {this.state.error.toString()}
                          </div>
                          {this.state.error.stack && (
                            <div>
                              <strong>Stack:</strong>
                              <pre className="mt-1 whitespace-pre-wrap">
                                {this.state.error.stack}
                              </pre>
                            </div>
                          )}
                          {this.state.errorInfo?.componentStack && (
                            <div>
                              <strong>Component Stack:</strong>
                              <pre className="mt-1 whitespace-pre-wrap text-xs">
                                {this.state.errorInfo.componentStack}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </details>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={this.handleReset}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" aria-hidden="true" />
                      Try Again
                    </Button>
                    
                    <Button 
                      onClick={() => window.location.href = '/'}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Home className="w-4 h-4" aria-hidden="true" />
                      Go Home
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
