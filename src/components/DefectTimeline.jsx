/**
 * Defect Timeline Component
 *
 * React component for visualizing chronological timeline of defects,
 * events, and legal issues with interactive filtering and highlighting.
 *
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';

export const DefectTimeline = ({ timeline, findings }) => {
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [highlightedEvent, setHighlightedEvent] = useState(null);

  // Merge timeline events with findings
  const timelineEvents = useMemo(() => {
    if (!timeline || !findings) return [];

    const events = [];

    // Add timeline dates/times
    if (timeline.dates) {
      timeline.dates.forEach((dateInfo, idx) => {
        events.push({
          type: 'date',
          timestamp: dateInfo.date,
          description: dateInfo.context,
          source: dateInfo.source,
          severity: 'info',
          id: `date-${idx}-${dateInfo.date}`
        });
      });
    }

    // Add findings with locations as events
    findings.forEach((finding, idx) => {
      if (finding.location || finding.timestamp) {
        events.push({
          type: 'finding',
          timestamp: finding.timestamp || finding.location,
          description: finding.description,
          severity: finding.severity?.toLowerCase() || 'low',
          findingType: finding.type,
          presetName: finding.presetName,
          context: finding.context,
          id: `finding-${idx}-${finding.type || 'unknown'}`
        });
      }
    });

    // Sort chronologically
    return events.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime() || 0;
      const timeB = new Date(b.timestamp).getTime() || 0;
      return timeA - timeB;
    });
  }, [timeline, findings]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return timelineEvents.filter(event => {
      if (selectedSeverity !== 'all' && event.severity !== selectedSeverity && event.severity !== 'info') {
        return false;
      }
      if (selectedType !== 'all' && event.type !== selectedType) {
        return false;
      }
      return true;
    });
  }, [timelineEvents, selectedSeverity, selectedType]);

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#f56565',
      high: '#ed8936',
      medium: '#ecc94b',
      low: '#48bb78',
      info: '#4299e1'
    };
    return colors[severity] || colors.info;
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return timestamp;
      }
      return date.toLocaleString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };

  if (!timeline && (!findings || findings.length === 0)) {
    return (
      <div className="defect-timeline empty">
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <div className="empty-text">No timeline data available</div>
          <div className="empty-hint">Timeline events will appear here after analysis</div>
        </div>
      </div>
    );
  }

  return (
    <div className="defect-timeline">
      <div className="timeline-header">
        <h3>📅 Chronological Timeline</h3>
        <div className="timeline-stats">
          {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Controls */}
      <div className="timeline-controls">
        <div className="filter-group">
          <label>Severity:</label>
          <select value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value)}>
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="info">Info</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Type:</label>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="date">Dates</option>
            <option value="finding">Findings</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline-container">
        {filteredEvents.length === 0 ? (
          <div className="no-events">No events match the current filters</div>
        ) : (
          <div className="timeline-track">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className={`timeline-event ${event.type} ${highlightedEvent === event.id ? 'highlighted' : ''}`}
                onMouseEnter={() => setHighlightedEvent(event.id)}
                onMouseLeave={() => setHighlightedEvent(null)}
              >
                <div className="event-marker" style={{ background: getSeverityColor(event.severity) }}>
                  <div className="marker-dot"></div>
                </div>

                <div className="event-content">
                  <div className="event-header">
                    <div className="event-timestamp">{formatTimestamp(event.timestamp)}</div>
                    {event.severity && event.severity !== 'info' && (
                      <span className={`severity-badge ${event.severity}`}>
                        {event.severity.toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="event-description">{event.description}</div>

                  {event.findingType && (
                    <div className="event-meta">
                      <span className="event-type">🔍 {event.findingType}</span>
                    </div>
                  )}

                  {event.presetName && (
                    <div className="event-preset">From: {event.presetName}</div>
                  )}

                  {event.source && (
                    <div className="event-source">Source: {event.source}</div>
                  )}

                  {event.context && highlightedEvent === event.id && (
                    <div className="event-context">
                      <details open>
                        <summary>Context</summary>
                        <pre>{event.context}</pre>
                      </details>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .defect-timeline {
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

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e2e8f0;
        }

        .timeline-header h3 {
          margin: 0;
          font-size: 18px;
          color: #2d3748;
        }

        .timeline-stats {
          font-size: 14px;
          color: #718096;
          font-weight: 500;
        }

        .timeline-controls {
          display: flex;
          gap: 15px;
          margin-bottom: 25px;
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

        .timeline-container {
          position: relative;
        }

        .no-events {
          text-align: center;
          padding: 40px;
          color: #a0aec0;
          font-size: 14px;
        }

        .timeline-track {
          position: relative;
          padding-left: 40px;
        }

        .timeline-track::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #cbd5e0 0%, #cbd5e0 100%);
        }

        .timeline-event {
          position: relative;
          margin-bottom: 20px;
          transition: all 0.2s ease;
        }

        .timeline-event.highlighted {
          transform: translateX(5px);
        }

        .event-marker {
          position: absolute;
          left: -40px;
          top: 5px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 2;
        }

        .marker-dot {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
        }

        .event-content {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border-left: 3px solid #cbd5e0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }

        .timeline-event.highlighted .event-content {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .timeline-event.finding.highlighted .event-content {
          border-left-color: #667eea;
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          gap: 10px;
          flex-wrap: wrap;
        }

        .event-timestamp {
          font-size: 13px;
          color: #718096;
          font-weight: 600;
        }

        .severity-badge {
          padding: 3px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
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

        .event-description {
          font-size: 14px;
          color: #4a5568;
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .event-meta {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }

        .event-type {
          font-size: 12px;
          color: #667eea;
          font-weight: 500;
        }

        .event-preset, .event-source {
          font-size: 12px;
          color: #718096;
          margin-top: 5px;
        }

        .event-context {
          margin-top: 10px;
        }

        .event-context details {
          cursor: pointer;
        }

        .event-context summary {
          font-size: 12px;
          color: #667eea;
          user-select: none;
        }

        .event-context pre {
          margin-top: 8px;
          padding: 10px;
          background: #f7fafc;
          border-radius: 4px;
          font-size: 12px;
          overflow-x: auto;
          color: #2d3748;
        }
      `}</style>
    </div>
  );
};

export default DefectTimeline;
