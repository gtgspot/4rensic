# Forensic Legal Analyzer - Integration Guide

## 🚀 Quick Start

### Option 1: Use the Modular HTML File (Easiest)

```bash
# Start local server
python3 serve.py
# or
npm start

# Open browser
open http://localhost:8000/index-modular.html
```

### Option 2: Import Individual Modules

```javascript
// Import the main application
import ForensicAnalyzer from './src/main.jsx';

// Or import individual modules
import { VictorianStatuteAnalyzer } from './src/analyzers/VictorianStatuteAnalyzer.js';
import { runAnalysis } from './src/analyzers/PresetAnalyzers.js';
```

---

## 📦 Module Import Patterns

### 1. Using the Main Application (Recommended)

The `main.jsx` orchestrator provides a unified API:

```javascript
import app from './src/main.jsx';

// Application auto-initializes on import

// Process a file
const result = await app.processFile(uploadedFile);

// Analyze document
const analysis = await app.analyzeDocument(documentText, {
  presets: [1, 2, 8]  // Select which presets to run
});

// Export results
await app.exportAnalysis('pdf', 'report.pdf');

// Get application status
console.log(app.getStatus());
// {
//   initialized: true,
//   documentsLoaded: 1,
//   hasCurrentAnalysis: true,
//   learnedPatterns: 0,
//   timelineEvents: 15
// }
```

### 2. Using Individual Analyzers

For fine-grained control, import specific analyzers:

```javascript
import { VictorianStatuteAnalyzer } from './src/analyzers/VictorianStatuteAnalyzer.js';

const analyzer = new VictorianStatuteAnalyzer();
await analyzer.init();

// Check compliance with specific statute
const compliance = analyzer.checkCompliance(
  documentText,
  'Road_Safety_Act_1986',
  '49'
);

if (!compliance.compliant) {
  console.log('Missing elements:', compliance.missing);
  console.log('Consequences:', compliance.consequences);
}

// Extract all statutory references
const refs = analyzer.extractReferences(documentText);
console.log('Found sections:', refs);
// ['s.49(1)(g)', 's.55D', 's.55E', ...]

// Analyze reasonable belief test (George v Rockett)
const beliefTest = analyzer.analyzeReasonableBeliefTest(documentText);
if (!beliefTest.compliant) {
  console.log('Reasonable belief test FAILED');
  beliefTest.issues.forEach(issue => {
    console.log(`${issue.type}: ${issue.description}`);
  });
}
```

### 3. Using Preset Analyzers

```javascript
import {
  getAllPresets,
  runAnalysis,
  Preset8_Evidentiary
} from './src/analyzers/PresetAnalyzers.js';

// Get all available presets
const presets = getAllPresets();
console.log(presets);
// [
//   { id: 1, name: 'Statutory Procedural Analysis', ... },
//   { id: 2, name: 'Contextual Analysis', ... },
//   ...
// ]

// Run analysis with selected presets
const results = await runAnalysis(
  documentText,
  [1, 2, 3, 8],  // Preset IDs to run
  allDocuments   // Array of all documents for cross-reference
);

// Or use a specific preset directly
const evidentiary = await Preset8_Evidentiary.analyze(documentText);
console.log(evidentiary.findings);
```

### 4. Cross-Document Analysis

```javascript
import { CrossReferenceEngine } from './src/analyzers/CrossReferenceEngine.js';

const engine = new CrossReferenceEngine();

// Add documents
engine.addDocument({
  name: 'Police Statement',
  text: policeStatementText
});

engine.addDocument({
  name: 'Defence Statement',
  text: defenceStatementText
});

// Analyze for discrepancies
const crossRef = engine.analyze();

console.log('Date discrepancies:', crossRef.dateDiscrepancies);
console.log('Time discrepancies:', crossRef.timeDiscrepancies);
console.log('Overall consistency:', crossRef.overallConsistency);
// 'consistent', 'minor_discrepancies', 'moderate_discrepancies', 'major_discrepancies'
```

### 5. Legal Interpretation Engine

```javascript
import { InterpretationEngine } from './src/analyzers/InterpretationEngine.js';

const engine = new InterpretationEngine();
await engine.init();

const interpretation = await engine.analyze(documentText);

console.log('Statutory framework:', interpretation.statutoryFramework);
console.log('Legal issues:', interpretation.legalIssues);
console.log('Compliance assessment:', interpretation.complianceAssessment);
console.log('Recommendations:', interpretation.recommendations);

// Example output:
// {
//   legalIssues: [
//     {
//       category: 'Reasonable Belief Test Failure',
//       severity: 'CRITICAL',
//       description: 'Subjective element not established',
//       statute: 'Road Safety Act 1986 s.49(1)(g)'
//     }
//   ],
//   recommendations: [
//     {
//       priority: 'CRITICAL',
//       category: 'Legal Issues',
//       recommendation: 'Address 1 critical legal issue(s) immediately'
//     }
//   ]
// }
```

