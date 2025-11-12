/**
 * Analysis Database - Enhanced with Outcome Tracking
 *
 * IndexedDB wrapper for storing analysis results, document history,
 * learning patterns, and court outcomes for intelligence gathering.
 *
 * @version 2.0.0
 */

export class AnalysisDatabase {
  constructor() {
    this.dbName = 'ForensicAnalyzerDB';
    this.dbVersion = 2; // Incremented for new outcomes store
    this.db = null;
  }

  /**
   * Initialize the database
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Failed to open database');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✓ Analysis Database initialized');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create object stores
        if (!db.objectStoreNames.contains('analyses')) {
          const analysesStore = db.createObjectStore('analyses', { keyPath: 'id', autoIncrement: true });
          analysesStore.createIndex('timestamp', 'timestamp', { unique: false });
          analysesStore.createIndex('fileName', 'fileName', { unique: false });
        }

        if (!db.objectStoreNames.contains('documents')) {
          const documentsStore = db.createObjectStore('documents', { keyPath: 'id', autoIncrement: true });
          documentsStore.createIndex('timestamp', 'timestamp', { unique: false });
          documentsStore.createIndex('name', 'name', { unique: false });
        }

        if (!db.objectStoreNames.contains('patterns')) {
          const patternsStore = db.createObjectStore('patterns', { keyPath: 'id', autoIncrement: true });
          patternsStore.createIndex('type', 'type', { unique: false });
          patternsStore.createIndex('frequency', 'frequency', { unique: false });
        }

        if (!db.objectStoreNames.contains('outcomes')) {
          const outcomesStore = db.createObjectStore('outcomes', { keyPath: 'id', autoIncrement: true });
          outcomesStore.createIndex('analysisId', 'analysisId', { unique: false });
          outcomesStore.createIndex('date', 'date', { unique: false });
          outcomesStore.createIndex('outcome', 'outcome', { unique: false });
        }
      };
    });
  }

  /**
   * Save an analysis result
   */
  async saveAnalysis(analysis) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['analyses'], 'readwrite');
      const store = transaction.objectStore('analyses');

      const analysisRecord = {
        ...analysis,
        timestamp: new Date().toISOString()
      };

      const request = store.add(analysisRecord);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all analyses
   */
  async getAllAnalyses() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['analyses'], 'readonly');
      const store = transaction.objectStore('analyses');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save a document
   */
  async saveDocument(document) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['documents'], 'readwrite');
      const store = transaction.objectStore('documents');

      const documentRecord = {
        ...document,
        timestamp: new Date().toISOString()
      };

      const request = store.add(documentRecord);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save a detected pattern
   */
  async savePattern(pattern) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['patterns'], 'readwrite');
      const store = transaction.objectStore('patterns');

      const request = store.add(pattern);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get patterns by type
   */
  async getPatternsByType(type) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['patterns'], 'readonly');
      const store = transaction.objectStore('patterns');
      const index = store.index('type');
      const request = index.getAll(type);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save an outcome
   */
  async saveOutcome(analysisId, outcome) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['outcomes'], 'readwrite');
      const store = transaction.objectStore('outcomes');

      const outcomeRecord = {
        analysisId: analysisId,
        outcome: outcome.outcome,
        defectsRaised: outcome.defectsRaised || [],
        courtResponse: outcome.courtResponse || '',
        effectiveArguments: outcome.effectiveArguments || [],
        date: outcome.date || new Date().toISOString(),
        timestamp: new Date().toISOString()
      };

      const request = store.add(outcomeRecord);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get outcome by analysis ID
   */
  async getOutcomeByAnalysisId(analysisId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['outcomes'], 'readonly');
      const store = transaction.objectStore('outcomes');
      const index = store.index('analysisId');
      const request = index.getAll(analysisId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all outcomes
   */
  async getAllOutcomes() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['outcomes'], 'readonly');
      const store = transaction.objectStore('outcomes');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update success rates from outcomes
   */
  async updateSuccessRates(patternDetector) {
    try {
      const outcomes = await this.getAllOutcomes();

      for (const outcome of outcomes) {
        await patternDetector.learnFromOutcome(outcome.analysisId, outcome);
      }

      console.log('✓ Success rates updated from outcomes');
      return patternDetector.getSuccessRates();
    } catch (error) {
      console.error('✗ Failed to update success rates:', error);
      throw error;
    }
  }

  /**
   * Clear all data
   */
  async clearAll() {
    const storeNames = ['analyses', 'documents', 'patterns', 'outcomes'];
    const promises = storeNames.map(storeName => {
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    return Promise.all(promises);
  }
}

export default AnalysisDatabase;
