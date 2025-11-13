/**
 * YScript Integration Module
 *
 * Provides high-level integration between YScriptEngine and the Forensic Legal Analyzer.
 * Simplifies document analysis with preset rule sets and helper functions.
 *
 * @version 1.0.0
 * @jurisdiction Victoria, Australia
 * @module YScriptIntegration
 */

import { YScriptEngine } from './YScriptEngine.js';
import {
  AllStatutoryRules,
  RoadSafetyActRules,
  CrimesActRules,
  EvidenceActRules,
  getRulesByStatute,
  getRulesBySection,
  getRulesByType,
  getCriticalRules
} from './StatutoryRules.js';

/**
 * YScript Document Analyzer
 *
 * High-level interface for analyzing documents against statutory rules
 */
export class YScriptDocumentAnalyzer {
  constructor(options = {}) {
    this.engine = new YScriptEngine();
    this.engine.setDebugMode(options.debug || false);
    this.autoLoadRules = options.autoLoadRules !== false; // default true

    if (this.autoLoadRules) {
      this.loadAllRules();
    }
  }

  /**
   * Load all statutory rules into the engine
   * @returns {Object} Loading results
   */
  loadAllRules() {
    return this.engine.registerRules(AllStatutoryRules);
  }

  /**
   * Load rules for a specific statute
   * @param {string} statute - Statute name (e.g., "Road Safety Act")
   * @returns {Object} Loading results
   */
  loadStatuteRules(statute) {
    const rules = getRulesByStatute(statute);
    return this.engine.registerRules(rules);
  }

  /**
   * Analyze document for Road Safety Act compliance
   * @param {string} documentText - Document text to analyze
   * @param {Object} options - Analysis options
   * @returns {Object} Analysis results
   */
  analyzeRoadSafetyCompliance(documentText, options = {}) {
    const { sections = null, includeReport = true } = options;

    let rulesToEvaluate = RoadSafetyActRules.map(r => r.ruleId);

    // Filter by specific sections if requested
    if (sections && Array.isArray(sections)) {
      rulesToEvaluate = RoadSafetyActRules
        .filter(r => sections.includes(r.section))
        .map(r => r.ruleId);
    }

    const results = this.engine.evaluateMultipleRules(rulesToEvaluate, documentText);

    if (includeReport) {
      results.report = this.engine.generateReport(results);
    }

    return results;
  }

  /**
   * Analyze document for specific statute section
   * @param {string} statute - Statute name
   * @param {string} section - Section number
   * @param {string} documentText - Document text to analyze
   * @returns {Object} Analysis results
   */
  analyzeSection(statute, section, documentText) {
    const rules = getRulesBySection(statute, section);

    if (rules.length === 0) {
      return {
        error: `No rules found for ${statute} s.${section}`,
        statute,
        section
      };
    }

    const ruleIds = rules.map(r => r.ruleId);
    const results = this.engine.evaluateMultipleRules(ruleIds, documentText);
    results.report = this.engine.generateReport(results);

    return results;
  }

  /**
   * Quick compliance check - just returns pass/fail
   * @param {string} ruleId - Rule ID to check
   * @param {string} documentText - Document text
   * @returns {boolean} Compliance status
   */
  quickCheck(ruleId, documentText) {
    const result = this.engine.evaluateRule(ruleId, documentText);
    return result.compliant;
  }

  /**
   * Find potential legal defects in document
   * @param {string} documentText - Document text to analyze
   * @returns {Object} Defect analysis
   */
  findDefects(documentText) {
    // Evaluate all critical rules
    const criticalRules = getCriticalRules();
    const criticalRuleIds = criticalRules.map(r => r.ruleId);

    const results = this.engine.evaluateMultipleRules(criticalRuleIds, documentText);

    const defects = {
      totalChecks: results.totalRules,
      defectsFound: results.nonCompliant,
      critical: [],
      warnings: [],
      passed: []
    };

    results.ruleResults.forEach(result => {
      if (!result.compliant) {
        const defect = {
          ruleId: result.ruleId,
          statute: `${result.statute} s.${result.section}`,
          type: result.type,
          consequence: result.outcome?.consequence,
          remedy: result.outcome?.remedy,
          missing: result.missing,
          evidence: result.evidence
        };

        if (result.outcome?.severity === 'CRITICAL') {
          defects.critical.push(defect);
        } else {
          defects.warnings.push(defect);
        }
      } else {
        defects.passed.push({
          ruleId: result.ruleId,
          statute: `${result.statute} s.${result.section}`,
          type: result.type
        });
      }
    });

    return defects;
  }