### 6. Storage and Pattern Detection

```javascript
import { AnalysisDatabase } from './src/storage/AnalysisDatabase.js';
import { PatternDetector } from './src/storage/PatternDetector.js';
import { TimelineManager } from './src/storage/TimelineManager.js';

// Database
const db = new AnalysisDatabase();
await db.init();

await db.saveAnalysis(analysisResults);
const history = await db.getAllAnalyses();
console.log('Total analyses:', history.length);

// Pattern Detection
const detector = new PatternDetector();
const patterns = detector.detectPatterns(findings);

patterns.forEach(pattern => {
  console.log(`${pattern.type}: ${pattern.description}`);
  console.log(`Frequency: ${pattern.frequency}, Significance: ${pattern.significance}`);
});

// Learn from analysis
detector.learn(analysisResults);
const learned = detector.getLearnedPatterns();

// Timeline Management
const timeline = new TimelineManager();
timeline.extractTimeline(documentText, 'Police Statement');

const chronological = timeline.buildChronologicalTimeline();
const discrepancies = timeline.detectDiscrepancies();
```

### 7. Utilities

```javascript
import { TextExtractor } from './src/utils/textExtractor.js';
import { StatuteParser } from './src/utils/statuteParser.js';
import { DefectClassifier } from './src/utils/defectClassifier.js';
import { ExportManager } from './src/utils/exportManager.js';

// Text Extraction
const extractor = new TextExtractor();
const text = await extractor.extractText(file);

// Statute Parsing
const parser = new StatuteParser();
const parsed = parser.parse(documentText);
console.log('Sections:', parsed.sections);
console.log('Acts:', parsed.acts);
console.log('Combined:', parsed.combined);

// Defect Classification
const classifier = new DefectClassifier();
const classified = classifier.classifyAll(findings);

console.log('By severity:', classified.bySeverity);
console.log('By type:', classified.byType);
console.log('Summary:', classified.summary);
// {
//   total: 25,
//   critical: 3,
//   high: 8,
//   medium: 10,
//   low: 4
// }

// Export
const exporter = new ExportManager();
await exporter.export(results, 'pdf', 'report.pdf');
await exporter.export(results, 'docx', 'report.docx');
await exporter.export(results, 'json', 'report.json');
await exporter.export(results, 'csv', 'report.csv');
```

---

## 🎯 Common Integration Patterns

### Pattern 1: Single Document Analysis

```javascript
import app from './src/main.jsx';

async function analyzeSingleDocument(file) {
  // 1. Process file
  const processed = await app.processFile(file);

  // 2. Analyze with all presets
  const analysis = await app.analyzeDocument(processed.document.text);

  // 3. Check for critical issues
  if (analysis.summary.criticalIssues > 0) {
    console.warn('CRITICAL ISSUES DETECTED');
    alert(`Found ${analysis.summary.criticalIssues} critical issues!`);
  }

  // 4. Export results
  await app.exportAnalysis('pdf', `${file.name}-analysis.pdf`);

  return analysis;
}
```

### Pattern 2: Multi-Document Comparison

```javascript
import app from './src/main.jsx';
import { CrossReferenceEngine } from './src/analyzers/CrossReferenceEngine.js';

async function compareDocuments(files) {
  const engine = new CrossReferenceEngine();

  // Process all files
  for (const file of files) {
    const processed = await app.processFile(file);
    engine.addDocument(processed.document);
  }

  // Analyze discrepancies
  const crossRef = engine.analyze();

  if (crossRef.dateDiscrepancies.length > 0) {
    console.warn('Date discrepancies found:');
    crossRef.dateDiscrepancies.forEach(d => {
      console.log(`- ${d.description}`);
    });
  }

  return crossRef;
}
```

### Pattern 3: Custom Preset Selection

```javascript
import { runAnalysis, getAllPresets } from './src/analyzers/PresetAnalyzers.js';

async function analyzeWithCustomPresets(text, presetNames) {
  // Get all presets
  const allPresets = getAllPresets();

  // Find preset IDs by name
  const selectedIds = allPresets
    .filter(p => presetNames.includes(p.name))
    .map(p => p.id);

  // Run analysis
  const results = await runAnalysis(text, selectedIds);

  return results;
}

// Usage
const results = await analyzeWithCustomPresets(documentText, [
  'Statutory Procedural Analysis',
  'Evidentiary Standards (Victorian)'
]);
```

### Pattern 4: Statute-Specific Compliance Check

