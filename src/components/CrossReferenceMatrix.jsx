/**
 * Cross-Reference Matrix Component
 *
 * React component for displaying multi-document cross-reference analysis,
 * showing discrepancies and consistencies across multiple documents.
 *
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';

export const CrossReferenceMatrix = ({ crossRefData, documents }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedDiscrepancy, setExpandedDiscrepancy] = useState(null);

  // Aggregate all discrepancies
  const allDiscrepancies = useMemo(() => {
    if (!crossRefData) return [];

    const discrepancies = [];
    let discrepancyCounter = 0;

    // Date discrepancies
    if (crossRefData.dateDiscrepancies) {
      crossRefData.dateDiscrepancies.forEach(d => {
        discrepancies.push({
          id: `date-discrepancy-${discrepancyCounter++}`,
          category: 'date',
          severity: d.severity || 'medium',
          description: d.description,
          documents: d.documents || [],
          details: d
        });
      });
    }

    // Time discrepancies
    if (crossRefData.timeDiscrepancies) {
      crossRefData.timeDiscrepancies.forEach(d => {
        discrepancies.push({
          id: `time-discrepancy-${discrepancyCounter++}`,
          category: 'time',
          severity: d.severity || 'medium',
          description: d.description,
          documents: d.documents || [],
          details: d
        });
      });
    }

    // Location discrepancies
    if (crossRefData.locationDiscrepancies) {
      crossRefData.locationDiscrepancies.forEach(d => {
        discrepancies.push({
          id: `location-discrepancy-${discrepancyCounter++}`,
          category: 'location',
          severity: d.severity || 'high',
          description: d.description,
          documents: d.documents || [],
          details: d
        });
      });
    }

    // Event sequence discrepancies
    if (crossRefData.eventSequenceDiscrepancies) {
      crossRefData.eventSequenceDiscrepancies.forEach(d => {
        discrepancies.push({
          id: `sequence-discrepancy-${discrepancyCounter++}`,
          category: 'sequence',
          severity: d.severity || 'high',
          description: d.description,
          documents: d.documents || [],
          details: d
        });
      });
    }

    return discrepancies;
  }, [crossRefData]);

  // Filter discrepancies
  const filteredDiscrepancies = useMemo(() => {
    if (selectedCategory === 'all') return allDiscrepancies;
    return allDiscrepancies.filter(d => d.category === selectedCategory);
  }, [allDiscrepancies, selectedCategory]);

  const getCategoryIcon = (category) => {
    const icons = {
      date: '📅',
      time: '⏰',
      location: '📍',
      sequence: '🔄'
    };
    return icons[category] || '📄';
  };

  const getCategoryColor = (category) => {
    const colors = {
      date: '#4299e1',
      time: '#9f7aea',
      location: '#ed8936',
      sequence: '#f56565'
    };
    return colors[category] || '#718096';
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

  const getConsistencyColor = (percentage) => {
    if (percentage >= 90) return '#48bb78';
    if (percentage >= 75) return '#ecc94b';
    if (percentage >= 50) return '#ed8936';
    return '#f56565';
  };

  const overallConsistency = crossRefData?.overallConsistency || 0;
  const documentCount = documents?.length || 0;

  if (!crossRefData || documentCount < 2) {
    return (
      <div className="cross-reference-matrix empty">
        <div className="empty-state">
          <div className="empty-icon">🔗</div>
          <div className="empty-text">No cross-reference data available</div>
          <div className="empty-hint">
            {documentCount < 2
              ? 'Upload at least 2 documents for cross-reference analysis'
              : 'Cross-reference analysis will appear here'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cross-reference-matrix">
      <div className="matrix-header">
        <h3>🔗 Cross-Reference Analysis</h3>
        <div className="document-count">
          {documentCount} document{documentCount !== 1 ? 's' : ''} compared
        </div>
      </div>

      {/* Overall Consistency */}
      <div className="consistency-panel">
        <div className="consistency-label">Overall Consistency Score</div>
        <div className="consistency-bar-container">
          <div
            className="consistency-bar-fill"
            style={{
              width: `${overallConsistency}%`,
              background: getConsistencyColor(overallConsistency)
            }}
          >
            <span className="consistency-value">{overallConsistency}%</span>
          </div>
        </div>
        <div className="consistency-interpretation">
          {overallConsistency >= 90 && '✅ High consistency - documents align well'}
          {overallConsistency >= 75 && overallConsistency < 90 && '⚠️ Moderate consistency - some discrepancies detected'}
          {overallConsistency >= 50 && overallConsistency < 75 && '⚠️ Low consistency - significant discrepancies'}
          {overallConsistency < 50 && '❌ Poor consistency - major conflicts detected'}
        </div>
      </div>

      {/* Document List */}
      {documents && documents.length > 0 && (
        <div className="documents-panel">
          <div className="panel-title">Documents in Analysis</div>
          <div className="document-list">
            {documents.map((doc, idx) => (
              <div key={doc.name || `document-${idx}`} className="document-item">
                <div className="document-icon">📄</div>
                <div className="document-name">{doc.name || `Document ${idx + 1}`}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="matrix-controls">
        <div className="filter-group">
          <label>Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All ({allDiscrepancies.length})</option>
            <option value="date">Dates ({allDiscrepancies.filter(d => d.category === 'date').length})</option>
            <option value="time">Times ({allDiscrepancies.filter(d => d.category === 'time').length})</option>
            <option value="location">Locations ({allDiscrepancies.filter(d => d.category === 'location').length})</option>
            <option value="sequence">Sequences ({allDiscrepancies.filter(d => d.category === 'sequence').length})</option>
          </select>
        </div>
      </div>

      {/* Discrepancies List */}
      <div className="discrepancies-section">
        <div className="section-title">
          {filteredDiscrepancies.length} Discrepanc{filteredDiscrepancies.length !== 1 ? 'ies' : 'y'} Found
        </div>

        {filteredDiscrepancies.length === 0 ? (
          <div className="no-discrepancies">
            <div className="success-icon">✅</div>
            <div>No discrepancies in this category</div>
          </div>
        ) : (
          <div className="discrepancy-list">
            {filteredDiscrepancies.map((discrepancy) => (
              <div
                key={discrepancy.id}
                className={`discrepancy-item ${expandedDiscrepancy === discrepancy.id ? 'expanded' : ''}`}
                onClick={() => setExpandedDiscrepancy(expandedDiscrepancy === discrepancy.id ? null : discrepancy.id)}
              >
                <div className="discrepancy-header">
                  <div className="category-badge" style={{ background: getCategoryColor(discrepancy.category) }}>
                    {getCategoryIcon(discrepancy.category)} {discrepancy.category.toUpperCase()}
                  </div>
                  <div
                    className="severity-indicator"
                    style={{ background: getSeverityColor(discrepancy.severity) }}
                    title={`${discrepancy.severity} severity`}
                  ></div>
                </div>

                <div className="discrepancy-description">
                  {discrepancy.description}
                </div>

                {discrepancy.documents && discrepancy.documents.length > 0 && (
                  <div className="affected-documents">
                    Affects: {discrepancy.documents.join(', ')}
                  </div>
                )}

                {expandedDiscrepancy === discrepancy.id && discrepancy.details && (
                  <div className="discrepancy-details">
                    <div className="details-title">Details:</div>
                    <pre>{JSON.stringify(discrepancy.details, null, 2)}</pre>
                  </div>
                )}

                <div className="expand-hint">
                  {expandedDiscrepancy === discrepancy.id ? '▲ Click to collapse' : '▼ Click for details'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .cross-reference-matrix {
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

        .matrix-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e2e8f0;
        }

        .matrix-header h3 {
          margin: 0;
          font-size: 18px;
          color: #2d3748;
        }

        .document-count {
          font-size: 14px;
          color: #718096;
          font-weight: 500;
        }

        .consistency-panel {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .consistency-label {
          font-size: 14px;
          color: #4a5568;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .consistency-bar-container {
          height: 40px;
          background: #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          margin-bottom: 10px;
        }

        .consistency-bar-fill {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: width 0.5s ease;
          min-width: 60px;
        }

        .consistency-value {
          color: white;
          font-weight: 700;
          font-size: 16px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .consistency-interpretation {
          font-size: 13px;
          color: #718096;
          font-style: italic;
        }

        .documents-panel {
          background: #f7fafc;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .panel-title {
          font-size: 14px;
          color: #4a5568;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .document-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .document-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: white;
          border-radius: 6px;
          font-size: 13px;
          color: #2d3748;
        }

        .document-icon {
          font-size: 16px;
        }

        .document-name {
          font-weight: 500;
        }

        .matrix-controls {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          padding: 12px;
          background: #f7fafc;
          border-radius: 8px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-group label {
          font-size: 14px;
          color: #4a5568;
          font-weight: 500;
        }

        .filter-group select {
          padding: 6px 12px;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .discrepancies-section {
          margin-top: 20px;
        }

        .section-title {
          font-size: 16px;
          color: #2d3748;
          font-weight: 600;
          margin-bottom: 15px;
        }

        .no-discrepancies {
          text-align: center;
          padding: 40px;
          color: #48bb78;
          font-size: 14px;
        }

        .success-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .discrepancy-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .discrepancy-item {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #cbd5e0;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .discrepancy-item:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateX(2px);
        }

        .discrepancy-item.expanded {
          border-left-color: #667eea;
        }

        .discrepancy-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .category-badge {
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
        }

        .severity-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .discrepancy-description {
          color: #4a5568;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .affected-documents {
          font-size: 12px;
          color: #718096;
          margin-bottom: 8px;
        }

        .discrepancy-details {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
        }

        .details-title {
          font-size: 12px;
          color: #4a5568;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .discrepancy-details pre {
          background: #f7fafc;
          padding: 10px;
          border-radius: 4px;
          font-size: 12px;
          overflow-x: auto;
          color: #2d3748;
        }

        .expand-hint {
          font-size: 11px;
          color: #a0aec0;
          text-align: center;
          margin-top: 8px;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default CrossReferenceMatrix;
