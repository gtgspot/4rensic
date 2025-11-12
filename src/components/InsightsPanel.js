/**
 * Insights Panel Component
 *
 * Displays real-time intelligence insights after each analysis including:
 * - Comparison to historical average
 * - Trend indicators
 * - Specific learned recommendations
 * - Novel issue detection
 *
 * @version 1.0.0
 */

export class InsightsPanel {
  constructor() {
    this.container = null;
  }

  /**
   * Create and render insights panel
   * @param {Object} insights - Intelligence insights from PatternDetector
   * @param {Object} currentAnalysis - Current analysis results
   * @param {HTMLElement} containerElement - Where to render the panel
   */
  render(insights, currentAnalysis, containerElement) {
    this.container = containerElement;

    const html = `
      <div class="insights-panel">
        <div class="insights-header">
          <h3>🧠 Real-Time Intelligence Insights</h3>
          <div class="insights-badge">${insights.complianceMetrics.totalAnalyses} analyses in database</div>
        </div>

        ${this.renderComparisonSection(insights, currentAnalysis)}
        ${this.renderTrendsSection(insights)}
        ${this.renderNovelIssuesSection(insights)}
        ${this.renderRecommendationsSection(insights)}
        ${this.renderMetricsSection(insights)}
      </div>
    `;

    containerElement.innerHTML = html;
    this.addStyles();
  }

