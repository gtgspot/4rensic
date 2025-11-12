/**
 * Pattern Insights Component
 *
 * React component for displaying machine learning-like pattern detection
 * insights, showing recurring issues, trends, and learned patterns.
 *
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';

export const PatternInsights = ({ patterns, analysisHistory }) => {
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [sortBy, setSortBy] = useState('frequency'); // frequency, severity, recency

  // Process patterns for display
  const processedPatterns = useMemo(() => {
    if (!patterns || patterns.length === 0) return [];

    return patterns.map((pattern, idx) => {
      const occurrences = pattern.occurrences || 1;
      const avgSeverity = pattern.avgSeverity || 'medium';
      const significance = pattern.significance || 'normal';

      return {
        ...pattern,
        id: pattern.id || `pattern-${pattern.type || 'unknown'}-${idx}`,
        occurrences,
        avgSeverity,
        significance,
        lastSeen: pattern.lastSeen || new Date().toISOString()
      };
    });
  }, [patterns]);

  // Sort patterns
  const sortedPatterns = useMemo(() => {
    const sorted = [...processedPatterns];

    if (sortBy === 'frequency') {
      sorted.sort((a, b) => (b.occurrences || 0) - (a.occurrences || 0));
    } else if (sortBy === 'severity') {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      sorted.sort((a, b) => {
        const severityA = severityOrder[a.avgSeverity?.toLowerCase()] || 0;
        const severityB = severityOrder[b.avgSeverity?.toLowerCase()] || 0;
        return severityB - severityA;
      });
    } else if (sortBy === 'recency') {
      sorted.sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));
    }

    return sorted;
  }, [processedPatterns, sortBy]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!analysisHistory || analysisHistory.length === 0) {
      return {
        totalAnalyses: 0,
        totalFindings: 0,
        mostCommonIssue: 'N/A',
        averageFindings: 0
      };
    }

    const totalAnalyses = analysisHistory.length;
    const totalFindings = analysisHistory.reduce((sum, analysis) => {
      return sum + (analysis.summary?.totalFindings || 0);
    }, 0);
    const averageFindings = totalAnalyses > 0 ? Math.round(totalFindings / totalAnalyses) : 0;

    // Find most common issue
    const issueCount = {};
    processedPatterns.forEach(pattern => {
      const type = pattern.type || 'Unknown';
      issueCount[type] = (issueCount[type] || 0) + (pattern.occurrences || 1);
    });
    const mostCommonIssue = Object.keys(issueCount).length > 0
      ? Object.keys(issueCount).reduce((a, b) => issueCount[a] > issueCount[b] ? a : b)
      : 'N/A';

    return {
      totalAnalyses,
      totalFindings,
      mostCommonIssue,
      averageFindings
    };
  }, [analysisHistory, processedPatterns]);

  const getSignificanceColor = (significance) => {
    const colors = {
      critical: '#f56565',
      high: '#ed8936',
      normal: '#4299e1',
      low: '#48bb78'
    };
    return colors[significance?.toLowerCase()] || colors.normal;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#f56565',
      high: '#ed8936',
      medium: '#ecc94b',
      low: '#48bb78'
    };
    return colors[severity?.toLowerCase()] || colors.medium;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  if (!patterns || patterns.length === 0) {
    return (
      <div className="pattern-insights empty">
        <div className="empty-state">
          <div className="empty-icon">🧠</div>
          <div className="empty-text">No patterns detected yet</div>
          <div className="empty-hint">
            Patterns will be learned as you analyze more documents
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pattern-insights">
      <div className="insights-header">
        <h3>🧠 Pattern Insights & Learning</h3>
        <div className="pattern-count">
          {sortedPatterns.length} pattern{sortedPatterns.length !== 1 ? 's' : ''} detected
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="statistics-dashboard">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{statistics.totalAnalyses}</div>
          <div className="stat-label">Total Analyses</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-value">{statistics.totalFindings}</div>
          <div className="stat-label">Total Findings</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{statistics.averageFindings}</div>
          <div className="stat-label">Avg Findings/Doc</div>
        </div>

        <div className="stat-card wide">
          <div className="stat-icon">⚠️</div>
          <div className="stat-value-text">{statistics.mostCommonIssue}</div>
          <div className="stat-label">Most Common Issue</div>
        </div>
      </div>

      {/* Controls */}
      <div className="insights-controls">
        <div className="sort-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="frequency">Frequency</option>
            <option value="severity">Severity</option>
            <option value="recency">Recency</option>
          </select>
        </div>
      </div>

      {/* Patterns List */}
      <div className="patterns-list">
        {sortedPatterns.map((pattern) => (
          <div
            key={pattern.id}
            className={`pattern-item ${selectedPattern === pattern.id ? 'selected' : ''}`}
            onClick={() => setSelectedPattern(selectedPattern === pattern.id ? null : pattern.id)}
          >
            <div className="pattern-header">
              <div className="pattern-type">
                <span className="type-icon">🔍</span>
                <span className="type-text">{pattern.type || 'Unknown Pattern'}</span>
              </div>
              <div className="pattern-badges">
                <span
                  className="significance-badge"
                  style={{ background: getSignificanceColor(pattern.significance) }}
                >
                  {pattern.significance || 'Normal'}
                </span>
                <span
                  className="severity-badge"
                  style={{ background: getSeverityColor(pattern.avgSeverity) }}
                >
                  {pattern.avgSeverity?.toUpperCase() || 'MEDIUM'}
                </span>
              </div>
            </div>

            <div className="pattern-stats">
              <div className="stat-item">
                <div className="stat-label-small">Occurrences</div>
                <div className="stat-value-small">{pattern.occurrences}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label-small">Last Seen</div>
                <div className="stat-value-small">{formatDate(pattern.lastSeen)}</div>
              </div>
              {pattern.frequency && (
                <div className="stat-item">
                  <div className="stat-label-small">Frequency</div>
                  <div className="stat-value-small">{Math.round(pattern.frequency * 100)}%</div>
                </div>
              )}
            </div>

            {pattern.description && (
              <div className="pattern-description">
                {pattern.description}
              </div>
            )}

            {selectedPattern === pattern.id && (
              <div className="pattern-details">
                <div className="details-section">
                  <div className="details-title">Pattern Details</div>

                  {pattern.examples && pattern.examples.length > 0 && (
                    <div className="examples-section">
                      <div className="examples-title">Examples:</div>
                      <ul className="examples-list">
                        {pattern.examples.slice(0, 3).map((example, idx) => (
                          <li key={`${pattern.id}-example-${idx}`}>{example}</li>
                        ))}
                      </ul>
                      {pattern.examples.length > 3 && (
                        <div className="more-examples">
                          +{pattern.examples.length - 3} more example{pattern.examples.length - 3 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )}

                  {pattern.recommendation && (
                    <div className="recommendation-section">
                      <div className="recommendation-title">💡 Recommendation:</div>
                      <div className="recommendation-text">{pattern.recommendation}</div>
                    </div>
                  )}

                  {pattern.relatedFindings && pattern.relatedFindings.length > 0 && (
                    <div className="related-section">
                      <div className="related-title">Related Findings:</div>
                      <div className="related-count">{pattern.relatedFindings.length} finding{pattern.relatedFindings.length !== 1 ? 's' : ''}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="expand-hint">
              {selectedPattern === pattern.id ? '▲ Click to collapse' : '▼ Click for details'}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .pattern-insights {
          width: 100%;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #a0aec0;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .empty-text {
          font-size: 16px;
          margin-bottom: 8px;
        }

        .empty-hint {
          font-size: 14px;
        }

        .insights-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e2e8f0;
        }

        .insights-header h3 {
          margin: 0;
          font-size: 18px;
          color: #2d3748;
        }

        .pattern-count {
          font-size: 14px;
          color: #718096;
          font-weight: 500;
        }

        .statistics-dashboard {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          color: white;
        }

        .stat-card.wide {
          grid-column: span 2;
        }

        @media (max-width: 768px) {
          .stat-card.wide {
            grid-column: span 1;
          }
        }

        .stat-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .stat-value-text {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 5px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.9;
        }

        .insights-controls {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          padding: 12px;
          background: #f7fafc;
          border-radius: 8px;
        }

        .sort-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sort-group label {
          font-size: 14px;
          color: #4a5568;
          font-weight: 500;
        }

        .sort-group select {
          padding: 6px 12px;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .patterns-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .pattern-item {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #cbd5e0;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pattern-item:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateX(2px);
        }

        .pattern-item.selected {
          border-left-color: #667eea;
        }

        .pattern-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          gap: 10px;
          flex-wrap: wrap;
        }

        .pattern-type {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .type-icon {
          font-size: 18px;
        }

        .type-text {
          font-size: 15px;
          font-weight: 600;
          color: #2d3748;
        }

        .pattern-badges {
          display: flex;
          gap: 8px;
        }

        .significance-badge, .severity-badge {
          padding: 3px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
        }

        .pattern-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .stat-label-small {
          font-size: 11px;
          color: #718096;
          text-transform: uppercase;
          font-weight: 600;
        }

        .stat-value-small {
          font-size: 14px;
          color: #2d3748;
          font-weight: 600;
        }

        .pattern-description {
          color: #4a5568;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .pattern-details {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
        }

        .details-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .details-title {
          font-size: 13px;
          color: #4a5568;
          font-weight: 700;
          text-transform: uppercase;
        }

        .examples-section {
          background: #f7fafc;
          padding: 12px;
          border-radius: 6px;
        }

        .examples-title {
          font-size: 12px;
          color: #4a5568;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .examples-list {
          margin: 0;
          padding-left: 20px;
          color: #2d3748;
          font-size: 13px;
        }

        .examples-list li {
          margin-bottom: 5px;
        }

        .more-examples {
          margin-top: 8px;
          font-size: 12px;
          color: #718096;
          font-style: italic;
        }

        .recommendation-section {
          background: #fffaf0;
          padding: 12px;
          border-radius: 6px;
          border-left: 3px solid #ed8936;
        }

        .recommendation-title {
          font-size: 12px;
          color: #7c2d12;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .recommendation-text {
          font-size: 13px;
          color: #2d3748;
          line-height: 1.5;
        }

        .related-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #f0fff4;
          border-radius: 6px;
        }

        .related-title {
          font-size: 12px;
          color: #22543d;
          font-weight: 600;
        }

        .related-count {
          font-size: 13px;
          color: #2f855a;
          font-weight: 600;
        }

        .expand-hint {
          font-size: 11px;
          color: #a0aec0;
          text-align: center;
          margin-top: 10px;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default PatternInsights;
