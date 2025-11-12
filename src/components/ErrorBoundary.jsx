/**
 * Error Boundary Component
 *
 * Catches and handles React component errors gracefully,
 * preventing the entire app from crashing.
 *
 * @version 1.0.0
 */

import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('🚨 Error caught by boundary:', error, errorInfo);

    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You could also log to an error reporting service here
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Optionally refresh the page
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Something went wrong</h2>
            <p className="error-message">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>

            <details className="error-details">
              <summary>Error Details</summary>
              <div className="error-stack">
                <div className="error-section">
                  <strong>Error:</strong>
                  <pre>{this.state.error?.toString()}</pre>
                </div>
                {this.state.errorInfo && (
                  <div className="error-section">
                    <strong>Component Stack:</strong>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </div>
                )}
              </div>
            </details>

            <div className="error-actions">
              <button onClick={this.handleReset} className="retry-btn">
                🔄 Try Again
              </button>
              <button onClick={() => window.location.reload()} className="reload-btn">
                ↻ Reload Page
              </button>
            </div>
          </div>

          <style jsx>{`
            .error-boundary {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 400px;
              padding: 40px 20px;
            }

            .error-container {
              max-width: 600px;
              text-align: center;
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              border-left: 4px solid #f56565;
            }

            .error-icon {
              font-size: 64px;
              margin-bottom: 20px;
            }

            .error-title {
              font-size: 24px;
              color: #2d3748;
              margin-bottom: 15px;
              font-weight: 700;
            }

            .error-message {
              font-size: 16px;
              color: #4a5568;
              margin-bottom: 20px;
              line-height: 1.5;
            }

            .error-details {
              text-align: left;
              margin: 20px 0;
              background: #f7fafc;
              padding: 15px;
              border-radius: 8px;
              cursor: pointer;
            }

            .error-details summary {
              font-size: 14px;
              font-weight: 600;
              color: #667eea;
              user-select: none;
            }

            .error-details summary:hover {
              color: #764ba2;
            }

            .error-stack {
              margin-top: 15px;
            }

            .error-section {
              margin-bottom: 15px;
            }

            .error-section strong {
              display: block;
              font-size: 12px;
              color: #718096;
              margin-bottom: 5px;
              text-transform: uppercase;
            }

            .error-section pre {
              background: white;
              padding: 10px;
              border-radius: 4px;
              font-size: 11px;
              overflow-x: auto;
              color: #2d3748;
              border: 1px solid #e2e8f0;
              max-height: 200px;
              overflow-y: auto;
            }

            .error-actions {
              display: flex;
              gap: 10px;
              justify-content: center;
              margin-top: 20px;
            }

            .retry-btn,
            .reload-btn {
              padding: 12px 24px;
              border: none;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
            }

            .retry-btn {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }

            .retry-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .reload-btn {
              background: white;
              color: #4a5568;
              border: 2px solid #e2e8f0;
            }

            .reload-btn:hover {
              background: #f7fafc;
              border-color: #cbd5e0;
            }
          `}</style>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
