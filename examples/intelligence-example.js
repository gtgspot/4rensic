/**
 * Intelligence System Usage Example
 *
 * This file demonstrates how to integrate the learning system
 * with real-time intelligence into your analyzer workflow.
 *
 * @version 1.0.0
 */

// Import required modules
import { AnalysisDatabase } from '../src/storage/AnalysisDatabase.js';
import { PatternDetector } from '../src/storage/PatternDetector.js';
import { InsightsPanel } from '../src/components/InsightsPanel.js';
import { OutcomeRecorder } from '../src/components/OutcomeRecorder.js';

/**
 * Main Intelligence Manager
 * Orchestrates all intelligence features
 */
export class IntelligenceManager {
  constructor() {
    this.database = null;
    this.patternDetector = null;
    this.insightsPanel = null;
    this.outcomeRecorder = null;
    this.initialized = false;
  }

  /**
   * Initialize the intelligence system
   */
  async init() {
    console.log('🧠 Initializing Intelligence System...');

    try {
      // Initialize database
      this.database = new AnalysisDatabase();
      await this.database.init();

      // Initialize pattern detector
      this.patternDetector = new PatternDetector();

      // Initialize UI components
      this.insightsPanel = new InsightsPanel();
      this.outcomeRecorder = new OutcomeRecorder(this.database, this.patternDetector);

      // Load historical success rates
      await this.loadSuccessRates();

      this.initialized = true;
      console.log('✅ Intelligence System initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Intelligence System:', error);
      throw error;
    }
  }

  /**
   * Load success rates from historical outcomes
   */
  async loadSuccessRates() {
    try {
      await this.database.updateSuccessRates(this.patternDetector);
      const rates = this.patternDetector.getSuccessRates();
      console.log(`✅ Loaded success rates for ${rates.length} defect types`);
    } catch (error) {
      console.error('⚠️ Failed to load success rates:', error);
    }
  }

  /**
   * Process completed analysis with intelligence
   * @param {Object} analysisResults - Results from analyzer
   * @param {HTMLElement} insightsContainer - Where to show insights
   * @param {HTMLElement} actionsContainer - Where to add outcome button
   */
  async processAnalysis(analysisResults, insightsContainer, actionsContainer) {
    if (!this.initialized) {
      throw new Error('Intelligence system not initialized. Call init() first.');
    }

    console.log('🔬 Processing analysis with intelligence...');

    try {
      // 1. Save analysis to database
      const analysisId = await this.database.saveAnalysis({
        ...analysisResults,
        fileName: analysisResults.fileName || 'Unknown Document'
      });

      console.log(`✅ Analysis saved with ID: ${analysisId}`);

      // 2. Get all historical analyses
      const allAnalyses = await this.database.getAllAnalyses();
      console.log(`📊 Retrieved ${allAnalyses.length} historical analyses`);

      // 3. Generate intelligence insights
      const insights = await this.patternDetector.analyzePatterns(allAnalyses);
      console.log('🧠 Intelligence insights generated:', insights);

      // 4. Display insights panel
      if (insightsContainer) {
        this.insightsPanel.render(insights, analysisResults, insightsContainer);
        console.log('✅ Insights panel rendered');
      }

      // 5. Add outcome recording button
      if (actionsContainer) {
        this.addRecordOutcomeButton(analysisId, analysisResults, actionsContainer);
        console.log('✅ Outcome recording button added');
      }

      // 6. Log key insights to console
      this.logKeyInsights(insights);

      return {
        analysisId,
        insights,
        totalAnalyses: allAnalyses.length
      };

    } catch (error) {
      console.error('❌ Failed to process analysis:', error);
      throw error;
    }
  }

