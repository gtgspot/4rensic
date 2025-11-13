/**
 * YScript Rules-as-Code Preprocessing Engine
 *
 * A sophisticated backend preprocessing system that converts Victorian statutes
 * into machine-executable rules and evaluates uploaded documents against these
 * rules programmatically.
 *
 * @version 1.0.0
 * @jurisdiction Victoria, Australia
 * @module YScriptEngine
 */

/**
 * YScript Rule Engine - Core interpreter for rules-as-code
 *
 * Parses statute definitions into executable rule objects and evaluates
 * document text against rule conditions programmatically.
 */
export class YScriptEngine {
  constructor() {
    this.rules = new Map();
    this.evaluationHistory = [];
    this.debugMode = false;
  }

  /**
   * Enable debug logging
   * @param {boolean} enabled - Whether to enable debug mode
   */
  setDebugMode(enabled = true) {
    this.debugMode = enabled;
  }

  /**
   * Log debug messages
   * @private
   */
  _debug(...args) {
    if (this.debugMode) {
      console.log('[YScript]', ...args);
    }
  }

  /**
   * Register a rule in the engine
   * @param {Object} rule - Rule definition object
   * @returns {boolean} Success status
   */
  registerRule(rule) {
    try {
      this._validateRule(rule);
      this.rules.set(rule.ruleId, rule);
      this._debug(`✓ Registered rule: ${rule.ruleId}`);
      return true;
    } catch (error) {
      console.error(`✗ Failed to register rule ${rule.ruleId}:`, error.message);
      return false;
    }
  }

