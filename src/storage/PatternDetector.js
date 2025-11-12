/**
 * Pattern Detector - Enhanced with Real-Time Intelligence
 *
 * Machine learning-like pattern detection for recurring legal issues
 * and common defects across analyzed documents. Learns from outcomes
 * and provides actionable intelligence.
 *
 * @version 2.0.0
 */

export class PatternDetector {
  constructor() {
    this.patterns = new Map();
    this.threshold = 3; // Minimum occurrences to consider a pattern
    this.successRates = new Map(); // Track which defects lead to successful outcomes
  }

  /**
   * Analyze patterns across all historical analyses
   * @param {Array} allAnalyses - All analysis records from database
   * @returns {Object} Comprehensive pattern analysis
   */
  async analyzePatterns(allAnalyses) {
    return {
      recurring: await this.findRecurringDefects(allAnalyses),
      trends: await this.analyzeTrends(allAnalyses),
      recommendations: await this.generateRecommendations(allAnalyses),
      novelIssues: await this.identifyNovelIssues(allAnalyses),
      complianceMetrics: await this.calculateCompliance(allAnalyses)
    };
  }

  /**
   * Find recurring defects across analyses
   * @param {Array} analyses - Historical analyses
   * @returns {Array} Recurring defect patterns
   */
  async findRecurringDefects(analyses) {
    const defectCounts = {};

    analyses.forEach(analysis => {
      const findings = analysis.findings || analysis.phases?.presetAnalysis?.flatMap(p => p.findings || []) || [];

      findings.forEach(defect => {
        const key = `${defect.type}|${defect.statute || 'unknown'}`;
        if (!defectCounts[key]) {
          defectCounts[key] = {
            type: defect.type,
            statute: defect.statute,
            severity: defect.severity,
            count: 0,
            firstSeen: analysis.timestamp,
            lastSeen: analysis.timestamp,
            descriptions: [],
            analysisIds: []
          };
        }
        defectCounts[key].count++;
        defectCounts[key].lastSeen = analysis.timestamp;
        defectCounts[key].descriptions.push(defect.description);
        defectCounts[key].analysisIds.push(analysis.id);
      });
    });

    // Return defects that occurred 3+ times
    return Object.values(defectCounts)
      .filter(d => d.count >= 3)
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Analyze trends over time
   * @param {Array} analyses - Historical analyses
   * @returns {Object} Trend analysis
   */
  async analyzeTrends(analyses) {
    if (analyses.length < 3) {
      return {
        status: 'insufficient_data',
        message: 'Need at least 3 analyses to detect trends',
        analysisCount: analyses.length
      };
    }

    // Get last 5 analyses (or all if less than 5)
    const recent = analyses.slice(-5);
    const severityCounts = recent.map(a => {
      const findings = a.findings || a.phases?.presetAnalysis?.flatMap(p => p.findings || []) || [];
      return findings.filter(d => d.severity === 'HIGH' || d.severity === 'CRITICAL').length;
    });

    // Calculate trend
    const firstHalf = severityCounts.slice(0, Math.floor(severityCounts.length / 2));
    const secondHalf = severityCounts.slice(Math.floor(severityCounts.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (secondAvg > firstAvg * 1.2) {
      return {
        direction: 'WORSENING',
        message: `⚠️ High-severity issues increased ${Math.round((secondAvg / firstAvg - 1) * 100)}% in recent analyses`,
        recommendation: 'Systematic review of documentation processes recommended',
        severity: 'HIGH',
        firstAvg: firstAvg.toFixed(1),
        secondAvg: secondAvg.toFixed(1)
      };
    } else if (secondAvg < firstAvg * 0.8 && firstAvg > 0) {
      return {
        direction: 'IMPROVING',
        message: `✅ High-severity issues decreased ${Math.round((1 - secondAvg / firstAvg) * 100)}%`,
        recommendation: 'Current processes appear effective - maintain practices',
        severity: 'LOW',
        firstAvg: firstAvg.toFixed(1),
        secondAvg: secondAvg.toFixed(1)
      };
    }

    return {
      direction: 'STABLE',
      message: 'Issue frequency stable',
      recommendation: 'Continue monitoring',
      severity: 'MEDIUM',
      firstAvg: firstAvg.toFixed(1),
      secondAvg: secondAvg.toFixed(1)
    };
  }

  /**
   * Generate actionable recommendations based on patterns
   * @param {Array} analyses - Historical analyses
   * @returns {Array} Specific recommendations
   */
  async generateRecommendations(analyses) {
    const recurring = await this.findRecurringDefects(analyses);
    const recommendations = [];

    recurring.forEach(defect => {
      // s.55D Directions Language
      if (defect.type && defect.type.toLowerCase().includes('55d') &&
          defect.type.toLowerCase().includes('directions')) {
        recommendations.push({
          issue: defect.type,
          frequency: defect.count,
          severity: 'HIGH',
          priority: 1,
          recommendation: `CREATE MANDATORY CHECKLIST: After ${defect.count} occurrences, implement checklist requiring explicit documentation of:\n` +
                        `1. Oral directions provided to subject (s.55D(2))\n` +
                        `2. Written directions provided if subject illiterate\n` +
                        `3. Officer confirms subject understood directions\n` +
                        `4. Time directions given recorded\n` +
                        `5. Subject's response to directions noted`,
          statute: 'Road Safety Act 1986 s.55D'
        });
      }

      // s.49 Reason to Believe
      if (defect.type && defect.type.toLowerCase().includes('49') &&
          defect.type.toLowerCase().includes('reason to believe')) {
        recommendations.push({
          issue: defect.type,
          frequency: defect.count,
          severity: 'HIGH',
          priority: 1,
          recommendation: `TRAINING REQUIRED: Recurring failure to document subjective belief formation. ` +
                        `Train officers to document:\n` +
                        `- Specific observations leading to belief\n` +
                        `- Which s.49(1)(a)-(h) indicator(s) observed\n` +
                        `- Time belief formed\n` +
                        `- Officer's exact words forming belief`,
          statute: 'Road Safety Act 1986 s.49'
        });
      }

      // s.464 Caution Language
      if (defect.type && defect.type.toLowerCase().includes('464') &&
          defect.type.toLowerCase().includes('caution')) {
        recommendations.push({
          issue: defect.type,
          frequency: defect.count,
          severity: 'CRITICAL',
          priority: 1,
          recommendation: `CRITICAL PROCESS FAILURE: s.464 caution defects appearing ${defect.count} times. ` +
                        `Implement:\n` +
                        `- Pre-printed caution cards for officers\n` +
                        `- Mandatory verbatim recording of caution\n` +
                        `- Supervisor review before interview commencement\n` +
                        `- Body-worn camera verification of caution delivery`,
          statute: 'Crimes Act 1958 s.464'
        });
      }

      // Generic high-frequency issues
      if (!recommendations.find(r => r.issue === defect.type) && defect.count >= 5) {
        recommendations.push({
          issue: defect.type,
          frequency: defect.count,
          severity: defect.severity,
          priority: 2,
          recommendation: `Pattern detected: "${defect.type}" has occurred ${defect.count} times. ` +
                        `Review procedures related to ${defect.statute || 'this requirement'} to identify systemic causes.`,
          statute: defect.statute || 'Unknown'
        });
      }
    });

    return recommendations.sort((a, b) => a.priority - b.priority || b.frequency - a.frequency);
  }

  /**
   * Identify novel issues not seen before
   * @param {Array} analyses - Historical analyses
   * @returns {Array} Novel issues
   */
  async identifyNovelIssues(analyses) {
    if (analyses.length === 0) return [];

    const latestAnalysis = analyses[analyses.length - 1];
    const latestFindings = latestAnalysis.findings ||
                          latestAnalysis.phases?.presetAnalysis?.flatMap(p => p.findings || []) || [];

    // Get all previous issue types
    const previousIssueTypes = new Set();
    analyses.slice(0, -1).forEach(analysis => {
      const findings = analysis.findings || analysis.phases?.presetAnalysis?.flatMap(p => p.findings || []) || [];
      findings.forEach(f => previousIssueTypes.add(f.type));
    });

    // Find issues in latest that weren't in previous
    const novelIssues = latestFindings.filter(finding =>
      !previousIssueTypes.has(finding.type)
    );

    return novelIssues.map(issue => ({
      type: issue.type,
      severity: issue.severity,
      description: issue.description,
      statute: issue.statute,
      isNew: true,
      message: `⚠️ NEW ISSUE TYPE: "${issue.type}" - First time detected in your analyses`
    }));
  }

  /**
   * Calculate compliance metrics
   * @param {Array} analyses - Historical analyses
   * @returns {Object} Compliance statistics
   */
  async calculateCompliance(analyses) {
    if (analyses.length === 0) {
      return {
        averageIssuesPerDoc: 0,
        complianceRate: 100,
        mostCommonIssue: 'None',
        totalAnalyses: 0
      };
    }

    let totalIssues = 0;
    let criticalCount = 0;
    let highCount = 0;
    const issueTypeCounts = {};

    analyses.forEach(analysis => {
      const findings = analysis.findings || analysis.phases?.presetAnalysis?.flatMap(p => p.findings || []) || [];
      totalIssues += findings.length;

      findings.forEach(f => {
        if (f.severity === 'CRITICAL') criticalCount++;
        if (f.severity === 'HIGH') highCount++;
        issueTypeCounts[f.type] = (issueTypeCounts[f.type] || 0) + 1;
      });
    });

    const mostCommonIssue = Object.entries(issueTypeCounts)
      .sort((a, b) => b[1] - a[1])[0];

    const avgIssues = (totalIssues / analyses.length).toFixed(1);
    const complianceScore = Math.max(0, 100 - (avgIssues * 5)); // Rough compliance score

    return {
      totalAnalyses: analyses.length,
      totalIssues: totalIssues,
      averageIssuesPerDoc: parseFloat(avgIssues),
      complianceRate: parseFloat(complianceScore.toFixed(1)),
      criticalIssues: criticalCount,
      highIssues: highCount,
      mostCommonIssue: mostCommonIssue ? mostCommonIssue[0] : 'None',
      mostCommonIssueCount: mostCommonIssue ? mostCommonIssue[1] : 0
    };
  }

  /**
   * Analyze findings for patterns (legacy method - kept for compatibility)
   * @param {Array} findings - Analysis findings
   * @returns {Array} Detected patterns
   */
  detectPatterns(findings) {
    const detectedPatterns = [];

    // Group findings by type
    const findingsByType = new Map();
    findings.forEach(finding => {
      const type = finding.type || 'Unknown';
      if (!findingsByType.has(type)) {
        findingsByType.set(type, []);
      }
      findingsByType.get(type).push(finding);
    });

    // Analyze each group
    findingsByType.forEach((groupFindings, type) => {
      if (groupFindings.length >= this.threshold) {
        detectedPatterns.push({
          type: 'Recurring Issue',
          category: type,
          frequency: groupFindings.length,
          description: `"${type}" appears ${groupFindings.length} times in document`,
          significance: this.assessSignificance(groupFindings.length),
          examples: groupFindings.slice(0, 3)
        });
      }
    });

    // Detect temporal patterns
    detectedPatterns.push(...this.detectTemporalPatterns(findings));

    // Detect severity patterns
    detectedPatterns.push(...this.detectSeverityPatterns(findings));

    return detectedPatterns;
  }

  /**
   * Detect temporal patterns in findings
   * @param {Array} findings - Analysis findings
   * @returns {Array} Temporal patterns
   */
  detectTemporalPatterns(findings) {
    const patterns = [];

    // Count temporal references
    const temporalFindings = findings.filter(f =>
      f.type && f.type.toLowerCase().includes('temporal')
    );

    if (temporalFindings.length > 5) {
      patterns.push({
        type: 'Temporal Pattern',
        category: 'High Temporal Reference Density',
        frequency: temporalFindings.length,
        description: 'Document contains many temporal references - timeline analysis recommended',
        significance: 'MEDIUM'
      });
    }

    return patterns;
  }

  /**
   * Detect severity patterns
   * @param {Array} findings - Analysis findings
   * @returns {Array} Severity patterns
   */
  detectSeverityPatterns(findings) {
    const patterns = [];

    // Count by severity
    const severityCounts = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0
    };

    findings.forEach(finding => {
      const severity = finding.severity ? finding.severity.toUpperCase() : 'LOW';
      if (severityCounts.hasOwnProperty(severity)) {
        severityCounts[severity]++;
      }
    });

    // Detect critical issue clusters
    if (severityCounts.CRITICAL > 3) {
      patterns.push({
        type: 'Severity Pattern',
        category: 'Multiple Critical Issues',
        frequency: severityCounts.CRITICAL,
        description: `Document has ${severityCounts.CRITICAL} CRITICAL issues - urgent review required`,
        significance: 'CRITICAL'
      });
    }

    return patterns;
  }

  /**
   * Learn from analysis results
   * @param {Object} analysisResults - Complete analysis results
   */
  learn(analysisResults) {
    if (!analysisResults.findings) return;

    // Extract patterns
    const patterns = this.detectPatterns(analysisResults.findings);

    // Store patterns
    patterns.forEach(pattern => {
      const key = `${pattern.type}:${pattern.category}`;
      if (this.patterns.has(key)) {
        const existing = this.patterns.get(key);
        existing.count++;
        existing.totalFrequency += pattern.frequency;
      } else {
        this.patterns.set(key, {
          ...pattern,
          count: 1,
          totalFrequency: pattern.frequency,
          firstSeen: new Date().toISOString()
        });
      }
    });
  }

  /**
   * Get learned patterns
   * @returns {Array} All learned patterns
   */
  getLearnedPatterns() {
    return Array.from(this.patterns.values())
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Assess pattern significance
   * @param {number} frequency - Pattern frequency
   * @returns {string} Significance level
   */
  assessSignificance(frequency) {
    if (frequency >= 10) return 'CRITICAL';
    if (frequency >= 7) return 'HIGH';
    if (frequency >= 5) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Learn from court outcome
   * @param {string} analysisId - Analysis ID
   * @param {Object} outcome - Court outcome details
   */
  async learnFromOutcome(analysisId, outcome) {
    // Update success rates for defects that were raised
    if (outcome.defectsRaised && Array.isArray(outcome.defectsRaised)) {
      outcome.defectsRaised.forEach(defectType => {
        if (!this.successRates.has(defectType)) {
          this.successRates.set(defectType, {
            type: defectType,
            totalRaised: 0,
            successful: 0,
            unsuccessful: 0,
            outcomes: []
          });
        }

        const stats = this.successRates.get(defectType);
        stats.totalRaised++;

        if (outcome.outcome === 'evidence excluded' ||
            outcome.outcome === 'application successful' ||
            outcome.outcome === 'case dismissed') {
          stats.successful++;
        } else {
          stats.unsuccessful++;
        }

        stats.outcomes.push({
          date: outcome.date,
          outcome: outcome.outcome,
          courtResponse: outcome.courtResponse,
          effectiveArguments: outcome.effectiveArguments
        });
      });
    }
  }

  /**
   * Get success rates for defect types
   * @returns {Array} Success rate statistics
   */
  getSuccessRates() {
    return Array.from(this.successRates.values())
      .map(stats => ({
        ...stats,
        successRate: stats.totalRaised > 0 ?
                    ((stats.successful / stats.totalRaised) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.successRate - a.successRate);
  }

  /**
   * Get prioritized defects based on success rates
   * @param {Array} currentDefects - Defects found in current analysis
   * @returns {Array} Prioritized defects with success rate info
   */
  prioritizeDefects(currentDefects) {
    return currentDefects.map(defect => {
      const successInfo = this.successRates.get(defect.type);

      if (successInfo && successInfo.totalRaised >= 3) {
        return {
          ...defect,
          hasHistoricalData: true,
          successRate: ((successInfo.successful / successInfo.totalRaised) * 100).toFixed(1),
          timesRaised: successInfo.totalRaised,
          recommendation: successInfo.successRate > 60 ?
            '✅ High success rate in court - strong defect to raise' :
            '⚠️ Lower success rate - ensure strong evidence before raising'
        };
      }

      return {
        ...defect,
        hasHistoricalData: false,
        recommendation: 'ℹ️ No historical outcome data for this defect type'
      };
    }).sort((a, b) => {
      // Sort by success rate if available, otherwise by severity
      if (a.hasHistoricalData && b.hasHistoricalData) {
        return parseFloat(b.successRate) - parseFloat(a.successRate);
      }
      return 0;
    });
  }

  /**
   * Reset learned patterns
   */
  reset() {
    this.patterns.clear();
    this.successRates.clear();
  }
}

export default PatternDetector;