  /**
   * Add record outcome button to UI
   */
  addRecordOutcomeButton(analysisId, analysisResults, container) {
    // Remove existing button if present
    const existingBtn = container.querySelector('.record-outcome-btn');
    if (existingBtn) existingBtn.remove();

    const button = document.createElement('button');
    button.className = 'btn export-btn record-outcome-btn';
    button.innerHTML = '📋 Record Court Outcome';
    button.onclick = () => {
      const defects = this.extractDefects(analysisResults);
      this.outcomeRecorder.show(analysisId, defects, document.body);
    };

    container.appendChild(button);
  }

  /**
   * Extract defects from analysis results
   */
  extractDefects(analysisResults) {
    const defects = [];

    // Extract from preset analysis
    if (analysisResults.phases?.presetAnalysis) {
      analysisResults.phases.presetAnalysis.forEach(preset => {
        if (preset.findings) {
          preset.findings.forEach(finding => {
            defects.push({
              type: finding.type,
              severity: finding.severity || 'LOW',
              description: finding.description,
              statute: finding.statute || 'Unknown'
            });
          });
        }
      });
    }

    // Extract from direct findings array
    if (analysisResults.findings) {
      analysisResults.findings.forEach(finding => {
        if (!defects.find(d => d.type === finding.type)) {
          defects.push({
            type: finding.type,
            severity: finding.severity || 'LOW',
            description: finding.description,
            statute: finding.statute || 'Unknown'
          });
        }
      });
    }

    return defects;
  }