  /**
   * Analyze document and generate detailed forensic report
   * @param {string} documentText - Document text to analyze
   * @param {Object} options - Analysis options
   * @returns {Object} Comprehensive analysis report
   */
  generateForensicReport(documentText, options = {}) {
    const {
      includeAllRules = false,
      focusStatute = null,
      includeEvidence = true
    } = options;

    let rulesToEvaluate;

    if (focusStatute) {
      rulesToEvaluate = getRulesByStatute(focusStatute).map(r => r.ruleId);
    } else if (includeAllRules) {
      rulesToEvaluate = Array.from(this.engine.rules.keys());
    } else {
      // Default: evaluate all critical mandatory prerequisites
      rulesToEvaluate = AllStatutoryRules
        .filter(r => r.type === 'MANDATORY_PREREQUISITE' || r.type === 'MANDATORY_PROCEDURAL')
        .map(r => r.ruleId);
    }

    const results = this.engine.evaluateMultipleRules(rulesToEvaluate, documentText);

    // Build comprehensive report
    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        documentLength: documentText.length,
        rulesEvaluated: results.totalRules,
        analysisType: focusStatute || 'Multi-statute analysis'
      },
      summary: {
        overallCompliant: results.overallCompliant,
        compliantRules: results.compliant,
        nonCompliantRules: results.nonCompliant,
        criticalFailures: results.criticalFailures.length,
        warnings: results.warnings.length
      },
      criticalDefects: results.criticalFailures,
      warnings: results.warnings,
      detailedResults: results.ruleResults,
      formattedReport: this.engine.generateReport(results)
    };

    // Add evidence summary if requested
    if (includeEvidence) {
      report.evidenceSummary = this._buildEvidenceSummary(results.ruleResults);
    }

    return report;
  }

  /**
   * Build evidence summary from results
   * @private
   */
  _buildEvidenceSummary(ruleResults) {
    const evidenceSummary = {
      totalEvidenceItems: 0,
      byRule: {},
      allEvidence: []
    };

    ruleResults.forEach(result => {
      if (result.evidence && result.evidence.length > 0) {
        evidenceSummary.totalEvidenceItems += result.evidence.length;
        evidenceSummary.byRule[result.ruleId] = {
          statute: `${result.statute} s.${result.section}`,
          evidenceCount: result.evidence.length,
          evidence: result.evidence
        };
        evidenceSummary.allEvidence.push(...result.evidence);
      }
    });

    return evidenceSummary;
  }

  /**
   * Get suggested remedies for non-compliance
   * @param {Object} analysisResults - Results from analysis
   * @returns {Array<Object>} Suggested remedies
   */
  getSuggestedRemedies(analysisResults) {
    const remedies = [];

    if (analysisResults.criticalFailures) {
      analysisResults.criticalFailures.forEach(failure => {
        remedies.push({
          priority: 'CRITICAL',
          statute: failure.statute,
          ruleId: failure.ruleId,
          consequence: failure.consequence,
          remedy: failure.remedy
        });
      });
    }

    if (analysisResults.warnings) {
      analysisResults.warnings.forEach(warning => {
        const rule = this.engine.getRule(warning.ruleId);
        if (rule && rule.evaluation.onFailure.remedy) {
          remedies.push({
            priority: 'WARNING',
            statute: warning.statute,
            ruleId: warning.ruleId,
            details: warning.details,
            remedy: rule.evaluation.onFailure.remedy
          });
        }
      });
    }

    return remedies;
  }

  /**
   * Compare two documents against same rule set
   * @param {string} document1 - First document text
   * @param {string} document2 - Second document text
   * @param {Array<string>} ruleIds - Rules to evaluate
   * @returns {Object} Comparison results
   */
  compareDocuments(document1, document2, ruleIds) {
    const results1 = this.engine.evaluateMultipleRules(ruleIds, document1);
    const results2 = this.engine.evaluateMultipleRules(ruleIds, document2);

    return {
      document1: results1,
      document2: results2,
      comparison: {
        doc1CompliantCount: results1.compliant,
        doc2CompliantCount: results2.compliant,
        doc1CriticalFailures: results1.criticalFailures.length,
        doc2CriticalFailures: results2.criticalFailures.length,
        betterCompliance: results1.compliant > results2.compliant ? 'document1' : 'document2',
        differencesCount: Math.abs(results1.compliant - results2.compliant)
      }
    };
  }

  /**
   * Get engine statistics
   * @returns {Object} Engine statistics
   */
  getStatistics() {
    return {
      rulesLoaded: this.engine.rules.size,
      evaluationsPerformed: this.engine.evaluationHistory.length,
      rulesByStatute: this._getRuleStatistics(),
      history: this.engine.getHistory()
    };
  }

  /**
   * Get rule statistics by statute
   * @private
   */
  _getRuleStatistics() {
    const stats = {};
    const allRules = this.engine.getRules();

    allRules.forEach(rule => {
      if (!stats[rule.statute]) {
        stats[rule.statute] = {
          total: 0,
          byType: {}
        };
      }
      stats[rule.statute].total++;

      if (!stats[rule.statute].byType[rule.type]) {
        stats[rule.statute].byType[rule.type] = 0;
      }
      stats[rule.statute].byType[rule.type]++;
    });

    return stats;
  }

  /**
   * Export engine state and results
   * @returns {Object} Exportable state
   */
  exportState() {
    return {
      rules: this.engine.exportRules(),
      history: this.engine.getHistory(),
      statistics: this.getStatistics()
    };
  }

  /**
   * Get reference to underlying engine
   * @returns {YScriptEngine} Engine instance
   */
  getEngine() {
    return this.engine;
  }
}