```javascript
import { VictorianStatuteAnalyzer } from './src/analyzers/VictorianStatuteAnalyzer.js';

async function checkRoadSafetyCompliance(text) {
  const analyzer = new VictorianStatuteAnalyzer();
  await analyzer.init();

  // Check Section 49 (Preliminary Breath Test)
  const s49 = analyzer.checkCompliance(text, 'Road_Safety_Act_1986', '49');

  // Check Section 55D (Authority)
  const s55D = analyzer.checkCompliance(text, 'Road_Safety_Act_1986', '55D');

  // Check Section 55E (Proper Performance)
  const s55E = analyzer.checkCompliance(text, 'Road_Safety_Act_1986', '55E');

  return {
    s49: s49.compliant,
    s55D: s55D.compliant,
    s55E: s55E.compliant,
    overallCompliant: s49.compliant && s55D.compliant && s55E.compliant,
    issues: [
      ...s49.missing,
      ...s55D.missing,
      ...s55E.missing
    ]
  };
}
```

### Pattern 5: Progressive Enhancement

```javascript
import app from './src/main.jsx';

async function analyzeWithProgressUpdates(text, onProgress) {
  onProgress('Initializing analyzers...', 0);

  onProgress('Running preset analyses...', 20);
  const presets = await runAnalysis(text, [1, 2, 3, 4, 5, 6, 7, 8]);

  onProgress('Detecting patterns...', 50);
  const patterns = patternDetector.detectPatterns(allFindings);

  onProgress('Building timeline...', 70);
  const timeline = timelineManager.extractTimeline(text);

  onProgress('Generating interpretation...', 85);
  const interpretation = await interpretationEngine.analyze(text);

  onProgress('Complete!', 100);

  return { presets, patterns, timeline, interpretation };
}

// Usage with UI
await analyzeWithProgressUpdates(text, (message, percent) => {
  console.log(`${percent}%: ${message}`);
  updateProgressBar(percent);
});
```

---

## 🔧 Configuration

### Customize Statute Database

Edit `/src/data/victorianStatutes.json`:

```json
{
  "Your_Custom_Act_2025": {
    "fullName": "Your Custom Act 2025 (Vic)",
    "shortName": "YCA 2025",
    "category": "Custom",
    "sections": {
      "1": {
        "title": "Your Section Title",
        "subsections": {
          "1": {
            "full_text": "The full text of the subsection...",
            "elements": [
              {
                "name": "element_name",
                "type": "prerequisite_type",
                "keywords": ["keyword1", "keyword2"],
                "required": true,
                "absence_consequence": "What happens if missing"
              }
            ]
          }
        }
      }
    }
  }
}
```

### Add New Preset Analyzer

Edit `/src/analyzers/PresetAnalyzers.js`:

```javascript
export const Preset9_CustomAnalysis = {
  name: 'Custom Analysis',
  description: 'Your custom analysis description',

  analyze(documentText) {
    const findings = [];
    const keyTerms = new Set();

    // Your custom analysis logic here
    // ...

    return {
      presetName: this.name,
      wordCount: documentText.split(/\s+/).length,
      keyTerms: Array.from(keyTerms),
      findings: findings
    };
  }
};

// Add to getAllPresets()
export function getAllPresets() {
  return [
    { id: 1, ...Preset1_StatutoryProcedural },
    // ... other presets
    { id: 9, ...Preset9_CustomAnalysis }  // Add yours
  ];
}
```

---

## 🐛 Troubleshooting

### Issue: Modules Not Loading

**Problem:** Browser shows "Failed to load module"

**Solution:**
```bash
# Ensure you're running a local server
python3 serve.py

# NOT just opening the HTML file directly (file://)
# ES6 modules require HTTP/HTTPS protocol
```

### Issue: CORS Errors

**Problem:** Cross-Origin Resource Sharing errors

**Solution:**
- Use the provided `serve.py` which includes CORS headers
- Or configure your server to allow local module loading

### Issue: StatuteAnalyzer Not Initialized

**Problem:** "Analyzer not initialized. Call init() first."

**Solution:**
```javascript
import { VictorianStatuteAnalyzer } from './src/analyzers/VictorianStatuteAnalyzer.js';

const analyzer = new VictorianStatuteAnalyzer();
await analyzer.init();  // Don't forget this!

// Now you can use it
const result = analyzer.checkCompliance(...);
```

### Issue: Database Not Available

**Problem:** IndexedDB errors

**Solution:**
```javascript
import { AnalysisDatabase } from './src/storage/AnalysisDatabase.js';

const db = new AnalysisDatabase();
await db.init();  // Initialize before use

// Check if initialized
if (db.db) {
  console.log('Database ready');
}
```

### Issue: Export Functions Not Working

**Problem:** PDF/DOCX export fails

**Solution:**
- Ensure jsPDF and docx libraries are loaded
- Check that results object has required properties
- Use browser console to see detailed errors