  /**
   * Log key insights to console
   */
  logKeyInsights(insights) {
    console.log('\n═══════════════════════════════════════');
    console.log('📊 KEY INTELLIGENCE INSIGHTS');
    console.log('═══════════════════════════════════════');

    // Compliance metrics
    const m = insights.complianceMetrics;
    console.log(`\n📈 Compliance Score: ${m.complianceRate}%`);
    console.log(`   Total Analyses: ${m.totalAnalyses}`);
    console.log(`   Average Issues: ${m.averageIssuesPerDoc} per document`);
    console.log(`   Critical Issues: ${m.criticalIssues}`);
    console.log(`   High Issues: ${m.highIssues}`);

    // Trends
    if (insights.trends.direction) {
      console.log(`\n📊 Trend: ${insights.trends.direction}`);
      console.log(`   ${insights.trends.message}`);
      console.log(`   ${insights.trends.recommendation}`);
    }

    // Recurring defects
    if (insights.recurring.length > 0) {
      console.log(`\n🔁 Recurring Defects (${insights.recurring.length} found):`);
      insights.recurring.slice(0, 3).forEach((defect, i) => {
        console.log(`   ${i + 1}. ${defect.type} (${defect.count}x)`);
      });
    }

    // Recommendations
    if (insights.recommendations.length > 0) {
      console.log(`\n💡 Top Recommendations:`);
      insights.recommendations.slice(0, 2).forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec.issue} (${rec.frequency}x)`);
        console.log(`      ${rec.recommendation.split('\n')[0]}`);
      });
    }

    // Novel issues
    if (insights.novelIssues.length > 0) {
      console.log(`\n🆕 Novel Issues (${insights.novelIssues.length} found):`);
      insights.novelIssues.forEach((issue, i) => {
        console.log(`   ${i + 1}. ${issue.type} [${issue.severity}]`);
      });
    }

    console.log('\n═══════════════════════════════════════\n');
  }

  /**
   * Record an outcome manually
   * @param {number} analysisId - Analysis ID
   * @param {Object} outcomeData - Outcome details
   */
  async recordOutcome(analysisId, outcomeData) {
    try {
      await this.database.saveOutcome(analysisId, outcomeData);
      await this.patternDetector.learnFromOutcome(analysisId, outcomeData);
      console.log('✅ Outcome recorded successfully');
    } catch (error) {
      console.error('❌ Failed to record outcome:', error);
      throw error;
    }
  }

  /**
   * Get success rates for all defect types
   */
  getSuccessRates() {
    return this.patternDetector.getSuccessRates();
  }

  /**
   * Prioritize defects based on court success rates
   * @param {Array} defects - Current defects
   */
  prioritizeDefects(defects) {
    return this.patternDetector.prioritizeDefects(defects);
  }

  /**
   * Get all historical analyses
   */
  async getAllAnalyses() {
    return await this.database.getAllAnalyses();
  }

  /**
   * Get all recorded outcomes
   */
  async getAllOutcomes() {
    return await this.database.getAllOutcomes();
  }

  /**
   * Generate intelligence report
   */
  async generateIntelligenceReport() {
    const analyses = await this.database.getAllAnalyses();
    const outcomes = await this.database.getAllOutcomes();
    const insights = await this.patternDetector.analyzePatterns(analyses);
    const successRates = this.patternDetector.getSuccessRates();

    return {
      summary: {
        totalAnalyses: analyses.length,
        totalOutcomes: outcomes.length,
        complianceScore: insights.complianceMetrics.complianceRate,
        avgIssuesPerDoc: insights.complianceMetrics.averageIssuesPerDoc
      },
      trends: insights.trends,
      recurringDefects: insights.recurring,
      recommendations: insights.recommendations,
      successRates: successRates,
      novelIssues: insights.novelIssues
    };
  }

  /**
   * Clear all data (use with caution!)
   */
  async clearAllData() {
    if (confirm('⚠️ This will delete ALL analysis data, outcomes, and patterns. Are you sure?')) {
      await this.database.clearAll();
      this.patternDetector.reset();
      console.log('✅ All data cleared');
    }
  }
}

// Example usage for integration
export async function exampleUsage() {
  console.log('🚀 Starting Intelligence System Example...\n');

  // 1. Initialize the intelligence manager
  const intelligence = new IntelligenceManager();
  await intelligence.init();

  // 2. Simulate an analysis result
  const mockAnalysisResults = {
    fileName: 'example-brief.pdf',
    timestamp: new Date().toISOString(),
    summary: {
      totalFindings: 5,
      criticalIssues: 1,
      highIssues: 2,
      mediumIssues: 1,
      lowIssues: 1
    },
    phases: {
      presetAnalysis: [
        {
          presetId: 1,
          findings: [
            {
              type: 'Missing s.55D directions language',
              severity: 'HIGH',
              description: 'Document fails to show oral directions were provided',
              statute: 'Road Safety Act 1986 s.55D'
            },
            {
              type: 'Insufficient s.49 reason to believe',
              severity: 'HIGH',
              description: 'Officer belief not adequately documented',
              statute: 'Road Safety Act 1986 s.49'
            }
          ]
        }
      ]
    }
  };

  // 3. Process analysis with intelligence
  const result = await intelligence.processAnalysis(
    mockAnalysisResults,
    document.getElementById('insights-container'),
    document.getElementById('results-actions')
  );

  console.log(`✅ Analysis processed. ID: ${result.analysisId}`);

  // 4. Example: Record an outcome
  const exampleOutcome = {
    outcome: 'evidence excluded',
    defectsRaised: [
      'Missing s.55D directions language',
      'Insufficient s.49 reason to believe'
    ],
    courtResponse: 'Magistrate agreed the directions were inadequate and excluded BAC evidence',
    effectiveArguments: [
      'Cited Walker v Melbourne',
      'Emphasized timing of directions'
    ],
    date: new Date().toISOString()
  };

  // await intelligence.recordOutcome(result.analysisId, exampleOutcome);

  // 5. Get success rates
  const successRates = intelligence.getSuccessRates();
  console.log('\n📊 Success Rates:', successRates);

  // 6. Generate intelligence report
  const report = await intelligence.generateIntelligenceReport();
  console.log('\n📋 Intelligence Report:', report);
}

// Export for use in other modules
export default IntelligenceManager;

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.IntelligenceManager = IntelligenceManager;
  window.exampleUsage = exampleUsage;
}