  /**
   * Render comparison to historical average
   */
  renderComparisonSection(insights, currentAnalysis) {
    const currentIssueCount = currentAnalysis.summary.totalFindings;
    const avgIssues = insights.complianceMetrics.averageIssuesPerDoc;
    const difference = currentIssueCount - avgIssues;
    const percentDiff = avgIssues > 0 ? ((difference / avgIssues) * 100).toFixed(0) : 0;

    let comparisonClass = 'neutral';
    let comparisonIcon = '➖';
    let comparisonText = 'About average';

    if (difference > avgIssues * 0.2) {
      comparisonClass = 'worse';
      comparisonIcon = '📈';
      comparisonText = `${Math.abs(percentDiff)}% worse than average`;
    } else if (difference < -avgIssues * 0.2) {
      comparisonClass = 'better';
      comparisonIcon = '📉';
      comparisonText = `${Math.abs(percentDiff)}% better than average`;
    }

    return `
      <div class="insight-section comparison-section ${comparisonClass}">
        <div class="section-icon">${comparisonIcon}</div>
        <div class="section-content">
          <h4>Comparison to Your Average</h4>
          <div class="comparison-stats">
            <div class="stat">
              <span class="stat-label">This Document:</span>
              <span class="stat-value">${currentIssueCount} issues</span>
            </div>
            <div class="stat">
              <span class="stat-label">Your Average:</span>
              <span class="stat-value">${avgIssues.toFixed(1)} issues</span>
            </div>
            <div class="stat highlight">
              <span class="stat-label">Assessment:</span>
              <span class="stat-value">${comparisonText}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render trend analysis
   */
  renderTrendsSection(insights) {
    const trends = insights.trends;

    if (trends.status === 'insufficient_data') {
      return `
        <div class="insight-section trend-section">
          <div class="section-icon">📊</div>
          <div class="section-content">
            <h4>Trend Analysis</h4>
            <p class="info-text">Need at least 3 analyses to detect trends. Keep analyzing to unlock trend intelligence!</p>
          </div>
        </div>
      `;
    }

    let trendIcon = '➖';
    let trendClass = 'stable';

    if (trends.direction === 'WORSENING') {
      trendIcon = '⚠️';
      trendClass = 'worsening';
    } else if (trends.direction === 'IMPROVING') {
      trendIcon = '✅';
      trendClass = 'improving';
    }

    return `
      <div class="insight-section trend-section ${trendClass}">
        <div class="section-icon">${trendIcon}</div>
        <div class="section-content">
          <h4>Trend Analysis</h4>
          <p class="trend-message">${trends.message}</p>
          <p class="trend-recommendation"><strong>Recommendation:</strong> ${trends.recommendation}</p>
          <div class="trend-details">
            <span>Earlier average: ${trends.firstAvg} high-severity issues</span>
            <span>Recent average: ${trends.secondAvg} high-severity issues</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render novel issues detected
   */
  renderNovelIssuesSection(insights) {
    const novelIssues = insights.novelIssues;

    if (!novelIssues || novelIssues.length === 0) {
      return '';
    }

    return `
      <div class="insight-section novel-section">
        <div class="section-icon">🆕</div>
        <div class="section-content">
          <h4>Novel Issues Detected</h4>
          <p class="info-text">These issue types have not been seen in your previous analyses:</p>
          <ul class="novel-issues-list">
            ${novelIssues.map(issue => `
              <li class="novel-issue">
                <span class="novel-badge">${issue.severity}</span>
                <span class="novel-type">${issue.type}</span>
                <p class="novel-desc">${issue.message}</p>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  /**
   * Render actionable recommendations
   */
  renderRecommendationsSection(insights) {
    const recommendations = insights.recommendations;

    if (!recommendations || recommendations.length === 0) {
      return `
        <div class="insight-section recommendations-section">
          <div class="section-icon">💡</div>
          <div class="section-content">
            <h4>Recommendations</h4>
            <p class="info-text">No recurring patterns detected yet. The system will generate recommendations as you analyze more documents.</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="insight-section recommendations-section">
        <div class="section-icon">💡</div>
        <div class="section-content">
          <h4>Actionable Recommendations</h4>
          <p class="info-text">Based on recurring patterns in your analyses:</p>
          <div class="recommendations-list">
            ${recommendations.slice(0, 3).map((rec, index) => `
              <div class="recommendation-item priority-${rec.priority}">
                <div class="rec-header">
                  <span class="rec-badge">${rec.severity}</span>
                  <span class="rec-frequency">Occurred ${rec.frequency}x</span>
                </div>
                <div class="rec-issue">${rec.issue}</div>
                <div class="rec-recommendation">${rec.recommendation.replace(/\n/g, '<br>')}</div>
                <div class="rec-statute">Statute: ${rec.statute}</div>
              </div>
            `).join('')}
          </div>
          ${recommendations.length > 3 ? `
            <p class="more-recommendations">+ ${recommendations.length - 3} more recommendations available</p>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render compliance metrics
   */
  renderMetricsSection(insights) {
    const metrics = insights.complianceMetrics;

    return `
      <div class="insight-section metrics-section">
        <div class="section-icon">📈</div>
        <div class="section-content">
          <h4>Your Compliance Metrics</h4>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">${metrics.complianceRate}%</div>
              <div class="metric-label">Compliance Score</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${metrics.totalAnalyses}</div>
              <div class="metric-label">Total Analyses</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${metrics.criticalIssues}</div>
              <div class="metric-label">Critical Issues</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${metrics.highIssues}</div>
              <div class="metric-label">High Issues</div>
            </div>
          </div>
          ${metrics.mostCommonIssue !== 'None' ? `
            <div class="most-common">
              <strong>Most Common Issue:</strong> ${metrics.mostCommonIssue} (${metrics.mostCommonIssueCount} occurrences)
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  /**
   * Add CSS styles for insights panel
   */
  addStyles() {
    if (document.getElementById('insights-panel-styles')) return;

    const styles = `
      <style id="insights-panel-styles">
        .insights-panel {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .insights-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e2e8f0;
        }

        .insights-header h3 {
          margin: 0;
          color: #2d3748;
          font-size: 20px;
        }

        .insights-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .insight-section {
          display: flex;
          gap: 15px;
          padding: 20px;
          margin-bottom: 15px;
          border-radius: 8px;
          background: #f7fafc;
          border-left: 4px solid #cbd5e0;
        }

        .section-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .section-content {
          flex: 1;
        }

        .section-content h4 {
          margin: 0 0 10px 0;
          color: #2d3748;
          font-size: 16px;
        }

        .comparison-section.better {
          background: #f0fff4;
          border-left-color: #48bb78;
        }

        .comparison-section.worse {
          background: #fff5f5;
          border-left-color: #f56565;
        }

        .comparison-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          background: white;
          border-radius: 4px;
        }

        .stat.highlight {
          background: #edf2f7;
          font-weight: 600;
        }

        .stat-label {
          color: #718096;
          font-size: 14px;
        }

        .stat-value {
          color: #2d3748;
          font-weight: 600;
          font-size: 14px;
        }

        .trend-section.improving {
          background: #f0fff4;
          border-left-color: #48bb78;
        }

        .trend-section.worsening {
          background: #fff5f5;
          border-left-color: #f56565;
        }

        .trend-message {
          font-size: 14px;
          color: #2d3748;
          margin: 5px 0;
        }

        .trend-recommendation {
          font-size: 13px;
          color: #4a5568;
          margin: 10px 0;
          padding: 10px;
          background: white;
          border-radius: 4px;
        }

        .trend-details {
          display: flex;
          gap: 20px;
          margin-top: 10px;
          font-size: 12px;
          color: #718096;
        }

        .novel-section {
          background: #fffaf0;
          border-left-color: #ed8936;
        }

        .novel-issues-list {
          list-style: none;
          padding: 0;
          margin: 10px 0 0 0;
        }

        .novel-issue {
          padding: 10px;
          margin-bottom: 8px;
          background: white;
          border-radius: 4px;
        }

        .novel-badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          background: #fbd38d;
          color: #7c2d12;
          margin-right: 8px;
        }

        .novel-type {
          font-weight: 600;
          color: #2d3748;
        }

        .novel-desc {
          margin: 5px 0 0 0;
          font-size: 12px;
          color: #4a5568;
        }

        .recommendations-section {
          background: #e6fffa;
          border-left-color: #38b2ac;
        }

        .recommendations-list {
          margin-top: 10px;
        }

        .recommendation-item {
          background: white;
          padding: 15px;
          margin-bottom: 12px;
          border-radius: 8px;
          border-left: 3px solid #38b2ac;
        }

        .recommendation-item.priority-1 {
          border-left-color: #f56565;
        }

        .rec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .rec-badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          background: #feb2b2;
          color: #742a2a;
        }

        .rec-frequency {
          font-size: 12px;
          color: #718096;
          font-weight: 600;
        }

        .rec-issue {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 8px;
        }

        .rec-recommendation {
          font-size: 13px;
          color: #4a5568;
          line-height: 1.6;
          padding: 10px;
          background: #f7fafc;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .rec-statute {
          font-size: 12px;
          color: #718096;
          font-style: italic;
        }

        .more-recommendations {
          text-align: center;
          color: #718096;
          font-size: 13px;
          margin-top: 10px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
          margin-bottom: 15px;
        }

        .metric-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }

        .metric-value {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .metric-label {
          font-size: 11px;
          opacity: 0.9;
        }

        .most-common {
          padding: 10px;
          background: white;
          border-radius: 4px;
          font-size: 13px;
          color: #2d3748;
        }

        .info-text {
          font-size: 13px;
          color: #4a5568;
          margin: 5px 0;
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }

  /**
   * Clear the insights panel
   */
  clear() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

export default InsightsPanel;