```javascript
// Verify libraries loaded
console.log('jsPDF loaded:', typeof jspdf !== 'undefined');
console.log('docx loaded:', typeof docx !== 'undefined');
```

---

## 📊 Performance Optimization

### Lazy Loading Modules

```javascript
// Load only when needed
async function analyzeWhenReady(text) {
  const { runAnalysis } = await import('./src/analyzers/PresetAnalyzers.js');
  return await runAnalysis(text);
}
```

### Caching Results

```javascript
const cache = new Map();

async function analyzeCached(text) {
  const hash = hashString(text);

  if (cache.has(hash)) {
    console.log('Using cached result');
    return cache.get(hash);
  }

  const result = await app.analyzeDocument(text);
  cache.set(hash, result);
  return result;
}
```

### Web Workers

```javascript
// worker.js
importScripts('./src/main.jsx');

self.addEventListener('message', async (e) => {
  const { text, presets } = e.data;
  const result = await runAnalysis(text, presets);
  self.postMessage(result);
});

// main.js
const worker = new Worker('worker.js', { type: 'module' });

worker.postMessage({ text: documentText, presets: [1, 2, 3] });

worker.addEventListener('message', (e) => {
  console.log('Analysis complete:', e.data);
});
```

---

## 🎓 Advanced Examples

### Example 1: Real-Time Analysis

```javascript
let analysisTimeout;

document.getElementById('editor').addEventListener('input', (e) => {
  clearTimeout(analysisTimeout);

  analysisTimeout = setTimeout(async () => {
    const text = e.target.value;
    const quickAnalysis = await runAnalysis(text, [1, 8]);  // Fast presets
    updateLiveResults(quickAnalysis);
  }, 1000);  // Debounce 1 second
});
```

### Example 2: Batch Processing

```javascript
async function batchAnalyze(files) {
  const results = [];

  for (const file of files) {
    try {
      const processed = await app.processFile(file);
      const analysis = await app.analyzeDocument(processed.document.text);
      results.push({ file: file.name, analysis });
    } catch (error) {
      results.push({ file: file.name, error: error.message });
    }
  }

  // Generate comparison report
  const report = generateComparisonReport(results);
  await app.exportAnalysis('pdf', 'batch-report.pdf');

  return results;
}
```

### Example 3: Custom Dashboard

```javascript
import app from './src/main.jsx';

class AnalysisDashboard {
  constructor() {
    this.analyses = [];
  }

  async addAnalysis(file) {
    const processed = await app.processFile(file);
    const analysis = await app.analyzeDocument(processed.document.text);

    this.analyses.push({
      id: Date.now(),
      fileName: file.name,
      timestamp: new Date(),
      analysis: analysis
    });

    this.updateDashboard();
  }

  updateDashboard() {
    const stats = {
      total: this.analyses.length,
      critical: this.analyses.filter(a => a.analysis.summary.criticalIssues > 0).length,
      avgFindings: this.analyses.reduce((sum, a) => sum + a.analysis.summary.totalFindings, 0) / this.analyses.length
    };

    console.log('Dashboard Stats:', stats);
  }

  exportAllToPDF() {
    // Export combined report
  }
}
```

---

## 🚢 Deployment

### Deploy to Web Server

```bash
# Build for production (if using bundler)
npm run build

# Copy files to server
scp -r src/ index-modular.html user@server:/var/www/html/

# Ensure proper MIME types in server config
# For Apache (.htaccess):
AddType application/javascript .js .jsx
AddType application/json .json
```

### Environment Variables

```javascript
// config.js
export const CONFIG = {
  API_URL: process.env.API_URL || 'http://localhost:8000',
  STATUTE_DB_PATH: process.env.STATUTE_DB_PATH || '/src/data/victorianStatutes.json',
  DEBUG: process.env.NODE_ENV === 'development'
};
```

---

## 📚 Additional Resources

- **Main README:** `/MODULAR_ARCHITECTURE_README.md`
- **Module Documentation:** See source files for JSDoc comments
- **Statute Database Schema:** `/src/data/victorianStatutes.json`
- **Example Implementation:** `/index-modular.html`

---

## ✅ Checklist for Integration

- [ ] Server running (ES6 modules require HTTP)
- [ ] All dependencies loaded (React, PDF.js, etc.)
- [ ] Modules importing correctly (check Network tab)
- [ ] Application initialized (check Console)
- [ ] Statute database loaded (6+ Acts)
- [ ] File upload working
- [ ] Analysis producing results
- [ ] Export functions working
- [ ] No CORS errors

---

## 🆘 Getting Help

If you encounter issues:

1. Check browser Console for errors
2. Verify Network tab shows successful module loads
3. Ensure local server is running
4. Check that all files are in correct locations
5. Review this guide for similar issues
6. Check source code JSDoc comments

---

**Happy Analyzing! 🔬⚖️**