  /**
   * Register multiple rules at once
   * @param {Array<Object>} rules - Array of rule definition objects
   * @returns {Object} Registration results
   */
  registerRules(rules) {
    const results = {
      total: rules.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    rules.forEach(rule => {
      const success = this.registerRule(rule);
      if (success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push(`Failed to register rule: ${rule.ruleId}`);
      }
    });

    return results;
  }

  /**
   * Validate rule structure
   * @private
   * @param {Object} rule - Rule to validate
   * @throws {Error} If rule is invalid
   */
  _validateRule(rule) {
    const requiredFields = ['ruleId', 'statute', 'section', 'type', 'condition', 'evaluation'];

    for (const field of requiredFields) {
      if (!rule[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!rule.condition.operator && !rule.condition.element) {
      throw new Error('Condition must have either operator or element');
    }

    if (!rule.evaluation.onSuccess || !rule.evaluation.onFailure) {
      throw new Error('Evaluation must define both onSuccess and onFailure');
    }
  }

  /**
   * Evaluate a document against a specific rule
   * @param {string} ruleId - ID of the rule to evaluate
   * @param {string} documentText - Document text to evaluate
   * @returns {Object} Evaluation result with evidence
   */
  evaluateRule(ruleId, documentText) {
    const rule = this.rules.get(ruleId);

    if (!rule) {
      return {
        error: `Rule not found: ${ruleId}`,
        availableRules: Array.from(this.rules.keys())
      };
    }

    this._debug(`\n━━━ Evaluating Rule: ${ruleId} ━━━`);
    this._debug(`Statute: ${rule.statute} s.${rule.section}`);
    this._debug(`Type: ${rule.type}`);

    const startTime = Date.now();

    // Normalize text for analysis
    const normalizedText = this._normalizeText(documentText);

    // Evaluate the condition
    const conditionResult = this._evaluateCondition(rule.condition, normalizedText, documentText);

    const evaluationTime = Date.now() - startTime;

    // Build result based on success/failure
    const result = {
      ruleId: rule.ruleId,
      statute: rule.statute,
      section: rule.section,
      type: rule.type,
      compliant: conditionResult.satisfied,
      evaluationTime: `${evaluationTime}ms`,
      timestamp: new Date().toISOString(),
      ...conditionResult
    };

    // Apply evaluation outcome
    if (conditionResult.satisfied) {
      result.outcome = {
        ...rule.evaluation.onSuccess,
        details: conditionResult.details
      };
    } else {
      result.outcome = {
        ...rule.evaluation.onFailure,
        details: conditionResult.details,
        missing: conditionResult.missing
      };
    }

    // Store in history
    this.evaluationHistory.push({
      ruleId,
      timestamp: result.timestamp,
      compliant: result.compliant,
      evaluationTime
    });

    this._debug(`Result: ${result.compliant ? '✓ COMPLIANT' : '✗ NON-COMPLIANT'}`);
    this._debug(`Time: ${evaluationTime}ms\n`);

    return result;
  }

  /**
   * Evaluate a condition (recursive for nested conditions)
   * @private
   * @param {Object} condition - Condition to evaluate
   * @param {string} normalizedText - Normalized text for keyword matching
   * @param {string} originalText - Original text for evidence extraction
   * @returns {Object} Evaluation result with evidence
   */
  _evaluateCondition(condition, normalizedText, originalText) {
    // Single element condition
    if (condition.element) {
      return this._evaluateElement(condition, normalizedText, originalText);
    }

    // Logical operator condition
    if (condition.operator) {
      return this._evaluateLogicalOperator(condition, normalizedText, originalText);
    }

    return {
      satisfied: false,
      details: 'Invalid condition structure',
      missing: ['Valid condition definition']
    };
  }

  /**
   * Evaluate a single element (keyword matching)
   * @private
   */
  _evaluateElement(condition, normalizedText, originalText) {
    const { element, keywords, required, type, options } = condition;

    let searchTerms = keywords || options || [];
    if (typeof searchTerms === 'string') {
      searchTerms = [searchTerms];
    }

    const evidence = [];
    const foundTerms = [];
    const missingTerms = [];

    for (const term of searchTerms) {
      const normalizedTerm = term.toLowerCase();
      const matches = this._findMatches(normalizedTerm, normalizedText, originalText);

      if (matches.length > 0) {
        foundTerms.push(term);
        evidence.push(...matches);
      } else if (required) {
        missingTerms.push(term);
      }
    }

    const satisfied = foundTerms.length > 0 || !required;

    return {
      satisfied,
      element: element || type,
      foundTerms,
      missingTerms: missingTerms.length > 0 ? missingTerms : undefined,
      evidence: evidence.length > 0 ? evidence : undefined,
      details: satisfied
        ? `Found: ${foundTerms.join(', ')}`
        : `Missing: ${missingTerms.join(', ')}`,
      missing: satisfied ? [] : missingTerms
    };
  }

  /**
   * Evaluate logical operators (AND, OR, NOT, IF-THEN)
   * @private
   */
  _evaluateLogicalOperator(condition, normalizedText, originalText) {
    const { operator, requirements, conditions, options, antecedent, consequent } = condition;

    switch (operator) {
      case 'AND':
        return this._evaluateAND(requirements || conditions, normalizedText, originalText);

      case 'OR':
        return this._evaluateOR(requirements || conditions || options, normalizedText, originalText);

      case 'NOT':
        return this._evaluateNOT(requirements || conditions, normalizedText, originalText);

      case 'IF-THEN':
      case 'IMPLIES':
        return this._evaluateIFTHEN(antecedent, consequent, normalizedText, originalText);

      default:
        return {
          satisfied: false,
          details: `Unsupported operator: ${operator}`,
          missing: ['Valid operator']
        };
    }
  }

  /**
   * Evaluate AND operator - all conditions must be satisfied
   * @private
   */
  _evaluateAND(requirements, normalizedText, originalText) {
    const results = [];
    const evidence = [];
    const missing = [];

    for (const req of requirements) {
      const result = this._evaluateCondition(req, normalizedText, originalText);
      results.push(result);

      if (result.evidence) {
        evidence.push(...result.evidence);
      }

      if (!result.satisfied) {
        missing.push(...(result.missing || [result.element || 'Unknown requirement']));
      }
    }

    const satisfied = results.every(r => r.satisfied);

    return {
      satisfied,
      operator: 'AND',
      subResults: results,
      evidence: evidence.length > 0 ? evidence : undefined,
      missing: missing.length > 0 ? missing : undefined,
      details: satisfied
        ? `All ${results.length} requirements satisfied`
        : `Failed ${results.filter(r => !r.satisfied).length} of ${results.length} requirements`
    };
  }

  /**
   * Evaluate OR operator - at least one condition must be satisfied
   * @private
   */
  _evaluateOR(requirements, normalizedText, originalText) {
    // Handle array of strings (options)
    if (requirements.every(r => typeof r === 'string')) {
      return this._evaluateElement(
        { options: requirements, required: true, type: 'OR_OPTIONS' },
        normalizedText,
        originalText
      );
    }

    // Handle array of conditions
    const results = [];
    const evidence = [];

    for (const req of requirements) {
      const result = this._evaluateCondition(req, normalizedText, originalText);
      results.push(result);

      if (result.evidence) {
        evidence.push(...result.evidence);
      }
    }

    const satisfied = results.some(r => r.satisfied);
    const satisfiedResults = results.filter(r => r.satisfied);

    return {
      satisfied,
      operator: 'OR',
      subResults: results,
      evidence: evidence.length > 0 ? evidence : undefined,
      details: satisfied
        ? `Satisfied ${satisfiedResults.length} of ${results.length} alternative requirements`
        : `None of ${results.length} alternative requirements satisfied`,
      missing: satisfied ? [] : ['At least one alternative requirement']
    };
  }

  /**
   * Evaluate NOT operator - condition must NOT be satisfied
   * @private
   */
  _evaluateNOT(requirement, normalizedText, originalText) {
    const conditions = Array.isArray(requirement) ? requirement : [requirement];
    const results = [];

    for (const req of conditions) {
      const result = this._evaluateCondition(req, normalizedText, originalText);
      results.push(result);
    }

    const anySatisfied = results.some(r => r.satisfied);
    const satisfied = !anySatisfied;

    return {
      satisfied,
      operator: 'NOT',
      subResults: results,
      details: satisfied
        ? 'Prohibited condition not present (correct)'
        : 'Prohibited condition found (violation)',
      missing: satisfied ? [] : ['Absence of prohibited condition']
    };
  }

  /**
   * Evaluate IF-THEN operator - if antecedent is true, consequent must be true
   * @private
   */
  _evaluateIFTHEN(antecedent, consequent, normalizedText, originalText) {
    const antecedentResult = this._evaluateCondition(antecedent, normalizedText, originalText);

    // If antecedent is false, IF-THEN is satisfied (vacuously true)
    if (!antecedentResult.satisfied) {
      return {
        satisfied: true,
        operator: 'IF-THEN',
        antecedentResult,
        consequentResult: null,
        details: 'IF-THEN satisfied (antecedent not met, vacuously true)',
        vacuouslyTrue: true
      };
    }

    // Antecedent is true, check consequent
    const consequentResult = this._evaluateCondition(consequent, normalizedText, originalText);
    const satisfied = consequentResult.satisfied;

    const evidence = [];
    if (antecedentResult.evidence) evidence.push(...antecedentResult.evidence);
    if (consequentResult.evidence) evidence.push(...consequentResult.evidence);

    return {
      satisfied,
      operator: 'IF-THEN',
      antecedentResult,
      consequentResult,
      evidence: evidence.length > 0 ? evidence : undefined,
      details: satisfied
        ? 'IF-THEN satisfied (both antecedent and consequent met)'
        : 'IF-THEN violated (antecedent met but consequent not met)',
      missing: satisfied ? [] : (consequentResult.missing || ['Consequent requirement'])
    };
  }

  /**
   * Find matches for a term in text and extract evidence
   * @private
   */
  _findMatches(searchTerm, normalizedText, originalText) {
    const matches = [];
    const normalizedSearchTerm = searchTerm.toLowerCase();

    // Split text into sentences for context
    const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 0);

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      const normalizedSentence = sentence.toLowerCase();

      if (normalizedSentence.includes(normalizedSearchTerm)) {
        matches.push({
          term: searchTerm,
          sentence: sentence,
          sentenceIndex: i,
          context: this._extractContext(sentences, i),
          confidence: this._calculateConfidence(normalizedSearchTerm, normalizedSentence)
        });
      }
    }

    return matches;
  }

  /**
   * Extract context around a sentence
   * @private
   */
  _extractContext(sentences, index, contextSize = 1) {
    const start = Math.max(0, index - contextSize);
    const end = Math.min(sentences.length, index + contextSize + 1);
    return sentences.slice(start, end).join('. ').trim();
  }

  /**
   * Calculate confidence score for a match
   * @private
   */
  _calculateConfidence(term, sentence) {
    // Exact match
    if (sentence === term) return 1.0;

    // Word boundary match
    const wordBoundaryRegex = new RegExp(`\\b${term}\\b`, 'i');
    if (wordBoundaryRegex.test(sentence)) return 0.9;

    // Partial match
    if (sentence.includes(term)) return 0.7;

    return 0.5;
  }

  /**
   * Normalize text for analysis
   * @private
   */
  _normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Evaluate multiple rules against a document
   * @param {Array<string>} ruleIds - Array of rule IDs to evaluate
   * @param {string} documentText - Document text to evaluate
   * @returns {Object} Combined evaluation results
   */
  evaluateMultipleRules(ruleIds, documentText) {
    const results = {
      totalRules: ruleIds.length,
      compliant: 0,
      nonCompliant: 0,
      errors: 0,
      overallCompliant: true,
      ruleResults: [],
      criticalFailures: [],
      warnings: []
    };

    for (const ruleId of ruleIds) {
      const result = this.evaluateRule(ruleId, documentText);

      if (result.error) {
        results.errors++;
        results.ruleResults.push(result);
        continue;
      }

      results.ruleResults.push(result);

      if (result.compliant) {
        results.compliant++;
      } else {
        results.nonCompliant++;
        results.overallCompliant = false;

        if (result.outcome?.severity === 'CRITICAL') {
          results.criticalFailures.push({
            ruleId: result.ruleId,
            statute: `${result.statute} s.${result.section}`,
            consequence: result.outcome.consequence,
            remedy: result.outcome.remedy
          });
        } else {
          results.warnings.push({
            ruleId: result.ruleId,
            statute: `${result.statute} s.${result.section}`,
            details: result.outcome.details
          });
        }
      }
    }

    return results;
  }

  /**
   * Get all registered rules
   * @returns {Array<Object>} Array of registered rules
   */
  getRules() {
    return Array.from(this.rules.values());
  }

  /**
   * Get a specific rule by ID
   * @param {string} ruleId - Rule ID
   * @returns {Object|null} Rule object or null
   */
  getRule(ruleId) {
    return this.rules.get(ruleId) || null;
  }

  /**
   * Get evaluation history
   * @returns {Array<Object>} Evaluation history
   */
  getHistory() {
    return this.evaluationHistory;
  }

  /**
   * Clear evaluation history
   */
  clearHistory() {
    this.evaluationHistory = [];
  }

  /**
   * Generate compliance report
   * @param {Object} evaluationResult - Result from evaluateRule or evaluateMultipleRules
   * @returns {string} Formatted compliance report
   */
  generateReport(evaluationResult) {
    if (evaluationResult.totalRules) {
      return this._generateMultiRuleReport(evaluationResult);
    } else {
      return this._generateSingleRuleReport(evaluationResult);
    }
  }

  /**
   * Generate report for single rule evaluation
   * @private
   */
  _generateSingleRuleReport(result) {
    const lines = [];

    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push(`YSCRIPT COMPLIANCE REPORT`);
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('');
    lines.push(`Rule ID:     ${result.ruleId}`);
    lines.push(`Statute:     ${result.statute} s.${result.section}`);
    lines.push(`Type:        ${result.type}`);
    lines.push(`Status:      ${result.compliant ? '✓ COMPLIANT' : '✗ NON-COMPLIANT'}`);
    lines.push(`Time:        ${result.evaluationTime}`);
    lines.push(`Timestamp:   ${result.timestamp}`);
    lines.push('');

    if (result.outcome) {
      lines.push('OUTCOME:');
      lines.push(`  Result:    ${result.outcome.result}`);
      lines.push(`  Message:   ${result.outcome.message}`);

      if (result.outcome.severity) {
        lines.push(`  Severity:  ${result.outcome.severity}`);
      }

      if (result.outcome.consequence) {
        lines.push(`  Consequence: ${result.outcome.consequence}`);
      }

      if (result.outcome.remedy) {
        lines.push(`  Remedy:    ${result.outcome.remedy}`);
      }

      lines.push('');
    }

    if (result.evidence && result.evidence.length > 0) {
      lines.push('EVIDENCE:');
      result.evidence.forEach((ev, idx) => {
        lines.push(`  [${idx + 1}] Term: "${ev.term}"`);
        lines.push(`      Sentence: "${ev.sentence}"`);
        lines.push(`      Confidence: ${(ev.confidence * 100).toFixed(0)}%`);
        lines.push('');
      });
    }

    if (result.missing && result.missing.length > 0) {
      lines.push('MISSING REQUIREMENTS:');
      result.missing.forEach((req, idx) => {
        lines.push(`  [${idx + 1}] ${req}`);
      });
      lines.push('');
    }

    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return lines.join('\n');
  }

  /**
   * Generate report for multiple rule evaluation
   * @private
   */
  _generateMultiRuleReport(results) {
    const lines = [];

    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push(`YSCRIPT MULTI-RULE COMPLIANCE REPORT`);
    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    lines.push('');
    lines.push(`Total Rules Evaluated: ${results.totalRules}`);
    lines.push(`Compliant:             ${results.compliant}`);
    lines.push(`Non-Compliant:         ${results.nonCompliant}`);
    lines.push(`Errors:                ${results.errors}`);
    lines.push(`Overall Status:        ${results.overallCompliant ? '✓ COMPLIANT' : '✗ NON-COMPLIANT'}`);
    lines.push('');

    if (results.criticalFailures.length > 0) {
      lines.push('CRITICAL FAILURES:');
      results.criticalFailures.forEach((failure, idx) => {
        lines.push(`  [${idx + 1}] ${failure.statute}`);
        lines.push(`      Rule: ${failure.ruleId}`);
        lines.push(`      Consequence: ${failure.consequence}`);
        lines.push(`      Remedy: ${failure.remedy}`);
        lines.push('');
      });
    }

    if (results.warnings.length > 0) {
      lines.push('WARNINGS:');
      results.warnings.forEach((warning, idx) => {
        lines.push(`  [${idx + 1}] ${warning.statute}`);
        lines.push(`      Rule: ${warning.ruleId}`);
        lines.push(`      Details: ${warning.details}`);
        lines.push('');
      });
    }

    lines.push('INDIVIDUAL RULE RESULTS:');
    results.ruleResults.forEach((result, idx) => {
      lines.push(`  [${idx + 1}] ${result.ruleId}`);
      lines.push(`      Statute: ${result.statute} s.${result.section}`);
      lines.push(`      Status: ${result.compliant ? '✓ COMPLIANT' : '✗ NON-COMPLIANT'}`);
      lines.push(`      Time: ${result.evaluationTime}`);
      lines.push('');
    });

    lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return lines.join('\n');
  }

  /**
   * Export rules to JSON
   * @returns {string} JSON string of all rules
   */
  exportRules() {
    const rulesArray = Array.from(this.rules.values());
    return JSON.stringify(rulesArray, null, 2);
  }

  /**
   * Import rules from JSON
   * @param {string} jsonString - JSON string of rules
   * @returns {Object} Import results
   */
  importRules(jsonString) {
    try {
      const rules = JSON.parse(jsonString);
      return this.registerRules(Array.isArray(rules) ? rules : [rules]);
    } catch (error) {
      return {
        total: 0,
        successful: 0,
        failed: 1,
        errors: [`Failed to parse JSON: ${error.message}`]
      };
    }
  }
}

/**
 * Factory function to create a new YScriptEngine instance
 * @returns {YScriptEngine} New engine instance
 */
export function createYScriptEngine() {
  return new YScriptEngine();
}

/**
 * Default export
 */
export default YScriptEngine;