/**
 * Preset Analyzers for Common Scenarios
 */
export const PresetAnalyzers = {
  /**
   * Road Safety Act - Drink Driving Analysis
   */
  DrinkDriving: {
    name: 'Drink Driving Analysis',
    statutes: ['Road Safety Act 1986'],
    ruleIds: [
      'RSA_s49_1_reason_to_believe',
      'RSA_s49_1_articulation_of_belief',
      'RSA_s55_1_evidentiary_test_prerequisite',
      'RSA_s55D_proper_administration',
      'RSA_s56_right_to_medical_practitioner'
    ],
    analyze(documentText) {
      const analyzer = new YScriptDocumentAnalyzer();
      return analyzer.engine.evaluateMultipleRules(this.ruleIds, documentText);
    }
  },

  /**
   * Preliminary Breath Test Analysis
   */
  PreliminaryBreathTest: {
    name: 'Preliminary Breath Test Analysis',
    statutes: ['Road Safety Act 1986'],
    ruleIds: [
      'RSA_s49_1_reason_to_believe',
      'RSA_s49_1_articulation_of_belief'
    ],
    analyze(documentText) {
      const analyzer = new YScriptDocumentAnalyzer();
      return analyzer.engine.evaluateMultipleRules(this.ruleIds, documentText);
    }
  },

  /**
   * Evidentiary Breath Test Analysis
   */
  EvidentiaryyBreathTest: {
    name: 'Evidentiary Breath Test Analysis',
    statutes: ['Road Safety Act 1986'],
    ruleIds: [
      'RSA_s55_1_evidentiary_test_prerequisite',
      'RSA_s55D_proper_administration',
      'RSA_s56_right_to_medical_practitioner'
    ],
    analyze(documentText) {
      const analyzer = new YScriptDocumentAnalyzer();
      return analyzer.engine.evaluateMultipleRules(this.ruleIds, documentText);
    }
  },

  /**
   * Arrest Lawfulness Analysis
   */
  ArrestLawfulness: {
    name: 'Arrest Lawfulness Analysis',
    statutes: ['Crimes Act 1958'],
    ruleIds: [
      'CRIMES_s458_arrest_reasonable_grounds',
      'GENERIC_caution_before_questions'
    ],
    analyze(documentText) {
      const analyzer = new YScriptDocumentAnalyzer();
      return analyzer.engine.evaluateMultipleRules(this.ruleIds, documentText);
    }
  }
};

