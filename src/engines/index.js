/**
 * YScript Rules-as-Code Engine - Module Exports
 *
 * Centralized export file for all YScript engine components
 *
 * @version 1.0.0
 * @jurisdiction Victoria, Australia
 * @module engines
 */

// Core Engine
export { YScriptEngine, createYScriptEngine, default as Engine } from './YScriptEngine.js';

// Statutory Rules
export {
  RoadSafetyActRules,
  CrimesActRules,
  EvidenceActRules,
  AllStatutoryRules,
  getRulesByStatute,
  getRulesBySection,
  getRulesByType,
  getCriticalRules,
  searchRules
} from './StatutoryRules.js';

// Integration Layer
export {
  YScriptDocumentAnalyzer,
  PresetAnalyzers,
  createAnalyzer,
  quickAnalysis,
  createAnalyzerWithToC,
  getImplementationGaps
} from './YScriptIntegration.js';

// Table of Provisions Navigator
export {
  TableOfProvisionsNavigator,
  createNavigator
} from './TableOfProvisionsNavigator.js';

/**
 * Quick start factory function
 *
 * Creates a fully configured analyzer ready for use
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.debug - Enable debug logging (default: false)
 * @param {boolean} options.autoLoadRules - Auto-load all rules (default: true)
 * @returns {YScriptDocumentAnalyzer} Configured analyzer instance
 *
 * @example
 * import { quickStart } from './engines/index.js';
 *
 * const analyzer = quickStart({ debug: true });
 * const results = analyzer.analyzeRoadSafetyCompliance(documentText);
 */
export function quickStart(options = {}) {
  const { createAnalyzer } = await import('./YScriptIntegration.js');
  return createAnalyzer(options);
}

/**
 * Analyze document with preset
 *
 * Convenience function for quick analysis using presets
 *
 * @param {string} preset - Preset name ('DrinkDriving', 'PreliminaryBreathTest', etc.)
 * @param {string} documentText - Document text to analyze
 * @returns {Object} Analysis results
 *
 * @example
 * import { analyze } from './engines/index.js';
 *
 * const results = analyze('DrinkDriving', documentText);
 * console.log(results.report);
 */
export async function analyze(preset, documentText) {
  const { quickAnalysis } = await import('./YScriptIntegration.js');
  return quickAnalysis(preset, documentText);
}

/**
 * Default export - YScriptEngine class
 */
export { YScriptEngine as default } from './YScriptEngine.js';
