/**
 * Analysis Results Component
 *
 * React component for displaying forensic analysis results with
 * severity color-coding, filtering, and export options.
 *
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';

export const AnalysisResults = ({ analysis, onExport }) => {
  const [filter, setFilter] = useState('all'); // all, critical, high, medium, low
  const [sortBy, setSortBy] = useState('severity'); // severity, type, preset

  // Extract all findings from analysis
  const allFindings = useMemo(() => {
    if (!analysis || !analysis.phases || !analysis.phases.presetAnalysis) {
      return [];
    }

    const findings = [];
    let findingCounter = 0;
    analysis.phases.presetAnalysis.forEach(preset => {
      if (preset.findings) {
        preset.findings.forEach(finding => {
          findings.push({
            ...finding,
            id: finding.id || `finding-${preset.presetId || 'unknown'}-${findingCounter++}`,
            presetName: preset.presetName,
            presetId: preset.presetId
          });
        });
      }
    });

    return findings;
  }, [analysis]);

  // Filter findings
  const filteredFindings = useMemo(() => {
    if (filter === 'all') return allFindings;
    return allFindings.filter(f =>
      f.severity?.toLowerCase() === filter.toLowerCase()
    );
  }, [allFindings, filter]);

  // Sort findings
  const sortedFindings = useMemo(() => {
    const sorted = [...filteredFindings];

    if (sortBy === 'severity') {
      const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      sorted.sort((a, b) => {
        const orderA = severityOrder[a.severity?.toUpperCase()] ?? 999;
        const orderB = severityOrder[b.severity?.toUpperCase()] ?? 999;
        return orderA - orderB;
      });
    } else if (sortBy === 'type') {
      sorted.sort((a, b) => (a.type || '').localeCompare(b.type || ''));
    } else if (sortBy === 'preset') {
      sorted.sort((a, b) => (a.presetName || '').localeCompare(b.presetName || ''));
    }

    return sorted;
  }, [filteredFindings, sortBy]);

  const getSeverityClass = (severity) => {
    return (severity || 'low').toLowerCase();
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#f56565',
      high: '#ed8936',
      medium: '#ecc94b',
      low: '#48bb78'
    };
    return colors[severity?.toLowerCase()] || colors.low;
  };

  if (!analysis) {
    return (
      <div className="analysis-results empty">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-text">No analysis results yet</div>
          <div className="empty-hint">Upload a document to begin analysis</div>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-results">
      {/* Summary Cards */}
      {analysis.summary && (
        <div className="summary-section">
          <div className="summary-cards">
            <div className="summary-card total">
              <div className="summary-value">{analysis.summary.totalFindings}</div>
              <div className="summary-label">Total Findings</div>
            </div>
            <div className="summary-card critical">
              <div className="summary-value">{analysis.summary.criticalIssues}</div>
              <div className="summary-label">Critical</div>
            </div>
            <div className="summary-card high">
              <div className="summary-value">{analysis.summary.highIssues}</div>
              <div className="summary-label">High</div>
            </div>
            <div className="summary-card medium">
              <div className="summary-value">{analysis.summary.mediumIssues}</div>
              <div className="summary-label">Medium</div>
            </div>
            <div className="summary-card low">
              <div className="summary-value">{analysis.summary.lowIssues}</div>
              <div className="summary-label">Low</div>
            </div>
          </div>

          <div className="overall-status" style={{
            background: analysis.summary.criticalIssues > 0 ? '#fee2e2' :
                       analysis.summary.highIssues > 0 ? '#fef3c7' : '#dcfce7',
            color: analysis.summary.criticalIssues > 0 ? '#991b1b' :
                   analysis.summary.highIssues > 0 ? '#78350f' : '#166534'
          }}>
            Status: {analysis.summary.overallStatus}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="results-controls">
        <div className="filter-group">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All ({allFindings.length})</option>
            <option value="critical">Critical ({allFindings.filter(f => f.severity?.toLowerCase() === 'critical').length})</option>
            <option value="high">High ({allFindings.filter(f => f.severity?.toLowerCase() === 'high').length})</option>
            <option value="medium">Medium ({allFindings.filter(f => f.severity?.toLowerCase() === 'medium').length})</option>
            <option value="low">Low ({allFindings.filter(f => f.severity?.toLowerCase() === 'low').length})</option>
          </select>
        </div>

        <div className="sort-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="severity">Severity</option>
            <option value="type">Type</option>
            <option value="preset">Preset</option>
          </select>
        </div>

        {onExport && (
          <div className="export-group">
            <button onClick={() => onExport('pdf')} className="export-btn">
              📄 PDF
            </button>
            <button onClick={() => onExport('docx')} className="export-btn">
              📝 DOCX
            </button>
            <button onClick={() => onExport('json')} className="export-btn">
              🔗 JSON
            </button>
            <button onClick={() => onExport('csv')} className="export-btn">
              📊 CSV
            </button>
          </div>
        )}
      </div>

      {/* Findings List */}
      <div className="findings-list">
        {sortedFindings.length === 0 ? (
          <div className="no-findings">
            No findings match the current filter
          </div>
        ) : (
          sortedFindings.map((finding) => (
            <div
              key={finding.id}
              className={`finding-item ${getSeverityClass(finding.severity)}`}
            >
              <div className="finding-header">
                <span className={`severity-badge ${getSeverityClass(finding.severity)}`}>
                  {finding.severity}
                </span>
                <span className="finding-type">{finding.type}</span>
                {finding.presetName && (
                  <span className="preset-name">{finding.presetName}</span>
                )}
              </div>

              <div className="finding-description">
                {finding.description}
              </div>

              {finding.location && (
                <div className="finding-location">
                  📍 {finding.location}
                </div>
              )}

              {finding.context && (
                <div className="finding-context">
                  <details>
                    <summary>View Context</summary>
                    <pre>{finding.context}</pre>
                  </details>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .analysis-results {
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

        .summary-section {
          margin-bottom: 20px;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
          margin-bottom: 15px;
        }

        .summary-card {
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          color: white;
        }

        .summary-card.total {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .summary-card.critical {
          background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
        }

        .summary-card.high {
          background: linear-gradient(135deg, #ed8936 0%, #c05621 100%);
        }

        .summary-card.medium {
          background: linear-gradient(135deg, #ecc94b 0%, #b7791f 100%);
        }

        .summary-card.low {
          background: linear-gradient(135deg, #48bb78 0%, #2f855a 100%);
        }

        .summary-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .summary-label {
          font-size: 12px;
          opacity: 0.9;
        }

        .overall-status {
          padding: 12px;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
        }

        .results-controls {
          display: flex;
          gap: 15px;
          align-items: center;
          padding: 15px;
          background: #f7fafc;
          border-radius: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filter-group, .sort-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-group label, .sort-group label {
          font-size: 14px;
          color: #4a5568;
          font-weight: 500;
        }

        .filter-group select, .sort-group select {
          padding: 6px 12px;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .export-group {
          margin-left: auto;
          display: flex;
          gap: 8px;
        }

        .export-btn {
          padding: 6px 12px;
          background: white;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .export-btn:hover {
          background: #f7fafc;
          border-color: #667eea;
        }

        .findings-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .finding-item {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #cbd5e0;
          transition: all 0.2s ease;
        }

        .finding-item:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .finding-item.critical {
          border-left-color: #f56565;
          background: #fff5f5;
        }

        .finding-item.high {
          border-left-color: #ed8936;
          background: #fffaf0;
        }

        .finding-item.medium {
          border-left-color: #ecc94b;
          background: #fffff0;
        }

        .finding-item.low {
          border-left-color: #48bb78;
          background: #f0fff4;
        }

        .finding-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .severity-badge {
          padding: 3px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .severity-badge.critical {
          background: #feb2b2;
          color: #742a2a;
        }

        .severity-badge.high {
          background: #fbd38d;
          color: #7c2d12;
        }

        .severity-badge.medium {
          background: #faf089;
          color: #744210;
        }

        .severity-badge.low {
          background: #9ae6b4;
          color: #22543d;
        }

        .finding-type {
          font-weight: 600;
          color: #2d3748;
          font-size: 14px;
        }

        .preset-name {
          font-size: 12px;
          color: #718096;
          margin-left: auto;
        }

        .finding-description {
          color: #4a5568;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .finding-location {
          font-size: 12px;
          color: #718096;
          margin-bottom: 8px;
        }

        .finding-context details {
          margin-top: 8px;
        }

        .finding-context summary {
          cursor: pointer;
          font-size: 12px;
          color: #667eea;
          user-select: none;
        }

        .finding-context pre {
          margin-top: 8px;
          padding: 10px;
          background: #f7fafc;
          border-radius: 4px;
          font-size: 12px;
          overflow-x: auto;
          color: #2d3748;
        }

        .no-findings {
          text-align: center;
          padding: 40px;
          color: #a0aec0;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default AnalysisResults;