/**
 * Factory function to create a new analyzer
 * @param {Object} options - Configuration options
 * @returns {YScriptDocumentAnalyzer} New analyzer instance
 */
export function createAnalyzer(options = {}) {
  return new YScriptDocumentAnalyzer(options);
}

/**
 * Quick analysis function - analyze document with preset
 * @param {string} preset - Preset name (e.g., 'DrinkDriving')
 * @param {string} documentText - Document text
 * @returns {Object} Analysis results
 */
export function quickAnalysis(preset, documentText) {
  if (!PresetAnalyzers[preset]) {
    throw new Error(`Unknown preset: ${preset}. Available: ${Object.keys(PresetAnalyzers).join(', ')}`);
  }

  return PresetAnalyzers[preset].analyze(documentText);
}

/**
 * Table of Provisions Integration
 *
 * Helper functions to integrate ToC navigation with YScript engine
 */

/**
 * Create analyzer with ToC integration
 * @param {Object} options - Configuration options
 * @param {boolean} options.loadToC - Load Table of Provisions (default: true)
 * @returns {Promise<Object>} Analyzer and navigator instances
 */
export async function createAnalyzerWithToC(options = {}) {
  const analyzer = createAnalyzer(options);

  if (options.loadToC !== false) {
    try {
      const { createNavigator } = await import('./TableOfProvisionsNavigator.js');
      const navigator = createNavigator();
      await navigator.init();

      return {
        analyzer,
        navigator,
        analyzeWithContext: (documentText, sectionNumber) => {
          const section = navigator.getSection(sectionNumber);
          const relatedSections = navigator.getRelatedSections(sectionNumber);
          const hierarchy = navigator.getSectionHierarchy(sectionNumber);

          // Get rules for this section
          const implStatus = navigator.getImplementationStatus(sectionNumber);

          if (!implStatus) {
            return {
              error: `No rules implemented for section ${sectionNumber}`,
              section: section,
              hierarchy: hierarchy,
              relatedSections: relatedSections
            };
          }

          // Analyze with implemented rules
          const results = analyzer.engine.evaluateMultipleRules(implStatus.ruleIds, documentText);

          return {
            ...results,
            section: section,
            hierarchy: hierarchy,
            relatedSections: relatedSections,
            navigationPath: navigator.getNavigationPath(sectionNumber)
          };
        }
      };
    } catch (error) {
      console.warn('Could not load Table of Provisions Navigator:', error);
      return { analyzer, navigator: null };
    }
  }

  return { analyzer, navigator: null };
}

/**
 * Get implementation gaps - sections without rules
 * @param {Object} navigator - ToC Navigator instance
 * @param {Array} currentRules - Current rules array
 * @returns {Object} Gap analysis
 */
export function getImplementationGaps(navigator, currentRules) {
  const implementedSections = new Set();

  // Extract section numbers from current rules
  currentRules.forEach(rule => {
    const sectionMatch = rule.section.match(/^(\d+[A-Z]*)/);
    if (sectionMatch) {
      implementedSections.add(sectionMatch[1]);
    }
  });

  // Get key provisions without implementation
  const keyProvisions = navigator.getKeyProvisions();
  const gaps = keyProvisions.filter(section =>
    !implementedSections.has(section.number)
  );

  return {
    totalKeyProvisions: keyProvisions.length,
    implemented: keyProvisions.length - gaps.length,
    gaps: gaps.length,
    gapSections: gaps.map(s => ({
      number: s.number,
      title: s.title,
      part: s.part,
      division: s.division
    }))
  };
}

/**
 * Default export
 */
export default {
  YScriptDocumentAnalyzer,
  PresetAnalyzers,
  createAnalyzer,
  quickAnalysis,
  createAnalyzerWithToC,
  getImplementationGaps
};
